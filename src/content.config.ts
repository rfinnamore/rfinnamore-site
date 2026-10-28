import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photos' }),
  schema: z.object({
    image: z.string(),
    caption: z.string().optional(),
    location: z.string().optional(),
    date: z.coerce.date(),
  }),
});

const media = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/media' }),
  schema: z.object({
    type: z.enum(['album', 'movie', 'book', 'podcast']),
    title: z.string(),
    creator: z.string().optional(),
    year: z.coerce.number().optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    status: z.enum(['finished', 'in-progress']).optional().default('finished'),
    cover: z.string().optional(),
    link: z.string().url().optional(),
    date: z.coerce.date().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    ready: z.boolean().optional().default(true),
  }),
});

const quotes = defineCollection({
  loader: file('./src/data/quotes.json', { parser: (text) => JSON.parse(text).map((q: any, i: number) => ({ id: String(i), ...q })) }),
  schema: z.object({ text: z.string(), by: z.string().optional() }),
});

export const collections = { notes, writing, photos, media, pages, quotes };
