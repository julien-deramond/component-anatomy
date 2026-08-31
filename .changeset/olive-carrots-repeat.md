---
'@component-anatomy/storybook': patch
---

Render the `<Anatomy>` block's "no parts found" message as markup instead of markdown.

Both variants of it were plain strings carrying markdown backticks — `` `of` ``, `` `parts` ``, `` `<Canvas of={…} />` `` — which a docs page shows verbatim, backticks and all. They now use the same inline-code styling as every other message the block renders.
