import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // Load Markdown files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // Optional hero image; we don't require it for every post.
      heroImage: z.any().optional(),
    }),
});

export const collections = { blog };

