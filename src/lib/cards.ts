// Model cards: one picture per model. The same SVG is shown at the top of each model page
// and rendered to a 1080×1080 PNG for LinkedIn (/cards/<id>.png). Attributes are inline (no CSS
// classes) so the image renderer draws exactly what the page shows.

const C = { ink: '#2e2d2a', ink2: '#55544e', ink3: '#96958d', line: '#e2e2de', wash: '#faf8f3', accent: '#c8582b', stamp: '#f4e4b2', stampEdge: '#d9c587' };
const SANS = "Satoshi, ui-sans-serif, system-ui, sans-serif";
const SERIF = "Sentient, Georgia, serif";

type Style = 'k' | 'n' | 'l' | 'u' | 's' | 'b' | 'a' | 'w' | 'wl' | 'd';
const S: Record<Style, string> = {
  k: `font-family="${SANS}" font-size="13" font-weight="700" letter-spacing="1.6" fill="${C.ink3}"`,
  n: `font-family="${SERIF}" font-size="40" letter-spacing="-1.2" fill="${C.ink}"`,
  l: `font-family="${SANS}" font-size="17" fill="${C.ink2}"`,
  u: `font-family="${SANS}" font-size="13" font-weight="700" fill="${C.ink3}"`,
  s: `font-family="${SANS}" font-size="15" fill="${C.ink2}"`,
  b: `font-family="${SANS}" font-size="16" font-weight="700" fill="${C.ink}"`,
  a: `font-family="${SANS}" font-size="14" font-weight="700" fill="${C.accent}"`,
  w: `font-family="${SANS}" font-size="16" font-weight="700" fill="#ffffff"`,
  wl: `font-family="${SANS}" font-size="16" fill="#ffffff"`,
  d: `font-family="${SERIF}" font-size="24" letter-spacing="-0.5" fill="${C.ink}"`,
};
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Extra attributes override the style's own (e.g. a different font-size), never duplicate them.
const t = (x: number, y: number, st: Style, text: string, extra = '') => {
  const keys = [...extra.matchAll(/([\w-]+)=/g)].map((m) => m[1]);
  const base = S[st].replace(/([\w-]+)="[^"]*"/g, (m, k) => (keys.includes(k) ? '' : m));
  return `<text x="${x}" y="${y}" ${base} ${extra}>${esc(text)}</text>`;
};

function frame(n: number, title: string, line: string, body: string, titleSize = 40) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 540" width="540" height="540" role="img" aria-label="${esc(title)}: ${esc(line)}">
<rect width="540" height="540" fill="#ffffff"/>
${t(36, 52, 'k', `MIND OF KV · MODEL ${String(n).padStart(2, '0')}`)}
<text x="36" y="104" font-family="${SERIF}" font-size="${titleSize}" letter-spacing="-1.2" fill="${C.ink}">${esc(title)}</text>
${body}
<line x1="36" y1="468" x2="504" y2="468" stroke="${C.line}"/>
${t(36, 500, 'l', line)}
${t(504, 500, 'u', 'mindofkv.com', 'text-anchor="end"')}
</svg>`;
}

const bodies: Record<string, { line: string; body: string; titleSize?: number }> = {
  inversion: {
    line: 'Solve for failure, then design it out.',
    body: `<rect x="36" y="150" width="468" height="62" rx="8" fill="${C.wash}" stroke="${C.line}"/>
${t(60, 188, 's', 'How do we make this win?', 'font-size="19"')}
<line x1="56" y1="182" x2="300" y2="182" stroke="${C.ink3}" stroke-width="1.5"/>
<path d="M270 222 C 270 248, 270 252, 270 270" stroke="${C.accent}" stroke-width="2.5" fill="none"/>
<path d="M261 262 L270 276 L279 262" stroke="${C.accent}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
${t(290, 254, 'a', 'flip it')}
<rect x="36" y="286" width="468" height="62" rx="8" fill="${C.stamp}" stroke="${C.stampEdge}"/>
${t(60, 325, 'd', 'How could this fail?')}
<path d="M36 381 l9 9 M45 381 l-9 9" stroke="${C.accent}" stroke-width="2" stroke-linecap="round"/>${t(52, 392, 's', 'The launch flops')}<path d="M200 381 l9 9 M209 381 l-9 9" stroke="${C.accent}" stroke-width="2" stroke-linecap="round"/>${t(216, 392, 's', 'Users bounce')}<path d="M352 381 l9 9 M361 381 l-9 9" stroke="${C.accent}" stroke-width="2" stroke-linecap="round"/>${t(368, 392, 's', 'It gets misused')}
${t(36, 430, 's', 'Remove these causes first.')}`,
  },
  'pre-mortem': {
    line: 'Imagine it failed, then fix why.',
    body: `<path d="M455 300 C 400 170, 140 170, 85 290" stroke="${C.accent}" stroke-width="2.5" fill="none" stroke-dasharray="7 6"/>
<path d="M78 278 L84 293 L98 285" stroke="${C.accent}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
${t(270, 190, 'a', 'Write down why. Fix those first.', 'text-anchor="middle"')}
<line x1="70" y1="320" x2="470" y2="320" stroke="${C.ink}" stroke-width="2"/>
<circle cx="85" cy="320" r="9" fill="${C.ink}"/>
<circle cx="270" cy="320" r="9" fill="#ffffff" stroke="${C.ink}" stroke-width="2"/>
<circle cx="455" cy="320" r="15" fill="${C.accent}"/>
<path d="M448 313 L462 327 M462 313 L448 327" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
${t(85, 360, 'b', 'Today', 'text-anchor="middle"')}${t(270, 360, 'b', 'Launch', 'text-anchor="middle"')}${t(455, 360, 'b', '6 months on', 'text-anchor="middle"')}
${t(455, 382, 's', '“It failed.”', 'text-anchor="middle"')}`,
  },
  '3-is-of-influence': {
    line: 'Be known, be understood, be sought out.',
    body: `<rect x="36" y="330" width="146" height="100" rx="6" fill="${C.wash}" stroke="${C.line}"/>
<rect x="197" y="260" width="146" height="170" rx="6" fill="${C.stamp}" stroke="${C.stampEdge}"/>
<rect x="358" y="180" width="146" height="250" rx="6" fill="${C.accent}"/>
${t(50, 362, 'b', 'Information')}${t(50, 384, 's', 'They know')}${t(50, 404, 's', 'your name')}
${t(211, 292, 'b', 'Insight')}${t(211, 314, 's', 'They know')}${t(211, 334, 's', 'your work')}
${t(372, 212, 'w', 'Interact')}${t(372, 234, 'wl', 'They seek')}${t(372, 254, 'wl', 'your input')}
${t(358, 164, 'a', 'Growth starts here ↓')}
<line x1="36" y1="430" x2="504" y2="430" stroke="${C.ink}" stroke-width="1.5"/>`,
  },
  'default-high-trust': {
    line: 'Extend trust first. Keep it.',
    body: `<line x1="70" y1="160" x2="70" y2="420" stroke="${C.ink}" stroke-width="1.5"/>
<line x1="70" y1="420" x2="490" y2="420" stroke="${C.ink}" stroke-width="1.5"/>
${t(58, 172, 's', 'Trust', 'text-anchor="end" font-size="13"')}${t(490, 444, 's', 'Time', 'text-anchor="end" font-size="13"')}
<path d="M70 405 C 200 400, 300 330, 480 285" stroke="${C.ink3}" stroke-width="2.5" fill="none" stroke-dasharray="7 6"/>
<path d="M70 205 C 160 200, 260 210, 340 200 S 450 195, 480 192" stroke="${C.accent}" stroke-width="3" fill="none"/>
<g fill="${C.accent}"><circle cx="150" cy="203" r="4"/><circle cx="230" cy="206" r="4"/><circle cx="310" cy="203" r="4"/><circle cx="390" cy="197" r="4"/></g>
${t(80, 185, 'a', 'Start high, keep it with regular contact')}
${t(480, 335, 's', 'Make them earn it', 'text-anchor="end"')}`,
  },
  'momentum-over-measurement': {
    line: 'A weekly rhythm beats quarterly OKRs.',
    titleSize: 31,
    body: `${t(504, 150, 's', 'Quarterly OKRs', 'text-anchor="end"')}
<line x1="392" y1="145" x2="506" y2="145" stroke="${C.ink3}" stroke-width="1.5"/>
<circle cx="270" cy="300" r="105" fill="none" stroke="${C.line}" stroke-width="14"/>
<path d="M270 195 A105 105 0 0 1 361 352" fill="none" stroke="${C.accent}" stroke-width="4"/>
<path d="M361 352 A105 105 0 0 1 179 352" fill="none" stroke="${C.ink}" stroke-width="4"/>
<path d="M179 352 A105 105 0 0 1 270 195" fill="none" stroke="${C.stampEdge}" stroke-width="4"/>
<circle cx="270" cy="195" r="10" fill="${C.accent}"/><circle cx="361" cy="352" r="10" fill="${C.ink}"/><circle cx="179" cy="352" r="10" fill="${C.stampEdge}"/>
${t(270, 178, 'b', 'Mon · Plan', 'text-anchor="middle"')}${t(372, 384, 'b', 'Tue–Thu · Ship')}${t(168, 384, 'b', 'Fri · Review', 'text-anchor="end"')}
${t(270, 296, 'd', 'Every', 'text-anchor="middle"')}${t(270, 324, 'd', 'week', 'text-anchor="middle"')}`,
  },
  'honest-gap-analysis': {
    line: 'Know the bar. Close the gap.',
    body: `<rect x="90" y="300" width="120" height="130" rx="6" fill="${C.wash}" stroke="${C.line}"/>
<rect x="300" y="180" width="120" height="250" rx="6" fill="${C.stamp}" stroke="${C.stampEdge}"/>
<line x1="90" y1="180" x2="300" y2="180" stroke="${C.accent}" stroke-width="1.5" stroke-dasharray="5 5"/>
<line x1="150" y1="186" x2="150" y2="294" stroke="${C.accent}" stroke-width="2"/>
<path d="M143 194 L150 184 L157 194 M143 286 L150 296 L157 286" stroke="${C.accent}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
${t(164, 236, 'a', 'The gap:')}${t(164, 256, 'a', 'write it down')}
${t(150, 452, 'b', 'You now', 'text-anchor="middle"')}${t(360, 452, 'b', 'Next level', 'text-anchor="middle"')}
${t(438, 214, 's', 'Ask')}${t(438, 250, 's', 'Write')}${t(438, 286, 's', 'Validate')}${t(438, 322, 's', 'Track')}`,
  },
};

export const hasCard = (id: string) => id in bodies;
/** The diagram alone (no frame), drawn in the card's 540-wide coordinates. Reused by share images. */
export const cardBody = (id: string) => bodies[id]?.body ?? '';
export function cardSvg(id: string, n: number, title: string) {
  const b = bodies[id];
  return b ? frame(n, title, b.line, b.body, b.titleSize) : '';
}
