// The site navigation: the docs sidebar (astro.config.mjs) and the demo pages (src/layouts/Demo.astro) share it.
// Strings are docs entries (src/content/docs/<id>.md); demo pages and links are hrefs under the site's base.
const base = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

export const GITHUB = 'https://github.com/julien-deramond/component-anatomy';
export const NPM = 'https://www.npmjs.com/package/@component-anatomy/core';

const page = (label, path) => ({ label, href: `${base}/${path}/` });

export const sidebar = [
  { label: 'Documentation', items: ['core', 'customization', 'astro', 'storybook', 'faq'] },
  {
    label: 'Demos',
    items: [page('Button', 'button'), page('Slider', 'slider'), page('Theming', 'theming'), page('Shadcn-style', 'shadcn')],
  },
  {
    label: 'Bootstrap via CDN',
    items: [
      page('Button', 'bs-button'),
      page('Alert', 'bs-alert'),
      page('Card', 'bs-card'),
      page('Badge', 'bs-badge'),
      page('Navbar', 'bs-navbar'),
    ],
  },
  {
    label: 'Links',
    items: [
      page('Live Storybook ↗', 'storybook'),
      { label: 'GitHub ↗', href: GITHUB },
      { label: 'npm ↗', href: NPM },
    ],
  },
];
