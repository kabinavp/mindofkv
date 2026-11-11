import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seriesLink = {
  series: reference('series').optional(),
  seriesOrder: z.number().optional(),
};

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    topics: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    palette: z.string().optional(),
    draft: z.boolean().default(false),
    ...seriesLink,
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/videos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    youtubeId: z.string().optional(), // e.g. "dQw4w9WgXcQ" — leave empty until published
    duration: z.string().optional(),
    topics: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    palette: z.string().optional(),
    draft: z.boolean().default(false),
    ...seriesLink,
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['ongoing', 'complete', 'planned']).default('ongoing'),
    palette: z.string().optional(), // moss | dune | glacier | ember | dusk | sea | stone | bloom
    order: z.number().default(0),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['live', 'building', 'idea', 'retired']),
    started: z.coerce.date(),
    url: z.string().url().optional(),
    stack: z.array(z.string()).default([]),
    metric: z.string().optional(), // e.g. "1,200"
    metricLabel: z.string().optional(), // e.g. "users"
    palette: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { articles, videos, series, products };
