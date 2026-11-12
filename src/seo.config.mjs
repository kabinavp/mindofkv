// Sections that still hold placeholder content. They stay out of Google (noindex + left out of the sitemap)
// until you replace the sample content; then delete the prefix from this list.
export const NOINDEX = ['/opinions', '/articles', '/videos', '/series', '/projects', '/topics', '/now', '/books', '/404'];
export const isNoindex = (path) => NOINDEX.some((p) => path === p || path.startsWith(p + '/') || path.startsWith(p + '.'));
