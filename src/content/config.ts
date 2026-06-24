import { defineCollection, z } from 'astro:content';

// Photography metadata block — mandated by Phase 1.4 (Editorial Imagery
// Guidelines). Every image upload must carry these fields.
const imageMeta = z
  .object({
    photographer: z.string().optional(),
    location: z.string().optional(),
    date: z.coerce.date().optional(),
    program: z.string().optional(),
    consentStatus: z.enum(['obtained', 'not-required', 'pending']).optional(),
  })
  .optional();

// ---- PROJECTS (maps to "Our Work" programmes) ----
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    focusArea: z.enum([
      'Environmental Sustainability',
      'Social Development',
      'Climate Resilience',
      'Human Rights',
      'Research',
    ]),
    country: z.string().default('Bangladesh'),
    coverImage: z.string(),
    coverAlt: z.string(),
    imageMeta,
    startYear: z.number().optional(),
    status: z.enum(['active', 'completed', 'planned']).default('active'),
    // Modular programme template: Challenge -> Approach -> Evidence (Phase 5, 3.4)
    challenge: z.string().optional(),
    approach: z.string().optional(),
    metrics: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// ---- BLOG (Stay Informed -> Blog) ----
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('CHRSD Editorial Team'),
    category: z.string().default('Field Notes'),
    coverImage: z.string(),
    coverAlt: z.string(),
    imageMeta,
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// ---- NEWS (homepage "Latest Updates" cards) ----
const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    pubDate: z.coerce.date(),
    type: z.enum(['News', 'Press Release', 'Announcement']).default('News'),
    coverImage: z.string(),
    coverAlt: z.string(),
    imageMeta,
    externalUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog, news };
