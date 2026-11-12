import { getCollection, type CollectionEntry } from 'astro:content';
import { getPosts, type Post } from './substack';

export interface Opinion {
  id: string; title: string; description?: string; topic: string; date?: Date;
  status: 'published' | 'in-the-works'; entry: CollectionEntry<'opinions'>; post?: Post; words: number;
}

export async function getOpinions(): Promise<Opinion[]> {
  const [entries, posts] = await Promise.all([getCollection('opinions'), getPosts()]);
  return entries.map((e) => {
    const post = e.data.substack ? posts.find((p) => p.slug === e.data.substack) : undefined;
    const words = post ? post.words : (e.body ?? '').split(/\s+/).filter(Boolean).length;
    return {
      id: e.id, entry: e, post, words,
      title: e.data.title ?? post?.title ?? e.id,
      description: e.data.description ?? post?.subtitle,
      topic: e.data.topic,
      date: e.data.date ?? post?.date,
      // A Substack-linked piece is only published once the post actually exists.
      status: e.data.substack && !post ? 'in-the-works' : e.data.status,
    } satisfies Opinion;
  }).sort((a, b) => (b.date?.valueOf() ?? 0) - (a.date?.valueOf() ?? 0));
}
