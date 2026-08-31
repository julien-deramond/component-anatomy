import { describe, it, expect } from 'vitest';
import { contrastRatio, parseColor, mix } from '../src/contrast.js';
import { DEFAULT_ACCENT, resolvePanelAccent, resolveThemeVars } from '../src/theme.js';

/**
 * Two ordinary panel surfaces. Deliberately not any integration's real tokens:
 * what is being asserted is that the resolution holds on a light and a dark
 * surface, not that it agrees with one downstream design system this week.
 */
const LIGHT = { background: '#ffffff', foreground: '#333333' };
const DARK = { background: '#1e1e1e', foreground: '#cccccc' };

const ratioOn = (color: string, surface: { background: string }) =>
  contrastRatio(color, surface.background) ?? 0;

describe('parseColor', () => {
  it('parses hex in every length', () => {
    expect(parseColor('#000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(parseColor('#FACC15')).toEqual({ r: 250, g: 204, b: 21, a: 1 });
    expect(parseColor('#00000080')?.a).toBeCloseTo(0.5, 1);
  });

  it('parses both rgb() syntaxes', () => {
    expect(parseColor('rgba(107, 114, 128, 0.9)')).toEqual({ r: 107, g: 114, b: 128, a: 0.9 });
    expect(parseColor('rgb(0 0 0 / 50%)')?.a).toBeCloseTo(0.5, 2);
  });

  it('returns null for notations it cannot measure', () => {
    expect(parseColor('color-mix(in srgb, #fff 50%, transparent)')).toBeNull();
    expect(parseColor('currentColor')).toBeNull();
    expect(parseColor('rebeccapurple')).toBeNull();
  });
});

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });

  it('composites a translucent foreground onto the background first', () => {
    // 50% black over white is mid grey — nowhere near black-on-white's 21:1.
    expect(contrastRatio('rgba(0, 0, 0, 0.5)', '#ffffff')!).toBeLessThan(6);
  });

  it('returns null when either color is unparseable', () => {
    expect(contrastRatio('currentColor', '#ffffff')).toBeNull();
  });
});

describe('mix', () => {
  it('interpolates channel-wise, keeping `amount` of the first color', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(mix('#000000', '#ffffff', 1)).toBe('#000000');
    expect(mix('#000000', '#ffffff', 0)).toBe('#ffffff');
  });
});

describe('resolvePanelAccent', () => {
  it('falls back to the built-in indigo with no preset or theme', () => {
    expect(resolvePanelAccent()).toBe(DEFAULT_ACCENT);
    expect(resolvePanelAccent('default')).toBe(DEFAULT_ACCENT);
  });

  it('follows a preset — the panel no longer disagrees with the canvas', () => {
    expect(resolvePanelAccent('contrast')).toBe('#000000');
    expect(resolvePanelAccent('blueprint')).toBe('#1d4ed8');
    expect(resolvePanelAccent('minimal')).toBe('#374151');
  });

  it('follows an explicit accent', () => {
    expect(resolvePanelAccent(undefined, { accent: '#0d9488' })).toBe('#0d9488');
  });

  it('resolves the very token the overlays paint, whatever the layering says', () => {
    // Not an assertion about preset-vs-theme precedence: the point is that
    // panel and canvas read the same resolved `--ca-label-bg`, so the two
    // cannot drift apart. Precedence itself is `resolveThemeVars`' business.
    for (const theme of [{ accent: '#0d9488' }, { labelBg: '#b91c1c' }, {}]) {
      expect(resolvePanelAccent('contrast', theme)).toBe(
        resolveThemeVars('contrast', theme)['--ca-label-bg']
      );
    }
  });

  it('lets an explicit labelBg win over the accent shorthand', () => {
    expect(resolvePanelAccent(undefined, { accent: '#0d9488', labelBg: '#b91c1c' })).toBe(
      '#b91c1c'
    );
  });

  it('keeps a legible accent untouched', () => {
    expect(resolvePanelAccent('contrast', undefined, LIGHT)).toBe('#000000');
    expect(resolvePanelAccent('blueprint', undefined, LIGHT)).toBe('#1d4ed8');
  });

  it('swaps to another color of the same preset when the preferred one fails', () => {
    // The contrast preset is black-on-yellow: on a dark panel the black is
    // unreadable (1.3:1) and its own yellow is the right answer (10:1).
    expect(resolvePanelAccent('contrast', undefined, DARK)).toBe('#facc15');
  });

  it('prefers a colorful fallback over a near-neutral one', () => {
    // blueprint's own label text is white: legible on a dark panel, but
    // indistinguishable from the panel's ordinary text, so a lightened blue
    // wins instead.
    const accent = resolvePanelAccent('blueprint', undefined, DARK);
    const { r, g, b } = parseColor(accent)!;
    expect(b).toBeGreaterThan(r);
    expect(b - Math.min(r, g)).toBeGreaterThan(20);
    expect(ratioOn(accent, DARK)).toBeGreaterThanOrEqual(4.5);
  });

  it('never hands back the built-in indigo to a story that chose its own colors', () => {
    // A teal accent is under 4.5:1 on white. The fix for it is a darker teal —
    // not the addon's default, however well that default scores.
    const accent = resolvePanelAccent('contrast', { accent: '#0d9488' }, LIGHT);
    expect(accent).not.toBe(DEFAULT_ACCENT);
    expect(ratioOn(accent, LIGHT)).toBeGreaterThanOrEqual(4.5);
    const { g, b, r } = parseColor(accent)!;
    expect(Math.min(g, b)).toBeGreaterThan(r); // still teal
  });

  it('adjusts a caller-chosen accent rather than borrowing a preset color', () => {
    // Teal is 4.0:1 on this dark surface — under the bar. `contrast`'s yellow
    // would clear it easily, but the story asked for teal, so teal it stays.
    const accent = resolvePanelAccent('contrast', { accent: '#0d9488' }, DARK);
    expect(accent).not.toBe('#facc15');
    expect(ratioOn(accent, DARK)).toBeGreaterThanOrEqual(4.5);
    const { r, g, b } = parseColor(accent)!;
    expect(Math.min(g, b)).toBeGreaterThan(r); // still teal
  });

  it('lifts the accent toward the panel text when no preset color works', () => {
    const accent = resolvePanelAccent(undefined, undefined, DARK);
    expect(accent).not.toBe(DEFAULT_ACCENT);
    expect(ratioOn(accent, DARK)).toBeGreaterThanOrEqual(4.5);
    // Still recognizably the indigo: blue stays the dominant channel.
    const { r, b } = parseColor(accent)!;
    expect(b).toBeGreaterThan(r);
  });

  it('meets the requested ratio for every preset on both panel surfaces', () => {
    for (const surface of [LIGHT, DARK]) {
      for (const preset of ['default', 'minimal', 'contrast', 'blueprint'] as const) {
        expect(ratioOn(resolvePanelAccent(preset, undefined, surface), surface)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('honours a custom minimum ratio', () => {
    // 3:1 is enough for the indigo on white, so it is returned as-is.
    expect(resolvePanelAccent(undefined, undefined, { ...LIGHT, minRatio: 3 })).toBe(
      DEFAULT_ACCENT
    );
  });

  it('leaves a color it cannot measure alone', () => {
    const accent = 'var(--brand)';
    expect(resolvePanelAccent(undefined, { accent }, DARK)).toBe(accent);
  });

  it('skips the legibility check entirely without a background', () => {
    expect(resolvePanelAccent('contrast', undefined, { foreground: DARK.foreground })).toBe(
      '#000000'
    );
  });
});
