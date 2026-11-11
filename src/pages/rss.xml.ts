import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles, essayHomes } from '../lib/content';
import { getPosts } from '../lib/substack';
import { SITE } from '../site.config';

export async function GET(context: APIContext) {
  const [articles, posts, homes] = await Promise.all([getArticles(), getPosts(), essayHomes()]);
  const items = [
    ...posts.filter((p) => homes.has(p.slug)).map((p) => ({ title: p.title, description: p.subtitle, pubDate: p.date, link: `/models/${homes.get(p.slug)}/#${p.slug}`, content: p.html })),
    ...articles.map((e) => ({ title: e.data.title, description: e.data.description, pubDate: e.data.date, link: `/articles/${e.id}/` })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  return rss({ title: SITE.name, description: SITE.description, site: context.site!, items, trailingSlash: false });
}
