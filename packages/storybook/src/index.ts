import { definePreviewAddon } from 'storybook/internal/csf';

import addonAnnotations from './preview.js';
import type { AnatomyParameters } from './types.js';

export { ADDON_ID, PANEL_ID, PARAM_KEY, EVENTS } from './constants.js';
export type { AnatomyParameters } from './types.js';

/** Parameter types contributed by this addon, for CSF Next type safety. */
export interface AnatomyTypes {
  parameters: {
    /** Configuration for the Component Anatomy addon. */
    anatomy?: AnatomyParameters;
  };
}

/**
 * CSF Next entry point. Users register the addon's preview annotations in
 * `.storybook/preview.ts`:
 *
 * ```ts
 * import componentAnatomy from '@component-anatomy/storybook';
 *
 * export default definePreview({
 *   addons: [componentAnatomy()],
 * });
 * ```
 */
export default () => definePreviewAddon<AnatomyTypes>(addonAnnotations);
