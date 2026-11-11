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

**Product:** `src/content/products/my-app.md` with `title`, `tagline`, `status` (live/building/idea/retired), `started`, `url`, `stack`, `metric` and `order`.

> All current content is placeholder content. Replace or delete it.

## Newsletter

The signup form posts to `SITE.newsletter.action`. Create a list on Buttondown, Kit, Beehiiv or similar and paste its form endpoint there.

## Deploy

Push to GitHub, then import the repo on **Vercel**, **Netlify** or **Cloudflare Pages** (build: `npm run build`, output: `dist`). Point `mindofkv.com` at it in your DNS settings.

Free extras: `/rss.xml`, `/sitemap-index.xml`, Open Graph tags, dark mode.
