/* Generates brand assets from the same content modules as the site.
 * Run: node scripts/generate-assets.mjs
 */
import { execFileSync } from 'node:child_process';
import { Buffer } from 'node:buffer';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createServer } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
mkdirSync(pub, { recursive: true });

const vite = await createServer({ root, logLevel: 'silent', server: { middlewareMode: true } });
const config = await vite.ssrLoadModule('/src/config.ts');
const site = await vite.ssrLoadModule('/src/content/site.ts');
const services = await vite.ssrLoadModule('/src/content/services.ts');
const packages = await vite.ssrLoadModule('/src/content/packages.ts');
const pages = await vite.ssrLoadModule('/src/content/pages.ts');
const ui = await vite.ssrLoadModule('/src/content/ui.ts');
await vite.close();

const { CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE, SITE_URL } = config;
const { engagementSteps } = site;
const { serviceOffers } = services;
const { packageFootnotes, packageOffers } = packages;
const { homeCopy } = pages;
const { assetCopy } = ui;

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Favicon: two independent strokes sharing one rounded frame. */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#111413"/>
  <path d="M14 39c10-17 20-17 30 0" fill="none" stroke="#E55438" stroke-width="5" stroke-linecap="round"/>
  <path d="M20 25c7 11 17 11 24 0" fill="none" stroke="#4765FF" stroke-width="5" stroke-linecap="round"/>
  <circle cx="47" cy="39" r="4" fill="#F2EDE2"/>
</svg>`;
writeFileSync(join(pub, 'favicon.svg'), faviconSvg);
const icon = sharp(Buffer.from(faviconSvg));
await icon.clone().resize(32, 32).png().toFile(join(pub, 'favicon-32x32.png'));
await icon.clone().resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean).find((candidate) => existsSync(candidate));
if (!chrome) throw new Error('No Chrome/Edge binary found for headless asset rendering');

/* OG image: generated HTML rendered locally by Chrome. */
const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;background:#F2EDE2;color:#111413;font-family:Inter,Segoe UI,Arial,sans-serif;position:relative}
body:before{content:"";position:absolute;inset:0;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 54px,rgba(169,51,31,.2) 54px,rgba(169,51,31,.2) 55px,transparent 55px,transparent 76px);opacity:.75;mask-image:linear-gradient(90deg,#000 0%,transparent 76%)}
.wrap{position:relative;height:100%;padding:58px 64px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:15px;font-family:ui-monospace,Menlo,monospace;font-size:19px;font-weight:700;letter-spacing:.13em;text-transform:uppercase}.mark{width:42px;height:42px;border-radius:12px;background:#111413;position:relative}.mark:before,.mark:after{content:"";position:absolute;left:9px;right:9px;height:14px;border:4px solid #E55438;border-bottom:0;border-radius:20px 20px 0 0;transform:rotate(180deg);top:22px}.mark:after{border-color:#4765FF;transform:none;top:8px}
h1{font-family:Georgia,'Times New Roman',serif;font-size:82px;line-height:.92;letter-spacing:-.045em;font-weight:500;max-width:760px}h1 em{font-style:italic;color:#A9331F}
.deck{display:grid;grid-template-columns:1fr 330px;gap:48px;align-items:end}.sub{margin-top:24px;max-width:710px;color:#424944;font-size:24px;line-height:1.38}.visual{height:190px;border-radius:26px;background:#101315;position:relative;overflow:hidden;box-shadow:0 30px 60px -42px #111}.visual:before{content:"";position:absolute;inset:42px 24px;background:linear-gradient(rgba(247,240,228,.14) 1px,transparent 1px);background-size:100% 28px}.visual svg{position:absolute;inset:0;width:100%;height:100%}
.offers{display:flex;gap:10px;margin-top:28px}.offers span{border:1px solid #D2C7B6;border-radius:999px;background:#FFFAF0;padding:9px 14px;color:#424944;font-family:ui-monospace,Menlo,monospace;font-size:13px;font-weight:700;letter-spacing:.09em;text-transform:uppercase}
.foot{display:flex;justify-content:space-between;gap:32px;color:#5C625C;font-family:ui-monospace,Menlo,monospace;font-size:16px}.foot span:last-child{text-align:right}.foot b{color:#A9331F}
</style></head><body><div class="wrap">
<div class="brand"><span class="mark"></span>${esc(SITE_NAME)}</div>
<div class="deck"><div><h1>${esc(homeCopy.hero.titleA)}<br><em>${esc(homeCopy.hero.titleB)}</em></h1><p class="sub">${esc(assetCopy.ogSummary)}</p><div class="offers">${assetCopy.ogOffers.map((offer) => `<span>${esc(offer)}</span>`).join('')}</div></div>
<div class="visual"><svg viewBox="0 0 330 190" preserveAspectRatio="none"><path d="M18 126 C70 48 105 48 158 112 S250 160 312 82" fill="none" stroke="#FF8C6E" stroke-width="4" stroke-linecap="round"/><path d="M18 84 C78 142 112 142 164 82 S246 38 312 120" fill="none" stroke="#91A4FF" stroke-width="4" stroke-linecap="round"/><circle cx="164" cy="97" r="7" fill="#F7F0E4"/><circle cx="164" cy="97" r="13" fill="none" stroke="#58C7A9" stroke-width="2"/></svg></div></div>
<div class="foot"><span>${esc(SITE_TAGLINE)}</span><span><b>${esc(CONTACT_EMAIL)}</b></span></div>
</div></body></html>`;
const ogPath = join(root, '.og-tmp.html');
writeFileSync(ogPath, ogHtml);
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', '--force-device-scale-factor=1', `--screenshot=${join(pub, 'og.png')}`, `file:///${ogPath.split(String.fromCharCode(92)).join('/')}`], { stdio: 'pipe' });
unlinkSync(ogPath);

/* Capability statement PDF: concise, current, and generated from the same data. */
const serviceRows = serviceOffers.map((offer) => `
  <section class="offer"><b>${esc(offer.index)}</b><h3>${esc(offer.title)}</h3><p class="tag">${esc(offer.tagline)}</p><p>${esc(offer.summary)}</p><ul>${offer.points.slice(0, 3).map((point) => `<li>${esc(point)}</li>`).join('')}</ul></section>`).join('');
const packageRows = packageOffers.map((pkg) => `<tr><th>${esc(pkg.name)}</th><td><b>${esc(pkg.price)}${pkg.unit ? ` ${esc(pkg.unit)}` : ''}</b><br>${esc(pkg.scope)}<br><span>${esc(pkg.delivery)}</span></td></tr>`).join('');
const stepRows = engagementSteps.map((step) => `<div><b>${esc(step.n)}</b><h4>${esc(step.title)}</h4><p>${esc(step.text)}</p></div>`).join('');
const noteRows = packageFootnotes.map((note) => `<li>${esc(note)}</li>`).join('');

const pdfHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:A4;margin:0}*{box-sizing:border-box;margin:0}body{width:210mm;min-height:296mm;padding:15mm 15mm 18mm;background:#fff;color:#111413;font-family:Segoe UI,Arial,sans-serif;font-size:9pt;line-height:1.42}.top{display:flex;justify-content:space-between;border-bottom:2px solid #111413;padding-bottom:8px}.brand{font-family:Georgia,serif;font-size:22pt;letter-spacing:-.03em}.tagline{margin-top:2px;color:#5C625C;font-size:8pt}.meta{text-align:right;color:#5C625C;font-size:7.5pt;line-height:1.5}h1{font-family:Georgia,serif;font-size:20pt;line-height:1.02;letter-spacing:-.03em;margin:10mm 0 3mm}h1 em{font-style:italic;color:#A9331F}.intro{max-width:165mm;color:#424944;font-size:9.5pt}h2{margin:7mm 0 2.5mm;color:#A9331F;font-size:8pt;letter-spacing:.13em;text-transform:uppercase}.offers{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}.offer{border:1px solid #D2C7B6;border-radius:2mm;padding:2.8mm}.offer>b{color:#A9331F;font-family:ui-monospace,Consolas,monospace;font-size:7pt}.offer h3{font-family:Georgia,serif;font-size:11pt;margin:1mm 0}.tag{color:#A9331F;font-size:7.5pt;font-weight:700;font-style:italic}.offer p,.offer li{font-size:7.4pt;color:#424944}.offer ul{padding-left:4mm;margin-top:1.5mm}.offer li{margin-bottom:1mm}table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #E0D7C9;padding:1.8mm 2mm;text-align:left;vertical:top;font-size:7.5pt}th{width:34mm;color:#111413}td{color:#424944}td b{color:#A9331F;font-size:9pt}td span{color:#5C625C;font-size:7pt}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:2.5mm}.steps div{border-top:2px solid #111413;padding-top:1.5mm}.steps b{color:#A9331F;font-family:ui-monospace,Consolas,monospace;font-size:7pt}.steps h4{font-size:8pt;margin:.7mm 0}.steps p{font-size:6.8pt;color:#5C625C}.notes{margin-top:2mm;padding-left:4mm;color:#5C625C;font-size:7pt}.foot{position:absolute;left:15mm;right:15mm;bottom:8mm;border-top:1px solid #D2C7B6;padding-top:2mm;display:flex;justify-content:space-between;color:#5C625C;font-size:7pt}
</style></head><body>
<div class="top"><div><div class="brand">${esc(SITE_NAME)}</div><div class="tagline">${esc(SITE_TAGLINE)}</div></div><div class="meta">${esc(assetCopy.capabilityStatementLabel)}<br>${esc(CONTACT_EMAIL)}<br>${esc(SITE_URL)}</div></div>
<h1>${esc(homeCopy.hero.titleA)} <em>${esc(homeCopy.hero.titleB)}</em></h1><p class="intro">${esc(site.brand.shortPitch)} ${esc(assetCopy.capabilityIntroSuffix)}</p>
<h2>${esc(assetCopy.offersHeading)}</h2><div class="offers">${serviceRows}</div>
<h2>${esc(assetCopy.packagesHeading)}</h2><table>${packageRows}</table><ul class="notes">${noteRows}</ul>
<h2>${esc(assetCopy.processHeading)}</h2><div class="steps">${stepRows}</div>
<div class="foot"><span>${esc(SITE_NAME)} · ${esc(SITE_TAGLINE)}</span><span>${esc(CONTACT_EMAIL)}</span></div>
</body></html>`;
const pdfPath = join(root, '.pdf-tmp.html');
writeFileSync(pdfPath, pdfHtml);
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${join(pub, 'capability-statement.pdf')}`, `file:///${pdfPath.split(String.fromCharCode(92)).join('/')}`], { stdio: 'pipe' });
unlinkSync(pdfPath);

console.log('assets written: favicon.svg, favicon-32x32.png, apple-touch-icon.png, og.png, capability-statement.pdf');
