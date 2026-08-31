---
'@component-anatomy/core': minor
'@component-anatomy/storybook': minor
---

Make the Storybook anatomy table follow the story's `preset` and `theme`, and keep the accent legible on the panel it is drawn on ([#13](https://github.com/julien-deramond/component-anatomy/issues/13#issuecomment-5475258915)).

The table used to accent its active row with the built-in indigo unless a story set `anatomy.theme.accent` — so `preset: 'contrast'` painted black-and-yellow overlays on the canvas while the panel next to them stayed indigo. It now resolves the same `--ca-label-bg` the overlays (and the Astro panel) use, whichever preset is in play.

Following the preset naively would have hurt the very users the `contrast` preset exists for: its black is 1.3:1 on Storybook's dark manager. The resolved accent is therefore checked against the surface it is painted on and, when it falls short of WCAG AA, replaced by the most colorful legible alternative — another color of the same preset, or the accent lifted toward the panel's own text. `contrast` becomes its yellow on a dark panel and stays black on a light one; the built-in indigo, which was itself sitting at 2.5:1 in a dark docs page, is lifted rather than left unreadable. Light-theme rendering is unchanged.

New in `@component-anatomy/core`, for integrations that render a panel in JS rather than CSS:

- `resolvePanelAccent(preset, theme, surface?)` — the accent for a panel, optionally checked against a `{ background, foreground, minRatio }` surface.
- `contrastRatio(foreground, background)` — WCAG 2.1 contrast ratio, compositing translucent colors first.
- `DEFAULT_ACCENT` — the built-in indigo, previously duplicated in the addon.
