export type AssetStatus =
  | "idle"
  | "queued"
  | "downloading"
  | "downloaded"
  | "ready"
  | "active"
  | "error";

export type AssetSnapshot = {
  index: number;
  url: string;
  status: AssetStatus;
  ready: boolean;
  priority: number;
  bytesLoaded: number;
  bytesTotal: number;
  progress: number | null;
  objectUrl: string | null;
  error: string | null;
  requestedAt: number | null;
  readyAt: number | null;
};

type AssetRecord = AssetSnapshot & {
  blob: Blob | null;
  promise: Promise<boolean> | null;
  resolve: ((ready: boolean) => void) | null;
  controller: AbortController | null;
  operationId: number;
  enqueuedAt: number;
  startedAt: number | null;
};

type AssetListener = (index: number, snapshot: AssetSnapshot) => void;
type AssetLogger = (...details: unknown[]) => void;

const PREEMPTION_PROGRESS_LIMIT = 0.78;
const UNKNOWN_TOTAL_KEEP_BYTES = 2_500_000;

const now = () => Math.round(window.performance.now());

export class SessionVideoAssetManager {
  private readonly records: AssetRecord[];
  private readonly listeners = new Set<AssetListener>();
  private readonly maxConcurrent: number;
  private readonly log: AssetLogger;
  private activeDownloads = 0;
  private disposed = false;
  private queueSequence = 0;

  constructor(
    urls: string[],
    maxConcurrent = 2,
    log: AssetLogger = () => undefined,
  ) {
    this.maxConcurrent = maxConcurrent;
    this.log = log;
    this.records = urls.map((url, index) => ({
      index,
      url,
      status: "idle",
      ready: false,
      priority: 0,
      bytesLoaded: 0,
      bytesTotal: 0,
      progress: null,
      objectUrl: null,
      error: null,
      requestedAt: null,
      readyAt: null,
      blob: null,
      promise: null,
      resolve: null,
      controller: null,
      operationId: 0,
      enqueuedAt: 0,
      startedAt: null,
    }));
  }

  subscribe(listener: AssetListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  snapshot(index: number): AssetSnapshot {
    return this.toSnapshot(this.records[index]);
  }

  snapshots() {
    return this.records.map((record) => this.toSnapshot(record));
  }

  isReady(index: number) {
    const record = this.records[index];
    return Boolean(record?.ready && record.objectUrl);
  }

  objectUrl(index: number) {
    return this.isReady(index) ? this.records[index].objectUrl : null;
  }

  request(index: number, priority: number, retry = false): Promise<boolean> {
    const record = this.records[index];
    if (!record || this.disposed) return Promise.resolve(false);
    if (record.ready && record.objectUrl) return Promise.resolve(true);

    if (record.status === "error" && !retry) return Promise.resolve(false);
    if (record.status === "error" && retry) this.resetFailedRecord(record);

    record.priority = Math.max(record.priority, priority);
    if (record.requestedAt === null) record.requestedAt = now();
    if (!record.promise) {
      record.promise = new Promise<boolean>((resolve) => {
        record.resolve = resolve;
      });
    }
    if (record.status === "idle") this.enqueue(record);

    this.preemptLowerPriorityDownload(record);
    this.pump();
    this.emit(record);
    return record.promise;
  }

  promote(index: number, priority: number) {
    return this.request(index, priority);
  }

  markActive(index: number) {
    this.records.forEach((record) => {
      if (record.index === index && record.ready) {
        record.status = "active";
        this.emit(record);
      } else if (record.status === "active") {
        record.status = "ready";
        this.emit(record);
      }
    });
  }

  markReady(index: number) {
    const record = this.records[index];
    if (!record?.ready || record.status !== "active") return;
    record.status = "ready";
    this.emit(record);
  }

  retry(index: number, priority: number) {
    return this.request(index, priority, true);
  }

  dispose() {
    this.disposed = true;
    this.records.forEach((record) => {
      record.controller?.abort("asset-manager-disposed");
      record.controller = null;
      if (record.objectUrl) URL.revokeObjectURL(record.objectUrl);
      record.objectUrl = null;
      record.blob = null;
      record.ready = false;
      record.resolve?.(false);
      record.resolve = null;
    });
    this.listeners.clear();
  }

  private toSnapshot(record: AssetRecord): AssetSnapshot {
    return {
      index: record.index,
      url: record.url,
      status: record.status,
      ready: record.ready,
      priority: record.priority,
      bytesLoaded: record.bytesLoaded,
      bytesTotal: record.bytesTotal,
      progress: record.progress,
      objectUrl: record.objectUrl,
      error: record.error,
      requestedAt: record.requestedAt,
      readyAt: record.readyAt,
    };
  }

  private emit(record: AssetRecord) {
    const snapshot = this.toSnapshot(record);
    this.listeners.forEach((listener) => listener(record.index, snapshot));
  }

  private enqueue(record: AssetRecord) {
    record.status = "queued";
    record.enqueuedAt = ++this.queueSequence;
    this.log(`ASSET ${record.index} queued`, { priority: record.priority });
  }

  private resetFailedRecord(record: AssetRecord) {
    record.status = "idle";
    record.ready = false;
    record.error = null;
    record.bytesLoaded = 0;
    record.bytesTotal = 0;
    record.progress = null;
    record.promise = null;
    record.resolve = null;
    record.controller = null;
    record.startedAt = null;
  }

  private preemptLowerPriorityDownload(priorityRecord: AssetRecord) {
    if (priorityRecord.status === "downloading") return;
    if (this.activeDownloads < this.maxConcurrent) return;

    const candidate = this.records
      .filter(
        (record) =>
          record.status === "downloading" &&
          record.priority < priorityRecord.priority &&
          record.index !== priorityRecord.index,
      )
      .sort((left, right) => left.priority - right.priority)[0];
    if (!candidate?.controller) return;

    const ratio =
      candidate.bytesTotal > 0
        ? candidate.bytesLoaded / candidate.bytesTotal
        : null;
    const worthKeeping =
      ratio !== null
        ? ratio >= PREEMPTION_PROGRESS_LIMIT
        : candidate.bytesLoaded >= UNKNOWN_TOTAL_KEEP_BYTES;
    if (worthKeeping) {
      this.log(`ASSET ${candidate.index} kept`, {
        reason: "download-nearly-complete",
        progress: ratio,
      });
      return;
    }

    candidate.status = "queued";
    candidate.enqueuedAt = ++this.queueSequence;
    this.log(`ASSET ${candidate.index} preempted`, {
      by: priorityRecord.index,
      bytesLoaded: candidate.bytesLoaded,
      bytesTotal: candidate.bytesTotal,
    });
    candidate.controller.abort("reprioritized");
    this.emit(candidate);
  }

  private pump() {
    if (this.disposed) return;
    while (this.activeDownloads < this.maxConcurrent) {
      const next = this.records
        .filter((record) => record.status === "queued")
        .sort((left, right) => {
          if (right.priority !== left.priority) return right.priority - left.priority;
          return left.enqueuedAt - right.enqueuedAt;
        })[0];
      if (!next) return;
      void this.download(next);
    }
  }

  private async download(record: AssetRecord) {
    const operationId = ++record.operationId;
    const controller = new AbortController();
    record.controller = controller;
    record.status = "downloading";
    record.startedAt = now();
    record.error = null;
    record.bytesLoaded = 0;
    record.progress = null;
    this.activeDownloads += 1;
    this.log(`ASSET ${record.index} downloading`, { priority: record.priority });
    this.emit(record);

    try {
      const response = await fetch(record.url, {
        cache: "force-cache",
        credentials: "same-origin",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentLength = Number(response.headers.get("content-length"));
      record.bytesTotal = Number.isFinite(contentLength) ? contentLength : 0;
      const contentType = response.headers.get("content-type") || "video/mp4";
      const blob = await this.readResponseBlob(response, record, operationId, contentType);

      if (
        this.disposed ||
        controller.signal.aborted ||
        operationId !== record.operationId
      ) {
        return;
      }

      record.status = "downloaded";
      record.blob = blob;
      record.bytesLoaded = blob.size;
      record.bytesTotal = record.bytesTotal || blob.size;
      record.progress = 1;
      this.emit(record);

      record.objectUrl = URL.createObjectURL(blob);
      record.ready = true;
      record.status = "ready";
      record.readyAt = now();
      this.log(`ASSET ${record.index} ready`, {
        bytes: blob.size,
        elapsedMs:
          record.startedAt === null ? null : record.readyAt - record.startedAt,
      });
      record.resolve?.(true);
      record.resolve = null;
      this.emit(record);
    } catch (error) {
      if (controller.signal.aborted) {
        if (!this.disposed && record.status !== "ready") {
          record.status = "queued";
          record.controller = null;
          this.emit(record);
        }
        return;
      }
      if (operationId !== record.operationId || this.disposed) return;

      record.status = "error";
      record.ready = false;
      record.error = error instanceof Error ? error.message : "asset-download-error";
      this.log(`ASSET ${record.index} error`, record.error);
      record.resolve?.(false);
      record.resolve = null;
      this.emit(record);
    } finally {
      if (record.controller === controller) record.controller = null;
      this.activeDownloads = Math.max(0, this.activeDownloads - 1);
      this.pump();
    }
  }

  private async readResponseBlob(
    response: Response,
    record: AssetRecord,
    operationId: number,
    contentType: string,
  ) {
    if (!response.body) return response.blob();

    const reader = response.body.getReader();
    const chunks: ArrayBuffer[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (operationId !== record.operationId) {
        await reader.cancel("obsolete-download");
        throw new DOMException("Obsolete download", "AbortError");
      }
      const copy = new Uint8Array(value.byteLength);
      copy.set(value);
      chunks.push(copy.buffer);
      record.bytesLoaded += copy.byteLength;
      record.progress =
        record.bytesTotal > 0
          ? Math.min(record.bytesLoaded / record.bytesTotal, 1)
          : null;
      this.emit(record);
    }
    return new Blob(chunks, { type: contentType });
  }
}
