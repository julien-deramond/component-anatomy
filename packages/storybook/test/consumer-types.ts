/**
 * Regression fixture for issue #12.
 *
 * Type-checks against the package's *built* declaration output
 * (`dist/index.d.ts`), not its source under `src/` — the bug that shipped
 * @component-anatomy/storybook@0.0.1 with no `.d.ts` files at all was
 * invisible to any check against source, since `src/types.ts` itself was
 * always correct. Only a check that imports from `dist`, the way a real
 * consumer does, can catch the build silently failing to emit it.
 *
 * The valid usage below mirrors the README's own example.
 */
import type { AnatomyParameters } from '../dist/index.js';

const parameters: AnatomyParameters = {
  parts: [{ id: 'icon', name: 'Icon', description: 'Optional leading glyph.' }],
  preset: 'blueprint',
  theme: { accent: '#0d9488' },
  overlayLabel: true,
  overlayPadding: 2,
  root: '.my-component',
  disable: false,
};
void parameters;

// If `AnatomyParameters` has silently degraded to `any` (e.g. the
// declaration file went missing again), this assignment stops erroring and
// the unused `@ts-expect-error` directive itself becomes a type error —
// failing the check either way.
// @ts-expect-error - `bogusField` is not part of AnatomyParameters
const invalid: AnatomyParameters = { bogusField: true };
void invalid;
