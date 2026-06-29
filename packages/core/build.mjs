/**
 * Build script for @component-anatomy/core
 * Uses esbuild directly (no tsup) to avoid mounted-FS unlink issues in dev environments.
 */
import { build } from 'esbuild';
import { execSync } from 'child_process';
import { rmSync, mkdirSync } from 'fs';

const entry = 'src/index.ts';
const outDir = 'dist';

// Clean dist
try { rmSync(outDir, { recursive: true, force: true }); } catch {}
mkdirSync(outDir, { recursive: true });

const shared = {
  entryPoints: [entry],
  bundle: true,
  sourcemap: true,
  target: 'es2020',
};

await Promise.all([
  // ESM
  build({
    ...shared,
    format: 'esm',
    outfile: `${outDir}/index.js`,
  }),
  // CJS
  build({
    ...shared,
    format: 'cjs',
    outfile: `${outDir}/index.cjs`,
  }),
  // IIFE for plain <script> usage
  build({
    ...shared,
    format: 'iife',
    globalName: 'ComponentAnatomy',
    outfile: `${outDir}/index.iife.js`,
  }),
]);

// Generate TypeScript declarations via tsc
execSync('../../node_modules/.bin/tsc --emitDeclarationOnly --declaration --outDir dist', {
  stdio: 'inherit',
});

console.log('✓ @component-anatomy/core built');
