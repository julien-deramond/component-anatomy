export const ADDON_ID = 'component-anatomy';
export const PANEL_ID = `${ADDON_ID}/panel`;

/** Story parameter key: `parameters.anatomy = { ... }` */
export const PARAM_KEY = 'anatomy';

/**
 * Channel events used to sync the manager panel — and the `<Anatomy>` MDX doc
 * block, which runs in the preview iframe — with the story canvas.
 *
 * Every payload carries the `storyId` it concerns; see `channel.ts` for the
 * payload types and the `matchesStory` filter each listener applies.
 */
export const EVENTS = {
  /** preview → consumers: a part became active in the canvas (hover/programmatic). */
  PART_ENTER: `${ADDON_ID}/part-enter`,
  /** preview → consumers: no part is active anymore. */
  PART_LEAVE: `${ADDON_ID}/part-leave`,
  /** preview → consumers: resolved part list for a story. */
  PARTS: `${ADDON_ID}/parts`,
  /** consumers → preview: the user hovers/focuses a panel entry. */
  HOVER_ITEM: `${ADDON_ID}/hover-item`,
  /** consumers → preview: the user left a panel entry. */
  LEAVE_ITEM: `${ADDON_ID}/leave-item`,
  /** consumers → preview: a panel/block mounted and wants the current part list. */
  PARTS_REQUEST: `${ADDON_ID}/parts-request`,
} as const;
