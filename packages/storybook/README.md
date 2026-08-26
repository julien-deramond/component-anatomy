# @component-anatomy/storybook

Storybook addon that adds an **Anatomy** panel — an interactive part list synced two-way with the story canvas.

- Hover a part in the panel → the element is highlighted in the canvas
- Hover a `data-part` element in the canvas → the panel entry activates
- The same table renders **inside MDX** via `@component-anatomy/storybook/blocks`
- Works with **Storybook 9 and 10**, any renderer (React, Vue, HTML, Web Components…)

## Install

```bash
npm install --save-dev @component-anatomy/storybook
```

```ts
// .storybook/main.ts
export default {
  addons: ['@component-anatomy/storybook'],
};
```

## Use

Annotate your story's DOM with `data-part` and add the `anatomy` parameter:

```ts
import type { AnatomyParameters } from '@component-anatomy/storybook';

export const Anatomy: Story = {
  parameters: {
    anatomy: {
      parts: [
        { id: 'icon',  name: 'Icon',  description: 'Optional leading glyph.' },
        { id: 'label', name: 'Label', description: 'The visible action text.' },
      ],
      // optional:
      preset: 'blueprint',            // 'default' | 'minimal' | 'contrast' | 'blueprint'
      theme: { accent: '#0d9488' },   // theme tokens for the canvas overlays
      overlayLabel: true,             // floating name chip
      overlayPadding: 2,              // inflate highlight boxes (px)
      root: '.my-component',          // narrow the anatomy root (CSS selector)
      disable: false,                 // turn off for a story
    } satisfies AnatomyParameters,
  },
};
```

Omit `parts` (pass `{}`) and the panel lists parts auto-discovered from `data-part` attributes, with names derived from the ids.

Parameters follow Storybook's normal inheritance — project-wide defaults in `.storybook/preview.ts`, per-component in `meta.parameters`, per-story overrides in `story.parameters`.

## In MDX

The panel's table also renders inline in a docs page, so anatomy can sit in the
prose next to the preview. Requires `@storybook/addon-docs` (the addon that
renders MDX), which stays an optional peer dependency — the panel above works
without it.

```mdx
import { Canvas, Meta } from '@storybook/addon-docs/blocks';
import { Anatomy } from '@component-anatomy/storybook/blocks';

import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Canvas of={ButtonStories.Anatomy} />
<Anatomy of={ButtonStories.Anatomy} />
```

Hover sync works both ways, exactly as in the panel.

| Prop | Type | Description |
|---|---|---|
| `of` | CSF export | The story to document, or a whole CSF module to read the meta's parameters. Omit on an attached docs page (one with `<Meta of={…} />`) to fall back to the page's current story. |
| `parts` | `AnatomyPartDefinition[]` | Curated list, overriding both `parameters.anatomy.parts` and auto-discovery. |
| `sync` | `boolean` | Two-way hover sync with the rendered story. Default `true`. `false` gives a purely static table. |

Two things worth knowing:

- **Auto-discovery needs the story on the page.** Parts are read from the story's
  `data-part` attributes as it renders, so a block that relies on discovery needs
  a `<Canvas of={…} />` (or `<Story of={…} />`) on the same page. A block with an
  explicit `parts` list stands on its own.
- **A meta has no canvas.** `of={ButtonStories}` reads `meta.parameters.anatomy`,
  but there is nothing to discover parts from or to sync hover with — give it
  `parts` explicitly.

Several blocks can share one page; each talks only to the story it names.

## Example

A complete Storybook 10 setup with Button/Slider/Tabs stories — and two MDX
pages using the `<Anatomy>` block — lives in [`examples/storybook`](https://github.com/julien-deramond/component-anatomy/tree/main/examples/storybook), deployed at https://julien-deramond.github.io/component-anatomy/storybook/.

## Docs

Full documentation: https://julien-deramond.github.io/component-anatomy/docs/storybook

## License

MIT
