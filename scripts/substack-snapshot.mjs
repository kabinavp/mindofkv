// Saves the current Substack feed to src/data/substack.json (the offline fallback).
// Run: npm run snapshot   (behind a proxy, prefix with NODE_USE_ENV_PROXY=1)
import { writeFileSync } from 'node:fs';
import { parseFeed } from '../src/lib/substack-parse.mjs';
const url = process.argv[2] ?? 'https://mindofkv.substack.com';
const posts = parseFeed(await (await fetch(`${url}/feed`)).text());
writeFileSync('src/data/substack.json', JSON.stringify(posts, null, 2) + '\n');
console.log(`Saved ${posts.length} posts`);
