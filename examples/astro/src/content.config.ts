import { docsLoader, docsSchema } from '@deramond.dev/astro/docs';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

/**
 * The docs: one Markdown file per page under src/content/docs, rendered by the docs route
 * `@deramond.dev/astro` adds at /docs/<file name>/. The sidebar is src/sidebar.mjs. Every page
 * has a description, used as its lead and meta description.
 */
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: z.object({ description: z.string() }) }),
  }),
};
