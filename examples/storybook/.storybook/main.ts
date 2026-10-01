import { defineMain } from '@storybook/web-components-vite/node';

export default defineMain({
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|js)'],
  addons: [
    // `@storybook/addon-docs` is what renders MDX pages — it is what the
    // `<Anatomy>` doc block needs to resolve `of={...}`.
    '@storybook/addon-docs',
    '@component-anatomy/storybook',
    {
      name: '@deramond.dev/storybook',
      options: { brand: { title: 'component-anatomy', url: 'https://julien-deramond.github.io/component-anatomy/' } },
    },
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
});
