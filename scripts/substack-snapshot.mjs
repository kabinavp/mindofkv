// Saves the current Substack feed to src/data/substack.json (the offline fallback). Run: npm run snapshot
import { writeFileSync } from 'node:fs';
const url = process.argv[2] ?? 'https://mindofkv.substack.com';
const xml = await (await fetch(`${url}/feed`)).text();
const pick = (s, t) => (s.match(new RegExp(`<${t}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${t}>`)) ?? [])[1]?.trim() ?? '';
const posts = xml.split('<item>').slice(1).map((c) => {
  const i = c.split('</item>')[0]; const e = i.match(/<enclosure[^>]*url="([^"]+)"/);
  return { title: pick(i, 'title'), subtitle: pick(i, 'description'), url: pick(i, 'link'), date: new Date(pick(i, 'pubDate')).toISOString(), image: e ? e[1].replace(/&amp;/g, '&') : undefined };
});
writeFileSync('src/data/substack.json', JSON.stringify(posts, null, 2) + '\n');
console.log(`Saved ${posts.length} posts`);
