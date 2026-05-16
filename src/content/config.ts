import { defineCollection, z } from 'astro:content';

/**
 * Schemas Zod para las content collections del sitio PeruJUG.
 *
 * - `blog`: posts del blog migrados desde Jekyll y futuras publicaciones.
 * - `eventos`: eventos historicos y proximos (Java Day, meetups, JConf).
 */

const imageObject = z.object({
  src: z.string(),
  alt: z.string(),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: imageObject.optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    author: z.string().default('PeruJUG'),
  }),
});

const speaker = z.object({
  name: z.string(),
  role: z.string(),
  country: z.string(),
  photo: z.string(),
});

const agendaItem = z.object({
  time: z.string(),
  title: z.string(),
  speaker: z.string().optional(),
});

const sponsor = z.object({
  name: z.string(),
  logo: z.string().optional(),
  url: z.string().optional(),
});

const eventos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    mapAddress: z.string().optional(),
    status: z.enum(['past', 'upcoming']).default('past'),
    image: imageObject.optional(),
    speakers: z.array(speaker).default([]),
    agenda: z.array(agendaItem).default([]),
    sponsors: z.array(sponsor).default([]),
    registrationUrl: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  blog,
  eventos,
};
