import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    year: z.number().optional(),
    order: z.number().default(0),
    services: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    url: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroTitle: z.string().optional(),
    heroText: z.string().optional(),
    heroCtaLabel: z.string().optional(),
    heroCtaUrl: z.string().optional(),
    services: z
      .array(
        z.object({
          title: z.string(),
          text: z.string().optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { cases, blog, pages };
