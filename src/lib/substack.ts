// Writing lives on Substack. At build time we read the publication's RSS feed;
// if that fails (offline, Substack down), we fall back to the last saved snapshot.
import snapshot from '../data/substack.json';
import { SITE } from '../site.config';

export interface Post { title: string; subtitle: string; date: Date; url: string; image?: string }
type Raw = Omit<Post, 'date'> & { date: string };

const pick = (xml: string, tag: string) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? m[1].trim() : '';
};
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export function parseFeed(xml: string): Raw[] {
  return xml.split('<item>').slice(1).map((chunk) => {
    const item = chunk.split('</item>')[0];
    const enc = item.match(/<enclosure[^>]*url="([^"]+)"/);
    return {
      title: decode(pick(item, 'title')),
      subtitle: decode(pick(item, 'description')),
      url: pick(item, 'link'),
      date: new Date(pick(item, 'pubDate')).toISOString(),
      image: enc ? decode(enc[1]) : undefined,
    };
  }).filter((p) => p.title && p.url);
}

let cache: Promise<Post[]> | undefined;
export function getPosts(): Promise<Post[]> {
  cache ??= (async () => {
    let raw: Raw[] = snapshot as Raw[];
    try {
      const res = await fetch(`${SITE.substack.url}/feed`, { signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'mindofkv.com site build' } });
      if (res.ok) { const live = parseFeed(await res.text()); if (live.length) raw = live; }
    } catch { /* use snapshot */ }
    return raw.map((p) => ({ ...p, date: new Date(p.date) })).sort((a, b) => b.date.valueOf() - a.date.valueOf());
  })();
  return cache;
}
