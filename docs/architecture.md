# Architecture: Component Anatomy

**Version:** 0.1 (Phase 3 — pre-implementation)

---

## Overview

Component Anatomy is a monorepo with two publishable packages and two examples:

```
packages/
  core/     @component-anatomy/core   — framework-agnostic runtime
  astro/    @component-anatomy/astro  — Astro integration

examples/
  plain-html/   — single HTML file, no build step
  astro/        — Astro docs site to verify the integration
```

The guiding principle: **the core is pure DOM**. It has zero runtime dependencies, no framework assumptions, and no opinion about how its output is rendered. Integrations own layout and Markdown rendering. The core owns interaction logic, overlay positioning, and the event contract.

---

## Monorepo Setup

**Package manager:** pnpm with workspaces  
**TypeScript:** project references (`tsconfig.json` per package)  
**Bundler:** tsup (wraps esbuild) — outputs ESM, CJS, and IIFE from one config  
**Node version:** 18+

```
pnpm-workspace.yaml
package.json             (root — scripts only, no publishable code)
packages/
  core/
    src/
    package.json
    tsconfig.json
    tsup.config.ts
  astro/
    src/
    package.json
    tsconfig.json
examples/
  plain-html/
  astro/
```

---

## Core Package: `@component-anatomy/core`

### Responsibility

The core does five things:

1. **Discover** — find all `[data-part]` elements within a root container
2. **Match** — map discovered element IDs to `AnatomyPartDefinition` objects
3. **Observe** — watch for DOM mutations (dynamic frameworks add elements asynchronously)
4. **Synchronize** — wire up hover events in both directions (element ↔ panel)
5. **Overlay** — render and reposition highlight boxes over active elements

It does not render HTML, process Markdown, or define layout. Those belong to integrations.

---

### Type System

```ts
// The data contract — shared between core and all integrations
export type AnatomyPartDefinition = {
  id: string;           // matches data-part="..." on the DOM element
  name: string;         // display name shown in the panel
  description?: string; // raw Markdown string — rendered by the integration
};

// Options passed to createAnatomy()
export type AnatomyOptions = {
  root: HTMLElement;                  // the component preview container
  panel?: HTMLElement;                // the documentation panel container (optional)
  parts?: AnatomyPartDefinition[];    // if omitted, auto-discovers from data-part values
};

// The public handle returned by createAnatomy()
export type AnatomyController = {
  highlight(partId: string): void;    // programmatically activate a part
  unhighlight(): void;                // deactivate all parts
  refresh(): void;                    // re-query the DOM (after dynamic updates)
  destroy(): void;                    // tear down all listeners and overlays
  on(event: AnatomyEvent, handler: AnatomyEventHandler): () => void;
};

export type AnatomyEvent = 'part:enter' | 'part:leave';
export type AnatomyEventHandler = (partId: string) => void;
```

---

### Internal Modules

The core is composed of three internal classes that are never exported directly. `createAnatomy` assembles them.

#### `AnatomyRegistry`

Responsible for discovering and tracking `[data-part]` elements in the DOM.

```
AnatomyRegistry
  constructor(root: HTMLElement)
  
  query(): Map<string, HTMLElement[]>
    — querySelectorAll('[data-part]') within root
    — groups elements by their data-part value
    — returns Map<partId, HTMLElement[]>
  
  observe(callback: () => void): () => void
    — MutationObserver watching root for childList + subtree changes
    — re-runs query() on change, calls callback
    — returns a cleanup function
```

The registry is stateless between calls — `query()` always reads the current DOM. This is intentional: it means the registry is always accurate after a React re-render or any other DOM mutation, without needing to reconcile against a stale cache.

#### `AnatomyOverlay`

Responsible for rendering and positioning highlight boxes above matched elements.

```
AnatomyOverlay
  constructor()
  
  show(elements: HTMLElement[]): void
    — creates one overlay <div> per element (not one bounding box)
    — each overlay is position:fixed, sized and positioned via getBoundingClientRect()
    — overlays are injected into document.body (avoids stacking context issues)
    — CSS class: 'ca-overlay'
  
  hide(): void
    — removes all overlay divs from the DOM
  
  reposition(): void
    — recomputes getBoundingClientRect() for the current active elements
    — called on scroll and resize
  
  destroy(): void
    — hides overlays and removes event listeners
```

**Why `position: fixed` injected into `document.body`:**  
Using `position: absolute` relative to a parent runs into CSS stacking context and `transform` issues — a single `transform: scale()` on any ancestor breaks the coordinate space. `position: fixed` with viewport-relative coordinates from `getBoundingClientRect()` works everywhere, regardless of the component's CSS. Injecting into `document.body` avoids z-index battles with the root container.

**Why one overlay per element (not a bounding box):**  
A Tabs component might have three `data-part="trigger"` elements spread across the page. A single bounding box would cover empty space between them. Individual overlays are precise.

**Overlay element structure:**
```html
<!-- injected into document.body -->
<div class="ca-overlay" aria-hidden="true" style="
  position: fixed;
  top: 48px; left: 120px; width: 200px; height: 40px;
  pointer-events: none;
"></div>
```

`pointer-events: none` is critical — the overlay must not capture mouse events that belong to the underlying component.

#### `AnatomyController` (internal orchestrator)

Wires the registry, overlay, and event system together. This is the object returned by `createAnatomy()`.

```
AnatomyController
  constructor(options: AnatomyOptions)
    — instantiates Registry and Overlay
    — calls _setup()
  
  _setup(): void
    — queries registry
    — attaches mouseenter/mouseleave to each [data-part] element
    — if panel provided: attaches mouseenter/mouseleave to [data-anatomy-item] elements
    — attaches ResizeObserver on root
    — attaches scroll listener on window
    — attaches MutationObserver via registry.observe()
  
  highlight(partId): void
    — overlay.show(registry.query().get(partId) ?? [])
    — marks matching [data-anatomy-item] as active (adds data-active attribute)
    — emits 'part:enter'
  
  unhighlight(): void
    — overlay.hide()
    — removes data-active from all [data-anatomy-item]
    — emits 'part:leave'
  
  refresh(): void
    — tears down element listeners
    — re-runs _setup() (picks up any new data-part elements)
  
  destroy(): void
    — tears down all listeners, observers, and overlays
```

---

### Data Flow

```
User hovers [data-part="thumb"] element
  → mouseenter listener fires
  → controller.highlight('thumb')
    → registry.query().get('thumb') → [HTMLElement]
    → overlay.show([thumbEl])          (visual highlight on component)
    → [data-anatomy-item="thumb"] gets data-active attr  (highlight in panel)
    → emits 'part:enter' event         (for custom integrations)

User hovers [data-anatomy-item="track"] in panel
  → mouseenter listener fires
  → controller.highlight('track')
    → registry.query().get('track') → [HTMLElement]
    → overlay.show([trackEl])
    → [data-anatomy-item="track"] gets data-active attr
    → emits 'part:enter' event

User moves mouse away
  → mouseleave fires
  → controller.unhighlight()
    → overlay.hide()
    → remove data-active from panel items
    → emits 'part:leave'
```

---

### Panel Attribute Convention

The core identifies panel entries by a `data-anatomy-item` attribute:

```html
<!-- rendered by the integration in the documentation panel -->
<div data-anatomy-item="track">...</div>
<div data-anatomy-item="thumb">...</div>
```

This is distinct from `data-part` (which belongs to component elements) to avoid ambiguity when an anatomy panel documents a component that itself appears in the preview.

The core uses `data-active` (a boolean attribute) to signal the active state to CSS:

```html
<div data-anatomy-item="thumb" data-active>...</div>
```

This keeps state in the DOM (no framework state needed) and is queryable with CSS: `[data-anatomy-item][data-active] { ... }`.

---

### Auto-Discovery Mode

When `parts` is omitted from `AnatomyOptions`, the core reads unique `data-part` values from the DOM and constructs minimal definitions:

```ts
// auto-discovered:
{ id: 'thumb', name: 'Thumb' }  // name is capitalized from the ID
```

No descriptions. The panel renders headings only. This is the zero-config path.

---

### CSS Custom Properties (Theming)

The core injects a minimal stylesheet into `<head>` on first use:

```css
.ca-overlay {
  background: var(--ca-overlay-bg, rgba(99, 102, 241, 0.12));
  outline: 2px solid var(--ca-overlay-border, rgba(99, 102, 241, 0.5));
  border-radius: var(--ca-overlay-radius, 4px);
  transition: opacity 150ms ease;
  pointer-events: none;
  z-index: var(--ca-overlay-z, 9999);
}

[data-anatomy-item] {
  cursor: default;
  transition: background 100ms ease;
}

[data-anatomy-item][data-active] {
  background: var(--ca-item-active-bg, rgba(99, 102, 241, 0.08));
}
```

Integrations override these via the same custom properties. No specificity battles.

---

### Output Formats

The core is bundled to three targets:

| Format | File | Use case |
|---|---|---|
| ESM | `dist/index.js` | Modern bundlers (Astro, Vite, webpack) |
| CJS | `dist/index.cjs` | Node.js require() |
| IIFE | `dist/index.iife.js` | Plain HTML `<script src="...">` |

The IIFE exposes `window.ComponentAnatomy.createAnatomy`.

---

## Astro Package: `@component-anatomy/astro`

### Responsibility

- Render the two-column anatomy layout as SSR HTML
- Render Markdown descriptions server-side (Astro's native pipeline)
- Wire up the core's client-side interactivity via a bundled script

### File Structure

```
packages/astro/
  src/
    ComponentAnatomy.astro   — the main component
    client.ts                — tiny client entry (calls createAnatomy)
    index.ts                 — package exports
  package.json
  tsconfig.json
```

### `ComponentAnatomy.astro`

```astro
---
// packages/astro/src/ComponentAnatomy.astro
import type { AnatomyPartDefinition } from '@component-anatomy/core';
import { marked } from 'marked'; // SSR Markdown rendering

export interface Props {
  parts?: AnatomyPartDefinition[];
  class?: string;
}

const { parts, class: className } = Astro.props;

// Generate a unique ID for this instance so multiple
// ComponentAnatomy instances on the same page don't cross-wire.
const instanceId = `ca-${Math.random().toString(36).slice(2, 8)}`;
---

<div
  class:list={['ca-root', className]}
  data-anatomy-root={instanceId}
>
  <!-- Left column: component preview (slot content) -->
  <div class="ca-preview" data-anatomy-preview={instanceId}>
    <slot />
  </div>

  <!-- Right column: documentation panel -->
  <div class="ca-panel" data-anatomy-panel={instanceId}>
    {parts?.map(async (part) => (
      <div class="ca-part-entry" data-anatomy-item={part.id}>
        <h3 class="ca-part-name">{part.name}</h3>
        {part.description && (
          <div
            class="ca-part-description"
            set:html={await marked.parse(part.description)}
          />
        )}
      </div>
    ))}
  </div>
</div>

<!-- Client hydration: one script per instance, Astro deduplicates the module -->
<script>
  import { createAnatomy } from '@component-anatomy/core';

  document.querySelectorAll('[data-anatomy-root]').forEach((root) => {
    const id = root.getAttribute('data-anatomy-root')!;
    const preview = root.querySelector(`[data-anatomy-preview="${id}"]`) as HTMLElement;
    const panel   = root.querySelector(`[data-anatomy-panel="${id}"]`) as HTMLElement;
    if (!preview) return;
    createAnatomy({ root: preview, panel });
  });
</script>
```

**Key design decisions:**

- **`marked` for SSR Markdown** — lightweight, synchronous-compatible, no runtime bundle shipped to the browser. Astro renders the HTML at build/request time.
- **Instance ID** — prevents cross-wiring when multiple `<ComponentAnatomy>` components appear on the same page (e.g., Button anatomy + Slider anatomy on one page).
- **`data-anatomy-preview` / `data-anatomy-panel`** — the client script uses these to find the right containers without relying on DOM hierarchy (robust against Astro's slot rendering).
- **`<script>` without `is:inline`** — Astro bundles and deduplicates this. The `createAnatomy` import is resolved once regardless of how many `<ComponentAnatomy>` instances are on the page.

---

### Layout CSS

The Astro package ships a default stylesheet (`ComponentAnatomy.css`) that integrations can import or override:

```css
.ca-root {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--ca-gap, 2rem);
  align-items: start;
}

.ca-preview {
  position: relative; /* anchor for any position:absolute children */
}

.ca-panel {
  display: flex;
  flex-direction: column;
  gap: var(--ca-part-gap, 1.5rem);
}

.ca-part-name {
  font-size: var(--ca-part-name-size, 0.875rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem;
}

.ca-part-description {
  font-size: var(--ca-part-desc-size, 0.875rem);
  line-height: 1.6;
}

/* Responsive: stack vertically on narrow viewports */
@media (max-width: 768px) {
  .ca-root {
    grid-template-columns: 1fr;
  }
}
```

---

## Example: `examples/astro`

A minimal Astro docs site that exists solely to verify the integration end-to-end. Not a production documentation site — just enough to run locally and test the full user journey.

```
examples/astro/
  src/
    pages/
      index.astro          — component index
      slider.astro         — Slider anatomy page
      button.astro         — Button anatomy page
    components/
      Slider.astro          — the Slider component (with data-part attrs)
      Button.astro          — the Button component (with data-part attrs)
  public/
  package.json
  astro.config.mjs
```

Each page imports `<ComponentAnatomy>` from `@component-anatomy/astro`, renders the component as a child, and passes `parts` definitions with Markdown descriptions.

---

## Example: `examples/plain-html`

A single `index.html` demonstrating the IIFE build. No build step, no npm.

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@component-anatomy/core/dist/index.iife.js" defer></script>
</head>
<body>
  <div id="preview">
    <div class="slider">
      <div data-part="track"></div>
      <div data-part="thumb"></div>
    </div>
  </div>

  <div id="panel">
    <div data-anatomy-item="track">
      <h3>Track</h3>
      <p>The rail where the thumb slides.</p>
    </div>
    <div data-anatomy-item="thumb">
      <h3>Thumb</h3>
      <p>The draggable handle.</p>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      window.ComponentAnatomy.createAnatomy({
        root: document.getElementById('preview'),
        panel: document.getElementById('panel'),
      });
    });
  </script>
</body>
</html>
```

---

## Key Technical Decisions

### 1. Overlay: `position: fixed` vs `position: absolute`

`position: fixed` with `getBoundingClientRect()` viewport coordinates was chosen over `position: absolute` relative to the root container.

Reason: any CSS `transform`, `filter`, or `will-change` on an ancestor creates a new stacking context and breaks `position: fixed`. However, this applies only when the overlay is *inside* that ancestor. By injecting overlays into `document.body`, we escape all ancestor stacking contexts. `getBoundingClientRect()` always returns viewport-relative coordinates regardless of scroll or transforms, making the math simple and reliable.

One caveat: `position: fixed` overlays don't scroll with the page. A `scroll` event listener on `window` calls `overlay.reposition()` to correct coordinates on every scroll frame (throttled with `requestAnimationFrame`).

### 2. One overlay div per element (not one bounding box)

When multiple elements share a `data-part` ID, each gets its own overlay div. A single bounding box computed from `getBoundingClientRect()` across multiple elements would cover empty space between them. Individual overlays are precise and visually clear.

### 3. Registry is stateless (re-queries on each call)

`registry.query()` always calls `querySelectorAll` fresh. There is no cached element list. This means:
- No stale references after React re-renders, Astro partial hydration, or dynamic slot changes
- `MutationObserver` only needs to trigger a re-setup of event listeners, not a reconcile of element lists
- Slightly more work per hover event, but negligible at this scale

### 4. `data-part` is a reference, not the name

The DOM attribute value is an ID. The display name lives in the definition. This means:
- Renaming "Thumb" to "Handle" requires no DOM changes
- The ID can be short and machine-friendly (`thumb`); the name can be prose (`Draggable handle`)
- Future fields (description, tokens, status, group) are additive without touching markup
- Compatible with Ark UI / Zag.js which already emit `data-part` with semantic IDs

### 5. Markdown is the integration's responsibility

The core stores raw Markdown strings. It does not bundle a Markdown parser. Each integration renders Markdown in the most appropriate way:
- Astro: `marked` at SSR time (zero client bundle)
- React (future): `react-markdown` as a peer dependency
- Plain HTML: consumer's choice (or no Markdown at all — plain text works fine)

This keeps the core at zero runtime dependencies.

### 6. Auto-discovery capitalizes IDs for display names

When no `parts` are provided, the ID `"slider-thumb"` becomes `"Slider Thumb"`. The transform is: split on `-` and `_`, capitalize each word, join with space. This gives reasonable results for kebab-case and snake_case IDs without requiring configuration.

### 7. Multiple `ComponentAnatomy` instances per page

The Astro component generates a random `instanceId` and stamps it on the root, preview, and panel elements. The client script queries all `[data-anatomy-root]` elements and initializes each independently. This supports documentation pages that show multiple components, each with their own anatomy panel.

---

## Sequence: Page Load (Astro)

```
1. Astro SSR renders ComponentAnatomy.astro
   → outputs .ca-root div with preview slot + panel HTML
   → panel entries have data-anatomy-item="[id]" attributes
   → Markdown descriptions rendered as HTML by marked

2. Browser loads the page
   → HTML is fully readable without JavaScript (progressive enhancement)
   → Panel shows part names and descriptions as static content

3. Astro loads the bundled client script
   → querySelectorAll('[data-anatomy-root]') finds each instance
   → createAnatomy({ root: preview, panel }) called for each
   → core attaches mouseenter/mouseleave to [data-part] elements in preview
   → core attaches mouseenter/mouseleave to [data-anatomy-item] elements in panel
   → ResizeObserver and scroll listener attached

4. User interacts
   → hover [data-part] element → overlay appears, panel entry gets data-active
   → hover panel entry → overlay appears over matched element(s)
```

The page is useful before JavaScript loads. JavaScript is additive.

---

## Accessibility Considerations

- Overlay divs carry `aria-hidden="true"` and `pointer-events: none` — invisible to assistive technology and non-interactive
- Panel entries are `tabindex="0"` so keyboard users can Tab through parts
- `focus` on a panel entry triggers the same `highlight()` call as `mouseenter`
- `blur` triggers `unhighlight()`
- Active panel entries receive `aria-current="true"` for screen reader announcement
- No ARIA roles are added to the component preview — the overlay is purely visual

---

## Future Extension Points

The architecture is designed to accommodate these without breaking changes:

- **Storybook addon** — calls `createAnatomy()` imperatively from a Storybook decorator, with the panel rendered in a separate iframe panel. Uses the `part:enter` / `part:leave` events to communicate across iframes via `postMessage`.
- **React integration** — a `<ComponentAnatomy>` React component that renders the panel via React state, responds to `part:enter` / `part:leave` events to set active state, and calls `anatomy.highlight()` on panel entry hover.
- **Ark UI adapter** — reads `@ark-ui/*/anatomy` exports and converts them to `AnatomyPartDefinition[]`, so engineers don't duplicate part names.
- **Token display** — adds an optional `tokens` field to `AnatomyPartDefinition`. The core passes it through; the integration renders it alongside the Markdown description.
- **Nested anatomy** — multiple `data-part` scopes within the same page. Handled by scoping each `createAnatomy()` call to its own `root` element.
