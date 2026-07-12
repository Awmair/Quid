import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const resources = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    author: z.string().default('Quid'),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    order: z.number(),
  }),
});

export const collections = { resources };
