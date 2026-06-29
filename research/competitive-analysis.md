# Competitive Analysis: Component Anatomy Runtime

**Date:** June 2026  
**Question:** Does this project need to exist?  
**Answer:** Yes — the gap is real and unoccupied.

---

## What We're Building

A framework-agnostic browser runtime that:
1. Reads `data-anatomy="PartName"` attributes from live rendered DOM elements
2. Displays an interactive documentation panel alongside the component
3. Syncs hover in both directions: hover a doc item → overlay appears on the element; hover the element → doc item highlights
4. Works with plain HTML, React, Astro, Storybook, and any custom docs system

---

## Existing Solutions

### 1. `ddamato/component-anatomy` (Web Component)

**Link:** https://github.com/ddamato/component-anatomy  
**Stars:** 0 (niche, solo project)

A native web component that places numbered pin markers on top of an image or any wrapped element. Uses a WYSIWYG edit mode: click a part of the image to place a pin at `{x%, y%}`, then type a description. The encoded definition is serialized into a `definitions` attribute.

**What it does well:**
- Zero dependencies, ships as a plain IIFE
- Hover on list item → highlights corresponding pin
- Accessible: markers are tabbable, `aria-describedby` wired up

**Critical limitations:**
- Works on **images and screenshots**, not live rendered DOM. Pins are placed by pixel coordinates (`x: "33%", y: "40%"`) that have no relationship to actual DOM elements.
- No `data-anatomy` approach — annotations are decoupled from the component's markup
- No reverse sync: hovering the rendered element does nothing
- No TypeScript, no framework integrations
- Unmaintained (0 stars, single contributor)
- The overlay lives over a static image, not a live, interactive component

**Gap:** It solves the "labeled diagram" use case, not the "live component documentation" use case.

---

### 2. `@storybook/addon-highlight`

**Link:** https://storybook.js.org/docs/essentials/highlight  
**Part of:** Storybook Essentials (installed by default)

A Storybook channel event system that accepts CSS selectors and draws outlines around matching DOM nodes. Used internally by the Accessibility addon to flag failing ARIA checks.

**What it does well:**
- Low-level, composable — any addon can emit the `HIGHLIGHT` event
- Works on live DOM nodes, not images
- Custom styles supported

**Critical limitations:**
- **Storybook-only.** Deeply coupled to Storybook's channel/iframe architecture. Cannot be used standalone.
- No named anatomy concept — just raw CSS selectors
- No documentation panel / anatomy list
- No bidirectional sync (hover a part → highlight a doc item is not possible)
- Developer-facing utility, not an end-user documentation runtime

**Gap:** The highlight primitive exists, but there is no layer on top that turns it into anatomy documentation with named parts, descriptions, and two-way sync.

---

### 3. Ark UI / Zag.js — `@ark-ui/*/anatomy`

**Link:** https://ark-ui.com  

Ark UI ships an `anatomy` entrypoint (`@ark-ui/react/anatomy`) that exports named slot definitions for use with Panda CSS `defineSlotRecipe`. It tells the styling system what the parts of a component are called, so you can write `slider.track`, `slider.thumb`, etc.

**What it does well:**
- Formal, typed definition of component parts
- Integrates with CSS-in-JS slot recipes
- Data attributes (`data-scope`, `data-part`) on rendered elements

**Critical limitations:**
- **Styling tool, not documentation tool.** There is no UI that uses these definitions to build an interactive anatomy panel.
- The anatomy definitions exist to drive CSS, not overlays or hover interactions
- No rendering layer whatsoever — purely a naming/token system

**Gap:** Ark has the data model (named parts) but no documentation/visualization runtime built on it. This project could integrate with Ark's anatomy definitions as a data source.

---

### 4. Carbon Design System — "Anatomy" Documentation Pages

**Link:** https://carbondesignsystem.com/components/modal/usage/

Carbon (and most mature design systems: Radix, Fluent UI, Chakra, PatternFly) document component anatomy as **static annotated images** — a screenshot of the component with numbered callouts, built in Figma and exported as PNG.

**What it does well:**
- Visually clear for end-users
- Works in any static site

**Critical limitations:**
- **Static.** The image goes out of date when the component changes.
- No interactivity — hovering the image does nothing
- Requires Figma or design tool work to produce; no automation
- Cannot be kept in sync with code automatically
- Zero relationship to the actual rendered DOM

**Gap:** The industry standard is a manual, static, Figma-derived image. There is nothing that generates interactive anatomy documentation from live code automatically.

---

### 5. Figma Plugins — Specs (EightShapes), Auto Anatomy

**Links:**  
- https://specsplugin.com  
- https://www.figma.com/community/widget/1222437820450843457/auto-anatomy

Figma plugins that traverse Figma's layer tree to annotate components with numbered callouts and generate "anatomy frames" alongside the component design.

**What they do well:**
- Automate the annotation of Figma components
- Specs plugin can detect Figma variables/tokens and show them in the anatomy
- Auto Anatomy can regenerate annotations when component changes

**Critical limitations:**
- **Figma-only.** Completely locked to the Figma design environment.
- No relationship to code or rendered DOM
- Requires a Figma license
- Output is Figma frames, not browser-runnable HTML/JS

**Gap:** These tools solve the design-side anatomy documentation problem but have no story for the code side. A developer implementing a component cannot use these tools to document the rendered output.

---

### 6. Microsoft Fluent UI — Component Anatomy Wiki

**Link:** https://github.com/microsoft/fluentui/wiki/Component-Anatomy

An internal wiki page defining a **naming convention** for the TypeScript files and slots that make up a Fluent UI component. Describes part structure as a specification, not a runtime.

**What it does well:**
- Clear conventions for naming slots and style targets
- Consistent across a large codebase

**Critical limitations:**
- Documentation only, no tooling
- Internal to Fluent UI, not a reusable library

---

### 7. DOM Annotation Libraries — `react-annotation`, `annotator.js`

General-purpose text/image annotation libraries. `react-annotation` builds connector + note + subject annotations for data visualizations. `annotator.js` annotates HTML text with XPath-based highlights.

**What they do well:**
- Rich annotation primitives (connectors, arrows, notes)

**Critical limitations:**
- Not designed for component documentation
- No concept of named anatomy parts or synchronization with a parts list
- Heavy or React-specific
- No `data-attribute`-driven approach

---

## Gap Analysis

| Capability | ddamato/component-anatomy | Storybook Highlight | Ark Anatomy | Design Systems (static) | Figma Plugins | **This project** |
|---|---|---|---|---|---|---|
| Works on live rendered DOM | ✗ | ✓ | — | ✗ | ✗ | ✓ |
| `data-anatomy` attribute-driven | ✗ | ✗ | partial | ✗ | ✗ | ✓ |
| Named parts + descriptions | ✓ | ✗ | ✓ (no UI) | ✓ (static) | ✓ (Figma) | ✓ |
| Hover doc item → overlay on element | ✓ (pin) | ✗ | ✗ | ✗ | ✗ | ✓ |
| Hover element → highlight doc item | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Framework-agnostic | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Works outside Storybook | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ |
| Stays in sync with code | ✗ | — | ✓ | ✗ | ✗ | ✓ |
| TypeScript + npm package | ✗ | ✓ | ✓ | — | — | ✓ |
| Supports multiple parts per component | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Open source | ✓ | ✓ | ✓ | varies | ✗ | ✓ |

---

## Why This Project Should Exist

**The core gap is a missing runtime layer.** Every existing tool either:

1. Works on static images (not live DOM), or
2. Is locked to a single platform (Storybook, Figma), or
3. Has the data model but no UI (Ark anatomy definitions), or
4. Has the highlighting primitive but no anatomy documentation concept (Storybook `addon-highlight`)

No open-source library currently allows a developer to annotate rendered component elements with `data-anatomy` attributes and get an interactive, bidirectional documentation panel in return — in plain HTML, React, Astro, or any other environment.

This matters because:

- **Design systems are increasingly code-first.** Tools like Ark UI, Radix, and Zag have moved anatomy definitions into code, but the documentation side hasn't caught up.
- **Static anatomy diagrams go stale.** When a component changes, the Figma annotation doesn't. A `data-anatomy`-driven approach ties documentation directly to the rendered output, so it is always accurate.
- **Two-way sync is new.** No tool today lets you hover a live component element and see the corresponding documentation item highlight. This interaction model is genuinely absent from the ecosystem.
- **Framework fragmentation is a solved problem for components but not for docs tooling.** A vanilla-JS core with thin framework wrappers can serve the entire ecosystem.

**The closest competitor** (`ddamato/component-anatomy`) has 0 stars, is unmaintained, and operates on images — not live DOM. It validates the concept but leaves the actual problem unsolved.

---

## Risks

- **Discoverability:** The concept is new enough that developers may not know to search for it. Good naming, a clear README, and integration with Storybook/Astro/React ecosystems are essential.
- **Overlay positioning complexity:** `getBoundingClientRect` + scroll + resize handling + nested transforms is non-trivial to get right cross-browser.
- **Maintenance surface:** Supporting multiple frameworks (React, Astro, Storybook) multiplies the maintenance burden. Keeping the core minimal reduces this risk.
- **Adoption chicken-and-egg:** Design systems won't add `data-anatomy` attributes without the tooling, and the tooling has no users without the attributes. First-party examples and integrations with popular systems (Ark, Radix) are critical for bootstrapping.

---

## Conclusion

**Build it.** The gap is real, the ecosystem is ready (Ark's `data-part` attributes are already in the DOM), and no existing tool competes on the specific value proposition: a framework-agnostic runtime that creates a two-way interactive link between annotated live DOM elements and an anatomy documentation panel.
