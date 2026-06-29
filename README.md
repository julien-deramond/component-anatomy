# Component Anatomy

> Interactive anatomy documentation for design system components — live, in-browser, framework-agnostic.

[![npm](https://img.shields.io/npm/v/@component-anatomy/core)](https://www.npmjs.com/package/@component-anatomy/core)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

---

## The problem

Design systems document component anatomy as static annotated images exported from Figma. Those images go stale, live in a design file most developers can't access, and offer no interactivity.

**Component Anatomy** solves this by turning `data-part` attributes on live DOM elements into an interactive, synchronized documentation panel — directly alongside the rendered component.

## How it works

Add `data-part="<id>"` to the elements you want to document:

```html
<div class="slider">
  <div class="track" data-part="track"></div>
  <div class="thumb" data-part="thumb"></div>
</div>
```

Pass definitions with Markdown descriptions:

```js
createAnatomy({
  root: document.querySelector('.slider'),
  panel: document.querySelector('#panel'),
  parts: [
    { id: 'track', name: 'Track', description: 'The rail where the thumb slides.' },
    { id: 'thumb', name: 'Thumb', description: 'The draggable handle.' },
  ],
});
```

The library creates a **bidirectional hover relationship**:

- Hover a part name in the panel → an overlay highlights the matching element(s) on the live component
- Hover a `data-part` element → the panel scrolls to and highlights the matching entry

---

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@component-anatomy/core`](./packages/core) | Framework-agnostic runtime — works anywhere a DOM exists | [![npm](https://img.shields.io/npm/v/@component-anatomy/core)](https://www.npmjs.com/package/@component-anatomy/core) |
| [`@component-anatomy/astro`](./packages/astro) | Astro integration with SSR Markdown and zero client bundle | [![npm](https://img.shields.io/npm/v/@component-anatomy/astro)](https://www.npmjs.com/package/@component-anatomy/astro) |

---

## Quick start

### Astro

```bash
npm install @component-anatomy/astro
```

```astro
---
import ComponentAnatomy from '@component-anatomy/astro/ComponentAnatomy.astro';

const parts = [
  { id: 'label', name: 'Label', description: 'The visible button text.' },
  { id: 'icon',  name: 'Icon',  description: 'Optional leading icon.' },
];
---

<ComponentAnatomy parts={parts}>
  <button class="btn">
    <svg data-part="icon" aria-hidden="true"><!-- … --></svg>
    <span data-part="label">Save changes</span>
  </button>
</ComponentAnatomy>
```

### Plain HTML (IIFE — no build step)

```html
<script src="https://unpkg.com/@component-anatomy/core/dist/index.iife.js"></script>

<div class="btn-preview">
  <button>
    <span data-part="label">Save</span>
  </button>
</div>

<div id="panel"></div>

<script>
  ComponentAnatomy.createAnatomy({
    root: document.querySelector('.btn-preview'),
    panel: document.querySelector('#panel'),
    parts: [
      { id: 'label', name: 'Label', description: 'The button label.' },
    ],
  });
</script>
```

### npm / ESM

```bash
npm install @component-anatomy/core
```

```js
import { createAnatomy } from '@component-anatomy/core';

const anatomy = createAnatomy({ root, panel, parts });

// Programmatic control
anatomy.highlight('label');
anatomy.unhighlight();

// Events
const off = anatomy.on('part:enter', (id) => console.log('hovered:', id));
off(); // unsubscribe

// Cleanup
anatomy.destroy();
```

---

## Features

- **Zero dependencies** in the core — plain DOM, no framework required
- **Bidirectional hover sync** — component preview ↔ documentation panel, always in sync
- **Rich part definitions** — Markdown descriptions (rendered SSR in Astro, or bring your own renderer)
- **Floating label chip** — DevTools-style part name chip above each overlay
- **Auto-discovery** — omit `parts` and the library reads all `data-part` values from the DOM
- **Multiple instances** — safe to use many times on the same page, fully isolated
- **Dynamic DOM** — `MutationObserver` support for components that change after mount
- **Keyboard accessible** — panel entries are focusable; preview is removed from the tab order
- **CSS custom properties** — theming without touching library code

---

## API reference

See [`packages/core/README.md`](./packages/core/README.md) for the full `createAnatomy()` API and type definitions.

See [`packages/astro/README.md`](./packages/astro/README.md) for the `<ComponentAnatomy>` Astro component.

---

## Examples

| Example | Description |
|---------|-------------|
| [`examples/astro`](./examples/astro) | Full Astro docs site — Button, Slider, and 5 Bootstrap v5 components |
| [`examples/plain-html`](./examples/plain-html) | Single HTML file, IIFE build, no build step |

To run the Astro example:

```bash
npm install
npm run build   # build core package
npm run dev     # start at http://localhost:4321
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development setup and how to submit pull requests.

---

## License

[MIT](./LICENSE) © Julien Déramond
