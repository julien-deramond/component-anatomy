/**
 * Color math — just enough of it to keep a themed accent legible.
 *
 * Overlays sit on top of the user's own component, where any accent reads as
 * intended. A documentation panel does not: it paints the accent as *text* on
 * its own surface, and that surface is not always the one a preset was
 * designed against (the Storybook manager panel is dark by default). These
 * helpers let an integration check an accent against the surface it is about
 * to paint it on, and lift it when it falls short.
 *
 * Only the color notations the presets and `AnatomyTheme` realistically carry
 * are parsed: hex (3/4/6/8) and `rgb()` / `rgba()`. Anything else — named
 * colors, `color-mix()`, `currentColor`, custom properties — returns `null`,
 * which every caller treats as "unmeasurable, leave it alone" rather than
 * guessing.
 */

/** A parsed sRGB color. `a` is 0–1. */
export type Rgb = { r: number; g: number; b: number; a: number };

const clamp255 = (n: number): number => Math.max(0, Math.min(255, Math.round(n)));

/** Parse a hex or `rgb()`/`rgba()` color. Returns null for anything else. */
export function parseColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase();

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    const expand = (h: string) =>
      h.length <= 4 ? h.split('').map((c) => c + c).join('') : h;
    const full = expand(hex);
    if (full.length !== 6 && full.length !== 8) return null;
    if (!/^[0-9a-f]+$/.test(full)) return null;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
      a: full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgb = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    // Both the legacy comma syntax and the space syntax (`rgb(0 0 0 / 50%)`).
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const channel = (raw: string) =>
      raw.endsWith('%') ? (parseFloat(raw) / 100) * 255 : parseFloat(raw);
    const alpha = (raw: string | undefined) =>
      raw === undefined ? 1 : raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw);
    const [r, g, b] = parts.slice(0, 3).map(channel);
    const a = alpha(parts[3]);
    if ([r, g, b, a].some((n) => Number.isNaN(n))) return null;
    return { r: clamp255(r), g: clamp255(g), b: clamp255(b), a: Math.max(0, Math.min(1, a)) };
  }

  return null;
}

/** Serialize back to a 6-digit hex string (alpha is dropped — callers composite first). */
export function toHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((c) => clamp255(c).toString(16).padStart(2, '0')).join('')}`;
}

/** Flatten a translucent color onto an opaque backdrop. */
export function composite(color: Rgb, backdrop: Rgb): Rgb {
  if (color.a >= 1) return color;
  const blend = (c: number, b: number) => c * color.a + b * (1 - color.a);
  return {
    r: blend(color.r, backdrop.r),
    g: blend(color.g, backdrop.g),
    b: blend(color.b, backdrop.b),
    a: 1,
  };
}

/** WCAG relative luminance of an opaque color. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG 2.1 contrast ratio between two colors, 1–21.
 *
 * A translucent foreground is composited onto the background first. Returns
 * `null` when either color cannot be parsed.
 */
export function contrastRatio(foreground: string, background: string): number | null {
  const bg = parseColor(background);
  const fg = parseColor(foreground);
  if (!bg || !fg) return null;

  const lightest = Math.max(relativeLuminance(composite(fg, bg)), relativeLuminance(bg));
  const darkest = Math.min(relativeLuminance(composite(fg, bg)), relativeLuminance(bg));
  return (lightest + 0.05) / (darkest + 0.05);
}

/**
 * Blend `from` toward `to`. `amount` is how much of `from` survives:
 * `1` returns `from`, `0` returns `to`. Returns `null` if either is unparseable.
 */
export function mix(from: string, to: string, amount: number): string | null {
  const a = parseColor(from);
  const b = parseColor(to);
  if (!a || !b) return null;
  const at = Math.max(0, Math.min(1, amount));
  return toHex({
    r: a.r * at + b.r * (1 - at),
    g: a.g * at + b.g * (1 - at),
    b: a.b * at + b.b * (1 - at),
    a: 1,
  });
}
