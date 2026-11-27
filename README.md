# Duet Studio — studio site

Static [Astro](https://astro.build) site for Duet Studio: verification, localization and functional QA, and directed product builds. No backend, database, analytics, cookies, forms, or third-party runtime embeds.

## Stack

- Astro 7, static output in `dist/`
- Self-hosted variable fonts through Fontsource packages (Fraunces + Inter)
- Vanilla JS enhancement layer in `public/site.js`; the site remains readable without it
- Generated visual assets only: SVG/canvas/CSS imagery, OG image, favicon set, and a generated capability statement PDF

## Content sources

- `src/config.ts` — SITE_NAME, tagline, CONTACT_EMAIL, SITE_URL, OG image path, mailto helpers
- `src/content/site.ts` — navigation, shared calls to action, studio facts, footer copy, engagement steps
- `src/content/services.ts` — the three service offers, build capabilities, verification principles and boundaries
- `src/content/packages.ts` — all prices, package scopes, delivery notes, and package footnotes
- `src/content/work.ts` — project names, honest statuses, facts, capabilities, and external links
- `src/content/pages.ts` — page-specific copy for the main pages
- `src/content/quality.ts` — QA, French LQA, and AI evaluation page copy
- `src/content/ui.ts` — shared interface labels, accessibility text, and small reusable UI copy
- `scripts/generate-assets.mjs` — regenerates `public/og.png`, `public/capability-statement.pdf`, and favicon assets (`npm run assets`)

## Commands

```bash
npm run dev        # local dev server
npm run build      # static build -> dist/
npm run preview    # preview the build
npm run check      # astro check (typecheck)
npm run lint       # eslint (js/mjs/ts)
npm run links      # internal link check against dist/ (run after build)
npm run assets     # regenerate OG image, PDF, favicons
```

## Environment

- `SITE_URL` — optional public origin for canonical/sitemap/OG URLs. Defaults to `https://portfolio-psi-topaz-22.vercel.app`. Set it when a custom domain goes live; no DNS changes are made from this repo.

## Portfolio archive

`/portfolios/` is the edition hub. `public/editions/archive/` contains static captures of the seven pre-pivot portfolio editions built from commit `97c6953`; root-relative URLs were rewritten into `/editions/archive/` so the editions can be browsed without restoring the legacy source tree. Third-party font requests were removed from the archived HTML. Archive-only redactions replace prohibited legacy project/profile names and missing-content terminology. The archive is historical reference material, not current studio positioning, and is not used by the Duet Studio pages.

## Redirects

`vercel.json` issues permanent redirects from retired routes. `/partners` now redirects to `/services`; `/proof` redirects to `/work`; `/ai-evaluation` redirects to `/quality/multilingual-ai-evaluation`. `/portfolios/` remains live as the editions hub; the original retired portfolio-edition routes redirect to `/`, while their archived captures remain available under `/editions/archive/`.
