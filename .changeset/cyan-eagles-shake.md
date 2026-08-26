---
'@component-anatomy/storybook': minor
---

Add an `<Anatomy>` doc block so the anatomy table can be rendered in MDX, alongside the preview ([#13](https://github.com/julien-deramond/component-anatomy/issues/13)).

```mdx
import { Canvas, Meta } from '@storybook/addon-docs/blocks';
import { Anatomy } from '@component-anatomy/storybook/blocks';

import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Canvas of={ButtonStories.Anatomy} />
<Anatomy of={ButtonStories.Anatomy} />
```

`of` accepts a CSF story export (reads its `parameters.anatomy`) or a whole CSF module (reads the meta's). On an attached docs page it can be omitted, falling back to the page's current story. Two-way hover sync with the canvas works exactly as it does in the panel, and auto-discovery works too when the story is rendered on the page. `parts` overrides the resolved list; `sync={false}` renders a static table.

`@storybook/addon-docs` and `react` are optional peer dependencies — only `@component-anatomy/storybook/blocks` needs them, and the addon panel is unaffected.

Alongside this:

- Channel events now carry the `storyId` they concern, and every listener filters on it. A docs page mounts several stories at once, so without addressing, hovering a part in one block highlighted the matching part in every other story on the page. A missing id on either side still matches, so mixed builds interoperate.
- The table resolves its chrome colors and fonts from Storybook's theme instead of hardcoded light-theme values, so it reads correctly in a dark docs page. The accent color is unchanged.
