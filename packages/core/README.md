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

### `AnatomyController`

```ts
interface AnatomyController {
  highlight(partId: string): void;   // Programmatically highlight a part
  unhighlight(): void;               // Clear active highlight
  refresh(): void;                   // Re-discover DOM parts after dynamic updates
  destroy(): void;                   // Remove all listeners and overlays
  on(event: AnatomyEvent, handler: AnatomyEventHandler): () => void;
}
```

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

```css
:root {
  --ca-overlay-bg: rgba(99, 102, 241, 0.18);
  --ca-overlay-border: rgba(99, 102, 241, 0.75);
  --ca-label-bg: rgba(79, 70, 229, 1);
  --ca-label-color: #fff;
}
```

## License

MIT
