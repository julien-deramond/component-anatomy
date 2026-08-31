---
'@component-anatomy/storybook': minor
---

Make the anatomy table follow the story's `preset` and `theme`, and keep its accent legible on the panel it is drawn on ([#13](https://github.com/julien-deramond/component-anatomy/issues/13#issuecomment-5475258915)).

The table accented its active row with the built-in indigo unless a story set `anatomy.theme.accent`. A `preset` was ignored, so `preset: 'contrast'` painted black-and-yellow overlays on the canvas while the panel beside them stayed indigo. Both the addon panel and the `<Anatomy>` doc block now resolve the same `--ca-label-bg` the overlays use, whichever preset is in play.

Because a preset is designed against your component and not against Storybook's own panel — which is dark by default — the resolved accent is also checked for contrast there and adjusted when it falls under WCAG AA. `contrast` keeps its black on a light panel and takes its yellow on a dark one; a color you chose yourself is darkened or lightened rather than swapped for one you did not choose. The built-in indigo, previously sitting at 2.5:1 in a dark docs page, is lifted instead of left unreadable. Light-panel rendering is unchanged for every preset.
