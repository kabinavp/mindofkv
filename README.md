# mindofkv.com

Personal site for **Mind of KV**: articles, videos, multi-part series and the products I'm building. Built with [Astro](https://astro.build), it's fully static and fast, and it costs nothing to host.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs static site to dist/
```

## Make it yours

| What | Where |
| --- | --- |
| Name, tagline, nav, socials, newsletter endpoint | `src/site.config.ts` |
| Colours & fonts | `src/styles/global.css` (`:root` tokens) |
| Homepage scene | `src/scripts/scene.ts` |
| Homepage hero copy | `src/pages/index.astro` |
| About / Start here / Now pages | `src/pages/about.astro`, `start-here.astro`, `now.astro` |
| Favicon | `public/favicon.svg` |

## Publishing content

Drop a Markdown (`.md`) or MDX (`.mdx`) file into the matching folder. The filename becomes the URL.

**Article:** `src/content/articles/my-post.md` → `/articles/my-post`
```yaml
---
title: My post
description: One-line summary (used in cards + SEO)
date: 2026-11-12
topics: [building, ai]      # creates /topics/building etc.
featured: true              # shows on Start Here
series: build-in-public     # optional: filename of a series
seriesOrder: 4              # optional: position in the series
draft: false
---
```

**Video:** `src/content/videos/my-video.md`. Same fields as an article, plus `youtubeId: "abc123"` and `duration: "12:34"`. The body holds the show notes.

**Series:** `src/content/series/my-series.md` with `title`, `description`, `status` (ongoing/complete/planned), `hue` (0–360 cover colour) and `order`. Articles and videos join a series via their `series:` field.

**Book:** `src/content/books/my-book.md` → listed on `/books`
```yaml
---
title: The Mom Test
author: Rob Fitzpatrick
isbn: "9781492180746"   # used to fetch the cover and build the Amazon link
finished: 2026-10-05
rating: 5               # optional, 1–5
favourite: true         # optional
# cover: /books/mom-test.jpg   # optional local image in public/books/
# link: https://bookshop.org/... # optional, replaces the Amazon link
---
One paragraph review goes here.
```
To earn from Amazon links, put your Associates tracking ID in `SITE.amazon.tag` (`src/site.config.ts`). The required disclosure line appears automatically once a tag is set.

**Product:** `src/content/products/my-app.md` with `title`, `tagline`, `status` (live/building/idea/retired), `started`, `url`, `stack`, `metric` and `order`.

> All current content is placeholder content. Replace or delete it.

### The hill (homepage)

The homepage scene is drawn live in `src/scripts/scene.ts`: grass, the tree, and you riding, building and filming. The stamps next to "In my free time," switch each figure on and off.

- **Live wind:** set `hill.lat` / `hill.lon` (and `hill.spot`) in `src/site.config.ts`. The grass and tree will then sway with the real wind, and the corner reads "Gentle breeze on … right now". The data comes from Open-Meteo, which is free and needs no key.
- **Speech lines:** edit `LINES` in `scene.ts`.
- **Jersey colour, skin tone:** `#c8582b` and `SKIN` in `scene.ts`.

## Newsletter

The signup form posts to `SITE.newsletter.action`. Create a list on Buttondown, Kit, Beehiiv or similar and paste its form endpoint there.

## Deploy

Push to GitHub, then import the repo on **Vercel**, **Netlify** or **Cloudflare Pages** (build: `npm run build`, output: `dist`). Point `mindofkv.com` at it in your DNS settings.

Free extras: `/rss.xml`, `/sitemap-index.xml` and Open Graph tags.
