import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { restoreMedia } from './scripts/restore-media.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const requestedBase = process.env.PAGES_BASE_PATH ?? '/';
const base = '/' + requestedBase.replace(/^\/+|\/+$/g, '') + '/';
const normalizedBase = base === '//' ? '/' : base;

export default defineConfig(() => {
  restoreMedia();
  return {
    root: resolve(root, 'static-site'),
    publicDir: resolve(root, 'public'),
    base: normalizedBase,
    plugins: [react()],
    define: { __PORTFOLIO_BASE__: JSON.stringify(normalizedBase) },
    build: { outDir: resolve(root, 'dist-pages'), emptyOutDir: true },
  };
});
