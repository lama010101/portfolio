import { pageUrl } from '../config';
import { projects } from '../data/work';

const paths = [
  '/',
  '/services/',
  '/quality/',
  '/quality/french-lqa-testing/',
  '/quality/multilingual-ai-evaluation/',
  '/partners/',
  '/work/',
  ...projects.map((project) => `/work/${project.slug}/`),
  '/how-we-build/',
  '/about/',
  '/terms-of-work/',
  '/contact/',
];

export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
      .map((p) => `  <url><loc>${pageUrl(p)}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
