# @component-anatomy/astro

> Astro integration for component-anatomy — SSR-rendered Markdown descriptions, live hover sync, zero client-side Markdown bundle.

## Installation

```bash
npm install @component-anatomy/astro
```

## Usage

Import the `<ComponentAnatomy>` component and wrap any HTML you want to document:

```astro
---
import ComponentAnatomy from '@component-anatomy/astro/ComponentAnatomy.astro';

const parts = [
  {
    id: 'track',
    name: 'Track',
    description: 'The **rail** where the thumb slides. Takes full width of the container.',
  },
  {
    id: 'thumb',
    name: 'Thumb',
    description: 'The draggable handle. Constrained to the `Track`.',
  },
];
---

<ComponentAnatomy parts={parts}>
  <div class="slider">
    <div class="track" data-part="track"></div>
    <div class="thumb" data-part="thumb"></div>
  </div>
</ComponentAnatomy>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `parts` | `AnatomyPartDefinition[]` | No | Part definitions. If omitted, parts are auto-discovered from `data-part` attributes. |

`AnatomyPartDefinition`:

```ts
{
  id: string;           // Matches the data-part value on the DOM element
  name: string;         // Display name shown in the panel
  description?: string; // Raw Markdown — rendered server-side by marked
}
```

## How it works

- The server renders the two-column layout (preview + panel) with Markdown descriptions converted to HTML by [`marked`](https://marked.js.org/) — no Markdown library is shipped to the browser
- The client script calls `createAnatomy()` from `@component-anatomy/core` to wire up hover sync and overlays
- Multiple `<ComponentAnatomy>` instances on the same page are isolated via a random instance ID

## Requirements

- Astro ≥ 4.0
- Node ≥ 18

## License

MIT
