# @component-anatomy/storybook

Storybook addon that adds an **Anatomy** panel — an interactive part list synced two-way with the story canvas.

- Hover a part in the panel → the element is highlighted in the canvas
- Hover a `data-part` element in the canvas → the panel entry activates
- The same table renders **inside MDX** via `@component-anatomy/storybook/blocks`
- Works with **Storybook 10 and 11**, any renderer (React, Vue, HTML, Web Components…)

## Install

```bash
npm install --save-dev @component-anatomy/storybook
```

Register the addon in `.storybook/main.ts`. This is what loads the **Anatomy**
panel into the Storybook manager:

```ts
// .storybook/main.ts
export default {
  addons: ['@component-anatomy/storybook'],
};
```

### If your `preview.ts` uses CSF Next

CSF Next is the default story format in Storybook 11. A `preview.ts` built with
`definePreview` composes **only** the addons it lists, and Storybook drops the
preview annotations that `main.ts` would otherwise contribute — so the addon
also has to be registered there, or the canvas decorator never mounts and the
panel stays empty:

```ts
// .storybook/preview.ts

// Replace your-framework with the framework you are using (e.g. react-vite, nextjs-vite)
import { definePreview } from '@storybook/your-framework';
import componentAnatomy from '@component-anatomy/storybook';

export default definePreview({
  // ...rest of preview
  addons: [componentAnatomy()], // 👈 register the addon here
});
```

Registering in both places is correct and safe: the two paths are mutually
exclusive, so the decorator is composed exactly once either way. A `preview.ts`
that is still a plain object needs only the `main.ts` entry above.

Doing so also types `parameters.anatomy` across that preview's metas and
stories, so the shape below is checked for you.

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

`preset` and `theme` reach the panel and the `<Anatomy>` block too, not just the canvas overlays: the active row is accented with the same color the overlay paints. Where that color would be illegible on Storybook's own panel — `contrast` is black, the manager is dark by default — the table falls back to the most colorful alternative that meets WCAG AA, so `contrast` accents with its yellow on a dark panel and with black on a light one.

Parameters follow Storybook's normal inheritance — project-wide defaults in `.storybook/preview.ts`, per-component in `meta.parameters`, per-story overrides in `story.parameters`.

## In MDX

The panel's table also renders inline in a docs page, so anatomy can sit in the
prose next to the preview. Requires `@storybook/addon-docs` (the addon that
renders MDX), which stays an optional peer dependency — the panel above works
without it.

```mdx
import { Meta } from '@storybook/addon-docs/blocks';
import { Anatomy } from '@component-anatomy/storybook/blocks';

import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Anatomy of={ButtonStories.Anatomy} />
```

`<Anatomy>` renders the canvas and the table together, tightened into one
pairing, with the canvas's show-code button dropped by default (chrome that
mostly restates what the table already documents). Hover sync works both ways,
exactly as in the panel.

| Prop | Type | Description |
|---|---|---|
| `of` | CSF export | The story to document, or a whole CSF module to read the meta's parameters. Omit on an attached docs page (one with `<Meta of={…} />`) to fall back to the page's current story. |
| `parts` | `AnatomyPartDefinition[]` | Curated list, overriding both `parameters.anatomy.parts` and auto-discovery. |
| `sync` | `boolean` | Two-way hover sync with the rendered story. Default `true`. `false` gives a purely static table. |
| `sourceState` | `'hidden' \| 'shown' \| 'none'` | Passed to the underlying `<Canvas>`. Default `'none'` — set it to keep the show-code button. |

For a hand-placed canvas — a custom layout, or one that keeps its source panel
some other way — use `<AnatomyTable>` next to your own `<Canvas>` instead. It
takes the same `of`, `parts` and `sync` props, minus `sourceState`, which is
`<Canvas>`'s concern:

```mdx
import { Canvas, Meta } from '@storybook/addon-docs/blocks';
import { AnatomyTable } from '@component-anatomy/storybook/blocks';

import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Canvas of={ButtonStories.Anatomy} />
<AnatomyTable of={ButtonStories.Anatomy} />
```

Two things worth knowing, for either block:

- **Auto-discovery needs the story's canvas on the page.** Parts are read from
  the story's `data-part` attributes as it renders, so a block that relies on
  discovery needs a canvas on the same page — `<Anatomy>` brings its own,
  `<AnatomyTable>` needs a `<Canvas of={…} />` (or `<Story of={…} />`) next to
  it. A block with an explicit `parts` list stands on its own.
- **A meta has no canvas.** `of={ButtonStories}` reads `meta.parameters.anatomy`,
  but there is nothing to discover parts from or to sync hover with — give it
  `parts` explicitly, and use `<AnatomyTable>` rather than `<Anatomy>` since
  there is no story to draw a canvas from.

Several blocks can share one page; each talks only to the story it names.

## Compatibility

| | |
|---|---|
| `storybook` | `^10.0.0 \|\| ^11.0.0-0` |
| `@storybook/addon-docs` | `^10.0.0 \|\| ^11.0.0-0` (optional — only for the MDX blocks) |
| `react` | `>=18` (optional — only for the MDX blocks) |
| Node | `>=22.12.0` |

The package is ESM-only, like Storybook itself since 9. Storybook 9 is no
longer supported: CSF Next registration needs `definePreviewAddon`, which
Storybook only ships from 9.1 onwards, and the addon is built and tested
against 10 and 11.

## Example

A complete Storybook 11 setup with Button/Slider/Tabs stories — and two MDX
pages using the `<Anatomy>` block — lives in [`examples/storybook`](https://github.com/julien-deramond/component-anatomy/tree/main/examples/storybook), deployed at https://julien-deramond.github.io/component-anatomy/storybook/.

## Docs

Full documentation: https://julien-deramond.github.io/component-anatomy/docs/storybook

## License

MIT
