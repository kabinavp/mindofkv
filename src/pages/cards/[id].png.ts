// Square 1080×1080 PNG of each model card, for LinkedIn.
import type { APIRoute, GetStaticPaths } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { join } from 'node:path';
import { getModels } from '../../lib/content';
import { cardSvg, hasCard } from '../../lib/cards';

export const getStaticPaths: GetStaticPaths = async () =>
  (await getModels()).map((m, i) => ({ m, n: i + 1 })).filter(({ m }) => hasCard(m.id))
    .map(({ m, n }) => ({ params: { id: m.id }, props: { svg: cardSvg(m.id, n, m.data.title) } }));

const fontFiles = ['sentient-400.ttf', 'satoshi-400.ttf', 'satoshi-700.ttf'].map((f) => join(process.cwd(), 'src/fonts', f));

export const GET: APIRoute = ({ props }) => {
  const png = new Resvg(props.svg as string, {
    fitTo: { mode: 'width', value: 1080 },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Satoshi' },
  }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
