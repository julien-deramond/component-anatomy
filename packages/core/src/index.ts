export type {
  AnatomyPartDefinition,
  AnatomyOptions,
  AnatomyController,
  AnatomyEvent,
  AnatomyEventHandler,
  AnatomyTheme,
  AnatomyPresetName,
  OverlayOptions,
  OverlayRenderContext,
} from './types.js';

export { createController as createAnatomy } from './controller.js';
export { presets, resolveThemeVars } from './theme.js';
