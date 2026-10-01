import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnatomyRegistry } from '../src/registry.js';
import { createController } from '../src/controller.js';

const raf = () => new Promise((r) => requestAnimationFrame(() => r(null)));
const tick = () => new Promise((r) => setTimeout(r, 0));

const overlays = () => document.querySelectorAll<HTMLElement>('.ca-overlay');

/** Attaches an open (or closed) shadow root to `host` holding `html`. */
function shadow(host: Element, html: string, mode: ShadowRootMode = 'open'): ShadowRoot {
  const root = host.attachShadow({ mode });
  root.innerHTML = html;
  return root;
}

function mount(html: string): HTMLElement {
  document.body.innerHTML = `<div id="root">${html}</div>`;
  return document.getElementById('root')!;
}

let tagCount = 0;
/**
 * Defines a Lit/Stencil-like element: it attaches its shadow root when
 * constructed and renders into it asynchronously, after it is connected.
 */
function defineAsyncElement(html: string): string {
  const tag = `x-async-${++tagCount}`;
  customElements.define(tag, class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
      queueMicrotask(() => {
        this.shadowRoot!.innerHTML = html;
      });
    }
  });
  return tag;
}

describe('AnatomyRegistry — shadow DOM', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('discovers data-part elements inside open shadow roots', () => {
    const root = mount(`<x-field data-part="root"><span data-part="icon" slot="icon"></span></x-field>`);
    shadow(root.querySelector('x-field')!, `
      <label data-part="label"></label>
      <input data-part="input">
      <slot name="icon"></slot>
    `);

    const registry = new AnatomyRegistry(root);
    // The host, its shadow tree, then its light (slotted) children
    expect(registry.partIds()).toEqual(['root', 'label', 'input', 'icon']);
    expect(registry.query().get('input')![0].localName).toBe('input');
  });

  it('walks nested shadow roots', () => {
    const root = mount(`<x-outer></x-outer>`);
    const outer = shadow(root.firstElementChild!, `<div data-part="frame"><x-inner></x-inner></div>`);
    shadow(outer.querySelector('x-inner')!, `<b data-part="core"></b>`);

    expect(new AnatomyRegistry(root).partIds()).toEqual(['frame', 'core']);
  });

  it('searches the shadow root of the root element itself', () => {
    const root = mount('');
    shadow(root, `<i data-part="inside"></i>`);
    root.innerHTML = `<i data-part="slotted"></i>`;

    expect(new AnatomyRegistry(root).partIds()).toEqual(['inside', 'slotted']);
  });

  it('cannot reach into closed shadow roots', () => {
    const root = mount(`<x-closed data-part="host"></x-closed>`);
    shadow(root.firstElementChild!, `<i data-part="hidden"></i>`, 'closed');

    expect(new AnatomyRegistry(root).partIds()).toEqual(['host']);
  });

  it('lists the open shadow roots it walks', () => {
    const root = mount(`<x-a></x-a><x-b></x-b>`);
    const a = shadow(root.children[0], '');
    shadow(root.children[1], '', 'closed');

    expect(new AnatomyRegistry(root).shadowRoots()).toEqual([a]);
  });

  describe('shadowParts', () => {
    function mountWithParts() {
      const root = mount(`<x-slider part="ignored-in-light-dom"></x-slider>`);
      shadow(root.firstElementChild!, `
        <div part="track"><div part="range"></div></div>
        <div part="thumb thumb-active" data-part="thumb"></div>
      `);
      return root;
    }

    it('ignores the part attribute by default', () => {
      expect(new AnatomyRegistry(mountWithParts()).partIds()).toEqual(['thumb']);
    });

    it('reads every part name inside shadow trees, never twice for one element', () => {
      const registry = new AnatomyRegistry(mountWithParts(), { shadowParts: true });

      expect(registry.partIds()).toEqual(['track', 'range', 'thumb', 'thumb-active']);
      const map = registry.query();
      expect(map.get('thumb')).toHaveLength(1);
      expect(map.get('thumb-active')![0]).toBe(map.get('thumb')![0]);
    });

    it('reads it in the light DOM of a root that itself lives in a shadow tree', () => {
      const host = mount(`<x-app></x-app>`).firstElementChild!;
      const app = shadow(host, `<section id="preview"><b part="label"></b></section>`);
      const root = app.getElementById('preview') as HTMLElement;

      expect(new AnatomyRegistry(root, { shadowParts: true }).partIds()).toEqual(['label']);
    });
  });

  describe('observe', () => {
    it('notices parts rendered into an existing shadow root', async () => {
      const root = mount(`<x-late></x-late>`);
      const late = shadow(root.firstElementChild!, '');
      const registry = new AnatomyRegistry(root);
      const callback = vi.fn();
      registry.observe(callback);

      late.innerHTML = `<i data-part="late"></i>`;
      await tick();

      expect(callback).toHaveBeenCalled();
      expect(registry.partIds()).toEqual(['late']);
      registry.destroy();
    });

    it('notices a web component added later, even before it renders its parts', async () => {
      const tag = defineAsyncElement(`<i data-part="inner"></i>`);
      const root = mount('');
      const registry = new AnatomyRegistry(root);
      const callback = vi.fn();
      registry.observe(callback);

      root.appendChild(document.createElement(tag));
      await tick();

      expect(callback).toHaveBeenCalled();
      expect(registry.partIds()).toEqual(['inner']);
      registry.destroy();
    });

    it('notices parts removed from a shadow root', async () => {
      const root = mount(`<x-gone></x-gone>`);
      const gone = shadow(root.firstElementChild!, `<i data-part="gone"></i>`);
      const registry = new AnatomyRegistry(root);
      const callback = vi.fn();
      registry.observe(callback);

      gone.innerHTML = '';
      await tick();

      expect(callback).toHaveBeenCalled();
      expect(registry.partIds()).toEqual([]);
      registry.destroy();
    });

    it('rescans when a custom element already in the DOM gets defined', async () => {
      const tag = `x-lazy-${++tagCount}`;
      const root = mount(`<${tag}></${tag}>`);
      const registry = new AnatomyRegistry(root);
      const callback = vi.fn();
      registry.observe(callback);
      expect(registry.partIds()).toEqual([]);

      // An upgrade attaches the shadow root without any observable mutation
      customElements.define(tag, class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' }).innerHTML = `<i data-part="upgraded"></i>`;
        }
      });
      await tick();

      expect(callback).toHaveBeenCalled();
      expect(registry.partIds()).toEqual(['upgraded']);
      registry.destroy();
    });

    it('stays quiet once destroyed', async () => {
      const tag = `x-lazy-${++tagCount}`;
      const root = mount(`<${tag}></${tag}>`);
      const late = shadow(document.body.appendChild(document.createElement('div')), '');
      const registry = new AnatomyRegistry(root);
      const callback = vi.fn();
      registry.observe(callback);
      registry.destroy();

      customElements.define(tag, class extends HTMLElement {});
      late.innerHTML = `<i data-part="x"></i>`;
      root.innerHTML = `<i data-part="y"></i>`;
      await tick();

      expect(callback).not.toHaveBeenCalled();
    });
  });
});

describe('createController — shadow DOM', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ca-overlay-styles')?.remove();
  });

  it('syncs hover between a shadow part and the panel', async () => {
    const root = mount(`<x-btn></x-btn>`);
    const btn = shadow(root.firstElementChild!, `<span data-part="label">Go</span>`);
    document.body.insertAdjacentHTML('beforeend', `
      <div id="panel"><div data-anatomy-item="label" tabindex="0"></div></div>`);
    const panel = document.getElementById('panel')!;
    const c = createController({ root, panel });

    btn.querySelector('span')!.dispatchEvent(new Event('mouseenter'));
    await raf();
    expect(overlays()).toHaveLength(1);
    expect(panel.firstElementChild!.hasAttribute('data-active')).toBe(true);

    btn.querySelector('span')!.dispatchEvent(new Event('mouseleave'));
    panel.firstElementChild!.dispatchEvent(new Event('focus'));
    await raf();
    expect(overlays()).toHaveLength(1);
    c.destroy();
  });

  it('auto-discovers parts a web component renders after the controller is created', async () => {
    const tag = defineAsyncElement(`<div data-part="track"></div><div data-part="thumb"></div>`);
    const root = mount(`<${tag}></${tag}>`);
    const c = createController({ root });
    const onChange = vi.fn();
    c.on('parts:change', onChange);
    expect(c.getParts()).toEqual([]);

    await tick();
    expect(c.getParts().map((p) => p.id)).toEqual(['track', 'thumb']);
    expect(onChange).toHaveBeenCalledTimes(1);

    c.highlight('thumb');
    await raf();
    expect(overlays()).toHaveLength(1);
    c.destroy();
  });

  it('only emits parts:change when the discovered list changes', async () => {
    const root = mount(`<x-same></x-same>`);
    const same = shadow(root.firstElementChild!, `<i data-part="a"></i>`);

    const auto = createController({ root });
    const explicit = createController({ root, parts: [{ id: 'a', name: 'A' }] });
    const onAuto = vi.fn();
    const onExplicit = vi.fn();
    auto.on('parts:change', onAuto);
    explicit.on('parts:change', onExplicit);

    same.innerHTML = `<i data-part="a"></i>`; // re-rendered, same parts
    await tick();
    expect(onAuto).not.toHaveBeenCalled();

    same.innerHTML = `<i data-part="a"></i><i data-part="b"></i>`;
    await tick();
    expect(onAuto).toHaveBeenCalledTimes(1);
    expect(onExplicit).not.toHaveBeenCalled();

    auto.destroy();
    explicit.destroy();
  });

  it('honors shadowParts', () => {
    const root = mount(`<x-native></x-native>`);
    shadow(root.firstElementChild!, `<i part="icon"></i>`);

    const c = createController({ root, shadowParts: true });
    expect(c.getParts()).toEqual([{ id: 'icon', name: 'Icon' }]);
    c.destroy();
  });

  it('repositions overlays when a scroller inside a shadow root scrolls', async () => {
    const root = mount(`<x-list></x-list>`);
    const list = shadow(root.firstElementChild!, `<div class="scroller"><i data-part="item"></i></div>`);
    const item = list.querySelector('i')!;
    let top = 50;
    item.getBoundingClientRect = () => ({ top, left: 0, width: 10, height: 10 }) as DOMRect;

    const c = createController({ root });
    c.highlight('item');
    await raf();
    expect(overlays()[0].style.top).toBe('50px');

    top = 20;
    // Like a real scroll event: neither bubbling nor composed
    list.querySelector('.scroller')!.dispatchEvent(new Event('scroll'));
    await raf();
    expect(overlays()[0].style.top).toBe('20px');
    c.destroy();
  });
});
