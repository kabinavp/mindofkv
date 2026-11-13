# Mind of KV — working guide

Personal site of KV at **mindofkv.com** (Astro, static, deployed to GitHub Pages from `main`).
Read this before building anything. It records the direction KV has set and the decisions already made.

## Positioning: narrow lens, wide topics

**Tagline:** *Ways of thinking, from the work of building things with people.*

The site is a **lens niche, not a topic niche** (unlike product-only writers). The lens is fixed: **how good
decisions get made, especially when building something with other people.** Product work is the *source* of the
ideas, not the boundary. Never say “product management” outright (except on the About page). Every piece should
read as useful to anyone who makes things with others (founders, engineers, designers, team leads), while product
people recognise it as written for them. Who exactly we write for, and how we reach them: **`AUDIENCE.md`**.

- **Universal principle, product story.** Headlines state a general idea; the proof is a real product example
  (e.g. *Invert to Win*: “ask how it could fail”, proven with the Groww payment-gateway launch).
- **Name the job, not the title.** “People who decide what gets built”, not “product managers”;
  “working with people you don’t manage”, not “stakeholder management”; “deciding what matters”, not
  “prioritisation frameworks”. No PM jargon (PRD, sprint, grooming) in headlines.
- **Product thinking applied to everything.** Wide topics (education, taxation, books, cycling) are seen through a
  product lens: who is the user, where does the experience break, what would a better design be.
- **Explicit in one place only:** the About page states KV’s role plainly.
- **Three rings:** ~60% core (deciding and building with people), ~25% getting better, ~15% the wide world seen
  through the same lens. A wide piece must still end in a reusable way of thinking.
- **Test for every piece:** (1) does it end in a reusable way of thinking? (2) is it from KV’s own experience or
  conviction? (3) would someone outside product still use it? Is there a real decision, user or team in it?
  Can the reader say what they’ll do differently on Monday?
- **Not a “builder” site.** Don’t over-index on the word builder; let the work show it.
- **The format is the signature:** real experience turned into a named model (2–4 words), with a card and a template.
- **Newsletter: *Low Gear*** (the gear for the steepest climbs). Promise: “One way to think through a hard call,
  every Sunday. Five minutes.” Signups say “Get Low Gear every Sunday”. Sign-off: “Keep climbing, KV”.
  Never call it a slow read; 600 words max. (Replaced *Stay Curious* / “Curious Club” in Nov 2026.)

## Editorial standard (non-negotiable)

Claude acts as **editor-in-chief**. Every piece follows **`EDITORIAL.md`**, benchmarked on Farnam Street (fs.blog)
and Lenny's Newsletter: researched, correctly attributed, cross-referenced, SEO-ready, and leaving the reader with
a new learning. Each piece raises the bar. Never publish below the best before it. Drafts go to the Low Gear Desk
(https://claude.ai/artifact/5AS6ibq9vFPNfX9UkMEezy) for KV's approval. Nothing is posted without it.

**Weekly rhythm (India time, Asia/Kolkata):** Thursday 10:47 a scheduled run revises items KV sent back and
drafts next week into the desk; KV approves by Saturday; LinkedIn Mon/Wed/Fri ~9:00; Low Gear every Sunday.

## Hard rules

- **Never invent KV’s opinions, reviews, experiences or numbers.** Opinions and book takes are KV’s own words;
  draft only from what KV wrote or said, and mark drafts as such.
- **No fake social proof** (e.g. “1000+ subscribers”). `SITE.newsletter.subscribers` stays null until KV gives a real count.
- **Keep it simple.** KV dislikes cluttered pages and the generic “AI-made” look (italic serif everywhere, boxes on
  boxes, gradients). Fewer elements, clear hierarchy, lots of white space.

## Sections (menu order)

Weekly · Models · Opinions · Books · Projects · About. (Writing and Videos were removed from the menu;
old URLs redirect.)

- **Weekly** (`/weekly`): *Low Gear*, every Sunday, a 5-minute read (≤600 words): one idea, one question, one book,
  one line worth keeping. Page ends at the signup. Issues go in `src/content/weekly/NNN.md` (template:
  `newsletter/TEMPLATE.md`).
- **Models** (`/models`): the heart of the site. Essays live **inside** their model page (one home model per essay,
  computed by `essayHomes()`); there is no separate Writing section.
  - Prefer **organic models** from KV’s own work over famous ones. Name them in 2–4 sticky words, often a triad
    or a contrast.
  - Each model has: `origin` (original / borrowed + `credit`), a one-liner, a **model card** (drawn in
    `src/lib/cards.ts`, PNG at `/cards/<id>.png` for LinkedIn), the explanation, a **good-vs-great** line,
    a **template** (read-only Google Doc, with credit; sources in `templates/`), and its essay.
  - Current models: Inversion (borrowed, Munger), Pre-mortem (borrowed, Gary Klein), 3 I’s of Influence,
    Default High Trust, Momentum over Measurement, Honest Gap Analysis.
  - Grouped by `theme`: Deciding · Working with people · Getting better · Seeing the world (`world`, for models from
    wide-ring topics; a theme with no models is hidden).
- **Opinions** (`/opinions`): KV’s own pieces on bigger questions (e.g. value of education in the AI age, Indian
  taxation). Not model summaries. Can be pulled from Substack via `substack:` in the front-matter.
  Hidden from search until the first piece is published.
- **Books** (`/books`): Reading now · Read · Up next (cover grid). Real covers stored in `public/books/`.
  Text under read books is a factual description until KV sends a gist (`myTake: true` once it’s his).
- **About**: Karthik Viswanathan (KV), works in product; reads a lot, rides hills, spiritual and philosophical. Only LinkedIn and Substack are listed as socials (others unconfirmed).
- **Projects**, **Now**: still placeholder content.

## Design system

- White background, no grid. Ink `#2e2d2a`, greys `#55544e` / `#96958d`, lines `#e2e2de`,
  accent orange `#c8582b` (the mascot’s top), stamp cream `#f4e4b2`.
- **Sentient** (upright) for big headings; **Satoshi** for everything else. Self-hosted in `public/fonts/`
  (Fontshare, ITF Free Font License). Italics only for the logo’s orange *of*, book titles and quotes.
- **Mascot:** the small figure in the orange top leaning on the “M” of “Mind *of* KV”.
- Homepage: hill scene with KV cycling (canvas, `src/scripts/scene.ts`), intro, free-time stamps, Low Gear signup.

## Plumbing

- **Newsletter:** Kit form `10179714`; all forms use `src/components/Subscribe.astro`.
- **Email:** hello@mindofkv.com forwards to KV via ImprovMX.
- **Substack:** essays are drafted on mindofkv.substack.com and mirrored onto model pages at build time
  (snapshot in `src/data/substack.json`, refresh with `npm run snapshot`). New pieces: publish here first.
- **Share images:** portrait 1080×1350 PNGs at `/share/<id>.png`, defined in `src/lib/share.ts` (headline,
  model diagram, KV's name and mascot on every image). Add one entry per post.
- **SEO:** sections with placeholder content are noindexed via `src/seo.config.mjs`. Every page has
  structured data and an auto-generated share image (`/og/...`).
- **Deploy:** `.github/workflows/deploy.yml` builds on every push to `main` and daily at 01:17 UTC.
- **Preview link for KV:** build with `ARTIFACT=1` (outputs `dist-preview/`), then relink paths for the shareable preview.
