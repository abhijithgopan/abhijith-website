# Abhijith — Personal Website

A minimalist personal website built with Astro and deployed to Cloudflare.

## Stack

- Astro
- TypeScript
- Cloudflare adapter
- Markdown content collections
- Local image assets
- Open-Meteo for weather data
- Letterboxd RSS for recently watched films

## Project structure

```text
src/
├── assets/photos/            # Photography files
├── components/
│   ├── charts/               # Reusable data visualisations
│   ├── home/                 # Homepage-specific components
│   ├── maps/                 # Reusable geography components
│   ├── KeralaUrbanHealthCoverage.astro
│   ├── SiteHeader.astro
│   └── ThemeInit.astro
├── content/blog/             # Markdown posts
├── data/geography/           # Geography documentation/data notes
├── layouts/
│   └── BaseLayout.astro      # Shared HTML/head/document shell
├── lib/
│   ├── letterboxd.ts         # Letterboxd RSS parsing and movie helpers
│   └── weather.ts            # Weather/location helpers
├── pages/
│   ├── api/                  # Cloudflare server endpoints
│   ├── blog/
│   ├── 404.astro
│   ├── 500.astro
│   ├── index.astro
│   ├── now.astro
│   └── photos.astro
└── styles/
    ├── pages/                # Page-specific CSS
    ├── accessibility.css
    ├── charts.css
    ├── design-system.css
    └── global.css
```

## Local development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build the production site:

```sh
npm run build
```

Preview the Cloudflare build locally:

```sh
npm run preview
```

Deploy with Wrangler:

```sh
npm run deploy
```

## Publishing a blog post

Create a Markdown file in `src/content/blog/` with frontmatter such as:

```md
---
title: "My new post"
date: 2026-09-17
description: "A short description of the post."
layout: standard
---

Your article goes here.
```

For the interactive Kerala article, keep `layout: interactive` and the existing slug/component pairing.

## Photos

Add image files to `src/assets/photos/`. The Photos page discovers supported image files automatically. Optional captions and camera/location details are maintained in `src/pages/photos.astro` using the exact filename as the key.

## Important files

- `src/layouts/BaseLayout.astro` — shared page shell, metadata, and document structure
- `src/styles/global.css` — site-wide visual system
- `src/pages/index.astro` — homepage content/data wiring
- `src/components/home/` — homepage widgets
- `src/pages/api/visitor.ts` — visitor distance + weather endpoint
- `src/lib/weather.ts` — weather configuration/helpers
- `src/lib/letterboxd.ts` — Letterboxd integration
- `astro.config.mjs` — Astro/Cloudflare configuration
- `wrangler.jsonc` — Cloudflare configuration

Generated directories such as `node_modules/`, `.astro/`, `dist/`, and `.wrangler/` should not be committed.

### Photo metadata

Optional photo metadata now lives in `src/data/photos.ts`, separate from the page itself. Add the exact filename as a key when you want to provide a better alt description, caption, location, date, camera, or lens.

The gallery uses a strict 3:4 thumbnail grid, with two columns on phones. The fullscreen viewer opens the original photograph. The fullscreen viewer supports mouse, keyboard, and touch-swipe navigation.

## V9 performance notes

- The profile image is served as a small WebP through Astro's image pipeline.
- The external Inter stylesheet is linked directly with a preconnect instead of CSS `@import`.
- The homepage no longer contains a duplicate weather/visitor script; the weather component owns that behaviour.
- Photo thumbnails use a tighter responsive width set and a modest image quality setting.
- Letterboxd RSS and Open-Meteo responses are edge-cached for short periods; the visitor API response itself remains `no-store` because it contains visitor-specific information.


## Production notes

The site is intentionally small: Astro handles the pages and content, while Cloudflare provides the server runtime. The visitor/weather feature is the main server-side feature. Avoid adding a database or additional runtime services unless a real requirement appears.

See `PRODUCTION.md` for the final deployment and verification checklist.


## Library
The homepage includes a small bookshelf below Recently Watched. Book metadata lives in `src/data/library.ts`; cover artwork is loaded from the cited publisher/catalogue image URLs. The full collection is available at `/library`.
