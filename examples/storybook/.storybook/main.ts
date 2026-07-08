import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|js)'],
  addons: ['@component-anatomy/storybook'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
};

export default config;
