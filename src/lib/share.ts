// Share images: one portrait picture per post (LinkedIn, Substack Notes, anywhere else).
// Drawn as SVG in a 540×675 frame and rendered to a 1080×1350 PNG at /share/<id>.png.
// Every image carries KV's name and the site, so it is attributed wherever it travels.
// Headlines are KV's ideas from his own essays; wrap {words} in braces to set them in orange.

import { cardBody } from './cards';

const C = { ink: '#2e2d2a', ink2: '#55544e', ink3: '#96958d', line: '#e2e2de', accent: '#c8582b', stamp: '#f4e4b2', stampEdge: '#d9c587' };
const SANS = 'Satoshi, sans-serif';
const SERIF = 'Sentient, serif';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export interface Share {
  id: string;
  kicker: string;          // the theme, e.g. “Deciding”
  label: string;           // shown top right, e.g. “Model · Inversion”
  headline: string[];      // one entry per line; {braces} = accent
  model?: string;          // reuse this model card's diagram
  art?: string;            // or custom SVG, drawn in 540-wide coordinates
  artTop?: number;         // where the diagram's own drawing starts and ends (its y), to centre it
  artBottom?: number;      // in the space between the headline and the footer
  artScale?: number;
}

// The mascot from the site header, drawn at a given height.
const mascot = (x: number, y: number, h: number) => `<g transform="translate(${x} ${y}) scale(${h / 40})">
<g stroke-linecap="round" stroke-linejoin="round" fill="none">
<path d="M11 26.2 12.4 33 8.6 39.4" stroke="#3b3a35" stroke-width="2.5"/><path d="M11 26.2 9.9 33 13.6 39.4" stroke="#2e2d2a" stroke-width="2.5"/>
<path d="M7.2 39.6h2.6M12.6 39.6h2.8" stroke="#2e2d2a" stroke-width="1.6"/><path d="M12.6 16.4 9.6 21.2 10.6 25" stroke="#a8572f" stroke-width="1.9"/>
<path d="M11 26 13.6 15.8" stroke="#c8582b" stroke-width="4.6"/><path d="M14 16.4 19 19.2 23.6 17.4" stroke="#c8582b" stroke-width="2"/><path d="M23.2 17.4 25.6 16.9" stroke="#a8724f" stroke-width="2.1"/>
</g><circle cx="13.4" cy="11.2" r="3.3" fill="#a8724f"/><path d="M10 10.6c0-2.6 1.6-3.9 3.6-3.9s3.4 1.3 3.4 3.4z" fill="#2e2d2a"/>
<path d="M16.4 9.9 19.4 10.4" stroke="#2e2d2a" stroke-width="1.3" stroke-linecap="round"/></g>`;

const headlineLine = (text: string) =>
  text.split(/(\{[^}]*\})/).filter(Boolean).map((part) =>
    part.startsWith('{') ? `<tspan fill="${C.accent}">${esc(part.slice(1, -1))}</tspan>` : esc(part)).join('');

export function shareSvg(s: Share) {
  // Sentient averages about 0.47em per character: size the headline so the longest line fits 460px.
  const longest = Math.max(...s.headline.map((l) => l.replace(/[{}]/g, '').length));
  const size = Math.min(42, Math.floor(460 / (longest * 0.47)));
  const lh = size * 1.18;
  const y0 = 146;
  const lines = s.headline.map((l, i) =>
    `<text x="40" y="${(y0 + i * lh).toFixed(1)}" font-family="${SERIF}" font-size="${size}" letter-spacing="-1.1" fill="${C.ink}">${headlineLine(l)}</text>`).join('\n');
  const headBottom = y0 + (s.headline.length - 1) * lh;

  const art = s.art ?? (s.model ? cardBody(s.model) : '');
  const scale = s.artScale ?? 1;
  const top = s.artTop ?? 150;
  const bottom = s.artBottom ?? 455;
  // Centre the diagram between the headline and the footer rule (y 598), and horizontally when scaled.
  const free0 = headBottom + 36, free1 = 572;
  const dx = (540 - 540 * scale) / 2;
  const dy = (free0 + free1) / 2 - ((top + bottom) / 2) * scale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 675" width="540" height="675">
<rect width="540" height="675" fill="#ffffff"/>
<text x="40" y="58" font-family="${SANS}" font-size="12" font-weight="700" letter-spacing="1.8"><tspan fill="${C.accent}">LOW GEAR</tspan><tspan fill="${C.ink3}">  ·  ${esc(s.kicker.toUpperCase())}</tspan></text>
<text x="500" y="58" text-anchor="end" font-family="${SANS}" font-size="12" font-weight="700" letter-spacing="0.4" fill="${C.ink3}">${esc(s.label)}</text>
<line x1="40" y1="76" x2="500" y2="76" stroke="${C.line}"/>
${lines}
<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${scale})">${art}</g>
<line x1="40" y1="598" x2="500" y2="598" stroke="${C.line}"/>
${mascot(36, 609, 44)}
<text x="70" y="630" font-family="${SANS}" font-size="16" font-weight="700" fill="${C.ink}">Karthik Viswanathan</text>
<text x="70" y="649" font-family="${SANS}" font-size="12.5" fill="${C.ink3}">KV · mindofkv.com</text>
<text x="500" y="630" text-anchor="end" font-family="${SANS}" font-size="13" font-weight="700" fill="${C.accent}">Low Gear</text>
<text x="500" y="649" text-anchor="end" font-family="${SANS}" font-size="12.5" fill="${C.ink3}">Every Sunday · 5 minutes</text>
</svg>`;
}

// The Low Gear launch picture: a climb with the four parts of every issue along it.
const launchArt = `
<path d="M40 470 C 150 468, 210 440, 270 380 S 400 250, 500 236" stroke="${C.ink}" stroke-width="2" fill="none"/>
<path d="M40 470 L 500 470" stroke="${C.line}" stroke-width="1.5"/>
<g fill="${C.accent}"><circle cx="96" cy="466" r="6"/><circle cx="214" cy="430" r="6"/><circle cx="318" cy="331" r="6"/><circle cx="446" cy="250" r="6"/></g>
<text x="96" y="446" text-anchor="middle" font-family="${SANS}" font-size="15" font-weight="700" fill="${C.ink}">One idea</text>
<text x="96" y="497" text-anchor="middle" font-family="${SANS}" font-size="12.5" fill="${C.ink2}">to use on Monday</text>
<text x="200" y="412" text-anchor="end" font-family="${SANS}" font-size="15" font-weight="700" fill="${C.ink}">One question</text>
<text x="226" y="460" text-anchor="start" font-family="${SANS}" font-size="12.5" fill="${C.ink2}">to sit with</text>
 <text x="304" y="318" text-anchor="end" font-family="${SANS}" font-size="15" font-weight="700" fill="${C.ink}">One book</text>
<text x="332" y="352" text-anchor="start" font-family="${SANS}" font-size="12.5" fill="${C.ink2}">worth your time</text>
<text x="446" y="226" text-anchor="end" font-family="${SANS}" font-size="15" font-weight="700" fill="${C.ink}">One line</text>
<text x="458" y="276" text-anchor="middle" font-family="${SANS}" font-size="12.5" fill="${C.ink2}">worth keeping</text>
<circle cx="112" cy="268" r="44" fill="${C.stamp}" stroke="${C.stampEdge}"/>
<text x="112" y="266" text-anchor="middle" font-family="${SERIF}" font-size="26" letter-spacing="-0.6" fill="${C.ink}">5 min</text>
<text x="112" y="286" text-anchor="middle" font-family="${SANS}" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="${C.ink2}">SUNDAYS</text>`;

// One entry per post in the content plan. Keep ids stable: the desk links to /share/<id>.png.
export const SHARES: Share[] = [
  { id: 'inversion', kicker: 'Deciding', label: 'Inversion', model: 'inversion', artTop: 150, artBottom: 432,
    headline: ['Before you ask how', 'it wins, ask how it', 'could {fail}.'] },
  { id: 'pre-mortem', kicker: 'Deciding', label: 'Pre-mortem', model: 'pre-mortem', artTop: 175, artBottom: 384,
    headline: ['Run the post-mortem', '{before} you launch.'] },
  { id: 'honest-gap-analysis', kicker: 'Getting better', label: 'Honest Gap Analysis', model: 'honest-gap-analysis', artTop: 178, artBottom: 456,
    headline: ['Growth starts with', 'one question:', '{what would it take?}'] },
  { id: 'default-high-trust', kicker: 'Working with people', label: 'Default High Trust', model: 'default-high-trust', artTop: 160, artBottom: 446,
    headline: ['Extend trust first.', 'Don’t make people', '{earn it}.'] },
  { id: '3-is-of-influence', kicker: 'Working with people', label: '3 I’s of Influence', model: '3-is-of-influence', artTop: 152, artBottom: 432,
    headline: ['Good work grows', 'your career when', '{others} know it.'] },
  { id: 'momentum-over-measurement', kicker: 'Getting better', label: 'Momentum over Measurement', model: 'momentum-over-measurement', artTop: 140, artBottom: 410,
    headline: ['Plan Monday.', 'Ship all week.', '{Review Friday.}'] },
  { id: 'low-gear-launch', kicker: 'New every Sunday', label: 'mindofkv.com/weekly', art: launchArt, artTop: 222, artBottom: 500,
    headline: ['One way to think', 'through a {hard call},', 'every Sunday.'] },
];
