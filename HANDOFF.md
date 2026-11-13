# Handoff: where Mind of KV stands (13 Nov 2026)

Read `CLAUDE.md` first: it holds the direction, rules, design system and plumbing. This file is the current status.

## Live setup

| Piece | Status |
| --- | --- |
| Repo | github.com/kabinavp/mindofkv (`main`) |
| Hosting | GitHub Pages via `.github/workflows/deploy.yml` (on push + daily 01:17 UTC). Deploys succeed. |
| Domain | mindofkv.com DNS at GoDaddy points to GitHub. **HTTPS certificate was still pending** on 12 Nov. |
| Newsletter | Kit form `10179714`, wired into every signup form. Not yet tested with a real signup. |
| Email | hello@mindofkv.com → Gmail via ImprovMX (KV setting up). |
| Substack | mindofkv.substack.com; 5 essays mirrored into model pages. |

## Done

- Homepage hill scene, Sentient/Satoshi type, mascot, orange *of* logo, white background.
- Menu: Weekly · Models · Opinions · Books · Projects · About.
- 6 models in 3 themes, each with origin/credit tag, model card (+1080² PNG at `/cards/<id>.png`),
  good-vs-great line, template placeholder, and its essay.
- Six template sources in `templates/` (Word versions given to KV for Google Drive upload).
- Books: Martyr! (reading), 4 read, 4 up next, real covers.
- Opinions: two "in the works" (education in the AI age, Indian taxation).
- About page written from what KV shared (no invented career details).
- SEO: titles/descriptions, structured data, share images, sitemap, noindex for placeholder sections.

## Open items

**Waiting on KV**
1. HTTPS: if the certificate still isn't issued, remove and re-add the custom domain in Pages settings;
   check GoDaddy for stray A/AAAA/CAA records or forwarding. Then tick *Enforce HTTPS*.
2. Kit: real test signup, confirmation email text, sender hello@mindofkv.com + Kit DNS records
   (merge SPF with ImprovMX's into one record).
3. Google Search Console + Bing: verify, submit `/sitemap-index.xml`.
4. Six template Google Doc links (view-only) → add as `template.url` in each model file.
5. Book gists for the 4 read books (set `myTake: true` when added); cover for *The Mind of Napoleon*.
6. Current role + 2–3 career highlights for About (LinkedIn couldn't be read automatically).
7. First Stay Curious issue date (15 or 22 Nov); bullets for the education opinion piece.
8. Other social accounts to list (only LinkedIn and Substack are on the site).

**Next to build**
- Interview KV to surface organic models (questions on advice he repeats, contrarian beliefs, cycling lessons).
- LinkedIn kit: ~3 posts per model, linking to model pages.
- "3 I's of Influence" self-assessment (6 questions, posts to Kit with a tag).
- Remove "Projects"/"Now" placeholder content or fill it.

## Working notes for the next session

- Local preview: `npm install && npm run dev`. Build: `npm run build`.
- Builds behind a proxy need `NODE_USE_ENV_PROXY=1` for the live Substack feed; offline builds fall back
  to `src/data/substack.json`.
- Share-link preview for KV: `ARTIFACT=1 npm run build` → `dist-preview/`, then make internal links relative.
- KV's preferences: simple, uncluttered pages; authentic, succinct, sharp copy; never invent his views.
