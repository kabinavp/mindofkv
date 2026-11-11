// Share images (1200×630) generated at build time for every important page.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const font = (p: string) => readFileSync(require.resolve(p));
const fonts = [
  { name: 'Newsreader', data: font('@fontsource/newsreader/files/newsreader-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Newsreader', data: font('@fontsource/newsreader/files/newsreader-latin-400-italic.woff'), weight: 400 as const, style: 'italic' as const },
  { name: 'Geist', data: font('@fontsource/geist-sans/files/geist-sans-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
];

const hill = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 170" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93a243"/><stop offset=".45" stop-color="#728b30"/><stop offset="1" stop-color="#3c5619"/></linearGradient></defs><path d="M0 40 C200 60 380 95 520 95 C700 95 820 60 960 22 C1040 2 1120 6 1200 18 V170 H0Z" fill="url(#g)"/></svg>`)}`;

const mascot = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 40"><g stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M11 26.2 12.4 33 8.6 39.4" stroke="#3b3a35" stroke-width="2.5"/><path d="M11 26.2 9.9 33 13.6 39.4" stroke="#2e2d2a" stroke-width="2.5"/><path d="M7.2 39.6h2.6M12.6 39.6h2.8" stroke="#2e2d2a" stroke-width="1.6"/><path d="M12.6 16.4 9.6 21.2 10.6 25" stroke="#a8572f" stroke-width="1.9"/><path d="M11 26 13.6 15.8" stroke="#c8582b" stroke-width="4.6"/><path d="M14 16.4 18.5 18.6 21.5 15.5" stroke="#c8582b" stroke-width="2"/></g><circle cx="13.4" cy="11.2" r="3.3" fill="#a8724f"/><path d="M10 10.6c0-2.6 1.6-3.9 3.6-3.9s3.4 1.3 3.4 3.4z" fill="#2e2d2a"/><path d="M16.4 9.9 19.4 10.4" stroke="#2e2d2a" stroke-width="1.3" stroke-linecap="round"/></svg>`)}`;

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export async function ogImage({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  const size = title.length > 60 ? 58 : title.length > 36 ? 68 : 80;
  const tree = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: '#ffffff', position: 'relative', padding: '64px 80px' }, [
    h('div', { display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Geist', fontSize: 24, color: '#2e2d2a' }, [
      h('div', { display: 'flex', fontFamily: 'Newsreader', fontSize: 34 }, [h('span', {}, 'Mind '), h('span', { fontStyle: 'italic', color: '#c8582b', margin: '0 8px' }, 'of'), h('span', {}, 'KV')]),
      h('span', { color: '#c8c7bf' }, '·'),
      h('span', { color: '#96958d', textTransform: 'uppercase', letterSpacing: 2, fontSize: 18 }, kicker),
    ]),
    h('div', { display: 'flex', flexDirection: 'column', marginTop: 70, maxWidth: 1000 }, [
      h('div', { fontFamily: 'Newsreader', fontStyle: 'italic', fontSize: size, lineHeight: 1.08, color: '#2e2d2a', letterSpacing: -1 }, title),
      sub ? h('div', { fontFamily: 'Newsreader', fontSize: 32, lineHeight: 1.35, color: '#5d5c56', marginTop: 24, maxWidth: 940 }, sub) : null,
    ].filter(Boolean)),
    { type: 'img', props: { src: hill, width: 1200, height: 170, style: { position: 'absolute', left: 0, bottom: 0 } } },
    { type: 'img', props: { src: mascot, width: 72, height: 120, style: { position: 'absolute', right: 120, bottom: 118 } } },
    h('div', { position: 'absolute', right: 80, bottom: 36, fontFamily: 'Geist', fontSize: 22, color: '#ffffff' }, 'mindofkv.com'),
  ]);
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
