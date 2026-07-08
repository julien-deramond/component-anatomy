import type {
  AnatomyPartDefinition,
  AnatomyPresetName,
  AnatomyTheme,
} from '@component-anatomy/core';

/**
 * Configuration for the anatomy addon, set through story parameters:
 *
 * ```ts
 * export const Primary: Story = {
 *   parameters: {
 *     anatomy: {
 *       parts: [
 *         { id: 'label', name: 'Label', description: 'The visible text.' },
 *       ],
 *     },
 *   },
 * };
 * ```
 */
export type AnatomyParameters = {
  /**
   * Part definitions. If omitted, parts are auto-discovered from
   * `data-part` attributes in the rendered story.
   */
  parts?: AnatomyPartDefinition[];
  /** Named visual preset for the canvas overlays. Default: 'default'. */
  preset?: AnatomyPresetName;
  /** Theme token overrides (applied on top of the preset). */
  theme?: AnatomyTheme;
  /** Show the floating name label chip in the canvas. Default: true. */
  overlayLabel?: boolean;
  /** Inflate highlight boxes by N pixels. Default: 0. */
  overlayPadding?: number;
  /**
   * CSS selector to narrow the anatomy root inside the story canvas.
   * Defaults to the whole canvas element.
   */
  root?: string;
  /** Disable the addon for this story. */
  disable?: boolean;
};
