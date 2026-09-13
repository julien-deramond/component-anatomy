import { definePreviewAddon } from 'storybook/internal/csf';

import annotations from './preview.js';
import type { AnatomyParameters } from './types.js';

export { ADDON_ID, PANEL_ID, PARAM_KEY, EVENTS } from './constants.js';
export type { AnatomyParameters } from './types.js';

/**
 * What this addon contributes to a CSF Next project's type context: a typed
 * `parameters.anatomy` on every meta and story of a preview that registers it.
 */
export type ComponentAnatomyTypes = {
  parameters: {
    /** @see {@link AnatomyParameters} */
    anatomy?: AnatomyParameters;
  };
};

/**
 * The addon's preview annotations, for a CSF Next `preview.ts`:
 *
 * ```ts
 * import { definePreview } from '@storybook/your-framework';
 * import componentAnatomy from '@component-anatomy/storybook';
 *
 * export default definePreview({
 *   addons: [componentAnatomy()],
 * });
 * ```
 *
 * `.storybook/main.ts` must still list the addon — `addons:
 * ['@component-anatomy/storybook']` — since that is what loads the manager
 * panel. What changes under CSF Next is the preview side: a `preview.ts` built
 * with `definePreview` composes *only* its own `addons`, and Storybook drops
 * every addon annotation main.ts would otherwise have contributed. Without the
 * call below, the canvas decorator never mounts and the panel stays empty.
 *
 * Registering in both places is safe — the two paths are mutually exclusive,
 * so the decorator is composed once either way.
 *
 * The `./blocks` subpath, not this entry, holds the `<Anatomy>` MDX block: it
 * needs React and `@storybook/addon-docs`, both optional peers that must not
 * become load-bearing for a Storybook that only wants the panel.
 */
export default () => definePreviewAddon<ComponentAnatomyTypes>(annotations);
