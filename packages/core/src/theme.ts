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

/**
 * Resolve a { preset, theme } pair into a flat CSS-variable map.
 * Only *customized* tokens are returned — an empty result means
 * "use the stylesheet defaults", which keeps global `--ca-*` variables
 * set by users fully functional (backward compatible).
 */
export function resolveThemeVars(
  preset?: AnatomyPresetName,
  theme?: AnatomyTheme
): Record<string, string> {
  const merged: AnatomyTheme = {
    ...(preset ? presets[preset] : undefined),
    ...theme,
  };

  const vars: Record<string, string> = {};

  // Accent shorthand — derive dependent tokens unless explicitly overridden.
  if (merged.accent) {
    vars['--ca-overlay-border'] = merged.accent;
    vars['--ca-overlay-bg'] = `color-mix(in srgb, ${merged.accent} 15%, transparent)`;
    vars['--ca-label-bg'] = merged.accent;
  }

  for (const [token, cssVar] of Object.entries(TOKEN_TO_VAR)) {
    const value = merged[token as keyof AnatomyTheme];
    if (value !== undefined) {
      vars[cssVar] =
        typeof value === 'number'
          ? token === 'zIndex'
            ? String(value)
            : token === 'transitionMs'
              ? `${value}ms`
              : `${value}px`
          : String(value);
    }
  }

  if (merged.overlayBorderStyle) {
    vars['--ca-overlay-border-style'] = merged.overlayBorderStyle;
  }

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
 * Overlays get their look from the CSS variables `resolveThemeVars()` emits.
 * A panel rendered in JS (the Storybook table) has no cascade to inherit them
 * from, so it resolves the same tokens through here and gets the *one* color
 * it needs — keeping panel and canvas in agreement whichever preset is set.
 * `--ca-label-bg` leads the list because that is the variable the Astro
 * panel's CSS already uses for its own accents.
 *
 * Pass a `surface` and the result is also checked for legibility *on that
 * surface*: presets are designed against the user's component, not against a
 * panel, and `contrast` — black on yellow — is illegible on a dark manager
 * panel, which is precisely the audience it exists for.
 *
 * When the preferred token is illegible there, two fallbacks compete: another
 * color from the same preset, and the preferred one blended toward the panel's
 * own text until it passes. The more colorful of the two wins, because a
 * near-neutral fallback (`blueprint`'s white label text on a dark panel) is
 * legible and yet indistinguishable from the panel's ordinary text — it stops
 * reading as an accent at all. `contrast` keeps its yellow; `blueprint` keeps
 * a blue. A color that cannot be parsed (`color-mix()`, `currentColor`, a
 * named color) is left untouched rather than guessed at.
 */
export function resolvePanelAccent(
  preset?: AnatomyPresetName,
  theme?: AnatomyTheme,
  surface: PanelSurface = {}
): string {
  const vars = resolveThemeVars(preset, theme);

  const candidates = [
    ...new Set(
      [
        vars['--ca-label-bg'],
        vars['--ca-overlay-border'],
        vars['--ca-label-fg'],
        DEFAULT_ACCENT,
      ].filter((color): color is string => !!color && color !== 'transparent')
    ),
  ];

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

  const fallbacks = candidates.slice(1).filter(legible);

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
