import type { APIRoute, GetStaticPaths } from 'astro';
import { getModels, getArticles } from '../../lib/content';
import { getPosts } from '../../lib/substack';
import { ogImage } from '../../lib/og';
import { SITE } from '../../site.config';

export const getStaticPaths: GetStaticPaths = async () => {
  const [models, posts, local] = await Promise.all([getModels(), getPosts(), getArticles()]);
  return [
    { params: { slug: 'home' }, props: { kicker: 'Notes from a curious mind', title: 'Essays, models and books on how to think, decide and lead.' } },
    { params: { slug: 'models' }, props: { kicker: 'Models', title: 'A library of thinking tools', sub: 'Short, practical models for product, leadership and life, each with real examples.' } },
    { params: { slug: 'writing' }, props: { kicker: 'Writing', title: 'Essays on product, leadership and teams' } },
    { params: { slug: 'newsletter' }, props: { kicker: 'Newsletter', title: SITE.newsletter.name, sub: SITE.newsletter.pitch } },
    ...models.map((m, i) => ({ params: { slug: `models/${m.id}` }, props: { kicker: `Model No. ${String(i + 1).padStart(2, '0')}`, title: m.data.title, sub: m.data.oneliner } })),
    ...posts.map((p) => ({ params: { slug: `articles/${p.slug}` }, props: { kicker: 'Essay', title: p.title, sub: p.subtitle } })),
    ...local.map((a) => ({ params: { slug: `articles/${a.id}` }, props: { kicker: 'Essay', title: a.data.title, sub: a.data.description } })),
  ];
};

export const GET: APIRoute = async ({ props }) =>
  new Response(await ogImage(props as { kicker: string; title: string; sub?: string }), { headers: { 'Content-Type': 'image/png' } });
