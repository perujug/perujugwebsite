// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://perujug.org',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  // Mapeo de URLs Jekyll legacy a las nuevas rutas Astro
  redirects: {
    '/2016/05/20/welcome-to-peruJUG.html': '/blog/welcome-to-perujug/',
    '/2018/06/30/java-day-2018.html': '/blog/java-day-2018/',
    '/javaday/2018/': '/eventos/javaday-2018/',
    '/javaday/2019/': '/eventos/javaday-2019/',
  },
});
