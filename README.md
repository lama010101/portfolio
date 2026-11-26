# Duet Studio — studio site

Vendor-facing studio site for multilingual QA, localization, AI evaluation and carefully directed small software builds.
Static [Astro](https://astro.build) site — no backend, no database, no analytics, no cookies.

## Stack

- Astro 7 (static output, `dist/`), system serif and sans font stacks
- Vanilla JS enhancement layer (`public/site.js`): audience routing, Ctrl+K palette, theme toggle, contact composer
- Works without JS: all content is in the HTML; the audience selector falls back to the default section order

## Content sources

- `src/config.ts` — SITE_NAME, tagline, CONTACT_EMAIL, LINKEDIN_URL, `SITE_URL` env override
- `src/data/studio.ts` — studio copy: services, methods, partner facts, onboarding, founder bio
- `src/data/work/projects/*.ts` — one data file per work case study; adding a file in that folder adds the project to `/work/` and `/work/<slug>/`
- `scripts/generate-assets.mjs` — regenerates `public/og.png`, `public/capability-statement.pdf`, favicon PNGs from the same constants (`npm run assets`)

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

## Redirects

`vercel.json` issues 301s from retired portfolio-edition routes and retired studio routes to the current pages.
