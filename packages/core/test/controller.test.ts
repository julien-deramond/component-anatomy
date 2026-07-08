import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createController } from '../src/controller.js';

const raf = () => new Promise((r) => requestAnimationFrame(() => r(null)));

function mountSlider() {
  document.body.innerHTML = `
    <div id="root">
      <div class="slider">
        <div data-part="track"><div data-part="fill"></div></div>
        <div data-part="thumb"></div>
        <span data-part="mark"></span>
        <span data-part="mark"></span>
      </div>
    </div>
    <div id="panel">
      <div data-anatomy-item="track" tabindex="0"></div>
      <div data-anatomy-item="thumb" tabindex="0"></div>
      <div data-anatomy-item="mark" tabindex="0"></div>
    </div>
  `;
  return {
    root: document.getElementById('root')!,
    panel: document.getElementById('panel')!,
  };
}

const overlays = () => document.querySelectorAll<HTMLElement>('.ca-overlay');
const labels = () => document.querySelectorAll<HTMLElement>('.ca-overlay-label');

describe('createController', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ca-overlay-styles')?.remove();
  });

  it('auto-discovers parts and humanizes names', () => {
    document.body.innerHTML = `
      <div id="root"><div data-part="leading-icon"></div></div>`;
    const c = createController({ root: document.getElementById('root')! });
    expect(c.getParts()).toEqual([{ id: 'leading-icon', name: 'Leading Icon' }]);
    c.destroy();
  });

  it('prefers explicit part definitions', () => {
    const { root } = mountSlider();
    const parts = [{ id: 'track', name: 'The Track', description: 'rail' }];
    const c = createController({ root, parts });
    expect(c.getParts()).toEqual(parts);
    c.destroy();
  });

  it('creates one overlay + label per matching element on highlight', async () => {
    const { root, panel } = mountSlider();
    const c = createController({ root, panel });

    c.highlight('mark');
    await raf();

    expect(overlays()).toHaveLength(2);
    expect(labels()).toHaveLength(2);
    expect(labels()[0].textContent).toBe('Mark');
    c.destroy();
  });

  it('uses the part display name in the overlay label', async () => {
    const { root, panel } = mountSlider();
    const c = createController({
      root,
      panel,
      parts: [{ id: 'track', name: 'Rail' }],
    });

    c.highlight('track');
    await raf();
    expect(labels()[0].textContent).toBe('Rail');
    c.destroy();
  });

  it('marks matching panel entries active and clears them on unhighlight', async () => {
    const { root, panel } = mountSlider();
    const c = createController({ root, panel });

    c.highlight('thumb');
    await raf();
    expect(panel.querySelector('[data-anatomy-item="thumb"]')!.hasAttribute('data-active')).toBe(true);
    expect(panel.querySelector('[data-anatomy-item="track"]')!.hasAttribute('data-active')).toBe(false);

    c.unhighlight();
    expect(panel.querySelector('[data-anatomy-item="thumb"]')!.hasAttribute('data-active')).toBe(false);
    expect(overlays()).toHaveLength(0);
    c.destroy();
  });

  it('synchronizes hover from the preview to the panel', async () => {
    const { root, panel } = mountSlider();
    const c = createController({ root, panel });

    const thumb = root.querySelector<HTMLElement>('[data-part="thumb"]')!;
    thumb.dispatchEvent(new Event('mouseenter'));
    await raf();

    expect(panel.querySelector('[data-anatomy-item="thumb"]')!.hasAttribute('data-active')).toBe(true);
    expect(overlays().length).toBeGreaterThan(0);

    thumb.dispatchEvent(new Event('mouseleave'));
    expect(overlays()).toHaveLength(0);
    c.destroy();
  });

  it('synchronizes hover and focus from the panel to the preview', async () => {
    const { root, panel } = mountSlider();
    const c = createController({ root, panel });

    const entry = panel.querySelector<HTMLElement>('[data-anatomy-item="track"]')!;
    entry.dispatchEvent(new Event('focus'));
    await raf();
    expect(overlays()).toHaveLength(1);

    entry.dispatchEvent(new Event('blur'));
    expect(overlays()).toHaveLength(0);
    c.destroy();
  });

  it('emits part:enter and part:leave events', () => {
    const { root, panel } = mountSlider();
    const c = createController({ root, panel });

    const enter = vi.fn();
    const leave = vi.fn();
    c.on('part:enter', enter);
    c.on('part:leave', leave);

    c.highlight('track');
    expect(enter).toHaveBeenCalledWith('track');

    c.unhighlight();
    expect(leave).toHaveBeenCalled();
    c.destroy();
  });

  it('supports unsubscribing from events', () => {
    const { root } = mountSlider();
    const c = createController({ root });

    const enter = vi.fn();
    const off = c.on('part:enter', enter);
    off();
    c.highlight('track');
    expect(enter).not.toHaveBeenCalled();
    c.destroy();
  });

  it('applies per-instance theme variables to overlays', async () => {
    const { root } = mountSlider();
    const c = createController({
      root,
      theme: { accent: '#ff0000', overlayRadius: 9 },
    });

    c.highlight('track');
    await raf();
    const box = overlays()[0];
    expect(box.style.getPropertyValue('--ca-overlay-border')).toBe('#ff0000');
    expect(box.style.getPropertyValue('--ca-overlay-radius')).toBe('9px');
    c.destroy();
  });

  it('applies preset variables and lets setTheme swap them at runtime', async () => {
    const { root } = mountSlider();
    const c = createController({ root, preset: 'contrast' });

    c.highlight('track');
    await raf();
    expect(overlays()[0].style.getPropertyValue('--ca-overlay-border')).toBe('#000000');

    c.setTheme({}, 'blueprint');
    expect(overlays()[0].style.getPropertyValue('--ca-overlay-border')).toBe('#2563eb');
    c.destroy();
  });

  it('adds no inline vars for the default look (global --ca-* stays effective)', async () => {
    const { root } = mountSlider();
    const c = createController({ root });

    c.highlight('track');
    await raf();
    expect(overlays()[0].getAttribute('style')).not.toContain('--ca-');
    c.destroy();
  });

  it('honors overlay options: label off, className, renderLabel, decorateOverlay', async () => {
    const { root } = mountSlider();

    // label: false
    let c = createController({ root, overlay: { label: false } });
    c.highlight('track');
    await raf();
    expect(labels()).toHaveLength(0);
    c.destroy();

    // className + renderLabel + decorateOverlay
    c = createController({
      root,
      overlay: {
        className: 'my-overlay',
        renderLabel: ({ part, index }) => `${part.name} #${index + 1}`,
        decorateOverlay: (box) => box.setAttribute('data-decorated', ''),
      },
    });
    c.highlight('mark');
    await raf();
    expect(overlays()[0].classList.contains('my-overlay')).toBe(true);
    expect(overlays()[0].hasAttribute('data-decorated')).toBe(true);
    expect(labels()[1].textContent).toBe('Mark #2');
    c.destroy();
  });

  it('re-discovers parts after dynamic DOM updates', async () => {
    const { root } = mountSlider();
    const c = createController({ root });

    const el = document.createElement('div');
    el.dataset.part = 'tooltip';
    root.querySelector('.slider')!.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));
    expect(c.getParts().map((p) => p.id)).toContain('tooltip');

    c.highlight('tooltip');
    await raf();
    expect(overlays()).toHaveLength(1);
    c.destroy();
  });

  it('supports multiple independent controllers on one page', async () => {
    document.body.innerHTML = `
      <div id="a"><div data-part="x"></div></div>
      <div id="b"><div data-part="x"></div><div data-part="x"></div></div>
    `;
    const ca = createController({ root: document.getElementById('a')! });
    const cb = createController({ root: document.getElementById('b')! });

    ca.highlight('x');
    await raf();
    expect(overlays()).toHaveLength(1);
    ca.unhighlight();

    cb.highlight('x');
    await raf();
    expect(overlays()).toHaveLength(2);

    ca.destroy();
    cb.destroy();
  });

  it('cleans up everything on destroy', async () => {
    const { root, panel } = mountSlider();
    const c = createController({ root, panel });

    c.highlight('track');
    await raf();
    c.destroy();

    expect(overlays()).toHaveLength(0);

    // Listeners are gone: hovering no longer creates overlays
    root.querySelector<HTMLElement>('[data-part="thumb"]')!
      .dispatchEvent(new Event('mouseenter'));
    await raf();
    expect(overlays()).toHaveLength(0);
  });
});
