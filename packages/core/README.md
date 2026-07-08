# @component-anatomy/core

> Framework-agnostic runtime for interactive component anatomy documentation.

This is the core package. It runs in any browser DOM — no build tools, no framework required.

## Installation

```bash
npm install @component-anatomy/core
```

Or via CDN (IIFE build):

```html
<script src="https://unpkg.com/@component-anatomy/core/dist/index.iife.js"></script>
<!-- ComponentAnatomy is now available as a global -->
```

## Usage

Annotate DOM elements with `data-part`:

```html
<div class="slider">
  <div class="track" data-part="track"></div>
  <div class="thumb" data-part="thumb"></div>
</div>
```

Initialize the controller:

```js
import { createAnatomy } from '@component-anatomy/core';

const anatomy = createAnatomy({
  root: document.querySelector('.slider'),
  panel: document.querySelector('#anatomy-panel'),
  parts: [
    {
      id: 'track',
      name: 'Track',
      description: 'The rail where the thumb slides.',
    },
    {
      id: 'thumb',
      name: 'Thumb',
      description: 'The draggable control handle.',
    },
  ],
});
```

## API

### `createAnatomy(options): AnatomyController`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `root` | `HTMLElement` | Yes | The component preview container |
| `panel` | `HTMLElement` | No | The documentation panel container |
| `parts` | `AnatomyPartDefinition[]` | No | Part definitions (auto-discovered from DOM if omitted) |
| `preset` | `'default' \| 'minimal' \| 'contrast' \| 'blueprint'` | No | Named visual preset |
| `theme` | `AnatomyTheme` | No | Theme token overrides, e.g. `{ accent: '#0d9488' }` |
| `overlay` | `OverlayOptions` | No | Overlay hooks: `label`, `padding`, `className`, `renderLabel`, `decorateOverlay` |

### `AnatomyController`

```ts
interface AnatomyController {
  highlight(partId: string): void;   // Programmatically highlight a part
  unhighlight(): void;               // Clear active highlight
  refresh(): void;                   // Re-discover DOM parts after dynamic updates
  destroy(): void;                   // Remove all listeners and overlays
  on(event: AnatomyEvent, handler: AnatomyEventHandler): () => void;
  getParts(): AnatomyPartDefinition[]; // Resolved (explicit or auto-discovered) parts
  setTheme(theme: AnatomyTheme, preset?: AnatomyPresetName): void; // Runtime theme switch
}
```

### Theming

```js
// One-line brand match — border, background wash and label derive from accent
createAnatomy({ root, panel, theme: { accent: '#0d9488' } });

// Named presets
createAnatomy({ root, panel, preset: 'blueprint' });

// Overlay hooks
createAnatomy({
  root,
  overlay: {
    padding: 4,
    renderLabel: ({ part, index }) => `${part.name} #${index + 1}`,
    decorateOverlay: (box, ctx) => box.classList.add('glow'),
  },
});
```

Full token table: [customization guide](https://julien-deramond.github.io/component-anatomy/docs/customization).

### `AnatomyPartDefinition`

```ts
type AnatomyPartDefinition = {
  id: string;           // Stable machine ID, matches data-part value
  name: string;         // Human-readable display name
  description?: string; // Markdown supported
};
```

### Events

```ts
anatomy.on('part:enter', (partId) => console.log('hovered:', partId));
anatomy.on('part:leave', (partId) => console.log('left:', partId));
```

## CSS custom properties

Instances without a `preset`/`theme` pick up global variables — theme a whole site in CSS only:

```css
:root {
  --ca-overlay-bg: rgba(99, 102, 241, 0.18);
  --ca-overlay-border: rgba(99, 102, 241, 0.75);
  --ca-overlay-border-width: 2px;
  --ca-overlay-border-style: solid;
  --ca-overlay-radius: 4px;
  --ca-label-bg: rgba(79, 70, 229, 1);
  --ca-label-fg: #fff;
  --ca-label-font: ui-monospace, monospace;
  --ca-label-font-size: 11px;
  --ca-overlay-z: 9998;
  --ca-transition: 150ms;
}
```

## License

MIT
