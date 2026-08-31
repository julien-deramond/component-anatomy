import type { AnatomyTheme, AnatomyPresetName } from './types.js';
import { contrastRatio, mix, parseColor } from './contrast.js';

/**
 * Theming — resolves { preset, theme } into a set of CSS custom properties
 * applied per controller instance.
 *
 * Resolution order (lowest → highest priority):
 *   1. Stylesheet defaults (the `var(--ca-*, fallback)` chain — the "default" look)
 *   2. Global CSS variables set by the user on :root or an ancestor
 *   3. A named preset passed to createAnatomy()
 *   4. Individual `theme` tokens passed to createAnatomy()
 *
 * The `accent` token is a shorthand: when provided, overlay border, overlay
 * background and label background are derived from it (via color-mix) unless
 * they are explicitly set too.
 */

/** Maps theme token names → CSS custom property names used by the stylesheet. */
export const TOKEN_TO_VAR: Record<
  keyof Omit<AnatomyTheme, 'accent' | 'overlayBorderStyle'>,
  string
> = {
  overlayBg: '--ca-overlay-bg',
  overlayBorder: '--ca-overlay-border',
  overlayBorderWidth: '--ca-overlay-border-width',
  overlayRadius: '--ca-overlay-radius',
  labelBg: '--ca-label-bg',
  labelFg: '--ca-label-fg',
  labelFont: '--ca-label-font',
  labelFontSize: '--ca-label-font-size',
  zIndex: '--ca-overlay-z',
  transitionMs: '--ca-transition',
};

/**
 * Built-in presets. Each is a plain AnatomyTheme — you can also import these,
 * spread them, and tweak individual tokens.
 */
export const presets: Record<AnatomyPresetName, AnatomyTheme> = {
  /** The built-in indigo look. Empty on purpose: it lives in the stylesheet defaults. */
  default: {},

  /** Quiet: no fill, thin neutral border, subdued label. */
  minimal: {
    overlayBg: 'transparent',
    overlayBorder: 'rgba(107, 114, 128, 0.9)',
    overlayBorderWidth: '1px',
    overlayRadius: '2px',
    labelBg: '#374151',
    labelFg: '#f9fafb',
  },

  /** High-visibility: strong yellow/black, thick border. WCAG-friendly. */
  contrast: {
    overlayBg: 'rgba(250, 204, 21, 0.25)',
    overlayBorder: '#000000',
    overlayBorderWidth: '3px',
    overlayRadius: '0px',
    labelBg: '#000000',
    labelFg: '#facc15',
  },

  /** Technical drawing look: blue dashed outline on a light wash. */
  blueprint: {
    overlayBg: 'rgba(37, 99, 235, 0.08)',
    overlayBorder: '#2563eb',
    overlayBorderWidth: '1.5px',
    overlayRadius: '0px',
    overlayBorderStyle: 'dashed',
    labelBg: '#1d4ed8',
    labelFg: '#ffffff',
  },
};

/** Formats one token value for CSS: bare numbers carry the unit the token implies. */
function tokenValue(token: string, value: string | number): string {
  if (typeof value !== 'number') return String(value);
  if (token === 'zIndex') return String(value);
  if (token === 'transitionMs') return `${value}ms`;
  return `${value}px`;
}

/**
 * Write one layer of tokens into `vars`, later layers overwriting earlier ones.
 *
 * `accent` is applied *before* the layer's own explicit tokens, so a layer that
 * sets both keeps the explicit one — while still overriding whatever a lower
 * layer had derived.
 */
function applyLayer(vars: Record<string, string>, tokens: AnatomyTheme | undefined): void {
  if (!tokens) return;

  if (tokens.accent) {
    vars['--ca-overlay-border'] = tokens.accent;
    vars['--ca-overlay-bg'] = `color-mix(in srgb, ${tokens.accent} 15%, transparent)`;
    vars['--ca-label-bg'] = tokens.accent;
  }

  for (const [token, cssVar] of Object.entries(TOKEN_TO_VAR)) {
    const value = tokens[token as keyof AnatomyTheme];
    if (value !== undefined) vars[cssVar] = tokenValue(token, value);
  }

  if (tokens.overlayBorderStyle) {
    vars['--ca-overlay-border-style'] = tokens.overlayBorderStyle;
  }
}

/**
 * Resolve a { preset, theme } pair into a flat CSS-variable map.
 * Only *customized* tokens are returned — an empty result means
 * "use the stylesheet defaults", which keeps global `--ca-*` variables
 * set by users fully functional (backward compatible).
 *
 * The two arguments are two of the four resolution layers documented at the
 * top of this file, and they are applied in that order rather than merged into
 * one object. Merging first would let a preset's `labelBg` outrank a theme's
 * `accent`, which inverts layers 3 and 4 — the accent is a *theme* token, so
 * `{ preset: 'contrast', theme: { accent } }` must honour the accent.
 */
export function resolveThemeVars(
  preset?: AnatomyPresetName,
  theme?: AnatomyTheme
): Record<string, string> {
  const vars: Record<string, string> = {};

  applyLayer(vars, preset ? presets[preset] : undefined);
  applyLayer(vars, theme);

  return vars;
}

/* ─────────────────────── Panel / table accent ─────────────────────── */

/** The built-in indigo. Also the stylesheet default for `--ca-label-bg`. */
export const DEFAULT_ACCENT = '#4f46e5';

/** The surface a documentation panel paints its accent on. */
export type PanelSurface = {
  /** Background color of the panel. Omit to skip the legibility check. */
  background?: string;
  /** The panel's own text color — what an illegible accent is lifted toward. */
  foreground?: string;
  /** Minimum WCAG contrast ratio. Default: 4.5 (normal-size text). */
  minRatio?: number;
};

/**
 * The accent a documentation panel should use for a given `{ preset, theme }`.
 *
 * A panel styled in CSS reads `var(--ca-label-bg)` and needs none of this. One
 * rendered in JS has no cascade to inherit the controller's inline variables
 * from, so it asks here instead and gets the *one* color it needs — the same
 * token, so panel and canvas agree whichever preset is set.
 *
 * Pass a `surface` and the result is also checked for legibility *on that
 * surface*. Presets are designed against the user's component, not against a
 * panel: `contrast` is black on yellow, and a panel with a dark background
 * turns it into 1.3:1 text — failing precisely the readers that preset exists
 * for.
 *
 * The rule when it is illegible: **a color the caller chose is adjusted, never
 * swapped for one they did not choose.** So an accent that came from `theme`
 * is only ever darkened or lightened toward the panel's own text, and the
 * built-in indigo is a stand-in for callers who customized nothing rather than
 * a candidate that could beat someone's brand color.
 *
 * A color that came from a *preset* is not the caller's in the same sense, so
 * there the preset's other colors compete with the blended version, and the
 * more colorful one wins: a near-neutral fallback (`blueprint`'s white label
 * text, on a dark surface) is legible and yet indistinguishable from the
 * panel's ordinary text, which stops it reading as an accent at all. `contrast`
 * keeps its yellow; `blueprint` keeps a blue.
 *
 * A color that cannot be parsed (`color-mix()`, `currentColor`, a named color)
 * is left untouched rather than guessed at.
 */
export function resolvePanelAccent(
  preset?: AnatomyPresetName,
  theme?: AnatomyTheme,
  surface: PanelSurface = {}
): string {
  const vars = resolveThemeVars(preset, theme);
  const slots = ['--ca-label-bg', '--ca-overlay-border', '--ca-label-fg'] as const;

  const customized = [
    ...new Set(
      slots
        .map((slot) => vars[slot])
        .filter((color): color is string => !!color && color !== 'transparent')
    ),
  ];

  // The built-in indigo stands in when the caller customized *nothing*. It is
  // deliberately not one candidate among many: a story that chose its own
  // colors must never be handed the addon's default back, however well that
  // default happens to score against the panel.
  const candidates = customized.length > 0 ? customized : [DEFAULT_ACCENT];

  const preferred = candidates[0];
  const { background, foreground, minRatio = 4.5 } = surface;
  if (!background) return preferred;

  // An unmeasurable color counts as legible: the caller gave us something we
  // have no business rewriting.
  const legible = (color: string): boolean => {
    const ratio = contrastRatio(color, background);
    return ratio === null || ratio >= minRatio;
  };

  if (legible(preferred)) return preferred;

  // Did the caller's own `theme` produce the color we are about to replace, or
  // did it come from the preset? Only in the second case may a sibling color
  // stand in for it.
  const preferredSlot = slots.find((slot) => vars[slot] === preferred);
  const themeVars = resolveThemeVars(undefined, theme);
  const authoredByCaller = !!preferredSlot && themeVars[preferredSlot] !== undefined;

  const fallbacks = authoredByCaller ? [] : candidates.slice(1).filter(legible);

  // Keep as much of the preferred accent as the surface allows: walk down from
  // 90% accent, stopping at the first legible blend.
  for (let amount = 0.9; foreground && amount > 0; amount -= 0.1) {
    const lifted = mix(preferred, foreground, amount);
    if (lifted && legible(lifted)) {
      fallbacks.push(lifted);
      break;
    }
  }

  if (fallbacks.length === 0) return foreground ?? preferred;
  return fallbacks.reduce((best, color) => (chroma(color) > chroma(best) ? color : best));
}

/**
 * How colorful a color is, 0 (grey, black, white) to 1 (fully saturated) —
 * HSL saturation without the hue and lightness. Unparseable colors score 0,
 * which only ever costs them a tie-break.
 */
function chroma(color: string): number {
  const rgb = parseColor(color);
  if (!rgb) return 0;
  return (Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)) / 255;
}
