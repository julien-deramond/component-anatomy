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
