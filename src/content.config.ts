import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/features/blog/content',
  }),
  schema: ({}) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      readingTimeMinutes: z.number().optional(), // Added by remark plugin
      isDraft: z.boolean().default(false),
      lang: z.string().optional().default('en'),
    }),
});

const tipsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/features/tips/content',
  }),
  schema: ({}) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      isDraft: z.boolean().default(false),
      lang: z.string().optional().default('en'),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    }),
});

export const collections = {
  blog: blogCollection,
  tips: tipsCollection,
};
