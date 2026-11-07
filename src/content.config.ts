// Content collections (spec.md §3). Path: src/content/<collection>/<lang>/<slug>.md(x);
// entry id = '<lang>/<slug>', translations share the slug.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lang = z.enum(['tr', 'en']);

const blog = defineCollection({
  loader: glob({ pattern: '{tr,en}/**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160).optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    lang,
    tags: z.array(z.string()).default([]),
    canonicalUrl: z.url().optional(),
    mirrors: z.array(z.url()).optional(),
    translationStatus: z.enum(['needed', 'partial', 'done']),
    translatedFrom: lang.optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '{tr,en}/**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    lang,
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    role: z.string().optional(),
    status: z.enum(['active', 'done', 'archived']),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

const entry = z.object({
  title: z.string(),
  org: z.string().optional(),
  period: z.string().optional(),
  description: z.string().optional(),
  url: z.url().optional(),
});

const resume = defineCollection({
  loader: glob({ pattern: '{tr,en}.json', base: './src/content/resume' }),
  schema: z.object({
    summary: z.string(),
    experience: z.array(entry),
    robotics: z.array(entry),
    writing: z.array(entry),
    skills: z.array(z.string()),
    links: z.array(z.object({ label: z.string(), url: z.url() })),
  }),
});

export const collections = { blog, projects, resume };
