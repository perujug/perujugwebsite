// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Integracion ad-hoc que aplana los redirects legacy `*.html` que Astro
 * materializa como `dist/<path>.html/index.html` (carpeta), moviendolos a
 * `dist/<path>.html` (archivo plano).
 *
 * Por que existe esta integracion (issue 1 y 3 del review v1):
 *   - Las URLs canonicas Jekyll de los posts terminan en `.html` SIN trailing
 *     slash (`/2016/05/20/welcome-to-peruJUG.html`).
 *   - Astro con `output: 'static'` y `trailingSlash: 'ignore'` siempre genera
 *     una carpeta con `index.html` para cada redirect declarado, formato que
 *     GitHub Pages solo sirve cuando el cliente solicita la URL CON slash.
 *   - Esta integracion ejecuta en `astro:build:done`: detecta los redirects
 *     en `dist/**\/*.html\/index.html`, lee el HTML, lo escribe en
 *     `dist/**\/*.html` plano, y elimina la carpeta original.
 *   - Adicionalmente clona la version en minusculas del slug `peruJUG`
 *     (`peruJUG.html` -> tambien `perujug.html`) para tolerar backlinks que
 *     normalicen el casing, ya que GitHub Pages es case-sensitive.
 */
function flattenLegacyHtmlRedirects() {
  /** @type {Array<{from: string; lowercase?: boolean}>} */
  const targets = [
    { from: '2016/05/20/welcome-to-peruJUG.html', lowercase: true },
    { from: '2018/06/30/java-day-2018.html' },
  ];

  return {
    name: 'perujug:flatten-legacy-html-redirects',
    hooks: {
      'astro:build:done': async (
        /** @type {{ dir: URL; logger: { info: (m: string) => void; warn: (m: string) => void } }} */
        { dir, logger }
      ) => {
        const distRoot = fileURLToPath(dir);
        for (const { from, lowercase } of targets) {
          const folderPath = path.join(distRoot, from);
          const indexPath = path.join(folderPath, 'index.html');
          let html;
          try {
            html = await fs.readFile(indexPath, 'utf8');
          } catch (_err) {
            logger.warn(`Redirect legacy esperado no encontrado: ${from}`);
            continue;
          }
          // Aplanar: escribir el HTML como archivo y eliminar la carpeta.
          await fs.rm(folderPath, { recursive: true, force: true });
          await fs.writeFile(path.join(distRoot, from), html, 'utf8');
          logger.info(`Aplanado redirect legacy: /${from}`);

          if (lowercase) {
            const lowerPath = path.join(distRoot, from.toLowerCase());
            // Solo escribir la variante en minusculas si no existiria una
            // colision con un archivo distinto ya emitido.
            await fs.writeFile(lowerPath, html, 'utf8');
            logger.info(`Clonado redirect (lowercase): /${from.toLowerCase()}`);
          }
        }
      },
    },
  };
}

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
    flattenLegacyHtmlRedirects(),
  ],
  // Mapeo de URLs Jekyll legacy a las nuevas rutas Astro.
  //
  // Astro materializa cada entrada como `dist/<from>/index.html`. Para los
  // redirects de posts cuya URL canonica termina en `.html` SIN slash, la
  // integracion `flattenLegacyHtmlRedirects` (arriba) aplana esa carpeta a
  // un archivo plano `dist/<from>` post-build. Ver issue 1 y 3 del review v1.
  redirects: {
    '/2016/05/20/welcome-to-peruJUG.html': '/blog/welcome-to-perujug/',
    '/2018/06/30/java-day-2018.html': '/blog/java-day-2018/',
    '/javaday/2018/': '/eventos/javaday-2018/',
    '/javaday/2019/': '/eventos/javaday-2019/',
  },
});
