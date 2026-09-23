---
title: "Troubleshooting & FAQ"
description: "Common issues and how to fix them."
---

## Troubleshooting

### Overlays don't appear

- Check the `root` element actually contains the `data-part` elements (`controller.getParts()` tells you what was found).
- If your app sets extreme `z-index` values, raise the overlay: `theme: { zIndex: 100000 }`.
- Zero-size elements produce zero-size boxes — give empty spans a size or padding, or use `overlay: { padding: 4 }`.
### Overlays are misplaced

- Overlays track `getBoundingClientRect` and reposition on scroll/resize. If the element moves due to CSS animation without a scroll/resize, call `controller.refresh()` — or re-highlight after the animation ends.
- Inside transformed/zoomed ancestors the rects are still correct — overlays live in `document.body` precisely to escape those stacking contexts.
### Panel doesn't react to hovering the component

- Panel entries must carry `data-anatomy-item="<id>"` matching the `data-part` value exactly (case-sensitive).
- If you rebuilt the panel DOM after `createAnatomy()`, call `controller.refresh()` to re-bind listeners.
### Dynamic content isn't picked up

Added/removed `data-part` elements are detected automatically via MutationObserver. Attribute-only changes (changing a `data-part` value in place) are not — call `controller.refresh()`.

### Storybook panel says "No anatomy configured"

- The `anatomy` parameter must exist (an empty object `{}` is enough for auto-discovery).
- The addon must be listed in `.storybook/main.ts` under `addons`.
### Storybook: the panel lists parts but the canvas never highlights

Check whether `.storybook/preview.ts` uses `definePreview` — CSF Next, the default in Storybook 11. Such a preview composes *only* its own `addons` array, and Storybook drops the preview annotations `main.ts` contributes, so the panel loads (that half comes from `main.ts`) while the canvas decorator never mounts. Add the addon there too:

```ts
// .storybook/preview.ts
import { definePreview } from '@storybook/your-framework';
import componentAnatomy from '@component-anatomy/storybook';

export default definePreview({
  addons: [componentAnatomy()],
});
```

Same cause when a story with `anatomy: {}` reports "No parts found": auto-discovery reads the rendered canvas, and without the decorator there is nothing reading it.

## FAQ

### Does it work without a bundler?

Yes — an IIFE build is shipped: `dist/index.iife.js` exposes `window.ComponentAnatomy`. See the [core docs](../core/).

### Can several parts share one id?

Yes. All matching elements highlight together (e.g. three tabs). Use `renderLabel` to number them.

### Does it affect my component's accessibility?

Overlays are `aria-hidden="true"` and ignore pointer events. The core adds no tabstops to your component. Keyboard interaction is provided through panel entries (focus/blur). The Astro integration additionally hides the decorative preview from the accessibility tree.

### What's the bundle cost?

Core is dependency-free, ~4&nbsp;kB min+gzip. The Astro panel renders server-side; the Storybook decorator only loads in Storybook.

### Is `data-anatomy` supported instead of `data-part`?

The attribute is `data-part`, aligning with design-system conventions (Zag.js, Ark UI, Radix internals) so annotations can double as styling/testing hooks.

### Can I use it in React / Vue / Svelte?

The core is framework-agnostic — call `createAnatomy()` in a mount effect and `destroy()` on unmount. Dedicated wrappers are on the roadmap; the Storybook addon already covers any renderer.
