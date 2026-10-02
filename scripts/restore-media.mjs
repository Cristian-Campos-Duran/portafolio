// Restore the supplied MP4 bytes for local use; no media conversion occurs.
import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function restoreMedia() {
  const entries = JSON.parse(readFileSync(resolve(root, 'worker/media-manifest.json'), 'utf8'));
  for (const info of entries) {
    const target = resolve(root, 'public' + info.path);
    if (existsSync(target)) {
      const bytes = readFileSync(target);
      if (bytes.length === info.size && createHash('sha256').update(bytes).digest('hex') === info.sha256) continue;
      throw new Error(`Original media differs from the verified manifest: ${info.path}`);
    }
    const parts = Array.from({ length: Math.ceil(info.size / info.chunkSize) }, (_, i) => readFileSync(resolve(root, info.sourceDirectory, `${i}.bin`)));
    const bytes = Buffer.concat(parts);
    if (bytes.length !== info.size || createHash('sha256').update(bytes).digest('hex') !== info.sha256) throw new Error(`Incomplete media source: ${info.path}`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target + '.tmp', bytes); renameSync(target + '.tmp', target);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) restoreMedia();
