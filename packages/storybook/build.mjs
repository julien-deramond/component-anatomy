/**
 * Build script for @component-anatomy/storybook
 *
 * Manager and preview entries stay ESM with `storybook/*` and `react` left
 * external — Storybook's builders alias those to its own runtime when the
 * user's Storybook compiles the addon.
 */
import { build } from 'esbuild';
import { execSync } from 'child_process';
import { rmSync, mkdirSync } from 'fs';

const outDir = 'dist';

try { rmSync(outDir, { recursive: true, force: true }); } catch {}
mkdirSync(outDir, { recursive: true });

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'storybook',
  'storybook/*',
  '@storybook/*',
  '@component-anatomy/core',
];

const shared = {
  bundle: true,
  sourcemap: true,
  target: 'es2020',
  external,
  jsx: 'transform', // classic runtime — `React` global is provided by the manager
};

await Promise.all([
  build({ ...shared, entryPoints: ['src/index.ts'], format: 'esm', outfile: `${outDir}/index.js` }),
  build({ ...shared, entryPoints: ['src/index.ts'], format: 'cjs', outfile: `${outDir}/index.cjs` }),
  build({ ...shared, entryPoints: ['src/manager.tsx'], format: 'esm', outfile: `${outDir}/manager.js` }),
  build({ ...shared, entryPoints: ['src/preview.ts'], format: 'esm', outfile: `${outDir}/preview.js` }),
]);

execSync('../../node_modules/.bin/tsc --emitDeclarationOnly --declaration --outDir dist', {
  stdio: 'inherit',
});

console.log('✓ @component-anatomy/storybook built');
