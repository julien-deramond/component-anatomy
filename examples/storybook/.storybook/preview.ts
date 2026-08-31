import type { Preview } from '@storybook/html-vite';
import '../src/components.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      // Without an explicit order Storybook floats ungrouped entries above the
      // sections and otherwise follows load order. The edge cases are the last
      // thing a visitor needs, so they go last.
      storySort: { order: ['Docs', 'Components', 'Edge cases'] },
    },
  },
};

export default preview;
