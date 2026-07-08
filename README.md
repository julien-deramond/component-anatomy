# Component Anatomy

> Interactive anatomy documentation for design system components — live, in-browser, framework-agnostic.

[![npm](https://img.shields.io/npm/v/@component-anatomy/core)](https://www.npmjs.com/package/@component-anatomy/core)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

**Docs & live demos:** https://julien-deramond.github.io/component-anatomy/ · **Live Storybook:** https://julien-deramond.github.io/component-anatomy/storybook/

---

## The problem

Design systems document component anatomy as static annotated images exported from Figma. Those images go stale, live in a design file most developers can't access, and offer no interactivity.

**Component Anatomy** turns `data-part` attributes on live DOM elements into an interactive, synchronized documentation panel — directly alongside the rendered component:

- Hover a part name in the panel → an overlay highlights the matching element(s) on the live component
- Hover a `data-part` element → the panel scrolls to and highlights the matching entry

<!-- screenshot: hero — slider with track highlighted and panel entry active -->
<!-- screenshot: storybook — Anatomy panel next to Controls -->

## Packages

| Package | Description |
|---------|-------------|
| [`@component-anatomy/core`](./packages/core) | Framework-agnostic runtime — works anywhere a DOM exists |
| [`@component-anatomy/astro`](./packages/astro) | Astro component with SSR Markdown panel and zero-config hover sync |
| [`@component-anatomy/storybook`](./packages/storybook) | Storybook 9/10 addon — "Anatomy" panel synced with the story canvas |

---

## Quick start

### Plain HTML (any bundler)

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

Omit `parts` and they're auto-discovered from the DOM (`leading-icon` → "Leading Icon").

### No build step (CDN / IIFE)

```html
<script src="https://unpkg.com/@component-anatomy/core/dist/index.iife.js"></script>
<script>
  ComponentAnatomy.createAnatomy({
    root: document.querySelector('#preview'),
    panel: document.querySelector('#panel'),
  });
</script>
```

### Astro

```astro
---
import ComponentAnatomy from '@component-anatomy/astro/ComponentAnatomy.astro';
const parts = [
  { id: 'track', name: 'Track', description: 'The rail the **thumb** moves on.' },
  { id: 'thumb', name: 'Thumb', description: 'The draggable control.' },
];
---
<ComponentAnatomy parts={parts} theme={{ accent: '#0d9488' }}>
  <Slider />
</ComponentAnatomy>
```

### Storybook

```ts
// .storybook/main.ts
export default { addons: ['@component-anatomy/storybook'] };
```

```ts
// Button.stories.ts
export const Anatomy: Story = {
  parameters: {
    anatomy: {
      parts: [
        { id: 'icon', name: 'Icon', description: 'Optional leading glyph.' },
        { id: 'label', name: 'Label', description: 'The visible action text.' },
      ],
    },
  },
};
```

---

## Core API concepts

| Concept | Role |
|---------|------|
| `data-part="id"` | Marks an element in the live component as a documented part. Multiple elements may share an id (all highlight together). |
| `data-anatomy-item="id"` | Marks a panel entry as documentation for that part. |
| `createAnatomy(options)` | Wires a root + panel pair, returns a controller. |
| Controller | `highlight(id)`, `unhighlight()`, `refresh()`, `destroy()`, `on(event, fn)`, `getParts()`, `setTheme(theme, preset?)` |
| Events | `part:enter` / `part:leave` — build your own integrations on top. |

Overlays are rendered into `document.body` (escaping ancestor stacking contexts), positioned with `getBoundingClientRect`, repositioned on scroll/resize/`ResizeObserver`, and re-bound automatically when `data-part` elements are added or removed (`MutationObserver`). Nested parts and multiple independent instances per page are supported.

## Rendering customization

Zero-config default, one-line theming, full hooks. Resolution order: default look → global `--ca-*` CSS variables → `preset` → `theme` tokens.

```js
createAnatomy({
  root, panel,

  // 1. Named presets: 'default' | 'minimal' | 'contrast' | 'blueprint'
  preset: 'blueprint',

  // 2. Theme tokens — `accent` derives border/wash/label from one brand color
  theme: { accent: '#0d9488', overlayRadius: 8, transitionMs: 0 },

  // 3. Overlay hooks
  overlay: {
    label: true,             // floating name chip
    padding: 4,              // inflate boxes by 4px
    className: 'my-overlay', // your CSS class on every box
    renderLabel: ({ part, index }) => `${part.name} #${index + 1}`,
    decorateOverlay: (box, ctx) => box.append(makeBadge(ctx.part)),
  },
});

// Runtime switching (theme pickers, dark mode…)
controller.setTheme({ accent: '#e11d48' }, 'minimal');
```

Or theme site-wide with CSS only:

```css
:root {
  --ca-overlay-border: #e11d48;
  --ca-overlay-bg: rgb(225 29 72 / 0.12);
  --ca-label-bg: #e11d48;
}
```

Full token table and recipes: [customization guide](https://julien-deramond.github.io/component-anatomy/docs/customization).

## Framework integrations

- **Astro** — `<ComponentAnatomy parts={...} preset theme overlayLabel>` with SSR Markdown descriptions, sticky active pill, `header` slot. [Guide](https://julien-deramond.github.io/component-anatomy/docs/astro)
- **Storybook 9/10** — `parameters.anatomy = { parts, preset, theme, root, disable }`, auto-discovery included, any renderer. [Guide](https://julien-deramond.github.io/component-anatomy/docs/storybook)
- **React/Vue/Svelte** — use the core in a mount effect; dedicated wrappers are on the roadmap.

## Real-world examples

- **Bootstrap via CDN** — annotate Bootstrap markup directly: [Button, Alert, Card, Badge, Navbar demos](https://julien-deramond.github.io/component-anatomy/bs-button)

  ```html
  <button type="button" class="btn btn-primary" data-part="button">
    <span class="spinner-border spinner-border-sm" data-part="spinner"></span>
    <span data-part="label">Loading…</span>
  </button>
  ```

- **Shadcn-style in CDN contexts** — ids mirror shadcn slot names: [Card & Button demo](https://julien-deramond.github.io/component-anatomy/shadcn)

  ```html
  <div class="card" data-part="card">
    <div data-part="card-header">
      <h3 data-part="card-title">Create project</h3>
      <p data-part="card-description">Deploy in one click.</p>
    </div>
    <div data-part="card-content">…</div>
    <div data-part="card-footer">…</div>
  </div>
  ```

## Repository layout

```
packages/
  core/        @component-anatomy/core       — the runtime
  astro/       @component-anatomy/astro      — Astro component
  storybook/   @component-anatomy/storybook  — Storybook addon
examples/
  plain-html/  zero-build IIFE example
  sandbox/     Vite playground: presets, live theming, overlay hooks, dynamic DOM
  astro/       the docs site + demos (deployed to GitHub Pages)
  storybook/   Storybook 10 instance using the addon
```

### Running locally

```bash
pnpm install
pnpm run build:packages

pnpm --filter examples-sandbox dev      # localhost:5173
pnpm --filter examples-astro dev        # localhost:4321
pnpm --filter examples-storybook dev    # localhost:6006

pnpm test                               # core unit tests (vitest + jsdom)
```

## Troubleshooting

The short list — full page [here](https://julien-deramond.github.io/component-anatomy/docs/faq):

- **No overlays?** Check `controller.getParts()`, and that `root` contains your `data-part` elements. Extreme z-index apps: `theme: { zIndex: 100000 }`.
- **Panel not reacting?** `data-anatomy-item` must match `data-part` exactly; call `refresh()` after replacing panel DOM.
- **Misplaced overlays after animations?** Call `controller.refresh()` or re-highlight; scroll/resize are tracked automatically.

## Contributing

PRs welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). Releases are managed with [changesets](./RELEASING.md).

## License

[MIT](./LICENSE)
