# @component-anatomy/astro

## 0.1.0

### Minor Changes

- [#35](https://github.com/julien-deramond/component-anatomy/pull/35) [`520601d`](https://github.com/julien-deramond/component-anatomy/commit/520601d6b65cb258fe2d5550349be62f39524d74) Thanks [@julien-deramond](https://github.com/julien-deramond)! - The panel's accent stays legible on any page. The active part's name, indicator and id chip, and the links in descriptions, now use `--ca-panel-accent`, which the block computes in the browser with `resolvePanelAccent()` from `@component-anatomy/core` (the same rule the Storybook table uses) against the background the panel actually sits on. On a dark page, `contrast` keeps its yellow and `minimal`'s grey or `blueprint`'s blue are lifted until they read; on a light page the presets are unchanged. A page-wide `--ca-label-bg` counts as the caller's own color and is only ever adjusted, never replaced. The sticky pill keeps the label's own background and text.

- [#33](https://github.com/julien-deramond/component-anatomy/pull/33) [`ad1a57d`](https://github.com/julien-deramond/component-anatomy/commit/ad1a57d4413660fd7b397dd362f2f4ecd4ea54cc) Thanks [@julien-deramond](https://github.com/julien-deramond)! - The anatomy panel can sit on a dark page. Every colour the block uses is now a CSS variable with its previous value as the default, so a light page renders exactly as before: `--ca-preview-dot`, `--ca-text-subtle`, `--ca-part-id-color`, `--ca-code-color`, `--ca-chip-bg`, `--ca-chip-border` and `--ca-indicator-border` are new, and the header slot and bold text reuse `--ca-part-desc-color` and `--ca-part-name-color`.

  Fix: a themed block (`theme={{ accent }}`) kept indigo on the active part's id chip and border and on the sticky pill's shadow. They now follow `--ca-label-bg`, and the pill's text and dot follow `--ca-label-fg`.

## 0.0.2

### Patch Changes

- Updated dependencies [[`35ca199`](https://github.com/julien-deramond/component-anatomy/commit/35ca1994aa8b08d79bb694d37921289072adbac9), [`c2e503d`](https://github.com/julien-deramond/component-anatomy/commit/c2e503d339948f780b28d202138bd3db2878e74c)]:
  - @component-anatomy/core@0.1.0
