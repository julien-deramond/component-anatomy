---
"@component-anatomy/astro": minor
---

The panel's accent stays legible on any page. The active part's name, indicator and id chip, and the links in descriptions, now use `--ca-panel-accent`, which the block computes in the browser with `resolvePanelAccent()` from `@component-anatomy/core` (the same rule the Storybook table uses) against the background the panel actually sits on. On a dark page, `contrast` keeps its yellow and `minimal`'s grey or `blueprint`'s blue are lifted until they read; on a light page the presets are unchanged. A page-wide `--ca-label-bg` counts as the caller's own color and is only ever adjusted, never replaced. The sticky pill keeps the label's own background and text.
