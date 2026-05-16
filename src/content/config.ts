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
    /**
     * Fecha de la ultima revision significativa del post (p. ej. cambios de
     * contenido tras feedback). Se setea solo cuando difiere materialmente
     * de `pubDate`; el JSON-LD `BlogPosting.dateModified` cae en `pubDate`
     * cuando este campo no esta presente.
     */
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
    /**
     * Direccion textual del lugar (calle, numero, ciudad). Slot opcional
     * pensado para eventos futuros donde se quiera mostrar la direccion
     * completa ademas del nombre del recinto. Los eventos historicos
     * migrados desde Jekyll no traen este dato.
     */
    mapAddress: z.string().optional(),
    status: z.enum(['past', 'upcoming']).default('past'),
    image: imageObject.optional(),
    speakers: z.array(speaker).default([]),
    agenda: z.array(agendaItem).default([]),
    /**
     * Patrocinadores anunciados. Slot opcional para eventos futuros y para
     * documentar sponsors historicos cuando se recuperen los datos. Los
     * Java Day 2018/2019 migrados desde Jekyll no listaban sponsors en el
     * front-matter original.
     */
    sponsors: z.array(sponsor).default([]),
    /**
     * URL externa de registro / ticketing. Slot exclusivo para eventos con
     * `status: upcoming`; los eventos pasados no lo necesitan.
     */
    registrationUrl: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  blog,
  eventos,
};
