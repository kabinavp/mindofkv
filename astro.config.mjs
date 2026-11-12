import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { isNoindex } from './src/seo.config.mjs';

// ARTIFACT=1 builds a self-contained preview (flat .html files, inlined CSS) for sharing as a link.
const artifact = process.env.ARTIFACT === '1';

export default defineConfig({
  site: 'https://mindofkv.com',
  trailingSlash: 'ignore',
  redirects: { '/models/circle-of-influence': '/models/3-is-of-influence', '/articles': '/models', '/newsletter': '/weekly', '/videos': '/models' },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !isNoindex(new URL(page).pathname.replace(/\/$/, '')) }),
  ],
  build: artifact ? { format: 'file', inlineStylesheets: 'always' } : {},
  outDir: artifact ? './dist-preview' : './dist',
});
