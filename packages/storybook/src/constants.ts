export const ADDON_ID = 'component-anatomy';
export const PANEL_ID = `${ADDON_ID}/panel`;

/** Story parameter key: `parameters.anatomy = { ... }` */
export const PARAM_KEY = 'anatomy';

/** Channel events used to sync the manager panel with the preview iframe. */
export const EVENTS = {
  /** preview → manager: a part became active in the canvas (hover/programmatic). */
  PART_ENTER: `${ADDON_ID}/part-enter`,
  /** preview → manager: no part is active anymore. */
  PART_LEAVE: `${ADDON_ID}/part-leave`,
  /** preview → manager: resolved part list for the current story. */
  PARTS: `${ADDON_ID}/parts`,
  /** manager → preview: the user hovers/focuses a panel entry. */
  HOVER_ITEM: `${ADDON_ID}/hover-item`,
  /** manager → preview: the user left a panel entry. */
  LEAVE_ITEM: `${ADDON_ID}/leave-item`,
  /** manager → preview: the panel mounted and wants the current part list. */
  PARTS_REQUEST: `${ADDON_ID}/parts-request`,
} as const;
