/**
 * Build script for @component-anatomy/storybook
 *
 * Every entry is ESM with `storybook/*`, `react` and `@storybook/addon-docs`
 * left external — Storybook's builders alias those to its own runtime when the
 * user's Storybook compiles the addon.
 *
 * There is no CJS output: `storybook` has been ESM-only since 9, and the main
 * entry now pulls in the preview annotations (for `definePreviewAddon`), so a
 * `.cjs` build would `require()` `storybook/preview-api` and throw on load.
 */
import { build } from 'esbuild';
import { execSync } from 'child_process';
import { rmSync, mkdirSync } from 'fs';
import { assertFilesExist } from '../../scripts/assert-files.mjs';

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
  '@storybook/addon-docs/blocks',
  '@component-anatomy/core',
];

const shared = {
  bundle: true,
  sourcemap: true,
  target: 'es2020',
  external,
  // Classic runtime: every .tsx here imports React explicitly, so this works
  // in the manager and in the preview iframe alike without a jsx-runtime dep.
  jsx: 'transform',
};

await Promise.all([
  build({ ...shared, entryPoints: ['src/index.ts'], format: 'esm', outfile: `${outDir}/index.js` }),
  build({ ...shared, entryPoints: ['src/manager.tsx'], format: 'esm', outfile: `${outDir}/manager.js` }),
  build({ ...shared, entryPoints: ['src/preview.ts'], format: 'esm', outfile: `${outDir}/preview.js` }),
  build({ ...shared, entryPoints: ['src/blocks.tsx'], format: 'esm', outfile: `${outDir}/blocks.js` }),
]);

execSync('../../node_modules/.bin/tsc --emitDeclarationOnly --declaration --outDir dist', {
  stdio: 'inherit',
});

// tsc can exit 0 without emitting anything (e.g. a stray "noEmit": true in
// tsconfig.json) — verify the declarations actually landed before claiming
// success. This is exactly how @component-anatomy/storybook@0.0.1 shipped
// to npm with no .d.ts files at all (issue #12).
assertFilesExist(
  [
    `${outDir}/index.d.ts`,
    `${outDir}/manager.d.ts`,
    `${outDir}/preview.d.ts`,
    `${outDir}/blocks.d.ts`,
  ],
  { packageName: '@component-anatomy/storybook' }
);

console.log('✓ @component-anatomy/storybook built');
