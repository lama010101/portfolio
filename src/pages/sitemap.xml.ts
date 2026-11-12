import { config } from '../config';

const paths = [
  '/',
  '/hire-me/',
  '/backtothepast/',
  '/how-i-work/',
  '/about/',
  '/portfolios/',
  '/studio/',
  '/play/',
  '/lens/',
  '/direction/',
  '/direction/hire/',
  '/direction/backtothepast/',
  '/direction/process/',
  '/direction/about/',
  '/atelier/',
  '/atelier/hire/',
  '/atelier/backtothepast/',
  '/atelier/how-i-work/',
  '/atelier/about/',
];

export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
      .map((p) => `  <url><loc>${new URL(p, config.siteUrl).href}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
