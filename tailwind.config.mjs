// @ts-check
import typography from '@tailwindcss/typography';

/**
 * Configuracion Tailwind para PeruJUG.
 *
 * Tokens de marca:
 * - peru-red: #D91023 (rojo bandera Peru)
 * - java-blue: #5382A1 (azul oficial Java)
 * - java-orange: #F89820 (naranja oficial Java)
 * - duke-white: #FFFFFF (blanco para contraste)
 *
 * Dark mode activado via clase `.dark` en <html> (controlado por el toggle del header).
 */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca PeruJUG
        peru: {
          red: '#D91023',
          white: '#FFFFFF',
        },
        java: {
          blue: '#5382A1',
          orange: '#F89820',
        },
        brand: {
          DEFAULT: '#D91023',
          accent: '#5382A1',
          highlight: '#F89820',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [typography],
};
