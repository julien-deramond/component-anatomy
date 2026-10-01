---
"@component-anatomy/astro": minor
---

Web Components support ([#46](https://github.com/julien-deramond/component-anatomy/issues/46)). Parts inside a web component's open shadow root are highlighted like any others, and a new `shadowParts` prop reads the native `part="…"` names instead of `data-part`. The preview is decorative and hidden from assistive technology, so the block also takes focusable elements inside open shadow roots out of the tab order. This includes elements of components that render after the page loaded.
