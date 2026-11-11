// Shared by the site build and scripts/substack-snapshot.mjs.
import { parse } from 'node-html-parser';

const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? m[1].trim() : '';
};
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// Strip Substack's UI chrome (expand buttons, subscribe widgets, share buttons) and keep clean, readable HTML.
export function cleanHtml(html) {
  const root = parse(html);
  root.querySelectorAll('.image-link-expand, .subscription-widget-wrap, .subscription-widget-wrap-editor, .button-wrapper, .captioned-button-wrap, .share-dialog, svg, source').forEach((n) => n.remove());
  root.querySelectorAll('img').forEach((img) => {
    for (const a of ['srcset', 'sizes', 'data-attrs', 'class', 'width', 'height']) img.removeAttribute(a);
    // Use the original image file rather than Substack's CDN wrapper, which refuses requests from other sites.
    const src = img.getAttribute('src') ?? '';
    const m = src.match(/\/(https%3A%2F%2F.+)$/);
    if (m) img.setAttribute('src', decodeURIComponent(m[1]));
    if (!img.getAttribute('fetchpriority')) img.setAttribute('loading', 'lazy');
    img.setAttribute('referrerpolicy', 'no-referrer'); // Substack's CDN refuses requests from other sites' pages
    if (!img.getAttribute('alt')) img.setAttribute('alt', '');
  });
  root.querySelectorAll('a.image-link').forEach((a) => a.replaceWith(a.querySelector('img')?.toString() ?? ''));
  root.querySelectorAll('picture').forEach((p) => p.replaceWith(p.innerHTML));
  root.querySelectorAll('[data-component-name], [data-attrs]').forEach((n) => { n.removeAttribute('data-component-name'); n.removeAttribute('data-attrs'); });
  return root.toString();
}

export function parseFeed(xml) {
  return xml.split('<item>').slice(1).map((chunk) => {
    const item = chunk.split('</item>')[0];
    const enc = item.match(/<enclosure[^>]*url="([^"]+)"/);
    const url = pick(item, 'link');
    return {
      slug: url.split('/p/')[1]?.replace(/[/?#].*$/, '') ?? '',
      title: decode(pick(item, 'title')),
      subtitle: decode(pick(item, 'description')),
      url,
      date: new Date(pick(item, 'pubDate')).toISOString(),
      image: enc ? decode(enc[1]).replace(/^.*\/(https%3A%2F%2F.+)$/, (_, u) => decodeURIComponent(u)) : undefined,
      html: cleanHtml(pick(item, 'content:encoded')),
    };
  }).filter((p) => p.slug && p.title);
}

