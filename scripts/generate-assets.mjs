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
const {
  education,
  engagementModel,
  experience,
  founder,
  languageBadge,
  languagePairs,
  languages,
  location,
  methodSteps,
  partnerServiceTypes,
  qualityServices,
  tools,
} = data;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) throw new Error('No Chrome/Edge binary found for headless rendering');
const fileUrl = (p) => 'file:///' + p.split(String.fromCharCode(92)).join('/');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const brandWords = SITE_NAME.split(/\s+/).filter(Boolean);
const brandHtml = brandWords.length > 1
  ? `${esc(brandWords.slice(0, -1).join(' '))} <span>${esc(brandWords.at(-1))}</span>`
  : esc(SITE_NAME);

/* ---------- favicon (pure shapes so SVG+PNG match) ---------- */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#14171D"/>
  <circle cx="25" cy="32" r="15" fill="#FF4B23"/>
  <circle cx="39" cy="32" r="15" fill="#12564F" fill-opacity="0.92"/>
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
  .mark i{width:34px;height:34px;border-radius:50%;background:#FF4B23;display:inline-block;box-shadow:18px 0 0 #12564F;opacity:.95}
  h1{font-size:78px;line-height:1.02;letter-spacing:-.02em;font-weight:500;max-width:15ch}
  h1 em{font-style:italic;color:#B23C1C}
  .sub{font-family:ui-monospace,Menlo,monospace;font-size:21px;color:#4C525C;max-width:56ch;line-height:1.5}
  .langs{display:flex;gap:10px}
  .langs span{font-family:ui-monospace,Menlo,monospace;font-size:15px;letter-spacing:.1em;text-transform:uppercase;border:1px solid #D6D1C5;border-radius:999px;padding:8px 16px;background:#FCFBF8;color:#4C525C}
  .langs span b{color:#12564F;font-weight:600}
  .foot{display:flex;justify-content:space-between;align-items:flex-end;font-family:ui-monospace,Menlo,monospace;font-size:16px;color:#4C525C}
</style></head><body><div class="wrap">
  <div class="mark"><i></i>${esc(SITE_NAME)}</div>
  <div>
    <h1>Human judgement. <em>Machine-paced delivery.</em></h1>
    <p class="sub" style="margin-top:28px">Multilingual QA and localization subcontracting first; carefully directed small software builds second.</p>
    <div class="langs" style="margin-top:36px">
      <span><b>EN&gt;FR</b> primary</span><span><b>FR&gt;EN</b></span><span><b>EN&lt;&gt;ES</b> secondary</span>
    </div>
  </div>
  <div class="foot"><span>${esc(location)}</span><span>${esc(siteUrl.replace('https://', ''))}</span></div>
</div></body></html>`;
const ogPath = join(root, '.og-tmp.html');
writeFileSync(ogPath, ogHtml);
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', '--force-device-scale-factor=1', `--screenshot=${join(pub, 'og.png')}`, fileUrl(ogPath)], { stdio: 'pipe' });

/* ---------- capability statement PDF ---------- */
const serviceRows = qualityServices.map((service) => `
  <div class="service">
    <div class="shead"><span class="idx">${esc(service.index)}</span><h3>${esc(service.title)}</h3></div>
    <p>${esc(service.summary)}</p>
  </div>`).join('');
const pairRows = languagePairs.map((l) => `<div class="pair"><b>${esc(l.pair)}</b><span>${esc(l.note)}</span></div>`).join('');
const engageRows = engagementModel.map((x) => `<li>${esc(x)}</li>`).join('');
const typeRows = partnerServiceTypes.map((x) => `<li>${esc(x)}</li>`).join('');
const method = methodSteps.map((s) => `<div class="m"><b>${s.n}</b><span>${esc(s.title)}</span></div>`).join('');
const langRows = `<tr><td>Languages</td><td>${languages.map((l) => `${l.lang}: ${l.level}`).join(' · ')}</td></tr>`;
const eduRows = `<tr><td>Education</td><td>${education.map((e) => `${e.degree} — ${e.school}`).join('<br>')}</td></tr>`;
const expRows = experience.slice(0, 2).map((e) => `<tr><td class="when">${esc(e.dates)}</td><td><b>${esc(e.role)}</b><br><span class="muted">${esc(e.org)}</span></td></tr>`).join('');
const buildNote = 'Directed small product builds and launch reviews are available as a secondary service; QA and localization subcontracting remain primary.';

const pdfHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 0; }
  * { margin:0; box-sizing:border-box; }
  body { font-family:'Segoe UI',Arial,sans-serif; color:#14171D; width:210mm; min-height:296mm; padding:13mm 14mm 15mm; font-size:8.6pt; line-height:1.36; position:relative; }
  .top { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2.5px solid #14171D; padding-bottom:8px; }
  .brand { font-size:20pt; font-weight:700; letter-spacing:-.5px; }
  .brand span { color:#B23C1C; }
  .tagline { font-size:7.6pt; color:#4C525C; margin-top:2px; max-width:105mm; }
  .meta { text-align:right; font-size:7.4pt; color:#4C525C; line-height:1.45; }
  h1 { font-size:16pt; margin:11px 0 3px; letter-spacing:-.3px; }
  .sub { color:#4C525C; font-size:8.8pt; max-width:160mm; }
  .badge { display:inline-block; margin-top:6px; font-size:7pt; letter-spacing:.08em; text-transform:uppercase; color:#12564F; border:1px solid #12564F; border-radius:99px; padding:2px 8px; }
  h2 { font-size:9.5pt; text-transform:uppercase; letter-spacing:.12em; color:#B23C1C; margin:11px 0 5px; border-bottom:1px solid #D6D1C5; padding-bottom:2px; }
  .pairs { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
  .pair { border:1px solid #D6D1C5; border-radius:7px; padding:6px 7px; }
  .pair b { display:block; font-family:ui-monospace,Menlo,monospace; font-size:9pt; color:#B23C1C; margin-bottom:2px; }
  .pair span { font-size:7.5pt; color:#4C525C; }
  .services { display:grid; grid-template-columns:1fr 1fr; gap:5px; }
  .service { border:1px solid #D6D1C5; border-radius:7px; padding:6px 7px; }
  .shead { display:flex; gap:6px; align-items:baseline; }
  .idx { font-family:ui-monospace,Menlo,monospace; font-size:7pt; color:#B23C1C; }
  .service h3 { font-size:8.7pt; margin:0; }
  .service p { font-size:7.3pt; color:#4C525C; margin-top:2px; }
  ul { padding-left:13px; margin:2px 0; }
  li { font-size:7.5pt; margin-bottom:1px; }
  .twocol { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .method { display:grid; grid-template-columns:repeat(5,1fr); gap:5px; }
  .m { border-top:2px solid #14171D; padding-top:3px; }
  .m b { font-family:ui-monospace,Menlo,monospace; font-size:6.7pt; color:#B23C1C; margin-right:3px; }
  .m span { font-size:7.2pt; font-weight:600; }
  table { width:100%; border-collapse:collapse; font-size:7.5pt; }
  th, td { text-align:left; padding:2.5px 6px; border-bottom:1px solid #E3DFD5; vertical-align:top; }
  th { width:31mm; color:#4C525C; font-weight:600; }
  .when { font-family:ui-monospace,Menlo,monospace; font-size:6.7pt; color:#4C525C; white-space:nowrap; }
  .muted { color:#4C525C; font-size:7.1pt; }
  .smallbox { border:1px dashed #B23C1C; border-radius:7px; padding:6px 7px; margin-top:7px; font-size:7.4pt; color:#4C525C; }
  .foot { position:absolute; bottom:8mm; left:14mm; right:14mm; border-top:1px solid #D6D1C5; padding-top:5px; display:flex; justify-content:space-between; font-size:7pt; color:#4C525C; }
  .foot b { color:#14171D; }
</style></head><body>
  <div class="top">
    <div><div class="brand">${brandHtml}</div><div class="tagline">${esc(SITE_TAGLINE)}</div></div>
    <div class="meta">Capability statement<br>${esc(location)}<br>${esc(CONTACT_EMAIL)}<br>${esc(siteUrl)}</div>
  </div>
  <h1>Multilingual QA vendor capacity for agencies and product teams.</h1>
  <p class="sub">Localization/i18n QA, functional QA, linguistic QA, multilingual AI output evaluation, and rubric or annotation-guideline writing. ${esc(founder.statement)}</p>
  <span class="badge">${esc(languageBadge)}</span>

  <h2>Language pairs offered</h2>
  <div class="pairs">${pairRows}</div>

  <h2>Quality services</h2>
  <div class="services">${serviceRows}</div>

  <h2>Vendor engagement</h2>
  <div class="twocol">
    <div><b>Service types</b><ul>${typeRows}</ul></div>
    <div><b>Engagement model</b><ul>${engageRows}</ul></div>
  </div>

  <h2>Delivery method</h2>
  <div class="method">${method}</div>
  <p class="muted" style="margin-top:4px">Every finding is decided by a human reviewer; AI tools are used for triage and drafting only where the client allows it.</p>

  <h2>Founder, credentials and tools</h2>
  <table>
    <tr><th>Founder</th><td>${esc(founder.name)} — QA test engineer background on Google i18n and Apple localization teams. Lived and worked in France, the US, Mexico and Asia.</td></tr>
    ${langRows}
    ${eduRows}
    ${expRows}
  </table>
  <p class="muted" style="margin-top:3px">Tools: ${esc(tools.join(', '))}.</p>
  <div class="smallbox"><b>Secondary build offer:</b> ${esc(buildNote)}</div>

  <div class="foot"><span><b>${esc(SITE_NAME)}</b> · vendor onboarding by email</span><span>${esc(CONTACT_EMAIL)} · ${esc(siteUrl)}</span></div>
</body></html>`;
const pdfPath = join(root, '.pdf-tmp.html');
writeFileSync(pdfPath, pdfHtml);
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${join(pub, 'capability-statement.pdf')}`, fileUrl(pdfPath)], { stdio: 'pipe' });

console.log('assets written:', ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png', 'og.png', 'capability-statement.pdf'].join(', '));
