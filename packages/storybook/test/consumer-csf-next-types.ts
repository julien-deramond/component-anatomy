/**
 * Regression fixture for the CSF Next entry point, in the same spirit as
 * `consumer-types.ts`: it type-checks against `dist/`, the way a consumer's
 * `preview.ts` resolves the package.
 *
 * Under CSF Next, Storybook composes a `definePreview` project from its own
 * `addons` array and ignores the preview annotations that `.storybook/main.ts`
 * would otherwise contribute (see `generateProjectAnnotationsCodeFromPreviews`
 * in `@storybook/builder-vite`). So the package's default export is not a
 * convenience — without it the canvas decorator never runs in a CSF Next
 * Storybook, and the Anatomy panel stays empty for every story.
 *
 * `definePreview` is imported from `storybook/internal/csf` rather than from a
 * framework package because the framework re-exports are renderer-specific and
 * not every renderer ships one yet (`@storybook/html` has none as of
 * storybook@11.0.0-alpha.0). The addon contract under test is the same either
 * way: `componentAnatomy()` has to be assignable to `addons`.
 */
import { definePreview } from 'storybook/internal/csf';

import componentAnatomy from '../dist/index.js';
import type { AnatomyParameters, ComponentAnatomyTypes } from '../dist/index.js';

const preview = definePreview({
  addons: [componentAnatomy()],
  parameters: { layout: 'centered' },
});
void preview;

// The addon's contribution to the project's type context: a typed
// `parameters.anatomy` on every meta and story of that preview.
const parameters: NonNullable<ComponentAnatomyTypes['parameters']>['anatomy'] = {
  parts: [{ id: 'label', name: 'Label' }],
  preset: 'blueprint',
};
void parameters;

const widened: AnatomyParameters | undefined = parameters;
void widened;

// If `dist/index.d.ts` went missing, the default export degrades to `any`,
// this assignment stops erroring, and the unused `@ts-expect-error` becomes a
// type error itself — the check fails either way.
// @ts-expect-error - `bogusField` is not part of AnatomyParameters
const invalid: AnatomyParameters = { bogusField: true };
void invalid;
