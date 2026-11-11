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

const books = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    isbn: z.string().optional(), // ISBN-13 or ISBN-10: used for the cover and the Amazon link
    cover: z.string().optional(), // optional local image, e.g. /books/the-mom-test.jpg (overrides the ISBN cover)
    finished: z.coerce.date(),
    rating: z.number().min(1).max(5).optional(),
    link: z.string().url().optional(), // any other store link; overrides the Amazon link
    topics: z.array(z.string()).default([]),
    favourite: z.boolean().default(false),
  }),
});

export const collections = { articles, videos, series, products, books };
