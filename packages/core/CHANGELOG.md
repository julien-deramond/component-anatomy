# @component-anatomy/core

## 0.1.0

### Minor Changes

- [#22](https://github.com/julien-deramond/component-anatomy/pull/22) [`35ca199`](https://github.com/julien-deramond/component-anatomy/commit/35ca1994aa8b08d79bb694d37921289072adbac9) Thanks [@julien-deramond](https://github.com/julien-deramond)! - Add `resolvePanelAccent()`, for integrations that render a documentation panel in JS rather than CSS ([#20](https://github.com/julien-deramond/component-anatomy/pull/20)).

  A panel styled in CSS reads `var(--ca-label-bg)` and needs nothing new. One rendered in JS — the Storybook addon's table — has no cascade to inherit a controller's inline variables from, so it asks for the one color it needs instead. Both then paint the same token, and the panel cannot drift away from the canvas it describes.

  ```js
  import { resolvePanelAccent } from "@component-anatomy/core";

  const surface = { background: panelBg, foreground: panelText };
  resolvePanelAccent("contrast", theme, surface);
  ```

  Pass a `surface` and the accent is also checked for legibility on it. Presets are designed against your component, not against a panel: `contrast` is black on yellow, and on a dark panel that is 1.3:1 text — failing precisely the readers that preset exists for. When the accent falls under the requested ratio (4.5:1 by default), a color _you_ chose is darkened or lightened toward the panel's own text, never swapped for one you did not choose; a color that came from a preset may instead be replaced by one of that preset's own colors, whichever of the two keeps more of its color. A color the library cannot parse (`color-mix()`, `currentColor`, a named color) is returned untouched rather than guessed at.

  Also exported: `contrastRatio(foreground, background)` — the WCAG 2.1 ratio, compositing a translucent foreground onto the background first — the `PanelSurface` type, and `DEFAULT_ACCENT`, the built-in indigo.

- [#21](https://github.com/julien-deramond/component-anatomy/pull/21) [`c2e503d`](https://github.com/julien-deramond/component-anatomy/commit/c2e503d339948f780b28d202138bd3db2878e74c) Thanks [@julien-deramond](https://github.com/julien-deramond)! - Fix `theme.accent` being ignored when a `preset` is also set.

  The documented resolution order is default look → global CSS variables → `preset` → `theme` tokens, and `accent` is a theme token. It was not treated as one: `resolveThemeVars()` merged the preset and the theme into a single object before deriving the accent's tokens, and the merge lost which layer each token came from. A preset that spells out `labelBg` or `overlayBorder` — `contrast` and `blueprint` both do — then overwrote what the accent had derived.

  ```js
  createAnatomy({ root, preset: "contrast", theme: { accent: "#0d9488" } });
  // before: black border and label chip — the accent silently ignored
  // after:  teal border, wash and label chip; the rest of the preset kept
  ```

  The layers are now applied in order instead of merged. Within a single layer the shorthand still yields to a token you spell out yourself, so `theme: { accent, overlayBorder }` keeps behaving as before.

  This changes rendered overlay colors only for the combination of a preset _and_ `theme.accent`, which had no way of working as documented until now. Presets alone, accents alone, and explicit tokens are all unaffected.
