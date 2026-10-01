---
"@component-anatomy/storybook": minor
---

Web Components support ([#46](https://github.com/julien-deramond/component-anatomy/issues/46)). Stories rendering web components are documented like any others: parts inside open shadow roots are auto-discovered and highlighted. The panel and the `<Anatomy>` block now update when parts appear after the story rendered, for example when a Lit or Stencil component renders asynchronously or an element is defined late. A new `shadowParts: true` parameter reads the native `part="…"` names a component already exposes for `::part()`, so no `data-part` needs to be added.
