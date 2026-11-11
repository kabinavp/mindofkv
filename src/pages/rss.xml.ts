import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles, getVideos } from '../lib/content';
import { getPosts } from '../lib/substack';
import { SITE } from '../site.config';

export async function GET(context: APIContext) {
  const [articles, videos, posts] = await Promise.all([getArticles(), getVideos(), getPosts()]);
  const items = [
    ...posts.map((p) => ({ title: p.title, description: p.subtitle, pubDate: p.date, link: p.url })),
    ...articles.map((e) => ({ title: e.data.title, description: e.data.description, pubDate: e.data.date, link: `/articles/${e.id}/` })),
    ...videos.map((e) => ({ title: `▶ ${e.data.title}`, description: e.data.description, pubDate: e.data.date, link: `/videos/${e.id}/` })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  return rss({ title: SITE.name, description: SITE.description, site: context.site!, items });
}
