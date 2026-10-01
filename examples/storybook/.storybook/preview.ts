import type { Preview } from '@storybook/web-components-vite';
import '../src/components.css';

/*
 * A plain `Preview` object rather than CSF Next's `definePreview({ addons })`,
 * on purpose: with a classic preview, Storybook composes the addon's
 * annotations from the `addons` list in `main.ts`, which is what registers the
 * anatomy decorator here — the path most projects take.
 *
 * A CSF Next consumer registers it in `preview.ts` instead:
 *
 *   import { definePreview } from '@storybook/react-vite';
 *   import componentAnatomy from '@component-anatomy/storybook';
 *
 *   export default definePreview({ addons: [componentAnatomy()] });
 *
 * — which is what `@component-anatomy/storybook`'s default export exists for.
 * `packages/storybook/test/consumer-csf-next-types.ts` covers that shape.
 */

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      // Without an explicit order Storybook floats ungrouped entries above the
      // sections and otherwise follows load order. The edge cases are the last
      // thing a visitor needs, so they go last.
      storySort: { order: ['Docs', 'Components', 'Web Components', ['Vanilla', 'Lit', 'Shoelace', 'Ionic (Stencil)'], 'Edge cases'] },
    },
  },
};

export default preview;
