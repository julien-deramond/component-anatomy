---
'@component-anatomy/core': minor
---

Add `resolvePanelAccent()`, for integrations that render a documentation panel in JS rather than CSS ([#20](https://github.com/julien-deramond/component-anatomy/pull/20)).

A panel styled in CSS reads `var(--ca-label-bg)` and needs nothing new. One rendered in JS — the Storybook addon's table — has no cascade to inherit a controller's inline variables from, so it asks for the one color it needs instead. Both then paint the same token, and the panel cannot drift away from the canvas it describes.

```js
import { resolvePanelAccent } from '@component-anatomy/core';

const surface = { background: panelBg, foreground: panelText };
resolvePanelAccent('contrast', theme, surface);
```

Pass a `surface` and the accent is also checked for legibility on it. Presets are designed against your component, not against a panel: `contrast` is black on yellow, and on a dark panel that is 1.3:1 text — failing precisely the readers that preset exists for. When the accent falls under the requested ratio (4.5:1 by default), a color _you_ chose is darkened or lightened toward the panel's own text, never swapped for one you did not choose; a color that came from a preset may instead be replaced by one of that preset's own colors, whichever of the two keeps more of its color. A color the library cannot parse (`color-mix()`, `currentColor`, a named color) is returned untouched rather than guessed at.

Also exported: `contrastRatio(foreground, background)` — the WCAG 2.1 ratio, compositing a translucent foreground onto the background first — the `PanelSurface` type, and `DEFAULT_ACCENT`, the built-in indigo.
