"use client";

import { publicAsset } from "./asset-path.mjs";


/* eslint-disable @next/next/no-img-element -- technical fallback frames must stay as supplied */

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  TouchEvent,
} from "react";
import {
  SessionVideoAssetManager,
  type AssetStatus,
} from "./video-asset-manager";


type MachinePhase =
  | "BOOT"
  | "INTRO"
  | "ENTER"
  | "HOLD"
  | "WAITING_TARGET"
  | "EXIT"
  | "SWITCHING";
type BootView = "loading" | "action" | "exiting" | "ready";
type PlaybackIssue =
  | "none"
  | "autoplay-blocked"
  | "loading-timeout"
  | "play-timeout"
  | "network-error"
  | "decode-error";
type PauseReason =
  | "hover"
  | "user"
  | "menu"
  | "visibility"
  | "waitingTarget"
  | "autoplay-blocked"
  | "boot-safety"
  | null;
type SlotIndex = 0 | 1;
type TransitionSource = "autoplay" | "click" | "swipe" | "keyboard";

type PortfolioState = {
  number: string;
  short: string;
  mobileShort: string;
  title: string;
  category: string;
  future: string;
  visualAlt: string;
  video: string;
  poster: string;
  href: string;
};

type MachineState = {
  currentIndex: number;
  currentPhase: MachinePhase;
  requestedIndex: number | null;
  transitionTarget: number | null;
  transitionSource: TransitionSource | null;
  transitionToken: number;
  activeSlot: SlotIndex;
  isUserPaused: boolean;
  isMenuPaused: boolean;
  isVisibilityPaused: boolean;
  isHoverPaused: boolean;
  pauseReason: PauseReason;
  isTransitioning: boolean;
  issue: PlaybackIssue;
  experienceStarted: boolean;
};

type PlayResult = {
  ok: boolean;
  issue: PlaybackIssue;
};

type PreparedTarget = {
  index: number;
  slot: SlotIndex;
  token: number;
};

type TargetPlan = {
  index: number;
  token: number;
  promise: Promise<boolean>;
};

type SwitchResult = "switched" | "superseded" | "blocked" | "error";

type ExitGate = {
  cycle: number;
  target: number;
  token: number;
  source: TransitionSource;
  seeking: boolean;
};

const HOLD_START = 1.5;
const EXIT_START = 6.5;
const AUTO_EXIT_ARM = 6.42;
const EXPECTED_DURATION = 8;
const INTRO_MINIMUM_MS = 1700;
const BOOT_SAFETY_MS = 5500;
const BOOT_EXIT_MS = 180;
const MEDIA_READY_TIMEOUT_MS = 2800;
const PLAY_PROMISE_TIMEOUT_MS = 1800;
const FIRST_FRAME_TIMEOUT_MS = 1400;
const HOLD_WATCHDOG_DELAY_MS = 650;
const MAX_DOWNLOADS = 2;
const PRIORITY_PRESENTATION = 10_000;
const PRIORITY_MANUAL = 20_000;
const PRIORITY_AUTOMATIC_NEXT = 8_000;
const BACKGROUND_PRIORITIES = [10_000, 6_000, 4_000, 3_000, 2_000];
const MEDIA_DEBUG = true;

const initialMachine: MachineState = {
  currentIndex: 0,
  currentPhase: "BOOT",
  requestedIndex: null,
  transitionTarget: null,
  transitionSource: null,
  transitionToken: 0,
  activeSlot: 0,
  isUserPaused: false,
  isMenuPaused: false,
  isVisibilityPaused: false,
  isHoverPaused: false,
  pauseReason: null,
  isTransitioning: false,
  issue: "none",
  experienceStarted: false,
};

const initialProgressStyle = {
  "--progress-scale": "0",
} as CSSProperties;

const portfolioStates: PortfolioState[] = [
  {
    number: "00",
    short: "Presentación",
    mobileShort: "Presentación",
    title: "Cristian Campos",
    category: "Presentación personal",
    future: "Ver proyectos",
    visualAlt: "Cristian Campos, editor de video y creador audiovisual",
    video: publicAsset("/portfolio/videos/presentation.mp4"),
    poster: publicAsset("/portfolio/videos/posters/presentation.jpg"),
    href: "/proyectos",
  },
  {
    number: "01",
    short: "Buena edición",
    mobileShort: "Buena edición",
    title: "El impacto de una buena edición",
    category: "Edición de video · Motion graphics",
    future: "Ver caso completo",
    visualAlt: "Comparación visual del antes y después de una buena edición de video",
    video: publicAsset("/portfolio/videos/good-editing.mp4"),
    poster: publicAsset("/portfolio/videos/posters/good-editing.jpg"),
    href: "/proyectos/buena-edicion",
  },
  {
    number: "02",
    short: "UNAD",
    mobileShort: "UNAD",
    title: "Red de Egresados UNAD",
    category: "Contenido audiovisual · Diseño multimedia",
    future: "Ver caso completo",
    visualAlt: "Selección de contenidos creados para la Red de Egresados UNAD",
    video: publicAsset("/portfolio/videos/unad.mp4"),
    poster: publicAsset("/portfolio/videos/posters/unad.jpg"),
    href: "/proyectos/unad",
  },
  {
    number: "03",
    short: "AMARED",
    mobileShort: "AMARED",
    title: "AMARED",
    category: "UX/UI · Identidad · Desarrollo web",
    future: "Ver caso completo",
    visualAlt: "Sistema digital e identidad visual del proyecto AMARED",
    video: publicAsset("/portfolio/videos/amared.mp4"),
    poster: publicAsset("/portfolio/videos/posters/amared.jpg"),
    href: "/proyectos/amared",
  },
  {
    number: "04",
    short: "Caso TikTok",
    mobileShort: "Caso TikTok",
    title: "Caso TikTok",
    category: "Contenido vertical · Estrategia creativa",
    future: "Ver caso completo",
    visualAlt: "Caso de contenido de gaming con alcance orgánico en TikTok",
    video: publicAsset("/portfolio/videos/tiktok.mp4"),
    poster: publicAsset("/portfolio/videos/posters/tiktok.jpg"),
    href: "/proyectos/caso-tiktok",
  },
];

const debugMedia = (...details: unknown[]) => {
  if (MEDIA_DEBUG) console.info("[portfolio-media]", ...details);
};

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const phaseForTime = (
  time: number,
): "ENTER" | "HOLD" | "EXIT" => {
  if (time < HOLD_START) return "ENTER";
  if (time < EXIT_START) return "HOLD";
  return "EXIT";
};

const otherSlot = (slot: SlotIndex): SlotIndex => (slot === 0 ? 1 : 0);

const configureVideo = (video: HTMLVideoElement) => {
  video.loop = false;
  video.autoplay = false;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.removeAttribute("loop");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
};

const issueFromPlayError = (error: unknown): PlaybackIssue => {
  if (
    error instanceof DOMException &&
    error.name === "NotAllowedError"
  ) {
    return "autoplay-blocked";
  }
  return "play-timeout";
};

const waitForMediaReady = (
  video: HTMLVideoElement,
  ownerIsCurrent: () => boolean,
  timeoutMs = MEDIA_READY_TIMEOUT_MS,
) =>
  new Promise<boolean>((resolve) => {
    let settled = false;
    const events = ["loadedmetadata", "loadeddata", "canplay", "error"] as const;
    const timer = window.setTimeout(() => {
      finish(
        ownerIsCurrent() &&
          !video.error &&
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA,
      );
    }, timeoutMs);

    const finish = (ready: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      events.forEach((eventName) => video.removeEventListener(eventName, check));
      resolve(ready);
    };
    const check = () => {
      if (!ownerIsCurrent()) {
        finish(false);
        return;
      }
      if (video.error) {
        finish(false);
        return;
      }
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) finish(true);
    };

    events.forEach((eventName) => video.addEventListener(eventName, check));
    check();
  });

const waitForFirstFrame = (
  video: HTMLVideoElement,
  ownerIsCurrent: () => boolean,
  timeoutMs = FIRST_FRAME_TIMEOUT_MS,
) =>
  new Promise<boolean>((resolve) => {
    let settled = false;
    let frameCallbackId = 0;
    const timer = window.setTimeout(() => {
      finish(
        ownerIsCurrent() &&
          !video.error &&
          !video.paused &&
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA,
      );
    }, timeoutMs);

    const finish = (ready: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("error", onError);
      if (
        frameCallbackId &&
        typeof video.cancelVideoFrameCallback === "function"
      ) {
        video.cancelVideoFrameCallback(frameCallbackId);
      }
      resolve(ready);
    };
    const onError = () => finish(false);
    const onTimeUpdate = () => {
      if (ownerIsCurrent()) finish(true);
    };
    const onPlaying = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => finish(ownerIsCurrent()));
      });
    };

    video.addEventListener("playing", onPlaying, { once: true });
    video.addEventListener("timeupdate", onTimeUpdate, { once: true });
    video.addEventListener("error", onError, { once: true });
    if (typeof video.requestVideoFrameCallback === "function") {
      frameCallbackId = video.requestVideoFrameCallback(() =>
        finish(ownerIsCurrent()),
      );
    } else if (!video.paused) {
      onPlaying();
    }
  });

export default function HomeStage({ active, menuOpen, onNavigate }: { active: boolean; menuOpen: boolean; onNavigate: (path: string) => void }) {
  const sceneActiveRef = useRef(active);
  sceneActiveRef.current = active;
  const [machine, setMachine] = useState<MachineState>(initialMachine);
  const [bootView, setBootView] = useState<BootView>("loading");
  const [fallbackIndex, setFallbackIndex] = useState<number | null>(null);
  const [motionPreferenceReady, setMotionPreferenceReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [assetStatuses, setAssetStatuses] = useState<AssetStatus[]>(
    portfolioStates.map(() => "idle"),
  );

  const machineRef = useRef<MachineState>(initialMachine);
  const mainRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([null, null]);
  const slotAssetRef = useRef<Array<number | null>>([null, null]);
  const slotGenerationRef = useRef<number[]>([0, 0]);
  const assetManagerRef = useRef<SessionVideoAssetManager | null>(null);
  const preparedTargetRef = useRef<PreparedTarget | null>(null);
  const targetPlanRef = useRef<TargetPlan | null>(null);
  const playAttemptsRef = useRef<
    Array<{ token: number; promise: Promise<PlayResult> } | null>
  >([null, null]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressScaleRef = useRef(0);
  const selectorListRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressVisualClickRef = useRef(false);
  const mountedRef = useRef(true);
  const pageVisibleRef = useRef(true);
  const hoverCapabilityRef = useRef(false);
  const bootMinimumDoneRef = useRef(false);
  const bootMediaReadyRef = useRef(false);
  const bootPreparationRef = useRef<Promise<boolean> | null>(null);
  const bootAttemptRef = useRef(false);
  const bootAttemptIdRef = useRef(0);
  const bootExitTimerRef = useRef<number | null>(null);
  const continueRequestedRef = useRef(false);
  const playbackCycleRef = useRef(0);
  const endedCycleRef = useRef(-1);
  const exitGateRef = useRef<ExitGate | null>(null);
  const lastTimelineLogRef = useRef({ cycle: -1, time: -1 });
  const switchWorkerRef = useRef<Promise<void> | null>(null);
  const transitionWakeRef = useRef(new Set<() => void>());
  const holdWatchdogRef = useRef({
    cycle: -1,
    attempted: false,
    lastMovingTime: 0,
  });
  const driveMachineRef = useRef<() => void>(() => undefined);
  const planTargetRef = useRef<
    (index: number, token: number, priority: number, reason: string) => Promise<boolean>
  >(() => Promise.resolve(false));
  const runSwitchWorkerRef = useRef<() => void>(() => undefined);
  const maybeStartBootRef = useRef<(reason?: string) => void>(() => undefined);

  const currentState = portfolioStates[machine.currentIndex];

  const commitMachine = useCallback(
    (
      update:
        | Partial<MachineState>
        | ((previous: MachineState) => MachineState),
    ) => {
      const previous = machineRef.current;
      const next =
        typeof update === "function"
          ? update(previous)
          : { ...previous, ...update };
      if (
        next.currentIndex === previous.currentIndex &&
        next.currentPhase === previous.currentPhase &&
        next.requestedIndex === previous.requestedIndex &&
        next.transitionTarget === previous.transitionTarget &&
        next.transitionSource === previous.transitionSource &&
        next.transitionToken === previous.transitionToken &&
        next.activeSlot === previous.activeSlot &&
        next.isUserPaused === previous.isUserPaused &&
        next.isMenuPaused === previous.isMenuPaused &&
        next.isVisibilityPaused === previous.isVisibilityPaused &&
        next.isHoverPaused === previous.isHoverPaused &&
        next.pauseReason === previous.pauseReason &&
        next.isTransitioning === previous.isTransitioning &&
        next.issue === previous.issue &&
        next.experienceStarted === previous.experienceStarted
      ) {
        return previous;
      }
      machineRef.current = next;
      setMachine(next);
      if (previous.currentPhase !== next.currentPhase) {
        debugMedia(`PHASE ${previous.currentPhase} → ${next.currentPhase}`);
      }
      if (previous.requestedIndex !== next.requestedIndex) {
        debugMedia(
          `requestedState=${
            next.requestedIndex === null
              ? "none"
              : portfolioStates[next.requestedIndex].number
          }`,
        );
      }
      return next;
    },
    [],
  );

  const desiredTarget = useCallback((state: MachineState) => {
    return (
      state.requestedIndex ??
      state.transitionTarget ??
      (state.currentIndex + 1) % portfolioStates.length
    );
  }, []);

  const diagnosticSnapshot = useCallback(
    (video?: HTMLVideoElement | null) => {
      const state = machineRef.current;
      const activeVideo = video ?? videoRefs.current[state.activeSlot];
      return {
        videoPaused: activeVideo?.paused ?? null,
        currentTime: activeVideo
          ? Number(activeVideo.currentTime.toFixed(3))
          : null,
        readyState: activeVideo?.readyState ?? null,
        networkState: activeVideo?.networkState ?? null,
        requestedState:
          state.requestedIndex === null
            ? null
            : portfolioStates[state.requestedIndex].number,
        currentState: portfolioStates[state.currentIndex].number,
        currentPhase: state.currentPhase,
        isUserPaused: state.isUserPaused,
        isMenuPaused: state.isMenuPaused,
        isVisibilityPaused: state.isVisibilityPaused,
        isHoverPaused: state.isHoverPaused,
        pauseReason: state.pauseReason,
        transitionSource: state.transitionSource,
        transitionToken: state.transitionToken,
      };
    },
    [],
  );

  const setProgressScale = useCallback((scale: number) => {
    const bounded = Math.min(Math.max(scale, 0), 1);
    progressScaleRef.current = bounded;
    progressRef.current?.style.setProperty("--progress-scale", String(bounded));
  }, []);

  const setProgressFromVideo = useCallback(
    (video: HTMLVideoElement) => {
      const duration =
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : EXPECTED_DURATION;
      setProgressScale(video.currentTime / duration);
    },
    [setProgressScale],
  );

  const pauseMediaElement = useCallback(
    (
      video: HTMLVideoElement,
      reason: string,
      assetIndex: number | null,
    ) => {
      if (video.paused) return;
      debugMedia(`PAUSE reason=${reason}`, {
        asset:
          assetIndex === null ? null : portfolioStates[assetIndex].number,
        ...diagnosticSnapshot(video),
      });
      video.pause();
    },
    [diagnosticSnapshot],
  );

  const pausePlayback = useCallback(
    (reason: Exclude<PauseReason, null>) => {
      const state = machineRef.current;
      const video = videoRefs.current[state.activeSlot];
      if (!video) return;
      if (state.pauseReason !== reason || !video.paused) {
        debugMedia(`PAUSE reason=${reason}`, diagnosticSnapshot(video));
      }
      if (!video.paused) video.pause();
      commitMachine({ pauseReason: reason });
    },
    [commitMachine, diagnosticSnapshot],
  );

  const playSlot = useCallback(
    (
      slot: SlotIndex,
      assetIndex: number,
      reason: string,
      operationToken: number,
    ): Promise<PlayResult> => {
      const video = videoRefs.current[slot];
      if (!video) return Promise.resolve({ ok: false, issue: "decode-error" });
      const existing = playAttemptsRef.current[slot];
      if (existing?.token === operationToken) return existing.promise;

      configureVideo(video);
      debugMedia(`PLAY reason=${reason}`, {
        asset: portfolioStates[assetIndex].number,
        slot,
        operationToken,
        ...diagnosticSnapshot(video),
      });

      let rawPlay: Promise<PlayResult>;
      try {
        rawPlay = video
          .play()
          .then(() => {
            debugMedia(`PLAY resolved reason=${reason}`, {
              asset: portfolioStates[assetIndex].number,
              slot,
              operationToken,
            });
            return { ok: true, issue: "none" } as PlayResult;
          })
          .catch((error: unknown) => {
            const issue = issueFromPlayError(error);
            video.dataset.playError =
              error instanceof DOMException ? error.name : "PlayPromiseRejected";
            debugMedia(`PLAY rejected reason=${reason}`, {
              asset: portfolioStates[assetIndex].number,
              issue,
              error:
                error instanceof DOMException ? error.name : String(error),
            });
            return { ok: false, issue } as PlayResult;
          });
      } catch (error) {
        rawPlay = Promise.resolve({
          ok: false,
          issue: issueFromPlayError(error),
        });
      }

      const timeout = wait(PLAY_PROMISE_TIMEOUT_MS).then(
        () => ({ ok: false, issue: "play-timeout" }) as PlayResult,
      );
      const promise = Promise.race([rawPlay, timeout]).finally(() => {
        if (playAttemptsRef.current[slot]?.token === operationToken) {
          playAttemptsRef.current[slot] = null;
        }
      });
      playAttemptsRef.current[slot] = { token: operationToken, promise };
      return promise;
    },
    [diagnosticSnapshot],
  );

  const cleanupSlot = useCallback(
    (slot: SlotIndex, expectedGeneration?: number, expectedAsset?: number | null) => {
      if (
        expectedGeneration !== undefined &&
        slotGenerationRef.current[slot] !== expectedGeneration
      ) {
        return;
      }
      if (
        expectedAsset !== undefined &&
        slotAssetRef.current[slot] !== expectedAsset
      ) {
        return;
      }
      const video = videoRefs.current[slot];
      if (!video) return;
      const assetIndex = slotAssetRef.current[slot];
      pauseMediaElement(video, "slot-reset", assetIndex);
      slotGenerationRef.current[slot] += 1;
      slotAssetRef.current[slot] = null;
      video.removeAttribute("src");
      video.load();
      video.dataset.asset = "none";
      video.dataset.slotStatus = "idle";
      playAttemptsRef.current[slot] = null;
    },
    [pauseMediaElement],
  );

  const operationIsCurrent = useCallback(
    (index: number, token: number, boot = false) => {
      const state = machineRef.current;
      if (boot) {
        return !state.experienceStarted && index === 0;
      }
      return state.transitionToken === token && desiredTarget(state) === index;
    },
    [desiredTarget],
  );

  const prepareSlot = useCallback(
    async (
      slot: SlotIndex,
      index: number,
      token: number,
      context: string,
      boot = false,
    ) => {
      const manager = assetManagerRef.current;
      const video = videoRefs.current[slot];
      const objectUrl = manager?.objectUrl(index);
      if (!manager || !video || !objectUrl) return false;
      if (!operationIsCurrent(index, token, boot)) return false;

      if (
        slotAssetRef.current[slot] === index &&
        video.dataset.objectUrl === objectUrl &&
        !video.error &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        return true;
      }

      const generation = ++slotGenerationRef.current[slot];
      pauseMediaElement(video, `prepare-${context}`, slotAssetRef.current[slot]);
      configureVideo(video);
      slotAssetRef.current[slot] = index;
      video.dataset.asset = portfolioStates[index].number;
      video.dataset.objectUrl = objectUrl;
      video.dataset.slotStatus = "preparing";
      video.src = objectUrl;
      try {
        video.currentTime = 0;
      } catch {
        // The seek is retried after metadata becomes available.
      }
      video.load();

      const ownsSlot = () =>
        mountedRef.current &&
        slotGenerationRef.current[slot] === generation &&
        slotAssetRef.current[slot] === index &&
        operationIsCurrent(index, token, boot);
      const ready = await waitForMediaReady(video, ownsSlot);
      if (!ready || !ownsSlot()) return false;
      try {
        video.currentTime = 0;
      } catch {
        // A complete blob remains available for the next play request.
      }
      video.dataset.slotStatus = "ready";
      debugMedia(`MEDIA ${portfolioStates[index].number} decoded`, {
        slot,
        context,
        readyState: video.readyState,
      });
      return true;
    },
    [operationIsCurrent, pauseMediaElement],
  );

  const targetIsPrepared = useCallback((index: number, token: number) => {
    const prepared = preparedTargetRef.current;
    if (!prepared || prepared.index !== index || prepared.token !== token) {
      return false;
    }
    const video = videoRefs.current[prepared.slot];
    return Boolean(
      video &&
        prepared.slot !== machineRef.current.activeSlot &&
        slotAssetRef.current[prepared.slot] === index &&
        !video.error &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA,
    );
  }, []);

  const planTarget = useCallback(
    (index: number, token: number, priority: number, reason: string) => {
      const prepared = preparedTargetRef.current;
      if (
        prepared?.index === index &&
        prepared.token === token &&
        prepared.slot !== machineRef.current.activeSlot &&
        slotAssetRef.current[prepared.slot] === index
      ) {
        const preparedVideo = videoRefs.current[prepared.slot];
        if (
          preparedVideo &&
          !preparedVideo.error &&
          preparedVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        ) {
          return Promise.resolve(true);
        }
      }
      const existing = targetPlanRef.current;
      if (existing?.index === index && existing.token === token) {
        return existing.promise;
      }

      const promise = (async () => {
        const manager = assetManagerRef.current;
        if (!manager) return false;
        const downloaded = await manager.request(index, priority);
        if (!downloaded || !operationIsCurrent(index, token)) return false;
        const slot = otherSlot(machineRef.current.activeSlot);
        const decoded = await prepareSlot(slot, index, token, reason);
        if (!decoded || !operationIsCurrent(index, token)) return false;
        preparedTargetRef.current = { index, slot, token };
        debugMedia(`TARGET ${portfolioStates[index].number} viable`, {
          token,
          reason,
          slot,
        });
        driveMachineRef.current();
        return true;
      })();

      targetPlanRef.current = { index, token, promise };
      void promise.finally(() => {
        if (
          targetPlanRef.current?.index === index &&
          targetPlanRef.current.token === token
        ) {
          targetPlanRef.current = null;
        }
      });
      return promise;
    },
    [operationIsCurrent, prepareSlot],
  );

  useEffect(() => {
    planTargetRef.current = planTarget;
  }, [planTarget]);

  const pauseReasonRequested = useCallback((state: MachineState): PauseReason => {
    if (state.isVisibilityPaused || document.visibilityState !== "visible") {
      return "visibility";
    }
    if (state.isMenuPaused) return "menu";
    if (state.isUserPaused) return "user";
    if (state.isHoverPaused && hoverCapabilityRef.current) return "hover";
    return null;
  }, []);

  const resumeActivePlayback = useCallback(
    (reason: string) => {
      const state = machineRef.current;
      const video = videoRefs.current[state.activeSlot];
      if (!video || video.ended || document.visibilityState !== "visible") {
        return Promise.resolve({ ok: false, issue: "play-timeout" } as PlayResult);
      }
      if (!video.paused) {
        debugMedia(`PLAY reason=${reason} already-playing`, diagnosticSnapshot(video));
        commitMachine({ pauseReason: null, issue: "none" });
        return Promise.resolve({ ok: true, issue: "none" } as PlayResult);
      }
      if (state.issue !== "none" && reason !== "user-continue") {
        return Promise.resolve({ ok: false, issue: state.issue } as PlayResult);
      }

      const index = state.currentIndex;
      const slot = state.activeSlot;
      const token = state.transitionToken;
      return playSlot(slot, index, reason, token).then((result) => {
        const latest = machineRef.current;
        if (
          latest.currentIndex !== index ||
          latest.activeSlot !== slot ||
          latest.transitionToken !== token
        ) {
          return result;
        }
        if (result.ok) {
          commitMachine({ pauseReason: null, issue: "none" });
        } else {
          commitMachine({
            pauseReason: "autoplay-blocked",
            issue: result.issue,
          });
        }
        return result;
      });
    },
    [commitMachine, diagnosticSnapshot, playSlot],
  );

  const authorizeExit = useCallback(
    (target: number, token: number, source: TransitionSource) => {
      const state = machineRef.current;
      const video = videoRefs.current[state.activeSlot];
      if (
        !video ||
        video.ended ||
        state.transitionToken !== token ||
        !targetIsPrepared(target, token) ||
        document.visibilityState !== "visible"
      ) {
        return false;
      }
      if (state.isMenuPaused) return false;

      const existingGate = exitGateRef.current;
      if (
        existingGate?.cycle === playbackCycleRef.current &&
        existingGate.token === token &&
        existingGate.target === target
      ) {
        return true;
      }

      const shouldSeek = video.currentTime < AUTO_EXIT_ARM;
      const gate: ExitGate = {
        cycle: playbackCycleRef.current,
        target,
        token,
        source,
        seeking: shouldSeek,
      };
      exitGateRef.current = gate;

      debugMedia(`EXIT authorized target=${portfolioStates[target].number}`, {
        source,
        token,
        shouldSeek,
        ...diagnosticSnapshot(video),
      });
      commitMachine({
        currentPhase: "EXIT",
        transitionTarget: target,
        transitionSource: source,
        pauseReason: null,
        isTransitioning: true,
        issue: "none",
      });

      const resumeAuthorizedExit = () => {
        const currentGate = exitGateRef.current;
        const latest = machineRef.current;
        if (
          currentGate !== gate ||
          latest.transitionToken !== token ||
          latest.currentIndex !== state.currentIndex ||
          latest.activeSlot !== state.activeSlot ||
          document.visibilityState !== "visible"
        ) {
          return;
        }
        gate.seeking = false;
        setProgressFromVideo(video);
        void resumeActivePlayback(`transition-${source}`);
      };

      if (!shouldSeek) {
        resumeAuthorizedExit();
        return true;
      }

      pauseMediaElement(video, `transition-seek-${source}`, state.currentIndex);
      let settled = false;
      let seekTimeout = 0;
      const finishSeek = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(seekTimeout);
        video.removeEventListener("seeked", finishSeek);
        resumeAuthorizedExit();
      };
      video.addEventListener("seeked", finishSeek, { once: true });
      seekTimeout = window.setTimeout(finishSeek, 550);
      try {
        video.currentTime = EXIT_START;
        setProgressFromVideo(video);
      } catch {
        video.removeEventListener("seeked", finishSeek);
        window.clearTimeout(seekTimeout);
        if (exitGateRef.current === gate) exitGateRef.current = null;
        void resumeActivePlayback("transition-seek-recovery");
        return false;
      }
      return true;
    },
    [
      commitMachine,
      diagnosticSnapshot,
      pauseMediaElement,
      resumeActivePlayback,
      setProgressFromVideo,
      targetIsPrepared,
    ],
  );

  const notifyTransitionChanged = useCallback(() => {
    transitionWakeRef.current.forEach((wake) => wake());
    transitionWakeRef.current.clear();
  }, []);

  const requestTransition = useCallback(
    (index: number, source: TransitionSource) => {
      const state = machineRef.current;
      const isAutomatic = source === "autoplay";
      if (index < 0 || index >= portfolioStates.length) return false;
      if (isAutomatic && state.requestedIndex !== null) return false;
      if (
        isAutomatic &&
        state.transitionTarget === index &&
        state.transitionSource === "autoplay"
      ) {
        return true;
      }
      if (!isAutomatic && index === state.requestedIndex) return true;
      if (!isAutomatic && index === state.currentIndex) return false;

      const token = isAutomatic
        ? state.transitionToken
        : state.transitionToken + 1;
      if (!isAutomatic) {
        preparedTargetRef.current = null;
        targetPlanRef.current = null;
        if (state.currentPhase === "EXIT") {
          exitGateRef.current = {
            cycle: playbackCycleRef.current,
            target: index,
            token,
            source,
            seeking: false,
          };
        } else {
          exitGateRef.current = null;
        }
      }

      commitMachine({
        requestedIndex: isAutomatic ? state.requestedIndex : index,
        transitionTarget: index,
        transitionSource: source,
        transitionToken: token,
        isTransitioning: true,
        issue: "none",
        pauseReason:
          state.currentPhase === "WAITING_TARGET"
            ? "waitingTarget"
            : state.pauseReason,
      });
      notifyTransitionChanged();
      debugMedia(
        `TRANSITION requested target=${portfolioStates[index].number} source=${source}`,
        { token, phase: state.currentPhase },
      );
      const priority = isAutomatic
        ? PRIORITY_AUTOMATIC_NEXT
        : PRIORITY_MANUAL;
      if (!isAutomatic) void assetManagerRef.current?.promote(index, priority);
      void planTargetRef.current(
        index,
        token,
        priority,
        `request-${source}`,
      );
      driveMachineRef.current();
      if (state.currentPhase === "SWITCHING") runSwitchWorkerRef.current();
      return true;
    },
    [commitMachine, notifyTransitionChanged],
  );

  const waitForPlanOrTransition = useCallback(
    (index: number, token: number, priority: number, reason: string) => {
      let wake: (() => void) | null = null;
      const changed = new Promise<"changed">((resolve) => {
        wake = () => resolve("changed");
        transitionWakeRef.current.add(wake);
      });
      const planned = planTargetRef
        .current(index, token, priority, reason)
        .then((ready) => (ready ? ("ready" as const) : ("failed" as const)));
      return Promise.race([planned, changed]).finally(() => {
        if (wake) transitionWakeRef.current.delete(wake);
      });
    },
    [],
  );

  const switchToPrepared = useCallback(
    async (
      index: number,
      token: number,
      playReason: string,
    ): Promise<SwitchResult> => {
      const state = machineRef.current;
      const prepared = preparedTargetRef.current;
      if (
        state.transitionToken !== token ||
        desiredTarget(state) !== index ||
        !prepared ||
        prepared.index !== index ||
        prepared.token !== token
      ) {
        return "superseded";
      }
      const slot = prepared.slot;
      const video = videoRefs.current[slot];
      if (!video) return "error";
      const slotGeneration = slotGenerationRef.current[slot];
      const ownsOperation = () => {
        const latest = machineRef.current;
        return (
          latest.transitionToken === token &&
          desiredTarget(latest) === index &&
          slotGenerationRef.current[slot] === slotGeneration &&
          slotAssetRef.current[slot] === index
        );
      };

      try {
        video.currentTime = 0;
      } catch {
        // The complete blob has already supplied a decoded first frame.
      }
      const playResult = await playSlot(slot, index, playReason, token);
      if (!ownsOperation()) {
        if (
          slotGenerationRef.current[slot] === slotGeneration &&
          slotAssetRef.current[slot] === index &&
          machineRef.current.activeSlot !== slot
        ) {
          pauseMediaElement(video, "obsolete-switch", index);
        }
        return "superseded";
      }
      if (!playResult.ok) {
        commitMachine({
          issue: playResult.issue,
          pauseReason: "autoplay-blocked",
        });
        return playResult.issue === "autoplay-blocked" ? "blocked" : "error";
      }
      const firstFrameReady = await waitForFirstFrame(video, ownsOperation);
      if (!ownsOperation()) {
        if (
          slotGenerationRef.current[slot] === slotGeneration &&
          slotAssetRef.current[slot] === index &&
          machineRef.current.activeSlot !== slot
        ) {
          pauseMediaElement(video, "obsolete-first-frame", index);
        }
        return "superseded";
      }
      if (!firstFrameReady) {
        commitMachine({ issue: "play-timeout", pauseReason: "autoplay-blocked" });
        return "error";
      }

      const previousSlot = state.activeSlot;
      const previousIndex = state.currentIndex;
      const previousGeneration = slotGenerationRef.current[previousSlot];
      const nextToken = token + 1;
      playbackCycleRef.current += 1;
      endedCycleRef.current = -1;
      holdWatchdogRef.current = {
        cycle: playbackCycleRef.current,
        attempted: false,
        lastMovingTime: 0,
      };
      preparedTargetRef.current = null;
      targetPlanRef.current = null;
      exitGateRef.current = null;
      setFallbackIndex(null);
      setProgressScale(0);
      assetManagerRef.current?.markActive(index);
      debugMedia(`SWITCH ${portfolioStates[previousIndex].number} → ${portfolioStates[index].number}`, {
        token,
        activeSlot: slot,
      });
      commitMachine({
        currentIndex: index,
        currentPhase: "ENTER",
        requestedIndex: null,
        transitionTarget: null,
        transitionSource: null,
        transitionToken: nextToken,
        activeSlot: slot,
        pauseReason: null,
        isTransitioning: false,
        issue: "none",
        experienceStarted: true,
      });

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          cleanupSlot(previousSlot, previousGeneration, previousIndex);
          const automaticTarget = (index + 1) % portfolioStates.length;
          void planTargetRef.current(
            automaticTarget,
            nextToken,
            PRIORITY_AUTOMATIC_NEXT,
            "automatic-next",
          );
        });
      });
      return "switched";
    },
    [
      cleanupSlot,
      commitMachine,
      desiredTarget,
      pauseMediaElement,
      playSlot,
      setProgressScale,
    ],
  );

  const runSwitchWorker = useCallback(() => {
    if (switchWorkerRef.current) return;

    const run = async () => {
      while (mountedRef.current) {
        const state = machineRef.current;
        if (state.currentPhase !== "SWITCHING") return;
        const target = desiredTarget(state);
        const token = state.transitionToken;
        const priority =
          state.requestedIndex === null
            ? PRIORITY_AUTOMATIC_NEXT
            : PRIORITY_MANUAL;
        const result = await waitForPlanOrTransition(
          target,
          token,
          priority,
          "switching",
        );
        if (!mountedRef.current) return;
        if (
          result === "changed" ||
          machineRef.current.transitionToken !== token
        ) {
          continue;
        }
        if (result === "failed") {
          const status = assetManagerRef.current?.snapshot(target);
          commitMachine({
            issue: status?.status === "error" ? "network-error" : "decode-error",
            pauseReason: "waitingTarget",
          });
          return;
        }
        const switched = await switchToPrepared(
          target,
          token,
          "switch-target",
        );
        if (switched === "superseded") continue;
        return;
      }
    };

    const worker = run().finally(() => {
      if (switchWorkerRef.current === worker) switchWorkerRef.current = null;
    });
    switchWorkerRef.current = worker;
  }, [commitMachine, desiredTarget, switchToPrepared, waitForPlanOrTransition]);

  useEffect(() => {
    runSwitchWorkerRef.current = runSwitchWorker;
  }, [runSwitchWorker]);

  const handleEnded = useCallback(
    (slot: SlotIndex) => {
      const state = machineRef.current;
      if (
        !state.experienceStarted ||
        state.activeSlot !== slot ||
        endedCycleRef.current === playbackCycleRef.current
      ) {
        return;
      }
      endedCycleRef.current = playbackCycleRef.current;
      setProgressScale(1);
      const target = desiredTarget(state);
      const priority =
        state.requestedIndex === null
          ? PRIORITY_AUTOMATIC_NEXT
          : PRIORITY_MANUAL;
      debugMedia(`ENDED ${portfolioStates[state.currentIndex].number}`, {
        target: portfolioStates[target].number,
        token: state.transitionToken,
      });
      commitMachine({
        currentPhase: "SWITCHING",
        transitionTarget: target,
        pauseReason: "waitingTarget",
        isTransitioning: true,
      });
      void planTargetRef.current(target, state.transitionToken, priority, "ended");
      runSwitchWorkerRef.current();
    },
    [commitMachine, desiredTarget, setProgressScale],
  );

  const handleUnexpectedHoldPause = useCallback(
    (video: HTMLVideoElement) => {
      const cycle = playbackCycleRef.current;
      const watchdog = holdWatchdogRef.current;
      if (watchdog.cycle !== cycle) {
        holdWatchdogRef.current = {
          cycle,
          attempted: false,
          lastMovingTime: video.currentTime,
        };
      }
      if (holdWatchdogRef.current.attempted) return;
      holdWatchdogRef.current.attempted = true;
      const capturedTime = video.currentTime;
      debugMedia("HOLD anomaly: paused without valid reason", diagnosticSnapshot(video));
      void resumeActivePlayback("hold-watchdog").then((result) => {
        if (!result.ok) return;
        window.setTimeout(() => {
          const latest = machineRef.current;
          const active = videoRefs.current[latest.activeSlot];
          if (
            latest.currentPhase === "HOLD" &&
            latest.pauseReason === null &&
            active === video &&
            video.paused &&
            video.currentTime <= capturedTime + 0.05
          ) {
            debugMedia("HOLD watchdog could not sustain playback", diagnosticSnapshot(video));
            commitMachine({
              issue: "autoplay-blocked",
              pauseReason: "autoplay-blocked",
            });
          }
        }, HOLD_WATCHDOG_DELAY_MS);
      });
    },
    [commitMachine, diagnosticSnapshot, resumeActivePlayback],
  );

  const driveMachine = useCallback(() => {
    const state = machineRef.current;
    if (
      !state.experienceStarted ||
      reducedMotion ||
      state.currentPhase === "BOOT" ||
      state.currentPhase === "INTRO" ||
      state.currentPhase === "SWITCHING"
    ) {
      return;
    }
    const video = videoRefs.current[state.activeSlot];
    if (!video) return;
    setProgressFromVideo(video);

    if (video.ended) {
      handleEnded(state.activeSlot);
      return;
    }
    if (
      state.isVisibilityPaused ||
      document.visibilityState !== "visible"
    ) {
      pausePlayback("visibility");
      return;
    }

    const desired = desiredTarget(state);
    const exitGate = exitGateRef.current;
    if (
      exitGate?.cycle === playbackCycleRef.current &&
      exitGate.token === state.transitionToken &&
      exitGate.target === desired
    ) {
      if (
        state.currentPhase !== "EXIT" ||
        state.transitionTarget !== desired ||
        state.transitionSource !== exitGate.source
      ) {
        commitMachine({
          currentPhase: "EXIT",
          transitionTarget: desired,
          transitionSource: exitGate.source,
          pauseReason: null,
          isTransitioning: true,
        });
      }
      if (!exitGate.seeking && video.paused && state.issue === "none") {
        void resumeActivePlayback(`exit-watchdog-${exitGate.source}`);
      }
      return;
    }

    const temporalPhase = phaseForTime(video.currentTime);
    if (temporalPhase === "ENTER") {
      if (state.currentPhase !== "ENTER" || state.pauseReason !== null) {
        commitMachine({ currentPhase: "ENTER", pauseReason: null });
      }
      if (state.requestedIndex !== null) {
        void planTargetRef.current(
          state.requestedIndex,
          state.transitionToken,
          PRIORITY_MANUAL,
          "manual-during-enter",
        );
      }
      if (video.paused && state.issue === "none") {
        void resumeActivePlayback("enter-watchdog");
      }
      return;
    }

    if (temporalPhase === "EXIT") {
      const source = state.transitionSource ?? "autoplay";
      const target = desiredTarget(state);
      const priority =
        state.requestedIndex === null
          ? PRIORITY_AUTOMATIC_NEXT
          : PRIORITY_MANUAL;
      exitGateRef.current = {
        cycle: playbackCycleRef.current,
        target,
        token: state.transitionToken,
        source,
        seeking: false,
      };
      if (
        state.currentPhase !== "EXIT" ||
        state.transitionTarget !== target ||
        state.pauseReason !== null
      ) {
        commitMachine({
          currentPhase: "EXIT",
          transitionTarget: target,
          transitionSource: source,
          pauseReason: null,
          isTransitioning: true,
        });
      }
      void planTargetRef.current(
        target,
        state.transitionToken,
        priority,
        "target-during-exit",
      );
      if (video.paused && state.issue === "none") {
        void resumeActivePlayback("exit-watchdog");
      }
      return;
    }

    const requested = state.requestedIndex;
    if (requested !== null) {
      void planTargetRef.current(
        requested,
        state.transitionToken,
        PRIORITY_MANUAL,
        "manual-during-hold",
      );
      if (targetIsPrepared(requested, state.transitionToken)) {
        const validPause = pauseReasonRequested(state);
        if (validPause) {
          pausePlayback(validPause);
          return;
        }
        authorizeExit(
          requested,
          state.transitionToken,
          state.transitionSource ?? "click",
        );
        return;
      }
      if (video.currentTime < HOLD_START + 0.22) {
        try {
          video.currentTime = HOLD_START;
          setProgressFromVideo(video);
        } catch {
          // The current composition is already visually static.
        }
      }
      if (
        state.currentPhase !== "WAITING_TARGET" ||
        state.transitionTarget !== requested
      ) {
        commitMachine({
          currentPhase: "WAITING_TARGET",
          transitionTarget: requested,
          transitionSource: state.transitionSource ?? "click",
          isTransitioning: true,
        });
      }
      pausePlayback("waitingTarget");
      return;
    }

    if (
      state.currentPhase === "WAITING_TARGET" &&
      state.transitionTarget !== null
    ) {
      const target = state.transitionTarget;
      void planTargetRef.current(
        target,
        state.transitionToken,
        PRIORITY_AUTOMATIC_NEXT,
        "automatic-waiting",
      );
      if (targetIsPrepared(target, state.transitionToken)) {
        const validPause = pauseReasonRequested(state);
        if (validPause) {
          pausePlayback(validPause);
          return;
        }
        authorizeExit(
          target,
          state.transitionToken,
          state.transitionSource ?? "autoplay",
        );
      } else {
        pausePlayback("waitingTarget");
      }
      return;
    }

    const requestedPause = pauseReasonRequested(state);
    if (requestedPause) {
      if (state.currentPhase !== "HOLD") commitMachine({ currentPhase: "HOLD" });
      pausePlayback(requestedPause);
      return;
    }

    const automaticTarget = (state.currentIndex + 1) % portfolioStates.length;
    void planTargetRef.current(
      automaticTarget,
      state.transitionToken,
      PRIORITY_AUTOMATIC_NEXT,
      "automatic-next",
    );
    if (video.currentTime >= AUTO_EXIT_ARM) {
      requestTransition(automaticTarget, "autoplay");
      if (targetIsPrepared(automaticTarget, state.transitionToken)) {
        authorizeExit(automaticTarget, state.transitionToken, "autoplay");
      } else {
        commitMachine({
          currentPhase: "WAITING_TARGET",
          transitionTarget: automaticTarget,
          transitionSource: "autoplay",
          isTransitioning: true,
        });
        pausePlayback("waitingTarget");
      }
      return;
    }

    if (
      state.currentPhase !== "HOLD" ||
      state.pauseReason !== null ||
      state.isTransitioning
    ) {
      commitMachine({
        currentPhase: "HOLD",
        transitionTarget: null,
        transitionSource: null,
        pauseReason: null,
        isTransitioning: false,
      });
    }
    const resumedSafePause =
      state.pauseReason === "user" ||
      state.pauseReason === "menu" ||
      state.pauseReason === "visibility" ||
      state.pauseReason === "hover";
    const watchdog = holdWatchdogRef.current;
    if (!video.paused) {
      if (
        watchdog.cycle !== playbackCycleRef.current ||
        video.currentTime >= watchdog.lastMovingTime + 0.15
      ) {
        holdWatchdogRef.current = {
          cycle: playbackCycleRef.current,
          attempted: false,
          lastMovingTime: video.currentTime,
        };
      }
    } else if (state.issue === "none") {
      if (resumedSafePause) {
        void resumeActivePlayback(`resume-${state.pauseReason}`);
      } else {
        handleUnexpectedHoldPause(video);
      }
    }
  }, [
    authorizeExit,
    commitMachine,
    desiredTarget,
    handleEnded,
    handleUnexpectedHoldPause,
    pausePlayback,
    pauseReasonRequested,
    reducedMotion,
    requestTransition,
    resumeActivePlayback,
    setProgressFromVideo,
    targetIsPrepared,
  ]);

  useEffect(() => {
    driveMachineRef.current = driveMachine;
  }, [driveMachine]);

  const finishBoot = useCallback(() => {
    setBootView("exiting");
    if (bootExitTimerRef.current !== null) {
      window.clearTimeout(bootExitTimerRef.current);
    }
    bootExitTimerRef.current = window.setTimeout(() => {
      setBootView("ready");
    }, BOOT_EXIT_MS);
  }, []);

  const startBootPlayback = useCallback(
    (reason: string) => {
      if (
        bootAttemptRef.current ||
        machineRef.current.experienceStarted ||
        !bootMediaReadyRef.current
      ) {
        return;
      }
      const video = videoRefs.current[0];
      if (!video) return;
      bootAttemptRef.current = true;
      const attemptId = ++bootAttemptIdRef.current;
      const operationToken = -attemptId;
      void playSlot(0, 0, reason, operationToken).then(async (result) => {
        if (
          attemptId !== bootAttemptIdRef.current ||
          !mountedRef.current ||
          machineRef.current.experienceStarted
        ) {
          return;
        }
        bootAttemptRef.current = false;
        if (!result.ok) {
          commitMachine({
            issue: result.issue,
            pauseReason: "autoplay-blocked",
          });
          setBootView("action");
          return;
        }
        const firstFrameReady = await waitForFirstFrame(
          video,
          () =>
            mountedRef.current &&
            attemptId === bootAttemptIdRef.current &&
            !machineRef.current.experienceStarted,
        );
        if (
          attemptId !== bootAttemptIdRef.current ||
          machineRef.current.experienceStarted
        ) {
          return;
        }
        if (!firstFrameReady) {
          pauseMediaElement(video, "boot-first-frame-timeout", 0);
          commitMachine({ issue: "play-timeout", pauseReason: "autoplay-blocked" });
          setBootView("action");
          return;
        }

        playbackCycleRef.current = 1;
        endedCycleRef.current = -1;
        exitGateRef.current = null;
        holdWatchdogRef.current = {
          cycle: 1,
          attempted: false,
          lastMovingTime: 0,
        };
        assetManagerRef.current?.markActive(0);
        setProgressScale(0);
        commitMachine({
          currentIndex: 0,
          currentPhase: "ENTER",
          requestedIndex: null,
          transitionTarget: null,
          transitionSource: null,
          transitionToken: 1,
          activeSlot: 0,
          pauseReason: null,
          isTransitioning: false,
          issue: "none",
          experienceStarted: true,
        });
        finishBoot();
        window.requestAnimationFrame(() => {
          void planTargetRef.current(
            1,
            1,
            PRIORITY_AUTOMATIC_NEXT,
            "automatic-next",
          );
        });
      });
    },
    [
      commitMachine,
      finishBoot,
      pauseMediaElement,
      playSlot,
      setProgressScale,
    ],
  );

  const maybeStartBoot = useCallback(
    (reason = "intro-complete") => {
      if (
        !bootMinimumDoneRef.current ||
        !bootMediaReadyRef.current ||
        machineRef.current.experienceStarted
      ) {
        return;
      }
      startBootPlayback(
        continueRequestedRef.current ? "user-continue" : reason,
      );
    },
    [startBootPlayback],
  );

  useEffect(() => {
    maybeStartBootRef.current = maybeStartBoot;
  }, [maybeStartBoot]);

  const prepareBootMedia = useCallback(() => {
    if (bootPreparationRef.current) return bootPreparationRef.current;
    const manager = assetManagerRef.current;
    if (!manager) return Promise.resolve(false);
    const promise = manager
      .request(0, PRIORITY_PRESENTATION)
      .then((ready) => {
        if (!ready || machineRef.current.experienceStarted) return false;
        return prepareSlot(0, 0, 0, "boot", true);
      })
      .then((ready) => {
        if (ready) {
          bootMediaReadyRef.current = true;
          debugMedia("PRESENTATION fully downloaded and decoded");
          maybeStartBootRef.current("intro-complete");
        }
        return ready;
      });
    bootPreparationRef.current = promise;
    return promise;
  }, [prepareSlot]);

  const revealFallback = useCallback(
    (index: number, issue: PlaybackIssue) => {
      exitGateRef.current = null;
      setFallbackIndex(index);
      setProgressScale(0);
      commitMachine({
        currentIndex: index,
        currentPhase: "HOLD",
        requestedIndex: null,
        transitionTarget: null,
        transitionSource: null,
        transitionToken: machineRef.current.transitionToken + 1,
        pauseReason: issue === "none" ? "user" : "autoplay-blocked",
        isTransitioning: false,
        issue,
        experienceStarted: true,
      });
      finishBoot();
    },
    [commitMachine, finishBoot, setProgressScale],
  );

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateMotion = () => {
      setReducedMotion(motionQuery.matches);
      setMotionPreferenceReady(true);
    };
    const updateHover = () => {
      hoverCapabilityRef.current = hoverQuery.matches;
      setCanHover(hoverQuery.matches);
      if (!hoverQuery.matches && machineRef.current.isHoverPaused) {
        commitMachine({ isHoverPaused: false });
        driveMachineRef.current();
      }
    };
    const updateVisibility = () => {
      const hidden = !sceneActiveRef.current || document.visibilityState !== "visible";
      pageVisibleRef.current = !hidden;
      commitMachine({ isVisibilityPaused: hidden });
      if (hidden && machineRef.current.experienceStarted) {
        pausePlayback("visibility");
      } else if (!hidden) {
        driveMachineRef.current();
        if (machineRef.current.currentPhase === "SWITCHING") {
          runSwitchWorkerRef.current();
        }
      }
    };

    updateMotion();
    updateHover();
    updateVisibility();
    motionQuery.addEventListener("change", updateMotion);
    hoverQuery.addEventListener("change", updateHover);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      hoverQuery.removeEventListener("change", updateHover);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [commitMachine, pausePlayback]);

  useEffect(() => {
    if (!motionPreferenceReady) return;
    debugMedia("BOOT");
    commitMachine({ currentPhase: "INTRO" });
    let cancelled = false;
    const minimumTimer = window.setTimeout(() => {
      if (cancelled) return;
      bootMinimumDoneRef.current = true;
      debugMedia("INTRO minimum completed");
      maybeStartBootRef.current("intro-complete");
    }, reducedMotion ? 900 : INTRO_MINIMUM_MS);

    if (reducedMotion) {
      const fallbackTimer = window.setTimeout(() => {
        if (!cancelled) revealFallback(0, "none");
      }, 950);
      return () => {
        cancelled = true;
        window.clearTimeout(minimumTimer);
        window.clearTimeout(fallbackTimer);
      };
    }

    const manager = new SessionVideoAssetManager(
      portfolioStates.map((state) => state.video),
      MAX_DOWNLOADS,
      debugMedia,
    );
    assetManagerRef.current = manager;
    const unsubscribe = manager.subscribe((index, snapshot) => {
      setAssetStatuses((previous) => {
        if (previous[index] === snapshot.status) return previous;
        const next = [...previous];
        next[index] = snapshot.status;
        return next;
      });
      const main = mainRef.current;
      if (main) {
        main.dataset[`asset${index}`] = snapshot.status;
      }
      if (index === 0 && snapshot.ready) void prepareBootMedia();
      driveMachineRef.current();
    });

    void manager.request(0, PRIORITY_PRESENTATION);
    [1, 2, 3, 4].forEach((index) => {
      void manager.request(index, BACKGROUND_PRIORITIES[index]);
    });
    void prepareBootMedia();

    const safetyTimer = window.setTimeout(() => {
      if (cancelled || machineRef.current.experienceStarted) return;
      bootAttemptIdRef.current += 1;
      bootAttemptRef.current = false;
      const presentation = videoRefs.current[0];
      if (presentation) pauseMediaElement(presentation, "boot-safety", 0);
      const snapshot = manager.snapshot(0);
      const issue: PlaybackIssue =
        snapshot.status === "error"
          ? "network-error"
          : snapshot.ready
            ? "play-timeout"
            : "loading-timeout";
      debugMedia("BOOT safety timeout", { issue, asset: snapshot });
      commitMachine({ issue, pauseReason: "boot-safety" });
      setBootView("action");
    }, BOOT_SAFETY_MS);

    return () => {
      cancelled = true;
      unsubscribe();
      window.clearTimeout(minimumTimer);
      window.clearTimeout(safetyTimer);
      manager.dispose();
      if (assetManagerRef.current === manager) assetManagerRef.current = null;
    };
  }, [
    commitMachine,
    motionPreferenceReady,
    pauseMediaElement,
    prepareBootMedia,
    reducedMotion,
    revealFallback,
  ]);

  useEffect(() => {
    if (!machine.experienceStarted || reducedMotion) return;
    let frame = 0;
    const tick = () => {
      driveMachineRef.current();
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [machine.experienceStarted, reducedMotion]);

  useEffect(() => {
    progressRef.current?.style.setProperty(
      "--progress-scale",
      String(progressScaleRef.current),
    );
    const list = selectorListRef.current;
    const activeButton = list?.querySelector<HTMLButtonElement>("button.active");
    if (!list || !activeButton || window.innerWidth > 700) return;
    const frame = window.requestAnimationFrame(() => {
      const left =
        activeButton.offsetLeft -
        (list.clientWidth - activeButton.offsetWidth) / 2;
      list.scrollTo({
        left: Math.max(0, left),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [machine.currentIndex, reducedMotion]);

  // The page keeps both stable video slots mounted between sections. A scene
  // switch is a visibility pause, never a new intro or a new media session.
  useEffect(() => {
    const hidden = !active || document.visibilityState !== "visible";
    pageVisibleRef.current = !hidden;
    commitMachine({ isVisibilityPaused: hidden, isMenuPaused: menuOpen, ...(!active ? { isHoverPaused: false } : {}) });
    if (hidden || menuOpen) {
      if (machineRef.current.experienceStarted) pausePlayback(hidden ? "visibility" : "menu");
    } else {
      driveMachineRef.current();
      if (machineRef.current.currentPhase === "SWITCHING") runSwitchWorkerRef.current();
    }
  }, [active, menuOpen, commitMachine, pausePlayback]);

  useEffect(
    () => {
      mountedRef.current = true;
      const transitionWakes = transitionWakeRef.current;
      const videos = videoRefs.current;
      const slotAssets = slotAssetRef.current;
      return () => {
        mountedRef.current = false;
        transitionWakes.forEach((wake) => wake());
        transitionWakes.clear();
        if (bootExitTimerRef.current !== null) {
          window.clearTimeout(bootExitTimerRef.current);
        }
        videos.forEach((video, slot) => {
          if (video) {
            pauseMediaElement(
              video,
              "component-unmount",
              slotAssets[slot],
            );
          }
        });
      };
    },
    [pauseMediaElement],
  );

  const selectReducedMotionState = (index: number) => {
    exitGateRef.current = null;
    setFallbackIndex(index);
    setProgressScale(0);
    commitMachine({
      currentIndex: index,
      currentPhase: "HOLD",
      requestedIndex: null,
      transitionTarget: null,
      transitionSource: null,
      transitionToken: machineRef.current.transitionToken + 1,
      pauseReason: "user",
      isTransitioning: false,
      issue: "none",
      experienceStarted: true,
    });
  };

  const requestState = (
    index: number,
    source: Exclude<TransitionSource, "autoplay"> = "click",
  ) => {
    if (index === machineRef.current.currentIndex) return;
    if (reducedMotion) {
      selectReducedMotionState(index);
      return;
    }
    requestTransition(index, source);
  };

  const handleBootContinue = () => {
    continueRequestedRef.current = true;
    commitMachine({ issue: "none", pauseReason: null });
    const manager = assetManagerRef.current;
    if (!manager) return;
    const snapshot = manager.snapshot(0);
    if (snapshot.status === "error") {
      bootPreparationRef.current = null;
      bootMediaReadyRef.current = false;
      void manager.retry(0, PRIORITY_PRESENTATION).then(() => prepareBootMedia());
      return;
    }
    if (bootMediaReadyRef.current) {
      bootAttemptRef.current = false;
      startBootPlayback("user-continue");
      return;
    }
    void manager.promote(0, PRIORITY_PRESENTATION).then(() => prepareBootMedia());
  };

  const retryPlayback = () => {
    const state = machineRef.current;
    commitMachine({ issue: "none", pauseReason: null });
    if (state.currentPhase === "SWITCHING") {
      const target = desiredTarget(state);
      if (targetIsPrepared(target, state.transitionToken)) {
        void switchToPrepared(target, state.transitionToken, "user-continue");
      } else {
        runSwitchWorkerRef.current();
      }
      return;
    }
    void resumeActivePlayback("user-continue");
  };

  const retryAsset = () => {
    const state = machineRef.current;
    const target =
      state.requestedIndex ?? state.transitionTarget ?? state.currentIndex;
    commitMachine({ issue: "none" });
    setFallbackIndex(null);
    void assetManagerRef.current
      ?.retry(target, PRIORITY_MANUAL)
      .then((ready) => {
        if (!ready) {
          commitMachine({ issue: "network-error" });
          return;
        }
        void planTargetRef.current(
          target,
          machineRef.current.transitionToken,
          PRIORITY_MANUAL,
          "asset-retry",
        );
        driveMachineRef.current();
        if (machineRef.current.currentPhase === "SWITCHING") {
          runSwitchWorkerRef.current();
        }
      });
  };

  const handlePlaybackControl = () => {
    if (
      machine.issue === "autoplay-blocked" ||
      machine.issue === "play-timeout" ||
      machine.issue === "loading-timeout"
    ) {
      retryPlayback();
      return;
    }
    if (machine.issue === "network-error" || machine.issue === "decode-error") {
      retryAsset();
      return;
    }
    const nextPaused = !machineRef.current.isUserPaused;
    commitMachine({ isUserPaused: nextPaused });
    debugMedia(nextPaused ? "USER requested pause" : "USER requested resume");
    driveMachineRef.current();
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || (event.target as HTMLElement).closest("button")) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    suppressVisualClickRef.current = true;
    window.setTimeout(() => {
      suppressVisualClickRef.current = false;
    }, 260);
    const nextIndex =
      deltaX < 0
        ? (machineRef.current.currentIndex + 1) % portfolioStates.length
        : (machineRef.current.currentIndex - 1 + portfolioStates.length) %
          portfolioStates.length;
    requestState(nextIndex, "swipe");
  };

  const handleVisualKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      rememberVisualReturn();
      onNavigate(currentState.href);
      return;
    }
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (machineRef.current.currentIndex + direction + portfolioStates.length) %
      portfolioStates.length;
    requestState(nextIndex, "keyboard");
  };

  const rememberVisualReturn = () => {
    try {
      sessionStorage.setItem(
        "portfolio:returnTo",
        JSON.stringify({ path: "/", timestamp: Date.now() }),
      );
    } catch {
      // The browser history remains available when storage is restricted.
    }
  };

  const handleVisualClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      suppressVisualClickRef.current ||
      (event.target as HTMLElement).closest("button, a")
    ) {
      return;
    }
    rememberVisualReturn();
    onNavigate(currentState.href);
  };

  const handleNativeMediaEvent = (slot: SlotIndex, eventName: string) => {
    const video = videoRefs.current[slot];
    const assetIndex = slotAssetRef.current[slot];
    if (!video) return;
    video.dataset.lastEvent = eventName;
    if (eventName === "timeupdate" && slot === machineRef.current.activeSlot) {
      setProgressFromVideo(video);
      if (video.currentTime >= 6) {
        const previous = lastTimelineLogRef.current;
        if (
          previous.cycle !== playbackCycleRef.current ||
          video.currentTime >= previous.time + 0.25
        ) {
          lastTimelineLogRef.current = {
            cycle: playbackCycleRef.current,
            time: video.currentTime,
          };
          const target = desiredTarget(machineRef.current);
          debugMedia("EXIT timeline", {
            nextStateReady: targetIsPrepared(
              target,
              machineRef.current.transitionToken,
            ),
            ...diagnosticSnapshot(video),
          });
        }
      }
      driveMachineRef.current();
    } else if (eventName === "pause") {
      debugMedia("NATIVE pause event", {
        slot,
        asset:
          assetIndex === null ? null : portfolioStates[assetIndex].number,
        ...diagnosticSnapshot(video),
      });
    } else if (eventName === "play" || eventName === "playing") {
      debugMedia(`NATIVE ${eventName} event`, {
        slot,
        asset:
          assetIndex === null ? null : portfolioStates[assetIndex].number,
      });
    } else if (eventName === "waiting" || eventName === "stalled") {
      debugMedia(`NATIVE ${eventName}`, {
        slot,
        asset:
          assetIndex === null ? null : portfolioStates[assetIndex].number,
        ...diagnosticSnapshot(video),
      });
    }
  };

  const handleVideoError = (slot: SlotIndex) => {
    const state = machineRef.current;
    const assetIndex = slotAssetRef.current[slot];
    const video = videoRefs.current[slot];
    debugMedia("MEDIA decode error", {
      slot,
      asset:
        assetIndex === null ? null : portfolioStates[assetIndex].number,
      code: video?.error?.code ?? null,
    });
    if (slot === state.activeSlot) {
      setFallbackIndex(state.currentIndex);
      commitMachine({
        issue: "decode-error",
        pauseReason: "autoplay-blocked",
      });
    }
  };

  const fallbackVisible = reducedMotion || fallbackIndex === machine.currentIndex;
  const controlShowsPlay = machine.isUserPaused || machine.issue !== "none";
  const controlLabel =
    machine.issue === "network-error" || machine.issue === "decode-error"
      ? "Reintentar carga del video"
      : controlShowsPlay
        ? "Reanudar presentación automática"
        : "Pausar presentación automática";
  const liveStatus =
    machine.issue === "autoplay-blocked"
      ? "La reproducción automática está bloqueada. Active el botón de reproducción."
      : machine.issue === "network-error" || machine.issue === "decode-error"
        ? "No fue posible preparar el video. Puede reintentar la carga."
        : machine.currentPhase === "WAITING_TARGET" && machine.transitionTarget !== null
          ? `Preparando ${portfolioStates[machine.transitionTarget].short}.`
          : "";
  const bootActionLabel =
    machine.issue === "network-error" || machine.issue === "decode-error"
      ? "Reintentar"
      : "Continuar";

  return (
    <>
      {bootView !== "ready" && (
        <div
          className={`boot-screen ${bootView === "exiting" ? "is-exiting" : ""}`}
          data-boot-state={bootView}
          data-boot-issue={machine.issue}
          role="status"
          aria-live="polite"
          aria-label={
            bootView === "action"
              ? "La portada está lista para continuar"
              : "Preparando portada"
          }
        >
          <span className="boot-wordmark" aria-label="Cristian David Campos">
            CDC<span>.</span>
          </span>
          <div className="boot-copy">
            <p>Bienvenido a mi portafolio</p>
            <span>Cristian Campos · Editor de Video</span>
          </div>
          {bootView === "loading" && (
            <span className="boot-indicator" aria-hidden="true" />
          )}
          {bootView === "action" && (
            <button
              type="button"
              className="boot-play"
              aria-label={
                bootActionLabel === "Reintentar"
                  ? "Reintentar carga de la presentación"
                  : "Iniciar presentación automática"
              }
              onClick={handleBootContinue}
            >
              <span className="play-icon" aria-hidden="true" />
              <span>{bootActionLabel}</span>
            </button>
          )}
        </div>
      )}

      <div
        className="portfolio-site-root"
        aria-hidden={bootView !== "ready"}
      >
      <section
        ref={mainRef}
        id="inicio"
        className="portfolio-shell"
        data-portfolio-state={currentState.number}
        data-portfolio-phase={reducedMotion ? "REDUCED" : machine.currentPhase}
        data-playback-paused={machine.pauseReason !== null ? "true" : "false"}
        data-pause-reason={machine.pauseReason ?? "none"}
        data-requested-state={
          machine.requestedIndex === null
            ? "none"
            : portfolioStates[machine.requestedIndex].number
        }
        data-transition-target={
          machine.transitionTarget === null
            ? "none"
            : portfolioStates[machine.transitionTarget].number
        }
        data-transition-token={machine.transitionToken}
        data-active-slot={machine.activeSlot}
        data-asset-statuses={assetStatuses.join(",")}
        data-experience-started={machine.experienceStarted ? "true" : "false"}
        data-playback-issue={machine.issue}
      >
        <div className="site-header home-header-space" aria-hidden="true" />

        <section className="hero" aria-label="Presentación y proyecto destacado">
          <div className="intro">
            <h1>
              <span className="name-desktop">
                Cristian<br />David<br />Campos
              </span>
              <span className="name-mobile">
                Cristian<br />David Campos
              </span>
            </h1>
            <p className="role">
              Editor de Video · Motion Graphics
              <br />
              Diseño Multimedia
            </p>
            <p className="statement">
              Creo y edito contenido audiovisual con intención, ritmo y enfoque digital.
            </p>
          </div>

          <article className="featured">
            <div
              className={`project-image-wrap ${
                machine.currentPhase === "WAITING_TARGET" ? "is-waiting" : ""
              }`}
              tabIndex={0}
              role="link"
              aria-label={`${currentState.number} ${currentState.short}. Abrir contenido; deslice horizontalmente para cambiar de estado en dispositivos táctiles.`}
              onClick={handleVisualClick}
              onPointerEnter={
                canHover
                  ? (event) => {
                      if (
                        event.pointerType === "mouse" &&
                        hoverCapabilityRef.current
                      ) {
                        commitMachine({ isHoverPaused: true });
                        driveMachineRef.current();
                      }
                    }
                  : undefined
              }
              onPointerLeave={
                canHover
                  ? (event) => {
                      if (
                        event.pointerType === "mouse" &&
                        hoverCapabilityRef.current
                      ) {
                        commitMachine({ isHoverPaused: false });
                        driveMachineRef.current();
                      }
                    }
                  : undefined
              }
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onKeyDown={handleVisualKeyDown}
            >
              {([0, 1] as SlotIndex[]).map((slot) => (
                <video
                  key={slot}
                  ref={(node) => {
                    videoRefs.current[slot] = node;
                  }}
                  className={`state-video ${
                    machine.experienceStarted &&
                    slot === machine.activeSlot &&
                    !fallbackVisible
                      ? "is-active"
                      : ""
                  }`}
                  data-slot={slot}
                  muted
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-hidden="true"
                  onPlay={() => handleNativeMediaEvent(slot, "play")}
                  onTimeUpdate={() => handleNativeMediaEvent(slot, "timeupdate")}
                  onLoadedMetadata={() => handleNativeMediaEvent(slot, "loadedmetadata")}
                  onLoadedData={() => handleNativeMediaEvent(slot, "loadeddata")}
                  onCanPlay={() => handleNativeMediaEvent(slot, "canplay")}
                  onPlaying={() => handleNativeMediaEvent(slot, "playing")}
                  onPause={() => handleNativeMediaEvent(slot, "pause")}
                  onWaiting={() => handleNativeMediaEvent(slot, "waiting")}
                  onStalled={() => handleNativeMediaEvent(slot, "stalled")}
                  onEnded={() => handleEnded(slot)}
                  onError={() => handleVideoError(slot)}
                />
              ))}

              {fallbackVisible && (
                <img
                  key={currentState.poster}
                  className="state-fallback"
                  src={currentState.poster}
                  alt={currentState.visualAlt}
                  width="1856"
                  height="1080"
                  loading="eager"
                  decoding="async"
                  draggable="false"
                />
              )}

              <button
                type="button"
                className={`autoplay-control ${
                  machine.issue !== "none" ? "is-blocked" : ""
                }`}
                aria-label={controlLabel}
                aria-pressed={machine.isUserPaused}
                onClick={(event) => {
                  event.stopPropagation();
                  handlePlaybackControl();
                }}
              >
                <span
                  className={controlShowsPlay ? "play-icon" : "pause-icon"}
                  aria-hidden="true"
                />
              </button>
              <span className="sr-only" aria-live="polite">{liveStatus}</span>
            </div>

            <div key={currentState.number} className="project-meta" aria-live="polite">
              <span className="project-number">{currentState.number}</span>
              <div>
                <p>{currentState.category}</p>
                <h2>{currentState.title}</h2>
              </div>
              <a className="future-state" href={`#${currentState.href.replace(/^\/proyectos\//, "caso/").replace(/^\//, "")}`} onClick={(event) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); onNavigate(currentState.href); }}>
                {currentState.future}
              </a>
            </div>
          </article>
        </section>

        <nav className="project-selector" aria-label="Seleccionar estado de la portada">
          <div ref={selectorListRef} className="selector-list">
            {portfolioStates.map((item, index) => {
              const isActive = index === machine.currentIndex;
              const isPending = index === machine.requestedIndex && !isActive;
              return (
                <button
                  key={item.number}
                  type="button"
                  className={`${isActive ? "active" : ""} ${
                    isPending ? "is-pending" : ""
                  }`}
                  aria-pressed={isActive}
                  aria-busy={isPending}
                  aria-label={`${item.number} ${item.short}`}
                  onClick={() => requestState(index)}
                >
                  <span className="selector-track" aria-hidden="true">
                    {isActive && (
                      <span
                        ref={progressRef}
                        className="selector-progress"
                        style={initialProgressStyle}
                      />
                    )}
                  </span>
                  <span className="selector-content">
                    <span className="selector-number">{item.number}</span>
                    <span className="selector-label">{item.short}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mobile-active-state" aria-hidden="true">
            <span>{currentState.number}</span>{currentState.mobileShort}
          </p>
        </nav>

      </section>
      </div>
    </>
  );
}
