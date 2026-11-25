/* Internal link check for the built site in dist/.
 * Verifies every internal href/src resolves to a built page or public asset,
 * and that same-site #anchors exist in the target document.
 * Run after `npm run build`: node scripts/check-links.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
if (!existsSync(dist)) { console.error('dist/ not found — run npm run build first'); process.exit(1); }

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const pages = new Map(); // route path -> { file, html }
for (const f of htmlFiles) {
  const rel = f.slice(dist.length).replace(/\\/g, '/');
  const route = rel === '/index.html' ? '/' : rel.replace(/index\.html$/, '');
  pages.set(route, { file: f, html: readFileSync(f, 'utf8') });
}

const resolvePath = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null;
  // asset-like paths (contain a file extension) resolve to files in dist
  const last = clean.split('/').pop() || '';
  if (/\.[a-z0-9]+$/i.test(last)) return existsSync(join(dist, clean)) ? clean : null;
  if (clean === '/') return '/';
  const c = clean.endsWith('/') ? clean : clean + '/';
  return pages.has(c) ? c : null;
};

const errors = [];
let checked = 0;
for (const [route, { html }] of pages) {
  const re = /(?:href|src|action)=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (/^(mailto:|tel:|javascript:|data:|https?:|#)/.test(url)) {
      if (url.startsWith('#')) {
        const id = url.slice(1);
        if (id && !html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) errors.push(`${route}: missing anchor ${url}`);
      }
      continue;
    }
    if (!url.startsWith('/')) continue;
    checked++;
    const [pathPart, hash] = url.split('#');
    const target = resolvePath(pathPart === '' ? route : pathPart);
    if (pathPart === '') {
      // same-page anchor
      if (hash && !html.includes(`id="${hash}"`)) errors.push(`${route}: missing same-page anchor #${hash}`);
      continue;
    }
    if (!target) { errors.push(`${route}: broken link ${url}`); continue; }
    if (hash) {
      const th = pages.get(target).html;
      if (!th.includes(`id="${hash}"`)) errors.push(`${route}: ${url} — target ${target} lacks #${hash}`);
    }
  }
}

// static assets referenced from public/ must exist in dist
for (const asset of ['/site.js', '/favicon.svg', '/favicon-32x32.png', '/apple-touch-icon.png', '/og.png', '/capability-statement.pdf', '/robots.txt', '/sitemap.xml']) {
  if (!existsSync(join(dist, asset))) errors.push(`missing public asset: ${asset}`);
}

console.log(`checked ${checked} internal links across ${pages.size} pages`);
if (errors.length) { console.error('BROKEN:\n' + errors.join('\n')); process.exit(1); }
console.log('link check passed');
