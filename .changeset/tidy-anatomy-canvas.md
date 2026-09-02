---
'@component-anatomy/storybook': minor
---

Add `<Anatomy>`, a doc block that pairs the canvas with its table and tightens the gap between them ([#13](https://github.com/julien-deramond/component-anatomy/issues/13#issuecomment-5475936860)).

Until now, `<Anatomy>` rendered the table alone, and every MDX example paired it by hand with a `<Canvas of={…} />` above it — each carrying its own show-code button and Storybook's default ~40px canvas margin, both mostly noise for an anatomy example. `<Anatomy>` now renders the canvas and the table together, drops the canvas's show-code button by default (`sourceState="none"`, overridable), and tightens the canvas's bottom margin — no `preview-head.html` setup required, the block injects its own scoped rule.

The table-only block is still available, renamed to `<AnatomyTable>`, for a hand-placed `<Canvas>` — a custom layout, or one that keeps its source panel:

```mdx
import { Anatomy } from '@component-anatomy/storybook/blocks';

<Anatomy of={ButtonStories.Anatomy} />
```

```mdx
import { Canvas } from '@storybook/addon-docs/blocks';
import { AnatomyTable } from '@component-anatomy/storybook/blocks';

<Canvas of={ButtonStories.Anatomy} />
<AnatomyTable of={ButtonStories.Anatomy} />
```

This is a breaking rename for anyone already importing `<Anatomy>` for the table-only behavior — switch that usage to `<AnatomyTable>`.
