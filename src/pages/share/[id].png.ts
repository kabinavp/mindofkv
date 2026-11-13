// Portrait 1080×1350 share image for each post in the content plan (see src/lib/share.ts).
import type { APIRoute, GetStaticPaths } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { join } from 'node:path';
import { SHARES, shareSvg } from '../../lib/share';

export const getStaticPaths: GetStaticPaths = () =>
  SHARES.map((s) => ({ params: { id: s.id }, props: { svg: shareSvg(s) } }));

const fontFiles = ['sentient-400.ttf', 'satoshi-400.ttf', 'satoshi-700.ttf'].map((f) => join(process.cwd(), 'src/fonts', f));

export const GET: APIRoute = ({ props }) => {
  const png = new Resvg(props.svg as string, {
    fitTo: { mode: 'width', value: 1080 },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Satoshi' },
  }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
