// Atmosphere palettes — each one reads like a motion-blurred landscape photo.
// [base, mid, highlight, shadow]
export const PALETTES: Record<string, [string, string, string, string]> = {
  moss:    ['#3d6b45', '#86a86f', '#d4dfae', '#17301f'],
  dune:    ['#c27a45', '#e7b382', '#f6e3c8', '#6b3a22'],
  glacier: ['#2f86e0', '#86cdf8', '#e9f6ff', '#0b3f8f'],
  ember:   ['#c2402f', '#e9775f', '#f7c2b0', '#5e1712'],
  dusk:    ['#6c55c0', '#b897e0', '#f0d9ef', '#251a57'],
  sea:     ['#1c8f93', '#6ed4c6', '#e3f7f1', '#0b4952'],
  stone:   ['#77736b', '#b1aa9f', '#e6e1d8', '#35322d'],
  bloom:   ['#c2477d', '#ea8fb2', '#fbe0ea', '#5c1534'],
};
const KEYS = Object.keys(PALETTES);

export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function paletteFor(seed: string, name?: string) {
  const key = name && PALETTES[name] ? name : KEYS[hash(seed) % KEYS.length];
  return { key, colors: PALETTES[key] };
}
