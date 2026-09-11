import { defineMain } from '@storybook/html-vite/node';

export default defineMain({
  stories: ['../src/**/*.stories.@(ts|js)'],
  addons: ['@component-anatomy/storybook', '@storybook/addon-mcp'],
  framework: '@storybook/html-vite',
});
