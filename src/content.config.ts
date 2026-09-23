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
    tags: z.array(z.string()).default([]),
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

    // Felter herunder bruges kun af forsiden. De oevrige sider har titel,
    // beskrivelse og broedtekst, og lader resten staa tomt.
    /** Lille linje over overskriften. Fx din rolle. */
    eyebrow: z.string().optional(),
    heroTitle: z.string().optional(),
    heroLead: z.string().optional(),
    heroText: z.string().optional(),
    ctaLabel: z.string().optional(),
    /** Tom eller udeladt betyder at maerket i headeren ikke vises. */
    availability: z.string().optional(),
    portrait: z.string().optional(),
    portraitAlt: z.string().optional(),
    /** Tre korte linjer om hvad du loeser for kunden. */
    services: z
      .array(z.object({ title: z.string(), text: z.string().optional() }))
      .default([]),
    workLead: z.string().optional(),
    aboutLead: z.string().optional(),
    aboutText: z.array(z.string()).default([]),
    quote: z.string().optional(),
    contactHeading: z.string().optional(),
    contactText: z.string().optional(),
  }),
});

export const collections = { cases, blog, pages };
