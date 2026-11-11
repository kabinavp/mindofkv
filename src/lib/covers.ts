// Finds a cover for each book at build time: local image → ISBN → Open Library search by title and author.
// If nothing is found (or the build is offline), the page falls back to a typeset cover.
const cache = new Map<string, Promise<string | undefined>>();

export function coverFor(b: { title: string; author: string; isbn?: string; cover?: string }) {
  if (b.cover) return Promise.resolve(b.cover);
  if (b.isbn) return Promise.resolve(`https://covers.openlibrary.org/b/isbn/${b.isbn.replace(/-/g, '')}-L.jpg?default=false`);
  const key = `${b.title}|${b.author}`;
  if (!cache.has(key)) {
    cache.set(key, (async () => {
      try {
        const q = new URLSearchParams({ title: b.title.replace(/[!?]/g, ''), author: b.author, limit: '1', fields: 'cover_i' });
        const res = await fetch(`https://openlibrary.org/search.json?${q}`, { signal: AbortSignal.timeout(6000), headers: { 'user-agent': 'mindofkv.com site build' } });
        const id = res.ok ? (await res.json()).docs?.[0]?.cover_i : undefined;
        return id ? `https://covers.openlibrary.org/b/id/${id}-L.jpg` : undefined;
      } catch { return undefined; }
    })());
  }
  return cache.get(key)!;
}
