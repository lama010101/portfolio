# Laurent Martenot - Portfolio

Static site built with [Astro](https://astro.build) (no backend, no database, no analytics, no cookies).

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs ./dist
npm run preview  # serve the build
```

## Edit the content

- **Config** (name, email, LinkedIn, game URL, form endpoint, site URL): `src/config.ts`
- **Images**: drop files in `public/images/`, then set the path in `src/data/assets.ts`. Empty = visible placeholder.
- **Copy**: each page is a single file in `src/pages/` (`index`, `hire-me`, `backtothepast`, `how-i-work`, `about`).
- **Placeholders**: `[[PLACEHOLDER: ...]]` markers are intentionally loud. See `PLACEHOLDERS.md` for the full list. Replace them with real content, then confirm none remain: `npm run build` and search `dist/` for `PLACEHOLDER`.
- **Contact**: mailto links are built from `config.email`. To add a form, set `config.formEndpoint` to a form service URL (a honeypot field is included).
- **Styling**: `src/styles/global.css` (palette and fonts are CSS variables at the top).

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: New Project, import the repo. Framework preset: Astro (build `npm run build`, output `dist`).
3. Set `siteUrl` in `src/config.ts` to the final URL and redeploy.

## Quality checks done

Lighthouse 12 (default mobile settings, local preview build) scored 95-100 in all four categories on every page. Checked at 360px and 1440px for horizontal scroll: none.
