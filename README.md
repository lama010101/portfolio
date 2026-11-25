# Locale & Logic — studio site

Vendor-facing one-person studio site for multilingual QA and AI evaluation.
Static [Astro](https://astro.build) site — no backend, no database, no analytics, no cookies.

## Stack

- Astro 7 (static output, `dist/`), self-hosted variable fonts (Fraunces + Inter)
- Vanilla JS enhancement layer (`public/site.js`): audience routing, Ctrl+K palette, theme toggle, contact composer
- Works without JS: all content is in the HTML; the audience selector falls back to the default section order

## Content sources

- `src/config.ts` — SITE_NAME, tagline, CONTACT_EMAIL, LINKEDIN_URL, GAME_URL, `SITE_URL` env override
- `src/data/studio.ts` — all site copy: offers, method, proof items, audiences, partner facts, founder bio
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

`vercel.json` issues 301s from all retired portfolio-edition routes (`/atelier*`, `/lens*`, `/studio*`, `/direction*`, `/portfolios*`, `/play*`, `/v2*`, `/hire-me*`, `/how-i-work*`, `/backtothepast*`) to `/`.
