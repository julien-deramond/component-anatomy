---
title: "Rendering customization"
label: Customization
description: "Zero-config by default, themable in one line, fully hookable when you need it."
---

See it live on the [theming demo](../../theming/).

## The layering model

Every visual decision resolves in this order (lowest → highest priority):

1. **Default look** — the built-in indigo style. Nothing to configure.
2. **Global CSS variables** — set `--ca-*` on `:root` for a page-wide brand.
3. **Preset** — a named token bundle passed per instance.
4. **Theme tokens** — individual overrides passed per instance.
## 1. Presets

```js
createAnatomy({ root, panel, preset: 'blueprint' });
```

| Preset | Look |
|---|---|
| `default` | Indigo fill + solid border, filled label chip. |
| `minimal` | No fill, thin neutral border, subdued gray label. |
| `contrast` | Yellow/black, thick square border. High visibility. |
| `blueprint` | Blue dashed outline on a light wash — technical drawing style. |

Presets are plain objects — import, spread, and tweak them:

```js
import { presets } from '@component-anatomy/core';
createAnatomy({ root, theme: { ...presets.blueprint, labelBg: '#0f172a' } });
```

## 2. Theme tokens

The `accent` shorthand derives the overlay border, a 15% background wash, and the label background from a single brand color:

```js
createAnatomy({ root, panel, theme: { accent: '#0d9488' } });
```

Because it is a theme token, `accent` outranks a preset: combine the two and the accent wins for the three tokens it derives, while the rest of the preset stays. A token you spell out yourself beats the shorthand, as always.

```js
createAnatomy({
  root,
  preset: 'contrast',              // thick square border, yellow label text…
  theme: { accent: '#0d9488' },    // …but teal border, wash and label background
});
```

| Token | Type | Maps to |
|---|---|---|
| `accent` | color | Shorthand → border, bg wash, label bg |
| `overlayBg` | color | `--ca-overlay-bg` |
| `overlayBorder` | color | `--ca-overlay-border` |
| `overlayBorderWidth` | px | CSS length | `--ca-overlay-border-width` |
| `overlayBorderStyle` | solid | dashed | dotted | `--ca-overlay-border-style` |
| `overlayRadius` | px | CSS length | `--ca-overlay-radius` |
| `labelBg` / `labelFg` | color | `--ca-label-bg` / `--ca-label-fg` |
| `labelFont` / `labelFontSize` | font | px | `--ca-label-font` / `--ca-label-font-size` |
| `zIndex` | number | `--ca-overlay-z` |
| `transitionMs` | ms | CSS time | `--ca-transition` |

Numbers get sensible units automatically (`8` → `8px`, `300` → `300ms` for `transitionMs`).

### Runtime switching

```js
controller.setTheme({ accent: picker.value }, 'minimal');
```

### Global CSS variables (no JS)

```css
:root {
  --ca-overlay-border: #e11d48;
  --ca-overlay-bg: rgb(225 29 72 / 0.12);
  --ca-label-bg: #e11d48;
}
```

Instances without a preset/theme pick these up automatically — useful for theming a whole docs site in CSS only.

## 3. Overlay hooks

```js
createAnatomy({
  root,
  overlay: {
    label: true,          // false hides the name chips entirely
    padding: 4,           // inflate every highlight box by 4px
    className: 'glow',    // your own CSS class on every box

    // Custom label text/content per box
    renderLabel: ({ part, element, index }) =>
      part.id === 'tab' ? `${part.name} #${index + 1}` : part.name,

    // Full access to the box element after creation
    decorateOverlay: (box, { part }) => {
      box.style.boxShadow = '0 4px 16px rgb(13 148 136 / .3)';
      if (part.id === 'thumb') box.append(makeCornerBadge());
    },
  },
});
```

- `renderLabel` returns a string (used as text) or a Node (appended). Return null to fall back to the part name.
- `decorateOverlay` runs once per box per highlight — keep it cheap; it executes on every hover.
## Recipes

### Match your brand in one line

```js
createAnatomy({ root, panel, theme: { accent: 'var(--brand-500)' } });
```

### Screenshot-friendly (no animation, no labels)

```js
createAnatomy({ root, theme: { transitionMs: 0 }, overlay: { label: false } });
```

### Dark page

```js
createAnatomy({ root, theme: {
  overlayBg: 'rgb(255 255 255 / 0.08)',
  overlayBorder: '#a5b4fc',
  labelBg: '#e0e7ff', labelFg: '#1e1b4b',
}});
```
