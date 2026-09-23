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
off(); // unsubscribe
```

## Behavior notes

- Dynamic DOM: a `MutationObserver` re-binds listeners when `data-part` elements are added/removed. Call `refresh()` after replacing the panel markup.
- Multiple instances per page are fully independent — part ids only need to be unique within one root.
- Nested parts work: hovering a child highlights the child, not the parent.
- Overlays are `aria-hidden` and `pointer-events: none`; keyboard access goes through the panel entries.
