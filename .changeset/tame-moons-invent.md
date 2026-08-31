---
'@component-anatomy/core': patch
---

Stop `resolvePanelAccent()` from replacing a caller's own accent with a color they did not choose.

Its legibility fallback treated the built-in indigo, and the preset's other colors, as candidates competing on chroma with the accent it was replacing — and either could win. So `theme: { accent: '#0d9488' }` drew teal overlays and got an indigo panel row on a light panel (teal is 3.9:1 there, the indigo scored better), or `contrast`'s yellow on a dark one.

The rule is now explicit: a color the caller chose is adjusted, never swapped. An accent from `theme` is only darkened or lightened toward the panel's own text; the built-in indigo stands in for callers who customized nothing at all; and a preset's sibling colors compete only when the color being replaced came from that same preset — which is what keeps `contrast` on its yellow and `blueprint` on a blue.

| `{ preset, theme }` | light panel | dark panel |
| --- | --- | --- |
| `{ theme: { accent: '#0d9488' } }` | `#148178` | `#209a8f` |
| `{ preset: 'contrast', theme: { accent: '#0d9488' } }` | `#148178` | `#209a8f` |
| `{ preset: 'contrast' }` | `#000000` | `#facc15` |

Caught by the new `Tabs/High Contrast Branded` example story; no released version carries the bug.
