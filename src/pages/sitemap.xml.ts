import { pageUrl } from '../config';
import { projects } from '../content/work';

const paths = [
  '/',
  '/services/',
  '/how-we-verify/',
  '/how-we-build/',
  '/work/',
  ...projects.map((project) => `/work/${project.slug}/`),
  '/about/',
  '/spot-check/',
  '/contact/',
  '/quality/',
  '/quality/french-lqa-testing/',
  '/quality/multilingual-ai-evaluation/',
  '/terms-of-work/',
];

export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
      .map((path) => `  <url><loc>${pageUrl(path)}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
