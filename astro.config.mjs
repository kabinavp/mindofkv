import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// ARTIFACT=1 builds a self-contained preview (flat .html files, inlined CSS) for sharing as a link.
const artifact = process.env.ARTIFACT === '1';

export default defineConfig({
  site: 'https://mindofkv.com',
  integrations: [mdx(), sitemap()],
  build: artifact ? { format: 'file', inlineStylesheets: 'always' } : {},
  outDir: artifact ? './dist-preview' : './dist',
});
