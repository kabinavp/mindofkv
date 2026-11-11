import { getCollection, type CollectionEntry } from 'astro:content';

const live = <T extends { data: { draft?: boolean } }>(e: T) => import.meta.env.DEV || !e.data.draft;
const byDate = (a: { data: { date: Date } }, b: { data: { date: Date } }) => b.data.date.valueOf() - a.data.date.valueOf();

export const getArticles = async () => (await getCollection('articles', live)).sort(byDate);
export const getVideos = async () => (await getCollection('videos', live)).sort(byDate);
export const getSeries = async () => (await getCollection('series')).sort((a, b) => a.data.order - b.data.order);
export const getProducts = async () => {
  const rank = { live: 0, building: 1, idea: 2, retired: 3 } as const;
  return (await getCollection('products')).sort(
    (a, b) => rank[a.data.status] - rank[b.data.status] || a.data.order - b.data.order,
  );
};

export type Item =
  | { kind: 'article'; entry: CollectionEntry<'articles'> }
  | { kind: 'video'; entry: CollectionEntry<'videos'> };

export const hrefOf = (i: Item) => `/${i.kind}s/${i.entry.id}`;

export async function getSeriesItems(seriesId: string): Promise<Item[]> {
  const [a, v] = await Promise.all([getArticles(), getVideos()]);
  const items: Item[] = [
    ...a.filter((e) => e.data.series?.id === seriesId).map((entry) => ({ kind: 'article' as const, entry })),
    ...v.filter((e) => e.data.series?.id === seriesId).map((entry) => ({ kind: 'video' as const, entry })),
  ];
  return items.sort(
    (x, y) => (x.entry.data.seriesOrder ?? 999) - (y.entry.data.seriesOrder ?? 999) ||
      x.entry.data.date.valueOf() - y.entry.data.date.valueOf(),
  );
}

export async function getAllTopics() {
  const [a, v] = await Promise.all([getArticles(), getVideos()]);
  const counts = new Map<string, number>();
  for (const e of [...a, ...v]) for (const t of e.data.topics) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((x, y) => y[1] - x[1]).map(([name, count]) => ({ name, slug: slugify(name), count }));
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 230));

export const getBooks = async () =>
  (await getCollection('books')).sort((a, b) => b.data.finished.valueOf() - a.data.finished.valueOf());

// ISBN-13 (978…) → ISBN-10, which Amazon uses as the product ID for most books.
export function isbn10(isbn: string) {
  const d = isbn.replace(/[^0-9X]/gi, '');
  if (d.length === 10) return d.toUpperCase();
  if (d.length !== 13 || !d.startsWith('978')) return null;
  const core = d.slice(3, 12);
  const sum = core.split('').reduce((s, c, i) => s + Number(c) * (10 - i), 0);
  const check = (11 - (sum % 11)) % 11;
  return core + (check === 10 ? 'X' : String(check));
}

export const getModels = async () => (await getCollection('models')).sort((a, b) => a.data.order - b.data.order);
export const modelsForEssay = async (slug: string) => (await getModels()).filter((m) => m.data.essays.includes(slug));
