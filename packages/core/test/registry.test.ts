import { describe, it, expect, beforeEach } from 'vitest';
import { AnatomyRegistry } from '../src/registry.js';

function mount(html: string): HTMLElement {
  document.body.innerHTML = `<div id="root">${html}</div>`;
  return document.getElementById('root')!;
}

describe('AnatomyRegistry', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('discovers data-part elements grouped by id', () => {
    const root = mount(`
      <div data-part="track"></div>
      <div data-part="thumb"></div>
      <span data-part="mark"></span>
      <span data-part="mark"></span>
    `);
    const registry = new AnatomyRegistry(root);
    const map = registry.query();

    expect(map.get('track')).toHaveLength(1);
    expect(map.get('mark')).toHaveLength(2);
    expect(registry.partIds()).toEqual(['track', 'thumb', 'mark']);
  });

  it('supports nested anatomy parts', () => {
    const root = mount(`
      <div data-part="track">
        <div data-part="fill"></div>
      </div>
    `);
    const registry = new AnatomyRegistry(root);
    expect(registry.partIds()).toEqual(['track', 'fill']);
  });

  it('always reads the live DOM (no stale cache)', () => {
    const root = mount(`<div data-part="a"></div>`);
    const registry = new AnatomyRegistry(root);
    expect(registry.partIds()).toEqual(['a']);

    const el = document.createElement('div');
    el.dataset.part = 'b';
    root.appendChild(el);
    expect(registry.partIds()).toEqual(['a', 'b']);
  });

  it('notifies on relevant DOM mutations', async () => {
    const root = mount('');
    const registry = new AnatomyRegistry(root);

    let called = 0;
    registry.observe(() => called++);

    const el = document.createElement('div');
    el.dataset.part = 'new';
    root.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));
    expect(called).toBe(1);
    registry.destroy();
  });

  it('ignores mutations without data-part elements', async () => {
    const root = mount('');
    const registry = new AnatomyRegistry(root);

    let called = 0;
    registry.observe(() => called++);

    root.appendChild(document.createElement('div'));

    await new Promise((r) => setTimeout(r, 0));
    expect(called).toBe(0);
    registry.destroy();
  });
});
