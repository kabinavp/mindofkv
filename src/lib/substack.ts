// Essays are written on Substack but published here: at build time we read the Substack feed,
// clean each post's HTML, and give it a page on this site. If the feed can't be reached,
// the last saved snapshot (src/data/substack.json) is used instead.
import { parseFeed } from './substack-parse.mjs';
import snapshot from '../data/substack.json';
import { SITE } from '../site.config';

export interface Post { slug: string; title: string; subtitle: string; date: Date; url: string; image?: string; html: string; words: number }
type Raw = Omit<Post, 'date' | 'words'> & { date: string };

let cache: Promise<Post[]> | undefined;
export function getPosts(): Promise<Post[]> {
  cache ??= (async () => {
    let raw: Raw[] = snapshot as Raw[];
    try {
      const res = await fetch(`${SITE.substack.url}/feed`, { signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'mindofkv.com site build' } });
      if (res.ok) { const live = parseFeed(await res.text()); if (live.length) raw = live; }
    } catch { /* use snapshot */ }
    return raw
      .map((p) => ({ ...p, date: new Date(p.date), words: p.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length }))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf());
  })();
  return cache;
}
