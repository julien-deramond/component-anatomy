import { readFileSync } from 'node:fs';

import deramond from '@deramond.dev/astro/integration';
import { defineConfig } from 'astro/config';

import { sidebar } from './src/sidebar.mjs';

// In CI these are set by the workflow; locally they're undefined and Astro
// falls back to no site/base, so `localhost:4321` works without any prefix.
const site = process.env.SITE_URL;    // e.g. https://julien-deramond.github.io
const base = process.env.BASE_PATH;   // e.g. /component-anatomy
const root = (base ?? '').replace(/\/$/, '');

// The version pill in the docs top bar follows the core package, which changesets bumps.
const { version } = JSON.parse(
  readFileSync(new URL('../../packages/core/package.json', import.meta.url), 'utf8'),
);

export default defineConfig({
  site,
  base,
  server: { port: 4321 },
  // Astro 7 defaults to compressHTML: 'jsx', which applies React's whitespace
  // rules and *drops* the line break between text and a following inline
  // element instead of collapsing it to a space — so prose wrapped before an
  // <a>/<code> renders as "Full guide inRendering customization". 'true' is
  // still lossless whitespace compression and keeps that space.
  compressHTML: true,
  // There is no docs home page: /docs/ opens the first one.
  redirects: { '/docs': `${root}/docs/core/` },
  integrations: [
    deramond({
      site: {
        name: 'Component Anatomy',
        description: 'Interactive anatomy documentation for design system components.',
      },
      brand: { mark: './src/brand/mark.svg', favicons: './src/brand/favicons/' },
      og: { art: './src/brand/og-art.png' },
      docs: {
        tool: { version: `v${version}` },
        tabs: [
          { label: 'Docs', href: `${root}/docs/` },
          { label: 'Storybook', href: `${root}/storybook/` },
        ],
        sidebar,
        edit: { repo: 'julien-deramond/component-anatomy', dir: 'examples/astro' },
      },
    }),
  ],
});
