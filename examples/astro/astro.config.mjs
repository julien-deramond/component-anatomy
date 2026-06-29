import { defineConfig } from 'astro/config';

// In CI these are set by the workflow; locally they're undefined and Astro
// falls back to no site/base, so `localhost:4321` works without any prefix.
const site = process.env.SITE_URL;    // e.g. https://julienderamond.github.io
const base = process.env.BASE_PATH;   // e.g. /component-anatomy

export default defineConfig({
  site,
  base,
  server: { port: 4321 },
});
