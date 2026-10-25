import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const articoli = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/articoli' }), schema: z.object({
 section: z.enum(['articolo','domande','progetto']).default('articolo'), parent: z.string().optional(), title: z.string(), description: z.string(), category: z.enum(['guide','soluzioni','test','recensioni']), date: z.coerce.date(), draft: z.boolean().default(true), tags: z.array(z.string()).default([]), image: z.string().optional(), imageAlt: z.string().optional(), imageCaption: z.string().optional(), youtube: z.object({ id: z.string().regex(/^[A-Za-z0-9_-]{11}$/), title: z.string() }).optional()
}) });
export const collections = { articoli };
