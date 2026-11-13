import type { APIRoute, GetStaticPaths } from 'astro';
import { getModels, getArticles } from '../../lib/content';
import { getOpinions } from '../../lib/opinions';
import { getPosts } from '../../lib/substack';
import { ogImage } from '../../lib/og';
import { SITE } from '../../site.config';

export const getStaticPaths: GetStaticPaths = async () => {
  const [models, posts, local, opinions] = await Promise.all([getModels(), getPosts(), getArticles(), getOpinions()]);
  return [
    { params: { slug: 'home' }, props: { kicker: 'Mind of KV', title: 'Ways of thinking, from the work of building things with people.' } },
    { params: { slug: 'models' }, props: { kicker: 'Models', title: 'A library of thinking tools', sub: 'Short, practical models for product, leadership and life, each with real examples.' } },
    { params: { slug: 'opinions' }, props: { kicker: 'Opinions', title: 'What I think about the bigger questions', sub: 'Education, taxation, technology, and how we live and work.' } },
    ...opinions.filter((o) => o.status === 'published').map((o) => ({ params: { slug: `opinions/${o.id}` }, props: { kicker: `Opinion · ${o.topic}`, title: o.title, sub: o.description } })),
    { params: { slug: 'weekly' }, props: { kicker: 'Weekly · Every Sunday', title: SITE.newsletter.name, sub: SITE.newsletter.promise } },
    ...models.map((m, i) => ({ params: { slug: `models/${m.id}` }, props: { kicker: `Model No. ${String(i + 1).padStart(2, '0')}`, title: m.data.title, sub: m.data.oneliner } })),
    ...local.map((a) => ({ params: { slug: `articles/${a.id}` }, props: { kicker: 'Essay', title: a.data.title, sub: a.data.description } })),
  ];
};

export const GET: APIRoute = async ({ props }) =>
  new Response(await ogImage(props as { kicker: string; title: string; sub?: string }), { headers: { 'Content-Type': 'image/png' } });
