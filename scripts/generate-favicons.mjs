#!/usr/bin/env node
/**
 * Genera el set completo de favicons + apple-touch-icon a partir de
 * `public/images/logo.png`.
 *
 * Salida en `public/`:
 *   - favicon-16.png        (16x16)
 *   - favicon-32.png        (32x32)
 *   - favicon-192.png       (192x192, usado por el manifest PWA)
 *   - favicon-512.png       (512x512, usado por el manifest PWA)
 *   - apple-touch-icon.png  (180x180)
 *   - favicon.ico           (multi-tamano 16/32/48, real .ico via png-to-ico)
 *
 * Uso: `node scripts/generate-favicons.mjs`
 *
 * Tras correrlo, commitear los archivos generados.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';

import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const sourceLogo = resolve(projectRoot, 'public/images/logo.png');
const publicDir = resolve(projectRoot, 'public');

/** Tamanos PNG a generar y su archivo destino. */
const pngTargets = [
  { size: 16, file: 'favicon-16.png' },
  { size: 32, file: 'favicon-32.png' },
  { size: 192, file: 'favicon-192.png' },
  { size: 512, file: 'favicon-512.png' },
  { size: 180, file: 'apple-touch-icon.png' },
];

/** Tamanos a empaquetar dentro del .ico real. */
const icoSizes = [16, 32, 48];

async function generatePng({ size, file }) {
  const outPath = resolve(publicDir, file);
  await sharp(sourceLogo)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(outPath);
  console.log(`  ok ${file} (${size}x${size})`);
}

async function generateIco() {
  // Renderizamos buffers PNG temporales para los tamanos del .ico
  const pngBuffers = await Promise.all(
    icoSizes.map((size) =>
      sharp(sourceLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer(),
    ),
  );
  const icoBuffer = await pngToIco(pngBuffers);
  await writeFile(resolve(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`  ok favicon.ico (${icoSizes.join(', ')})`);
}

async function main() {
  console.log(`Generando favicons desde ${sourceLogo}`);
  for (const target of pngTargets) {
    await generatePng(target);
  }
  await generateIco();
  console.log('Listo. Revisa los cambios en public/ y commitea.');
}

main().catch((err) => {
  console.error('Error generando favicons:', err);
  process.exitCode = 1;
});
