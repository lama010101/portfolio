/* Generates brand assets from the same content constants as the site:
 *   public/favicon.svg, favicon-32x32.png, apple-touch-icon.png  (sharp)
 *   public/og.png          (1200x630, headless Chrome screenshot of generated HTML)
 *   public/capability-statement.pdf (A4, headless Chrome print-to-pdf)
 * Run: node scripts/generate-assets.mjs
 */
import { execFileSync } from 'node:child_process';
import { Buffer } from 'node:buffer';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createServer } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
mkdirSync(pub, { recursive: true });

// Load the TS content modules through Vite so extensionless imports and
// import.meta.env resolve exactly as they do in the Astro build.
const vite = await createServer({ root, logLevel: 'silent', server: { middlewareMode: true } });
const config = await vite.ssrLoadModule('/src/config.ts');
const data = await vite.ssrLoadModule('/src/data/studio.ts');
await vite.close();

const { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE, siteUrl } = config;
const { education, experience, founder, languageBadge, languages, location, methodSteps, offers, partnerFacts, tools } = data;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) throw new Error('No Chrome/Edge binary found for headless rendering');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- favicon (pure shapes so SVG+PNG match) ---------- */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#14171D"/>
  <rect x="13" y="13" width="27" height="27" rx="7" fill="#FF4B23"/>
  <rect x="26" y="26" width="27" height="27" rx="7" fill="#12564F"/>
</svg>`;
writeFileSync(join(pub, 'favicon.svg'), faviconSvg);
const icon = sharp(Buffer.from(faviconSvg));
await icon.clone().resize(32, 32).png().toFile(join(pub, 'favicon-32x32.png'));
await icon.clone().resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));

/* ---------- OG image: HTML -> Chrome screenshot ---------- */
const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#F3F1EC;color:#14171D;font-family:Georgia,'Times New Roman',serif;position:relative;overflow:hidden}
  body::before{content:'';position:absolute;inset:0;background-image:linear-gradient(#E3DFD5 1px,transparent 1px),linear-gradient(90deg,#E3DFD5 1px,transparent 1px);background-size:72px 72px;opacity:.5;mask-image:radial-gradient(120% 90% at 50% 0%,#000 0%,transparent 70%)}
  .wrap{position:relative;padding:64px 72px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
  .mark{display:inline-flex;align-items:center;gap:14px;font-family:ui-monospace,Menlo,monospace;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#4C525C}
  .mark i{width:34px;height:34px;border-radius:8px;background:#14171D;display:inline-block;position:relative}
  .mark i::before{content:'';position:absolute;left:8px;top:8px;width:11px;height:11px;border-radius:3px;background:#FF4B23}
  .mark i::after{content:'';position:absolute;right:8px;bottom:8px;width:11px;height:11px;border-radius:3px;background:#12564F}
  h1{font-size:84px;line-height:1.02;letter-spacing:-.02em;font-weight:500;max-width:16ch}
  h1 em{font-style:italic;color:#B23C1C}
  .sub{font-family:ui-monospace,Menlo,monospace;font-size:22px;color:#4C525C;max-width:52ch;line-height:1.5}
  .langs{display:flex;gap:10px}
  .langs span{font-family:ui-monospace,Menlo,monospace;font-size:15px;letter-spacing:.1em;text-transform:uppercase;border:1px solid #D6D1C5;border-radius:999px;padding:8px 16px;background:#FCFBF8;color:#4C525C}
  .langs span b{color:#12564F;font-weight:600}
  .foot{display:flex;justify-content:space-between;align-items:flex-end;font-family:ui-monospace,Menlo,monospace;font-size:16px;color:#4C525C}
  .foot a{color:#B23C1C;text-decoration:none}
</style></head><body><div class="wrap">
  <div class="mark"><i></i>${esc(SITE_NAME)}</div>
  <div>
    <h1>Multilingual quality for <em>AI and software.</em></h1>
    <p class="sub" style="margin-top:28px">${esc(SITE_TAGLINE)} Human review of apps, games and AI outputs.</p>
    <div class="langs" style="margin-top:36px">
      <span><b>FR</b> native</span><span><b>EN</b> near-native</span><span><b>ES</b> professional</span>
    </div>
  </div>
  <div class="foot"><span>${esc(location)}</span><span>${esc(siteUrl.replace('https://', ''))}</span></div>
</div></body></html>`;
const ogPath = join(root, '.og-tmp.html');
writeFileSync(ogPath, ogHtml);
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', '--force-device-scale-factor=1', `--screenshot=${join(pub, 'og.png')}`, `file:///${ogPath.replace(/\\/g, '/')}`], { stdio: 'pipe' });

/* ---------- capability statement PDF ---------- */
const li = (xs) => xs.map((x) => `<li>${esc(x)}</li>`).join('');
const offerRows = offers.map((o) => `
  <div class="offer ${o.secondary ? 'secondary' : ''}">
    <div class="ohead"><span class="idx">${o.index}</span><h3>${esc(o.title)}</h3></div>
    <p class="tag">${esc(o.tagline)}</p>
    <p>${esc(o.summary)}</p>
    <p class="lbl">Includes</p><ul>${li(o.points)}</ul>
    <p class="lbl">Deliverable</p><ul>${li(o.deliverables)}</ul>
  </div>`).join('');
const methRows = methodSteps.map((s) => `<div class="m"><b>${s.n}</b><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div>`).join('');
const partnerRows = partnerFacts.map((f) => `<tr><th>${esc(f.k)}</th><td>${esc(f.v)}</td></tr>`).join('');
const langRows = languages.map((l) => `<tr><td>${esc(l.lang)}</td><td>${esc(l.level)}</td></tr>`).join('');
const eduRows = education.map((e) => `<tr><td>${esc(e.school)}</td><td>${esc(e.degree)}${e.detail ? ' — ' + esc(e.detail) : ''}</td></tr>`).join('');
const expRows = experience.slice(0, 4).map((e) => `<tr><td class="when">${esc(e.dates)}</td><td><b>${esc(e.role)}</b><br><span class="muted">${esc(e.org)}</span></td></tr>`).join('');

const pdfHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 0; }
  * { margin:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#14171D; width:210mm; min-height:296mm; padding:16mm 15mm; font-size:9.5pt; line-height:1.45; }
  .top { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2.5px solid #14171D; padding-bottom:10px; }
  .brand { font-size:20pt; font-weight:700; letter-spacing:-.5px; }
  .brand span { color:#B23C1C; }
  .tag { font-size:8pt; color:#4C525C; margin-top:2px; }
  .meta { text-align:right; font-size:8pt; color:#4C525C; line-height:1.5; }
  h1 { font-size:17pt; margin:14px 0 4px; letter-spacing:-.3px; }
  .sub { color:#4C525C; font-size:9.5pt; max-width:150mm; }
  .badge { display:inline-block; margin-top:8px; font-size:7.5pt; letter-spacing:.08em; text-transform:uppercase; color:#12564F; border:1px solid #12564F; border-radius:99px; padding:3px 10px; }
  h2 { font-size:10.5pt; text-transform:uppercase; letter-spacing:.12em; color:#B23C1C; margin:16px 0 6px; border-bottom:1px solid #D6D1C5; padding-bottom:3px; }
  .offers { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
  .offer { border:1px solid #D6D1C5; border-radius:8px; padding:9px 10px; }
  .offer.secondary { border-style:dashed; }
  .ohead { display:flex; gap:7px; align-items:baseline; }
  .idx { font-family:ui-monospace,Menlo,monospace; font-size:8pt; color:#B23C1C; }
  .offer h3 { font-size:10pt; margin:0; }
  .tag { font-size:8.5pt; font-weight:600; margin:3px 0 4px; }
  .lbl { font-size:7pt; text-transform:uppercase; letter-spacing:.1em; color:#4C525C; margin:6px 0 2px; }
  ul { padding-left:14px; margin:2px 0 4px; }
  li { font-size:8.3pt; margin-bottom:1.5px; }
  p { font-size:8.6pt; margin:2px 0; }
  .method { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; }
  .m { border-top:2px solid #14171D; padding-top:5px; }
  .m b { font-family:ui-monospace,Menlo,monospace; font-size:7.5pt; color:#B23C1C; }
  .m h4 { font-size:8.8pt; margin:2px 0 2px; }
  .m p { font-size:7.6pt; color:#4C525C; }
  table { width:100%; border-collapse:collapse; font-size:8.6pt; }
  th, td { text-align:left; padding:3.5px 8px; border-bottom:1px solid #E3DFD5; vertical-align:top; }
  th { width:34mm; color:#4C525C; font-weight:600; }
  .when { font-family:ui-monospace,Menlo,monospace; font-size:7.6pt; color:#4C525C; white-space:nowrap; }
  .muted { color:#4C525C; font-size:8pt; }
  .foot { position:absolute; bottom:10mm; left:15mm; right:15mm; border-top:1px solid #D6D1C5; padding-top:6px; display:flex; justify-content:space-between; font-size:7.5pt; color:#4C525C; }
  .foot b { color:#14171D; }
</style></head><body>
  <div class="top">
    <div><div class="brand">${esc(SITE_NAME)} <span>&amp;</span> Logic</div><div class="tag">${esc(SITE_TAGLINE)}</div></div>
    <div class="meta">Capability statement<br>${esc(location)}<br>${esc(CONTACT_EMAIL)}<br>${esc(siteUrl)}</div>
  </div>
  <h1>Multilingual quality for AI and software.</h1>
  <p class="sub">Native-French, near-native English, professional Spanish. Human review of apps, games and AI outputs — ${esc(founder.statement)}</p>
  <span class="badge">${esc(languageBadge)}</span>

  <h2>Offers</h2>
  <div class="offers">${offerRows}</div>

  <h2>Method</h2>
  <div class="method">${methRows}</div>
  <p class="muted" style="margin-top:5px">Every finding is decided by a human reviewer; AI tools are used for triage and drafting only where the client allows it.</p>

  <h2>For agencies &amp; vendors</h2>
  <table>${partnerRows}</table>

  <h2>Founder &amp; languages</h2>
  <table>
    <tr><th>Founder</th><td>${esc(founder.name)} — ${esc(founder.statement)} Lived and worked in France, the US, Mexico and Asia.</td></tr>
    ${langRows}
    ${eduRows}
    ${expRows}
  </table>
  <p class="muted" style="margin-top:4px">Tools: ${esc(tools.join(', '))}.</p>

  <div class="foot"><span><b>${esc(SITE_NAME)}</b> · ${esc(SITE_TAGLINE)}</span><span>${esc(CONTACT_EMAIL)} · ${esc(siteUrl)}</span></div>
</body></html>`;
const pdfPath = join(root, '.pdf-tmp.html');
writeFileSync(pdfPath, pdfHtml);
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${join(pub, 'capability-statement.pdf')}`, `file:///${pdfPath.replace(/\\/g, '/')}`], { stdio: 'pipe' });

console.log('assets written:', ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png', 'og.png', 'capability-statement.pdf'].join(', '));
