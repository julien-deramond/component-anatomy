export { ADDON_ID, PANEL_ID, PARAM_KEY, EVENTS } from './constants.js';
export type { AnatomyParameters } from './types.js';

// The `<Anatomy>` doc block lives in the `./blocks` subpath, not here: this
// entry is loaded at config time by `.storybook/main.ts` (and built to CJS),
// while the block needs React and `@storybook/addon-docs`, both optional
// peers that must not become load-bearing for `addons: ['...']` to work.
