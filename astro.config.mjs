// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import path from 'node:path';

// Mapeo de URLs Jekyll legacy a las nuevas rutas Astro.
//
// Astro materializa cada entrada como `dist/<from>/index.html`. Para los
// redirects de posts cuya URL canonica termina en `.html` SIN slash, la
// integracion `flattenLegacyHtmlRedirects` (abajo) aplana esa carpeta a un
// archivo plano `dist/<from>` post-build. Ver issue 1 y 3 del review v1.
//
// Esta es la UNICA fuente de verdad de los redirects legacy: la integracion
// deriva sus targets filtrando por `.html` para evitar el acoplamiento que
// exigia mantener dos listas sincronizadas (review v2, issue 1).
/** @type {Record<string, string>} */
const LEGACY_REDIRECTS = {
  '/2016/05/20/welcome-to-peruJUG.html': '/blog/welcome-to-perujug/',
  '/2018/06/30/java-day-2018.html': '/blog/java-day-2018/',
  '/javaday/2018/': '/eventos/javaday-2018/',
  '/javaday/2019/': '/eventos/javaday-2019/',
};

// Paths legacy `.html` cuyo casing original mezcla mayusculas y minusculas.
// Para cada uno, la integracion clona ademas una variante toLowerCase() del
// archivo emitido, tolerando backlinks que normalicen casing (GitHub Pages
// es case-sensitive).
const LOWERCASE_CLONE_PATHS = new Set([
  '/2016/05/20/welcome-to-peruJUG.html',
]);

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
 *     normalicen el casing.
 *
 * Targets derivados de `LEGACY_REDIRECTS` (review v2, issue 1): cualquier
 * redirect cuyo `from` termina en `.html` se procesa automaticamente; no
 * hay arrays paralelos que mantener sincronizados.
 */
function flattenLegacyHtmlRedirects() {
  /** @type {Array<{from: string; lowercase: boolean}>} */
  const targets = Object.keys(LEGACY_REDIRECTS)
    .filter((from) => from.endsWith('.html'))
    .map((from) => ({
      // Normalizar a path relativo (sin slash inicial) para `path.join`.
      from: from.replace(/^\//, ''),
      lowercase: LOWERCASE_CLONE_PATHS.has(from),
    }));

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
            const fromLower = from.toLowerCase();
            const lowerPath = path.join(distRoot, fromLower);
            // Solo escribir la variante en minusculas si no existe ya un
            // archivo distinto en esa ruta (review v2, issue 2). En el
            // estado actual no hay colision, pero el guard protege a
            // mantenedores futuros que agreguen redirects con casing
            // similar.
            try {
              await fs.access(lowerPath);
              logger.warn(
                `Clon lowercase omitido por colision existente: /${fromLower}`
              );
              continue;
            } catch {
              // No existe, podemos escribir el clon.
            }
            // Reescribir el body del meta-refresh para que el "Redirecting
            // from <code>...</code>" muestre la URL realmente solicitada
            // en la variante lowercase, no la original camelCase (review
            // v2, issue 3).
            const fromBasename = path.basename(from);
            const fromLowerBasename = path.basename(fromLower);
            const lowerHtml =
              fromBasename === fromLowerBasename
                ? html
                : html.replaceAll(fromBasename, fromLowerBasename);
            await fs.writeFile(lowerPath, lowerHtml, 'utf8');
            logger.info(`Clonado redirect (lowercase): /${fromLower}`);
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
  redirects: LEGACY_REDIRECTS,
});
