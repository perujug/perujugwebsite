# PeruJUG

Sitio web oficial de la comunidad **PeruJUG** (Peru Java User Group), construido
con [Astro](https://astro.build) y desplegado en GitHub Pages.

## Sobre la comunidad

PeruJUG es la comunidad peruana de personas que desarrollan, ensenan y aprenden
con tecnologias Java y de la JVM. Organizamos meetups, charlas tecnicas y el
**Java Day Peru**, con el objetivo de compartir conocimiento, conectar a la
comunidad y dar visibilidad al ecosistema Java en el pais.

## Stack tecnologico

- [Astro 7](https://astro.build) como framework de sitio estatico.
- [Tailwind CSS 3](https://tailwindcss.com) para los estilos, integrado mediante PostCSS.
- [TypeScript](https://www.typescriptlang.org) para schemas de contenido y tipos.
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
  de Astro para blog y eventos (Markdown con front-matter validado por Zod).
- [GitHub Pages](https://pages.github.com) como hosting, con despliegue
  automatico via GitHub Actions.

## Requisitos

- [Node.js](https://nodejs.org) **24 LTS**. La version exacta esta declarada
  en `.mise.toml`; si usas [mise](https://mise.jdx.dev), ejecuta `mise install`.
- npm (incluido con Node). El proyecto usa `npm`; no mezcles `pnpm` ni `yarn`
  para mantener consistencia con CI (`npm ci`).

## Como correr el proyecto localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/perujug/perujugwebsite.git
cd perujugwebsite

# 2. Instalar el runtime declarado (si usas mise) y las dependencias
mise install
npm ci

# 3. Levantar el servidor de desarrollo
npm run dev
```

Luego abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## Scripts disponibles

| Comando           | Descripcion                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo con hot reload.                 |
| `npm run build`   | Genera el sitio estatico optimizado en `dist/`.                  |
| `npm run preview` | Sirve `dist/` localmente para validar el build de produccion.    |
| `npm run check`   | Ejecuta `astro check` (tipos TS + schemas de content collections). |

## Estructura del proyecto

```text
.
├── public/                  # Assets estaticos servidos tal cual (favicons, imagenes, manifest, robots.txt)
│   └── images/              # Logos, fotos de organizadores, recursos de eventos
├── src/
│   ├── components/          # Componentes Astro reutilizables (SEO, etc.)
│   ├── content/
│   │   ├── blog/            # Posts del blog en Markdown
│   │   ├── eventos/         # Eventos (Java Day, meetups) en Markdown
│   │   └── config.ts        # Schemas Zod de las content collections
│   ├── layouts/             # Layouts compartidos (BaseLayout)
│   └── pages/               # Rutas del sitio
│       ├── blog/            # Indice y paginas dinamicas [...slug] del blog
│       ├── eventos/         # Indice y paginas dinamicas [...slug] de eventos
│       ├── index.astro      # Home
│       ├── acerca.astro
│       ├── equipo.astro
│       ├── 404.astro
│       └── rss.xml.js       # Feed RSS generado
├── astro.config.mjs         # Configuracion de Astro (sitemap, redirects, integraciones)
├── tailwind.config.mjs      # Configuracion de Tailwind CSS
└── package.json
```

## Como agregar un post al blog

1. Crea un nuevo archivo Markdown en `src/content/blog/<slug>.md`. El `<slug>`
   se convertira en la URL final: `/blog/<slug>/`.
2. Agrega el front-matter siguiendo el schema definido en
   [`src/content.config.ts`](./src/content.config.ts):

   ```markdown
   ---
   title: 'Titulo del post'
   description: 'Resumen breve que aparece en listados y meta descripcion.'
   pubDate: 2025-01-15
   updatedDate: 2025-01-20      # opcional
   tags: ['java', 'comunidad']
   author: 'PeruJUG'            # opcional, por defecto "PeruJUG"
   draft: false                 # si es true, no se publica
   image:                       # opcional
     src: '/images/mi-imagen.jpg'
     alt: 'Descripcion accesible de la imagen'
   ---

   Contenido del post en **Markdown**.
   ```

3. Corre `npm run check` para validar el front-matter y `npm run dev` para
   previsualizar.

## Como agregar un evento

1. Crea un archivo en `src/content/eventos/<slug>.md`. La URL sera
   `/eventos/<slug>/`.
2. Usa el siguiente ejemplo como base (ver schema en `src/content.config.ts`):

   ```markdown
   ---
   title: 'Java Day Peru 2025'
   description: 'Conferencia anual de la comunidad Java peruana.'
   date: 2025-09-13
   location: 'Lima, Peru'
   latitude: -12.0464
   longitude: -77.0428
   mapAddress: 'Av. Ejemplo 123, Lima'
   status: 'upcoming'           # 'upcoming' | 'past'
   image:
     src: '/images/javadayperu/header.jpg'
     alt: 'Banner del Java Day Peru'
   speakers:
     - name: 'Nombre Apellido'
       role: 'Java Champion'
       country: 'Peru'
       photo: '/images/javadayperu/speaker.jpg'
   agenda:
     - time: '09:00'
       title: 'Apertura'
       speaker: 'Equipo PeruJUG'
   sponsors:
     - name: 'Sponsor S.A.'
       logo: '/images/javadayperu/sponsors.jpg'
       url: 'https://sponsor.example'
   registrationUrl: 'https://example.com/registro'
   tags: ['javaday', 'conferencia']
   ---

   Descripcion larga del evento en **Markdown**.
   ```

3. Coloca las imagenes referenciadas en `public/images/` respetando las rutas
   indicadas en el front-matter.

## Como contribuir

Toda contribucion es bienvenida. Para mantener el repositorio ordenado:

1. Haz un **fork** del repositorio.
2. Crea una **rama descriptiva** a partir de la rama por defecto del
   repositorio (actualmente `master`; el maintainer puede renombrarla a `main`
   en cualquier momento sin romper el deploy, ver seccion "Despliegue"). Por
   ejemplo `feat/nuevo-evento` o `fix/typo-home`.
3. Escribe **commits descriptivos en espanol** usando prefijos convencionales
   (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `ci:`).
4. Antes de abrir el PR, corre `npm run build` y `npm run check` para
   asegurarte de que el sitio compila y los schemas validan.
5. Abre un **Pull Request** hacia la rama por defecto describiendo el cambio
   y vinculando issues si corresponde.

Al participar, te comprometes a respetar nuestro
[Codigo de Conducta](./CODE_OF_CONDUCT.md).

## Despliegue

El despliegue es automatico mediante GitHub Actions. Cada push a las ramas
`main` o `master` dispara el workflow [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml),
que ejecuta `npm run check`, construye el sitio (`npm run build`) y publica el
contenido de `dist/` en GitHub Pages. El workflow tambien puede ejecutarse
manualmente desde la pestana **Actions** del repositorio (`workflow_dispatch`).

> **Nota para el maintainer:** se incluyen ambas ramas (`main` y `master`) en
> el trigger a proposito. La rama por defecto historica es `master`; cuando
> decidas renombrar a `main` (Settings -> Branches -> Rename), el deploy seguira
> funcionando sin tocar el workflow. Si prefieres simplificar, puedes editar
> `branches:` en el yaml y dejar solo la rama elegida.

Para que funcione, el repositorio debe tener Pages configurado en modo
**GitHub Actions** (Settings -> Pages -> Source: "GitHub Actions"). El dominio
personalizado (CNAME) se administra desde la misma pantalla y no se versiona en
el repositorio.

## Licencia

Publicado bajo la licencia MIT. Lee el archivo [LICENSE.txt](./LICENSE.txt)
para mas detalles.
