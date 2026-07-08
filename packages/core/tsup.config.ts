/**
 * NOTE: This project uses `build.mjs` (esbuild directly) instead of tsup.
 *
 * This file is intentionally left as a reference for the equivalent tsup
 * configuration, but the active build script is `build.mjs`.
 *
 * To build: `npm run build` (runs `node build.mjs`)
 */
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'ComponentAnatomy',
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
});
