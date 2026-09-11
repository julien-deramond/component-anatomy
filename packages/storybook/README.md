# @component-anatomy/storybook

Storybook addon that adds an **Anatomy** panel — an interactive part list synced two-way with the story canvas.

- Hover a part in the panel → the element is highlighted in the canvas
- Hover a `data-part` element in the canvas → the panel entry activates
- Works with **Storybook 10 and 11**, any renderer (React, Vue, HTML, Web Components…)

## Install

```bash
npm install --save-dev @component-anatomy/storybook
```

Register the addon in `.storybook/main.ts`:

```ts
// .storybook/main.ts
export default {
  addons: ['@component-anatomy/storybook'],
};
```

If your project uses [CSF Next](https://storybook.js.org/docs/api/csf/csf-next) (the default in Storybook 11), also register the addon's preview annotations in `.storybook/preview.ts`:

```ts
// .storybook/preview.ts

// Replace your-framework with the framework you are using (e.g., react-vite, nextjs-vite)
import { definePreview } from '@storybook/your-framework';

import componentAnatomy from '@component-anatomy/storybook';

export default definePreview({
  // ...rest of preview
  addons: [componentAnatomy()], // 👈 register the addon here
});
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

## Example

A complete Storybook 11 setup with Button/Slider/Tabs stories lives in [`examples/storybook`](https://github.com/julien-deramond/component-anatomy/tree/main/examples/storybook), deployed at https://julien-deramond.github.io/component-anatomy/storybook/.

## Docs

Full documentation: https://julien-deramond.github.io/component-anatomy/docs/storybook

## License

MIT
