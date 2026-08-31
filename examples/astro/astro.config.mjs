import { defineConfig } from 'astro/config';

// In CI these are set by the workflow; locally they're undefined and Astro
// falls back to no site/base, so `localhost:4321` works without any prefix.
const site = process.env.SITE_URL;    // e.g. https://julien-deramond.github.io
const base = process.env.BASE_PATH;   // e.g. /component-anatomy

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
});
