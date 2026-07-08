import type { AnatomyTheme, AnatomyPresetName } from './types.js';

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
