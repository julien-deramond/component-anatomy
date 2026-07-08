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
