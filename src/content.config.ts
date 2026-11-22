import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * A series groups posts that tell one longer story in smaller, scoped parts
 * (e.g. building a NAS: hardware, backups, Secure Boot…). Posts opt in with `series`.
 */
const series = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/series' }),
  schema: z.object({
    title: z.string().max(80),
    description: z.string().max(200),
    /** `ongoing` while parts are still being written. */
    status: z.enum(['ongoing', 'complete']).default('ongoing'),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().max(110),
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Set when the post was first published elsewhere, so search engines credit the original. */
    canonical: z.url().optional(),
    /** Part of a series: `id` is a file name in src/content/series, `part` orders the posts (1-based). */
    series: z
      .object({
        id: reference('series'),
        part: z.number().int().positive(),
      })
      .optional(),
    /** Set when the post is the written version of a conference talk. */
    talk: z
      .object({
        event: z.string(),
        date: z.coerce.date(),
        url: z.url().optional(),
        slides: z.url().optional(),
        video: z.url().optional(),
      })
      .optional(),
  }),
});

export const collections = { posts, series };
