# Product Definition: Component Anatomy

**Version:** 0.2 (Phase 2 — refined)

---

## Problem Statement

Design systems document component anatomy — the named parts that make up a component — as static annotated images produced in Figma. This creates three persistent pain points:

1. **Staleness.** When a component's DOM structure changes, the Figma diagram doesn't. The documentation lies.
2. **Disconnect from code.** The anatomy lives in a design file, not in the codebase. Developers cannot verify it, test it, or extend it without opening Figma.
3. **No interactivity.** A static image cannot tell you which DOM element corresponds to a named part, or let you explore the component by hovering its elements.

The result is that anatomy documentation is either missing, outdated, or only understood by the designer who drew it.

---

## Target Users

### Primary: Design system engineers

Engineers who build and maintain component libraries. They own the component source code and are responsible for documentation quality. They want anatomy documentation that stays in sync with the code automatically and can be shipped alongside the component without a Figma dependency.

**What they need:** A way to annotate their component's DOM once (`data-part="track"`) and get interactive documentation for free.

### Secondary: Design system consumers

Frontend engineers who use a design system's components. They need to understand a component's structure to style it, extend it, or debug it. Today they consult static diagrams or read source code; they would benefit from interactive, richly described anatomy alongside a live component preview.

### Tertiary: Documentation platform builders

Engineers building Storybook stories, Astro docs sites, or custom documentation systems who want to add anatomy visualization to their existing setup without writing it themselves.

---

## Core Concepts

### The `data-part` attribute

DOM elements are annotated with `data-part`, whose value is a **stable ID** referencing a part definition:

```html
<div class="slider">
  <div data-part="track"></div>
  <div data-part="thumb"></div>
</div>
```

The value is intentionally an ID — short, machine-friendly, stable even if the display name is later changed. The display name, description, and any future metadata live in the definition object, not in the DOM.

**Why `data-part` and not something else:**
- Already the convention in Ark UI and Zag.js (`data-part="thumb"` is already in their rendered output). Components built on these libraries work with zero changes.
- Short, readable, and semantically unambiguous — it identifies a *part* of a component.
- Avoids coupling the DOM attribute to a display string (e.g. `data-part="trigger"` vs `data-part="Trigger Button"` — the former is a stable ID, the latter is fragile).

### The Part Definition

Each part is described by a definition object. The description field is **Markdown** — it can be a single sentence, multiple paragraphs, images, links, code blocks, or anything Markdown supports:

```ts
type AnatomyPartDefinition = {
  id: string;           // matches the value of data-part="..."
  name: string;         // display name shown in the documentation panel
  description?: string; // Markdown — can be rich: paragraphs, images, links, code
  // future fields: tokens, accessibility notes, status, etc.
};
```

This separation matters: the `id` is what the DOM knows. The `name` and `description` are what the reader sees. They can evolve independently.

### The Rendering Model

The anatomy view has two areas rendered side by side:

1. **Component preview** — the live, interactive component, exactly as it would appear in production. Nothing is modified on the component itself.
2. **Anatomy documentation area** — a scrollable column of part entries. Each entry has a name (heading) and a rendered Markdown description. This is documentation, not just a label list.

When the user hovers a `data-part` element in the preview, the matching entry in the documentation area becomes active (scrolls into view if needed, visually highlighted). A colored overlay appears above the hovered element.

When the user hovers a part entry in the documentation area, the matching element(s) in the preview receive an overlay highlight.

The documentation area is meant to be read, not just glanced at. Rich descriptions — explaining *why* a part exists, its relationship to other parts, accessibility considerations, usage guidance — are first-class content.

---

## Use Cases

### UC-1: Annotate a component inline

A design system engineer adds `data-part` attributes to a component's markup:

```html
<div class="slider">
  <div data-part="track"></div>
  <div data-part="thumb"></div>
</div>
```

The library picks this up automatically. No configuration beyond the attributes.

### UC-2: Rich part descriptions

The Thumb part of a Slider has a multi-paragraph description with a usage note and an accessibility callout:

```ts
{
  id: 'thumb',
  name: 'Thumb',
  description: `
## Thumb

The draggable handle that represents the current value on the track.

Users can drag it or use arrow keys to change the value. The thumb always
stays within the bounds of the track and snaps to the step increment if one
is defined.

### Accessibility

The thumb element receives \`role="slider"\` and exposes \`aria-valuenow\`,
\`aria-valuemin\`, and \`aria-valuemax\`. Keyboard interaction follows the
[ARIA Authoring Practices slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/).
  `
}
```

This renders in the documentation area as formatted text, not a tooltip.

### UC-3: Interactive hover exploration

A consumer hovers "Track" in the documentation area. A colored overlay appears above the Track element in the live preview. They move their mouse to the rendered Thumb; the "Thumb" entry in the documentation area highlights. The two views stay synchronized.

### UC-4: Multiple instances of the same part

A RadioGroup has three Radio items, each with `data-part="item"`. Hovering the "Item" entry overlays all three elements simultaneously.

### UC-5: Auto-discovery mode

No `parts` definition is passed. The library reads all `data-part` values from the DOM and renders a documentation area with name headings and no descriptions. Useful for a quick, zero-config setup:

```tsx
<ComponentAnatomy>
  <Slider />
</ComponentAnatomy>
```

### UC-6: Storybook integration

A story author wraps a story with `withComponentAnatomy(parts)`. The anatomy documentation area appears in a Storybook addon panel. Hover synchronization works between the story iframe and the panel.

### UC-7: Astro documentation site

An Astro component wraps the live component preview with `<Anatomy parts={sliderParts}>`. The documentation area is SSR-rendered as static HTML; client-side interactivity (hover sync, overlays) is hydrated on load.

### UC-8: Plain HTML documentation

A static HTML page includes the core library via `<script>`. The anatomy initializes from `data-part` attributes and a JSON parts definition. No build step required.

---

## Problems Solved

| Problem | How this library solves it |
|---|---|
| Anatomy docs go stale | Docs derive from `data-part` attributes on the live component — DOM changes → docs change |
| Anatomy lives in Figma, not in code | Part definitions are version-controlled alongside the component source |
| No interactivity in anatomy docs | Two-way hover sync links the documentation area to rendered elements in real time |
| Descriptions are too shallow | The `description` field is Markdown — paragraphs, images, links, code are all valid |
| Hard to extend part metadata later | ID-based definitions decouple DOM annotation from display — new fields can be added to the definition object without touching the markup |
| Figma dependency for anatomy tooling | Zero Figma dependency; runs anywhere a DOM exists |
| Storybook lock-in for DOM highlighting | Framework-agnostic core; Storybook is one optional integration |

---

## Non-Goals

These are explicitly out of scope, at least for v1:

- **Design tool integration.** This library does not read from or write to Figma, Sketch, or any other design tool.
- **Accessibility auditing.** This is not an a11y checker. Accessibility guidance can live in part descriptions, but the library does not audit.
- **Visual regression testing.** The overlay is for documentation and exploration, not for diffing screenshots.
- **Automatic anatomy inference.** The library does not try to guess part names from class names or ARIA roles. Annotations must be explicit.
- **Component playground / controls.** This is not a Storybook replacement. No prop controls, knobs, or state manipulation.
- **Design token display.** A future possibility, not MVP.
- **Server-side rendering of overlays.** Overlays require `getBoundingClientRect` and are inherently client-side. SSR can render the documentation area; overlay positioning is always hydrated.
- **Markdown rendering engine.** The core delivers raw Markdown strings to the host; rendering is the responsibility of the integration layer (React can use `react-markdown`; Astro can use its built-in Markdown support; plain HTML can use a small CDN library). This keeps the core dependency-free.

---

## MVP Scope

### Core library (`@component-anatomy/core`)

- Discover all elements with `data-part` attributes within a root element
- Match discovered elements to a provided `AnatomyPartDefinition[]` by ID
- Fall back to auto-discovery (use IDs as display names) when no definitions are passed
- Render an overlay (colored highlight box) above a target element using `getBoundingClientRect`
- Update overlay position on window resize and scroll
- Sync hover: documentation area entry → overlay on matching element(s)
- Sync hover: rendered element → highlight matching documentation area entry
- Support multiple elements sharing the same `data-part` ID
- Emit events: `part:enter`, `part:leave` (allows integrations to add their own behavior)
- Clean up on destroy (no memory leaks, no dangling event listeners)
- TypeScript types included, zero runtime dependencies

### Anatomy documentation area UI

- Render one entry per defined part: `name` as heading, `description` as Markdown (raw string passed to the renderer)
- Active state on the entry matching the currently hovered element
- Smooth overlay transition (opacity, not position snap)
- Themeable via CSS custom properties (overlay color, active entry color)
- Scrollable if the part list exceeds the available height

### Astro integration (`@component-anatomy/astro`)

- `<ComponentAnatomy>` Astro component — renders the two-column layout as SSR HTML
- `parts` prop accepts `AnatomyPartDefinition[]`
- Markdown descriptions rendered server-side via Astro's built-in Markdown pipeline (no client-side Markdown renderer needed)
- Overlay and hover sync hydrated client-side via a small vanilla JS script — no framework runtime in the browser
- Works inside any Astro content collection, MDX page, or `.astro` component

### Examples

- `examples/plain-html` — Slider with Track and Thumb, CDN script tag, JSON definitions inline
- `examples/astro` — A small Astro docs site showing realistic design system components (Button, Slider) with full anatomy documentation, Markdown descriptions, and live hover interaction

---

## API Sketch (MVP)

### Part definition type

```ts
type AnatomyPartDefinition = {
  id: string;           // matches data-part="..." on the DOM element
  name: string;         // display name
  description?: string; // Markdown string
};
```

### Core

```ts
import { createAnatomy } from '@component-anatomy/core';

const anatomy = createAnatomy({
  root: document.querySelector('.preview'),
  parts: [
    {
      id: 'track',
      name: 'Track',
      description: '## Track\n\nThe rail where the thumb slides.',
    },
    {
      id: 'thumb',
      name: 'Thumb',
      description: '## Thumb\n\nThe draggable handle.',
    },
  ],
  // called by the core when a part should be rendered in the docs area
  renderDescription: (el, markdownString) => { /* host handles Markdown */ },
});

anatomy.destroy();
```

### Astro

```astro
---
import { ComponentAnatomy } from '@component-anatomy/astro';

const parts = [
  {
    id: 'track',
    name: 'Track',
    description: '## Track\n\nThe rail where the thumb slides.',
  },
  {
    id: 'thumb',
    name: 'Thumb',
    description: '## Thumb\n\nThe draggable handle.',
  },
];
---

<ComponentAnatomy parts={parts}>
  <div class="slider">
    <div data-part="track"></div>
    <div data-part="thumb"></div>
  </div>
</ComponentAnatomy>
```

### Auto-discovery (zero config)

```astro
---
import { ComponentAnatomy } from '@component-anatomy/astro';
---

<!-- No parts prop — discovers data-part attributes, uses IDs as display names -->
<ComponentAnatomy>
  <Slider />
</ComponentAnatomy>
```

---

## Future Possibilities

- **React integration** (`@component-anatomy/react`) — `<ComponentAnatomy>` wrapper with `react-markdown` for descriptions
- **Storybook addon** (`@component-anatomy/storybook`) — `withComponentAnatomy()` decorator, dedicated panel
- **Ark UI / Zag.js adapter** — auto-import part definitions from `@ark-ui/*/anatomy` to avoid duplication
- **Design token display** — show CSS custom properties applied to each part
- **Keyboard navigation** — Tab through parts, focus triggers overlay
- **Export to static image** — labeled PNG from the live anatomy view
- **VSCode extension** — hover `data-part` in code to see description inline
- **Part status field** — e.g. `status: 'deprecated' | 'experimental'` displayed in the documentation area
- **Part grouping** — organize many parts into named sections (e.g. "Interactive", "Layout", "Decorative")

---

## Success Metrics (open source)

- GitHub stars as a proxy for awareness
- npm weekly downloads as a proxy for adoption
- Number of design systems publicly using the library
- Issues filed from framework integrations (indicates real usage beyond toy examples)
