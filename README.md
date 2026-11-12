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

## Search (SEO)

- Every page has a title, description, canonical URL, structured data (schema.org) and an auto-generated share image (`/og/...png`, built by `src/lib/og.ts`).
- Model pages use `seoTitle` / `seoDescription`: write them as the phrase people actually search (e.g. "How to Run a Pre-mortem").
- Sections that still hold sample content are hidden from Google (noindex, left out of the sitemap). The list is in `src/seo.config.mjs`; remove a section from it once its content is real.
- After launch: verify the site in Google Search Console and Bing Webmaster Tools, and submit `https://mindofkv.com/sitemap-index.xml` to both.

## Publishing content

Drop a Markdown (`.md`) or MDX (`.mdx`) file into the matching folder. The filename becomes the URL.

**Article:** `src/content/articles/my-post.md` → `/articles/my-post`
```yaml
---
title: My post
description: One-line summary (used in cards + SEO)
date: 2026-11-12
topics: [building, ai]      # creates /topics/projects etc.
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

**Model:** `src/content/models/<id>.md` → `/models/<id>`. Also set `origin` (original / borrowed), `credit` (for borrowed), `great` (the good-vs-great line) and `template` (`title`, plus `url` once the read-only Google Doc exists). Each model's card is drawn in `src/lib/cards.ts`; a 1080×1080 PNG is built at `/cards/<id>.png`. Template sources live in `templates/`.
 Front-matter: `title`, `oneliner`, `essays` (Substack slugs), `books`, `videos`, `related` (other model ids), `order`. Essays listed here automatically show the model at the end of the post.

**Weekly (Stay Curious):** each Sunday issue is a file in `src/content/weekly/` (copy `newsletter/TEMPLATE.md`). It appears in the archive at `/weekly/NNN`; paste the same text into Buttondown to send it.

**Opinion:** `src/content/opinions/<slug>.md` → `/opinions/<slug>`. Your own pieces on bigger questions.
- Written on Substack: the file only needs `topic:` and `substack: <post-slug>`; the title, date and text come from the post.
- Written here: give it `title`, `description`, `topic`, `date`, and write the piece below the front-matter.
- Planning one: `status: in-the-works` lists the title under "In the works".
- `/opinions` is hidden from search until the first piece is published; then remove it from `src/seo.config.mjs`.

**Product:** `src/content/products/my-app.md` with `title`, `tagline`, `status` (live/projects/idea/retired), `started`, `url`, `stack`, `metric` and `order`.

> All current content is placeholder content. Replace or delete it.

### The hill (homepage)

The homepage scene is drawn live in `src/scripts/scene.ts`: grass, the tree, and you riding, building and filming. The stamps next to "In my free time," switch each figure on and off.

- **Live wind:** set `hill.lat` / `hill.lon` (and `hill.spot`) in `src/site.config.ts`. The grass and tree will then sway with the real wind, and the corner reads "Gentle breeze on … right now". The data comes from Open-Meteo, which is free and needs no key.
- **Speech lines:** edit `LINES` in `scene.ts`.
- **Jersey colour, skin tone:** `#c8582b` and `SKIN` in `scene.ts`.

## Newsletter

The signup form posts to `SITE.newsletter.action`. Create a list on Buttondown, Kit, Beehiiv or similar and paste its form endpoint there.

## Deploy

The site is published by GitHub Actions to GitHub Pages (`.github/workflows/deploy.yml`):
every push to `main` goes live in about two minutes, and a daily run at 01:17 UTC rebuilds the site
so new Substack posts appear without a manual deploy.

One-time setup (already done once for mindofkv.com):
1. Repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Same page → Custom domain: `mindofkv.com` → Save, then tick **Enforce HTTPS** once the certificate is issued.
3. At the domain registrar, point the domain at GitHub Pages:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www`: `kabinavp.github.io`
