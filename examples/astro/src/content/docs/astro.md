---
title: "Astro integration"
description: "@component-anatomy/astro — a ready-made two-column anatomy block: live preview left, documentation panel right. Markdown descriptions are rendered server-side; the only client JS is the core runtime."
---

## Installation

```sh
npm install @component-anatomy/astro
```

## Usage

```astro
---
import ComponentAnatomy from '@component-anatomy/astro/ComponentAnatomy.astro';
import Slider from '../components/Slider.astro';

const parts = [
  { id: 'track', name: 'Track', description: 'The rail the **thumb** moves on.' },
  { id: 'thumb', name: 'Thumb', description: 'The draggable control. `aria-valuenow` reflects the value.' },
];
---
<ComponentAnatomy parts={parts}>
  <Slider />
</ComponentAnatomy>
```

Your component just needs `data-part` attributes on the elements to document. Everything else — panel entries, hover sync, sticky active pill, keyboard focus — is generated.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `parts` | `AnatomyPartDefinition[]` | — | Part list. Descriptions accept Markdown. |
| `preset` | `'default' \| 'minimal' \| 'contrast' \| 'blueprint'` | `'default'` | Visual preset for overlays and panel accent. |
| `theme` | `AnatomyTheme` | — | Token overrides, e.g. `{ accent: "#0d9488" }`. |
| `overlayLabel` | `boolean` | `true` | Show the floating name chip. |
| `label` | `string` | "Component anatomy" | Accessible label of the block. |
| `class` | `string` | — | Extra class on the wrapper. |

## Theming

```astro
<ComponentAnatomy parts={parts} preset="blueprint">
  <Slider />
</ComponentAnatomy>

<ComponentAnatomy parts={parts} theme={{ accent: '#0d9488', overlayRadius: 8 }}>
  <Slider />
</ComponentAnatomy>
```

The theme is applied to both the canvas overlays and the panel accents (active entry, indicator dot, sticky pill). See it on the [theming demo](../../theming/).

## Header slot

```astro
<ComponentAnatomy parts={parts}>
  <Slider />
  <p slot="header">Hover a part below, or the component itself.</p>
</ComponentAnatomy>
```

## Layout customization

The block exposes CSS variables of its own:

```css
.my-anatomy {
  --ca-gap: 3rem;                 /* column gap */
  --ca-preview-bg: #ffffff;       /* preview background */
  --ca-preview-padding: 4rem 2rem;
  --ca-panel-max-height: 600px;
}
```

## View transitions

The client script re-initializes on `astro:page-load`, so it works with Astro view transitions out of the box.

## Live examples

- [Button](../../button/), [Slider](../../slider/) — custom Astro components
- [Bootstrap via CDN](../../bs-button/) — Button, Alert, Card, Badge, Navbar
- [Shadcn-style components](../../shadcn/)
