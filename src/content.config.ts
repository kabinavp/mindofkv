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
    order: z.number(), // position on the shelf (1 = top)
    status: z.enum(['reading', 'read', 'next']).default('read'), // next = in the pipeline
    isbn: z.string().optional(), // optional: pins the exact edition for the cover and Amazon link
    cover: z.string().optional(), // optional local image, e.g. /books/martyr.jpg (overrides everything)
    year: z.number().optional(), // year first published
    finished: z.coerce.date().optional(),
    rating: z.number().min(1).max(5).optional(),
    link: z.string().url().optional(), // any other store link; overrides the Amazon link
    myTake: z.boolean().default(false), // false = the text below is a short description; true = it's my review
    favourite: z.boolean().default(false),
  }),
});

const models = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/models' }),
  schema: z.object({
    title: z.string(),
    oneliner: z.string(), // the model in one sentence
    seoTitle: z.string().optional(), // what people search for, e.g. "How to Run a Pre-mortem"
    seoDescription: z.string().optional(),
    updated: z.coerce.date().optional(),
    essays: z.array(z.string()).default([]), // Substack post slugs or local article ids
    books: z.array(z.string()).default([]), // book ids
    videos: z.array(z.string()).default([]), // video ids
    related: z.array(z.string()).default([]), // other model ids
    order: z.number().default(0),
  }),
});

// Weekly issues ("Stay Curious"), published every Sunday. One file per issue: src/content/weekly/001.md
const weekly = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/weekly' }),
  schema: z.object({
    number: z.number(),
    date: z.coerce.date(),
    subject: z.string(), // e.g. "Solve for failure first"
    model: z.string().optional(), // model id featured as "One idea"
    book: z.string().optional(), // book id featured as "One book"
    draft: z.boolean().default(false),
  }),
});

// Opinions: short, clear stands on things. One file each: src/content/opinions/<id>.md
const opinions = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/opinions' }),
  schema: z.object({
    stance: z.string(), // the opinion in one sentence
    topic: z.string(), // e.g. Product, Leadership, Career, Teams
    since: z.coerce.date(), // when I started holding it
    strength: z.enum(['strong', 'leaning', 'exploring']).default('strong'),
    model: z.string().optional(), // related model id
    order: z.number().default(0),
  }),
});

export const collections = { articles, videos, series, products, books, models, weekly, opinions };
