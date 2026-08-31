---
'@component-anatomy/storybook': patch
---

Render the `<Anatomy>` block's "no parts found" message as markup instead of markdown.

Both variants of it were plain strings carrying markdown backticks — `` `of` ``, `` `parts` `` — which a docs page shows verbatim, backticks and all. They now use the same inline-code styling as every other message the block renders.

Also splits the addon panel's disabled state out of its "no anatomy configured" message. Storybook removes a panel whose `paramKey` parameter is disabled, so this is a fallback nobody should see; it no longer tells the author of a deliberately disabled story to go and configure one.
