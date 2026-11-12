# Laurent Martenot - Portfolio Suite

Static site built with [Astro](https://astro.build) (no backend, no database, no analytics, no cookies).

## Editions included

- **`/portfolios/`** — **All Portfolios Hub**: compares and links to all seven live portfolio editions, with a live responsive viewport previewer (Desktop / Tablet / Mobile).
- **`/`** — **Edition 01: Editorial Consultancy** (`Home`, `Hire Me`, `BackToThePast`, `How I Work`, `About & Contact`).
- **`/play/`** — **Edition 02: Laurent.Play** (`public/play/`, candy neo-brutalist single-page arcade with draggable stickers, confetti, and 4-choice year quiz; configured via `public/play/config.js`).
- **`/studio/`** — **Edition 03: Laurent // Studio** (`src/pages/studio.astro`, playful chromatic AI & web showcase featuring 4 live color worlds, particle physics canvas, Web Audio harmonic synth, playable 8-step AI Director Simulator, EN/FR/ES Multilingual QA Arena, Chrono-Pin timeline scrubber, and Live Mission Brief Composer; wired directly to `src/config.ts` and `src/data/assets.ts`).
- **`/v2/`** — **Edition 04: Portfolio V2 Warm Editorial** (standalone static HTML/CSS/JS under `public/v2/`, editorial minimalism with six-stage interactive build pipeline and spec-sheet details).
- **`/direction/`** — **Edition 05: Direction — Product Builder Lens** (`src/pages/direction/`, adaptive audience lens, interactive 6-step method explorer, live correction evidence slots, command palette (⌘K), keyboard-first nav, WCAG AA).
- **`/lens/`** — **Edition 06: Lens (experimental)** (`src/pages/lens.astro`, multilingual headline switcher, adaptive section reordering, source traceability, dark mode).
- **`/atelier/`** — **Edition 07: Laurent / Atelier** (`src/pages/atelier/`, premium Swiss-editorial field notebook: vermilion blueprint ring illustration, interactive 8-step Idea-to-Product pipeline, audience switcher, Ctrl+K command palette, hire brief builder, live-vs-ambition split and dataset schema card; isolated config in `src/data/atelier.ts`, styles in `src/styles/atelier.css`, progressive enhancement in `public/atelier/atelier.js`).

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
- **Atelier edition**: fully isolated — config, image slots and content in `src/data/atelier.ts` (empty string = visible placeholder), styles `src/styles/atelier.css`, components `src/components/atelier/`, assets `public/atelier/` (favicon, OG card, `atelier.js`). Every interactive piece degrades gracefully without JS.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: New Project, import the repo. Framework preset: Astro (build `npm run build`, output `dist`).
3. Set `siteUrl` in `src/config.ts` to the final URL and redeploy.

## Quality checks done

Lighthouse 12 (default mobile settings, local preview build) scored 95-100 in all four categories on every page. Checked at 360px and 1440px for horizontal scroll: none.
