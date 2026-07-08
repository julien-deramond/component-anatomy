export type AnatomyPartDefinition = {
  /** Matches the value of data-part="..." on the DOM element */
  id: string;
  /** Display name shown in the documentation panel and overlay label */
  name: string;
  /** Raw Markdown string — rendered by the integration layer */
  description?: string;
};

export type AnatomyEvent = 'part:enter' | 'part:leave';
export type AnatomyEventHandler = (partId: string) => void;

/* ─────────────────────────── Theming ─────────────────────────── */

/** Names of the built-in visual presets. */
export type AnatomyPresetName = 'default' | 'minimal' | 'contrast' | 'blueprint';

/**
 * Theme tokens. All optional — anything you don't set falls back to the
 * preset, then to global `--ca-*` CSS variables, then to the default look.
 */
export type AnatomyTheme = {
  /**
   * Shorthand: a single brand color. Overlay border, overlay background
   * (15% wash) and label background are derived from it automatically.
   */
  accent?: string;
  /** Overlay fill. Any CSS color. */
  overlayBg?: string;
  /** Overlay border color. */
  overlayBorder?: string;
  /** Overlay border width — number (px) or CSS length. */
  overlayBorderWidth?: string | number;
  /** Overlay border style: 'solid' | 'dashed' | 'dotted'… */
  overlayBorderStyle?: string;
  /** Overlay corner radius — number (px) or CSS length. */
  overlayRadius?: string | number;
  /** Label chip background. */
  labelBg?: string;
  /** Label chip text color. */
  labelFg?: string;
  /** Label chip font-family. */
  labelFont?: string;
  /** Label chip font-size — number (px) or CSS length. */
  labelFontSize?: string | number;
  /** z-index of overlays and labels. */
  zIndex?: number;
  /** Show/hide transition duration — number (ms) or CSS time. */
  transitionMs?: string | number;
};

/* ─────────────────────── Overlay customization ─────────────────────── */

export type OverlayRenderContext = {
  /** The part being highlighted. */
  part: AnatomyPartDefinition;
  /** The DOM element this overlay box covers. */
  element: HTMLElement;
  /** Index of this element among all elements matching the part (0-based). */
  index: number;
};

export type OverlayOptions = {
  /** Show the floating name label chip. Default: true. */
  label?: boolean;
  /**
   * Custom label content. Return a string (used as textContent) or a Node
   * (appended). Return null/undefined to fall back to the part name.
   */
  renderLabel?: (ctx: OverlayRenderContext) => string | Node | null | undefined;
  /**
   * Called after each overlay box is created and positioned — mutate it,
   * append children, add classes. The box is `position: fixed` and sized
   * to the target element.
   */
  decorateOverlay?: (box: HTMLElement, ctx: OverlayRenderContext) => void;
  /** Extra class name(s) added to every overlay box. */
  className?: string;
  /** Inflate the highlight box by N pixels on every side. Default: 0. */
  padding?: number;
};

/* ─────────────────────────── Options ─────────────────────────── */

export type AnatomyOptions = {
  /** The component preview container — where data-part elements live */
  root: HTMLElement;
  /** The documentation panel container — where data-anatomy-item elements live */
  panel?: HTMLElement;
  /** Part definitions. If omitted, auto-discovers from data-part values in the DOM */
  parts?: AnatomyPartDefinition[];
  /** Named visual preset. Default: 'default'. */
  preset?: AnatomyPresetName;
  /** Per-instance theme token overrides (applied on top of the preset). */
  theme?: AnatomyTheme;
  /** Overlay rendering options and hooks. */
  overlay?: OverlayOptions;
};

export type AnatomyController = {
  /** Programmatically activate a part (overlay + panel highlight) */
  highlight(partId: string): void;
  /** Deactivate all parts */
  unhighlight(): void;
  /** Re-query the DOM — call after dynamic updates */
  refresh(): void;
  /** Tear down all listeners and overlays */
  destroy(): void;
  /** Subscribe to part activation events. Returns an unsubscribe function. */
  on(event: AnatomyEvent, handler: AnatomyEventHandler): () => void;
  /** The resolved part definitions (explicit or auto-discovered). */
  getParts(): AnatomyPartDefinition[];
  /** Swap theme tokens at runtime. Pass a preset name, tokens, or both. */
  setTheme(theme: AnatomyTheme, preset?: AnatomyPresetName): void;
};
