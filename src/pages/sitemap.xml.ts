import { pageUrl } from '../config';

const paths = [
  '/',
  '/quality/',
  '/ai-evaluation/',
  '/proof/',
  '/partners/',
  '/about/',
  '/contact/',
];

export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
      .map((p) => `  <url><loc>${pageUrl(p)}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
