---
"@component-anatomy/astro": minor
---

The anatomy panel can sit on a dark page. Every colour the block uses is now a CSS variable with its previous value as the default, so a light page renders exactly as before: `--ca-preview-dot`, `--ca-text-subtle`, `--ca-part-id-color`, `--ca-code-color`, `--ca-chip-bg`, `--ca-chip-border` and `--ca-indicator-border` are new, and the header slot and bold text reuse `--ca-part-desc-color` and `--ca-part-name-color`.

Fix: a themed block (`theme={{ accent }}`) kept indigo on the active part's id chip and border and on the sticky pill's shadow. They now follow `--ca-label-bg`, and the pill's text and dot follow `--ca-label-fg`.
