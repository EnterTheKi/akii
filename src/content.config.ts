import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The kiaz logbook, one Markdown file per note. Bodies are the original kiaz prose,
// kept as raw HTML so the small ASCII headers and blockquotes survive.
const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
