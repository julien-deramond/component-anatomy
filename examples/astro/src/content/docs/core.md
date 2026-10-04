---
title: "Core library"
description: "@component-anatomy/core — the framework-agnostic runtime. Works anywhere a browser DOM exists."
---

## What it solves

Design systems document component anatomy with static images exported from design tools. Those go stale and offer no interactivity. Component Anatomy turns `data-part` attributes on live DOM elements into an interactive, synchronized documentation panel — hover a part name to highlight the element, hover the element to highlight the part name.

## Installation

```sh
npm install @component-anatomy/core
```

Or with no build step, straight from a CDN:

```html
<script src="https://unpkg.com/@component-anatomy/core/dist/index.iife.js"></script>
<script>
  const controller = ComponentAnatomy.createAnatomy({ /* ... */ });
</script>
```

## Quick start — basic HTML

1. Annotate the elements you want to document with `data-part`:

```html
<div id="preview">
  <div class="slider">
    <div class="track" data-part="track"></div>
    <div class="thumb" data-part="thumb"></div>
  </div>
</div>

<div id="panel">
  <div data-anatomy-item="track" tabindex="0">Track — the rail the thumb moves on</div>
  <div data-anatomy-item="thumb" tabindex="0">Thumb — the draggable control</div>
</div>
```

2. Create the controller:

```js
import { createAnatomy } from '@component-anatomy/core';

const controller = createAnatomy({
  root: document.querySelector('#preview'),
  panel: document.querySelector('#panel'),
  parts: [
    { id: 'track', name: 'Track', description: 'The rail the thumb moves on.' },
    { id: 'thumb', name: 'Thumb', description: 'The draggable control.' },
  ],
});
```

That's it. Hovering either side highlights the other. Panel entries with `tabindex="0"` also respond to keyboard focus. If you omit `parts`, they are auto-discovered from the DOM and names are derived from the ids (`leading-icon` → "Leading Icon").

<figure class="dg" id="dg-sync">
  <div class="dg__scroll">
    <svg viewBox="0 0 320 424" role="img" aria-labelledby="dg-sync-t dg-sync-d">
      <title id="dg-sync-t">How the preview and the anatomy panel stay in sync</title>
      <desc id="dg-sync-d">The controller returned by createAnatomy sits between the live component and the docs panel. Hovering an element marked data-part tells the controller, which marks the panel entry with the same id. Hovering or focusing a panel entry tells the controller, which draws an overlay box on the matching elements of the live component.</desc>
      <defs>
        <marker id="dg-sync-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
          <path d="M0,0 L8,4 L0,8 Z" class="dg-head" />
        </marker>
      </defs>
      <text class="dg-title" x="16" y="24"><tspan class="dg-num">01</tspan> Preview</text>
      <text class="dg-title" x="16" y="148"><tspan class="dg-num">02</tspan> Runtime</text>
      <text class="dg-title" x="16" y="272"><tspan class="dg-num">03</tspan> Panel</text>
      <g class="dg-node"><rect x="16" y="36" width="288" height="56" /><text class="dg-text" x="160" y="55">Live component</text><text class="dg-code" x="160" y="76">data-part</text></g>
      <g class="dg-node"><rect x="16" y="160" width="288" height="56" /><text class="dg-text" x="160" y="179">Controller</text><text class="dg-code" x="160" y="200">createAnatomy()</text></g>
      <g class="dg-node"><rect x="16" y="284" width="288" height="56" /><text class="dg-text" x="160" y="303">Docs panel</text><text class="dg-code" x="160" y="324">data-anatomy-item</text></g>
      <path class="dg-edge" d="M120,92 V158" pathLength="1" marker-end="url(#dg-sync-arrow)" style="--i:0" />
      <path class="dg-edge" d="M224,160 V94" pathLength="1" marker-end="url(#dg-sync-arrow)" style="--i:0" />
      <path class="dg-edge" d="M120,284 V218" pathLength="1" marker-end="url(#dg-sync-arrow)" style="--i:1" />
      <path class="dg-edge" d="M224,216 V282" pathLength="1" marker-end="url(#dg-sync-arrow)" style="--i:1" />
      <text class="dg-label" x="130" y="130">hover</text>
      <text class="dg-label" x="234" y="130">box</text>
      <text class="dg-label" x="130" y="254">hover</text>
      <text class="dg-label" x="234" y="254">mark</text>
      <text class="dg-note" x="16" y="372">One id ties both sides:</text>
      <text class="dg-note" x="16" y="390">data-part="thumb" on the element,</text>
      <text class="dg-note" x="16" y="408">data-anatomy-item="thumb" on its entry.</text>
    </svg>
  </div>
  <figcaption>Figure 1 · either side tells the controller; it answers on the other side. Box: the overlay on the element. Mark: the highlighted panel entry.</figcaption>
</figure>
<style>
  #dg-sync { margin: var(--space-6) 0; border: var(--stroke-hairline) solid var(--color-line); background: var(--color-bg); }
  #dg-sync .dg__scroll { overflow: hidden; }
  #dg-sync svg { display: block; width: 100%; max-width: 400px; height: auto; margin: 0 auto; }
  #dg-sync figcaption { padding: var(--space-2) var(--space-3); border-top: var(--stroke-hairline) solid var(--color-line); font: var(--font-size-xs) / var(--font-line-height-body) var(--font-family-mono); color: var(--color-muted); }
  #dg-sync .dg-node rect { fill: var(--color-panel); stroke: var(--color-line); stroke-width: 1; }
  #dg-sync .dg-code, #dg-sync .dg-text { fill: var(--color-fg); text-anchor: middle; dominant-baseline: middle; }
  #dg-sync .dg-code { font: var(--font-weight-regular) 13px var(--font-family-mono); }
  #dg-sync .dg-text { font: var(--font-weight-regular) 14px var(--font-family-body); }
  #dg-sync .dg-title { font: var(--font-weight-semibold) 11px var(--font-family-display); letter-spacing: var(--font-letter-spacing-eyebrow); text-transform: uppercase; fill: var(--color-muted); }
  #dg-sync .dg-num { font-family: var(--font-family-mono); fill: var(--color-primary); }
  #dg-sync .dg-label { font: 11px var(--font-family-mono); fill: var(--color-muted); text-anchor: start; }
  #dg-sync .dg-note { font: 12px var(--font-family-body); fill: var(--color-muted); }
  #dg-sync .dg-edge { fill: none; stroke: var(--color-primary); stroke-width: 1.5; }
  #dg-sync .dg-head { fill: var(--color-primary); }
</style>

## Core concepts

| Concept | Role |
|---|---|
| `data-part="id"` | Marks an element in the live component as a documented anatomy part. Multiple elements may share one id. |
| `data-anatomy-item="id"` | Marks a panel entry as the documentation for that part. |
| `createAnatomy(options)` | Wires a root + panel pair and returns a controller. |
| Controller | Programmatic API: `highlight(id)`, `unhighlight()`, `refresh()`, `destroy()`, `on(event, fn)`, `getParts()`, `setTheme(theme, preset?)`. |
| Overlay | Highlight boxes + name chips rendered into `document.body`, positioned with `getBoundingClientRect`, repositioned on scroll/resize. |

## Options

```js
createAnatomy({
  root,                       // HTMLElement — required
  panel,                      // HTMLElement — optional
  parts,                      // AnatomyPartDefinition[] — optional (auto-discovered)
  shadowParts: false,         // also read native `part` attributes in shadow roots
  preset: 'minimal',          // 'default' | 'minimal' | 'contrast' | 'blueprint'
  theme: { accent: '#0d9488' },
  overlay: {
    label: true,              // show the floating name chip
    padding: 4,               // inflate boxes by N px
    className: 'my-overlay',  // extra class on every box
    renderLabel: (ctx) => `${ctx.part.name} #${ctx.index + 1}`,
    decorateOverlay: (box, ctx) => { /* mutate the box element */ },
  },
});
```

See [Rendering customization](../customization/) for the full theming guide.

## Events

```js
const off = controller.on('part:enter', (partId) => console.log('active:', partId));
controller.on('part:leave', () => console.log('inactive'));
controller.on('parts:change', () => console.log('found:', controller.getParts()));
off(); // unsubscribe
```

`parts:change` fires when auto-discovery finds a different set of parts after the DOM changed — a web component rendering late, for example. It never fires when you pass `parts`.

## Web Components

Parts are found inside open shadow roots too. Put `data-part` wherever the element lives: on the host, on a slotted child, or inside the shadow tree.

```js
class MySlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <div data-part="track"><div data-part="range"></div></div>
      <div data-part="thumb"></div>`;
  }
}
customElements.define('my-slider', MySlider);

createAnatomy({ root: document.querySelector('#preview') }); // track, range, thumb
```

Shadow roots rendered after `createAnatomy()` are picked up: Lit and Stencil render asynchronously, and autoloaders define elements only once they are on the page. With auto-discovery, listen to `parts:change` to know when they appeared.

Many web components already name their anatomy with the native `part` attribute, the one `::part()` styles. Read it instead of adding `data-part`:

```js
createAnatomy({ root, shadowParts: true });
// <div part="thumb focused"> is both the `thumb` and the `focused` part
```

An element with several names highlights one of them when hovered: the first one documented — listed in `parts`, or else among the panel's `data-anatomy-item` entries — otherwise its first name. List `selected` before `tab` and hovering the selected tab highlights `selected`. From the panel, every element carrying a name is highlighted, as usual.

`part` is only read inside shadow trees, where it has a meaning. Elements in a **closed** shadow root (`mode: 'closed'`) cannot be reached from outside the component: annotate the host or its slotted children instead.

## Behavior notes

- Dynamic DOM: a `MutationObserver` — on the root and on every open shadow root inside it — re-binds listeners when `data-part` elements or web components are added/removed, or a part name changes in place. Call `refresh()` after replacing the panel markup.
- Multiple instances per page are fully independent — part ids only need to be unique within one root.
- Nested parts work: hovering a child highlights the child, not the parent.
- Overlays are `aria-hidden` and `pointer-events: none`; keyboard access goes through the panel entries.
