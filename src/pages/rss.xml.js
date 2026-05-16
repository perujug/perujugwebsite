import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

/**
 * Endpoint RSS del blog PeruJUG.
 *
 * Lista los posts publicados (sin `draft: true`) ordenados por `pubDate`
 * descendente. Se sirve en `/rss.xml` y queda referenciado desde el
 * `<link rel="alternate" type="application/rss+xml">` del BaseLayout.
 */
export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'PeruJUG Blog',
    description: 'Novedades de la comunidad Peru Java User Group',
    site: context.site ?? 'https://perujug.org',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags ?? [],
    })),
    customData: '<language>es-PE</language>',
  });
}
