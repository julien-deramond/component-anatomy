---
title: "Storybook addon"
description: "@component-anatomy/storybook — an \"Anatomy\" panel next to Controls and Actions, synced two-way with the story canvas."
---

[Open the live Storybook →](../../storybook/)

## Compatibility

Storybook **10 and 11**, any renderer (React, Vue, HTML, Web Components…). The canvas side is framework-agnostic — it only reads the rendered DOM.

The package is ESM-only, like Storybook itself. Storybook 9 is no longer supported — CSF Next registration needs `definePreviewAddon`, which Storybook only ships from 9.1 onwards.

## Installation

```sh
npm install --save-dev @component-anatomy/storybook
```

```ts
// .storybook/main.ts
export default {
  addons: ['@component-anatomy/storybook'],
};
```

That's the whole setup — the addon registers its panel and a global decorator automatically.

### With CSF Next

CSF Next is the default story format in Storybook 11. A `preview.ts` built with `definePreview` composes *only* the addons it lists, and Storybook drops the preview annotations `main.ts` would otherwise contribute — so the addon has to be registered there too, or the canvas decorator never mounts and the panel stays empty:

```ts
// .storybook/preview.ts
import { definePreview } from '@storybook/your-framework';
import componentAnatomy from '@component-anatomy/storybook';

export default definePreview({
  addons: [componentAnatomy()],
});
```

Registering in both places is correct and safe: the two paths are mutually exclusive, so the decorator is composed exactly once either way. A `preview.ts` that is still a plain object needs only the `main.ts` entry above. Registering in `preview.ts` also types `parameters.anatomy` across that preview's metas and stories.

## Usage

Annotate the story's DOM with `data-part` and add the `anatomy` parameter:

```ts
export const Anatomy: Story = {
  parameters: {
    anatomy: {
      parts: [
        { id: 'icon',  name: 'Icon',  description: 'Optional leading glyph.' },
        { id: 'label', name: 'Label', description: 'The visible action text.' },
        { id: 'badge', name: 'Badge', description: 'Numeric counter.' },
      ],
    },
  },
};
```

Hover a part in the panel → the canvas element is highlighted. Hover the element in the canvas → the panel entry activates. Omit `parts` entirely and the panel lists what it finds in the DOM.

## Parameters

| Key | Type | Description |
|---|---|---|
| `parts` | `AnatomyPartDefinition[]` | Part list. Omit to auto-discover from `data-part`. |
| `preset` | `string` | `default` | `minimal` | `contrast` | `blueprint`. |
| `theme` | `AnatomyTheme` | Token overrides for the overlays and the panel accent, e.g. `{ accent: "#0d9488" }`. |
| `overlayLabel` | `boolean` | Show the floating name chip. Default true. |
| `overlayPadding` | `number` | Inflate highlight boxes by N px. |
| `root` | `string` | CSS selector narrowing the anatomy root inside the canvas. |
| `disable` | `boolean` | Turn the addon off for a story. |

Parameters follow Storybook's normal inheritance: set project-wide defaults in `.storybook/preview.ts`, per-component defaults in `meta.parameters`, and per-story overrides in `story.parameters`. Typed as `AnatomyParameters`:

```ts
import type { AnatomyParameters } from '@component-anatomy/storybook';

export const Anatomy: Story = {
  parameters: {
    anatomy: { preset: 'blueprint', overlayPadding: 2 } satisfies AnatomyParameters,
  },
};
```

## In MDX docs pages

The same table renders inside an MDX page with the `<Anatomy>` block, so component anatomy can sit in the prose next to the preview rather than only in the panel. It needs `@storybook/addon-docs`, which is what renders MDX:

```mdx
import { Meta } from '@storybook/addon-docs/blocks';
import { Anatomy } from '@component-anatomy/storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Anatomy of={ButtonStories.Anatomy} />
```

`<Anatomy>` renders the canvas and the table together, tightened into one pairing, with the canvas's show-code button dropped by default. Hover sync works both ways, exactly as it does in the panel. Point `of` at a story to read its `parameters.anatomy`, at a whole CSF module to read the meta's, or omit it on an attached docs page to fall back to the page's current story.

| Prop | Type | Description |
|---|---|---|
| `of` | `CSF export` | Story or meta to document. Omit on an attached page for the current story. |
| `parts` | `AnatomyPartDefinition[]` | Curated list, overriding the parameter and auto-discovery. |
| `sync` | `boolean` | Two-way hover sync with the canvas. Default true. |
| `sourceState` | `'hidden' \| 'shown' \| 'none'` | Passed to the internal `<Canvas>`. Default `'none'` — set it to keep the show-code button. |

For a hand-placed canvas — a custom layout, or one that keeps its source panel some other way — use `<AnatomyTable>` next to your own `<Canvas>` instead. It takes the same `of`, `parts` and `sync` props, minus `sourceState`, which is `<Canvas>`'s concern:

```mdx
import { Canvas, Meta } from '@storybook/addon-docs/blocks';
import { AnatomyTable } from '@component-anatomy/storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Canvas of={ButtonStories.Anatomy} />
<AnatomyTable of={ButtonStories.Anatomy} />
```

Auto-discovery reads the story as it renders, so a block relying on it needs a canvas on the same page — `<Anatomy>` brings its own, `<AnatomyTable>` needs a `<Canvas>` or `<Story>` block next to it. A block with an explicit `parts` list stands on its own. Several blocks can share one page: each talks only to the story it names.

## Live examples

The [deployed Storybook](../../storybook/) shows Button (default + blueprint theme), Slider (accent theme) and Tabs (auto-discovery, high-contrast preset, and that preset combined with a brand accent), plus an *Edge cases* group covering the states where there is nothing to show — no parts, disabled, unconfigured — and two MDX pages, *Docs → Anatomy in MDX* and the Button docs page, using the `<Anatomy>` block. Sources live in `examples/storybook` in the repo.
