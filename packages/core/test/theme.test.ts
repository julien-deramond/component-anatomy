import { describe, it, expect } from 'vitest';
import { resolveThemeVars, presets } from '../src/theme.js';

describe('resolveThemeVars', () => {
  it('returns an empty map for the default preset with no overrides', () => {
    expect(resolveThemeVars()).toEqual({});
    expect(resolveThemeVars('default')).toEqual({});
  });

  it('maps preset tokens to CSS variables', () => {
    const vars = resolveThemeVars('contrast');
    expect(vars['--ca-overlay-border']).toBe('#000000');
    expect(vars['--ca-overlay-border-width']).toBe('3px');
    expect(vars['--ca-label-fg']).toBe('#facc15');
  });

  it('derives overlay + label colors from the accent shorthand', () => {
    const vars = resolveThemeVars(undefined, { accent: '#ff0000' });
    expect(vars['--ca-overlay-border']).toBe('#ff0000');
    expect(vars['--ca-label-bg']).toBe('#ff0000');
    expect(vars['--ca-overlay-bg']).toContain('color-mix');
    expect(vars['--ca-overlay-bg']).toContain('#ff0000');
  });

  it('lets explicit tokens win over the accent shorthand', () => {
    const vars = resolveThemeVars(undefined, {
      accent: '#ff0000',
      overlayBorder: '#00ff00',
    });
    expect(vars['--ca-overlay-border']).toBe('#00ff00');
    expect(vars['--ca-label-bg']).toBe('#ff0000');
  });

  it('lets theme tokens win over preset tokens', () => {
    const vars = resolveThemeVars('contrast', { overlayBorderWidth: '1px' });
    expect(vars['--ca-overlay-border-width']).toBe('1px');
    expect(vars['--ca-overlay-border']).toBe('#000000'); // still from preset
  });

  it('lets a theme accent win over a preset that sets the same tokens', () => {
    // The accent is a *theme* token, so it sits in layer 4 and outranks the
    // preset in layer 3 — including the tokens the preset spells out and the
    // accent only derives. `contrast` sets labelBg/overlayBorder to black.
    const vars = resolveThemeVars('contrast', { accent: '#0d9488' });
    expect(vars['--ca-label-bg']).toBe('#0d9488');
    expect(vars['--ca-overlay-border']).toBe('#0d9488');
    expect(vars['--ca-overlay-bg']).toContain('#0d9488');
  });

  it('keeps the preset tokens the accent says nothing about', () => {
    const vars = resolveThemeVars('contrast', { accent: '#0d9488' });
    expect(vars['--ca-overlay-border-width']).toBe('3px'); // still from preset
    expect(vars['--ca-label-fg']).toBe('#facc15');
  });

  it('lets an explicit theme token win over a theme accent, preset or not', () => {
    for (const preset of [undefined, 'contrast'] as const) {
      const vars = resolveThemeVars(preset, { accent: '#0d9488', overlayBorder: '#00ff00' });
      expect(vars['--ca-overlay-border']).toBe('#00ff00');
      expect(vars['--ca-label-bg']).toBe('#0d9488');
    }
  });

  it('applies a preset accent below the theme layer', () => {
    // No built-in preset sets `accent`, but presets are plain AnatomyTheme
    // objects and users spread them — the layering has to hold either way.
    const spread = { ...presets.blueprint, accent: '#ff0000' };
    expect(resolveThemeVars(undefined, spread)['--ca-label-bg']).toBe('#1d4ed8');
    expect(resolveThemeVars(undefined, { accent: '#ff0000' })['--ca-label-bg']).toBe('#ff0000');
  });

  it('converts numeric tokens to the right units', () => {
    const vars = resolveThemeVars(undefined, {
      overlayRadius: 8,
      zIndex: 42,
      transitionMs: 300,
      labelFontSize: 12,
    });
    expect(vars['--ca-overlay-radius']).toBe('8px');
    expect(vars['--ca-overlay-z']).toBe('42');
    expect(vars['--ca-transition']).toBe('300ms');
    expect(vars['--ca-label-font-size']).toBe('12px');
  });

  it('supports border style (blueprint preset)', () => {
    const vars = resolveThemeVars('blueprint');
    expect(vars['--ca-overlay-border-style']).toBe('dashed');
  });

  it('exports all four presets', () => {
    expect(Object.keys(presets).sort()).toEqual(['blueprint', 'contrast', 'default', 'minimal']);
  });
});
