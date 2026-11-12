# Laurent Martenot — Portfolio V2

Static portfolio for **Laurent Martenot — AI-Native Business & Product Builder**.
Plain HTML/CSS/JS. No build step, no backend, no dependencies, no analytics, no cookies.

## Run locally

```bash
node serve.js        # http://localhost:8080
# or any static server: npx serve .
```

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Hire Me | `hire-me.html` |
| BackToThePast | `backtothepast.html` |
| How I Work | `how-i-work.html` |
| About & Contact | `about.html` |

## Edit the content

- **Config** (name, email, LinkedIn, game/project URLs, form endpoint, site URL): `config.js`
- **Copy**: each page is a single HTML file — text is plain markup.
- **Styling**: `assets/css/main.css` — palette & type are CSS variables at the top.
- **Behavior**: `assets/js/main.js` — placeholders, nav, reveals, stepper, accordion.
- **Images**: the site uses marked image *slots* (no broken `<img>` tags). To add a real photo/screenshot, drop the file in `assets/img/` and replace the matching `.shot` block.
- **Placeholders**: `[[PLACEHOLDER: ...]]` markers are intentionally loud (dashed accent underline + `PH` badges). Full list: `PLACEHOLDERS.md`. Verify none remain before launch: `grep -r "PLACEHOLDER" .`

## How placeholders work

- Values in `config.js` that start with `[[PLACEHOLDER:` render as marked placeholders; links built from them become visibly-marked non-links. Set a real value and they turn into working links automatically.
- `data-cfg="key"` → fills text · `data-cfg-link="key"` → link or placeholder · `data-cfg-optional="key"` → link shown only when configured · `data-mailto="Subject"` → prefilled email link.

## Deploy

The site uses **relative paths**, so it works both standalone (domain root) and mounted under a subpath (e.g. `/v2/`).

- **Vercel (standalone):** import this folder as a project — framework preset "Other", no build command, output = project root.
- **Mounted:** copy this folder into `portfolio/public/v2/` of the main portfolio project → served at `/v2/`.

After deploy: set `siteUrl` in `config.js`, update `sitemap.xml` + `robots.txt`, redeploy.

## Quality notes

- WCAG AA: ink-on-paper ~15:1, accent reserved for large text/decorative use, `--accent-ink` for small accent text.
- `prefers-reduced-motion` disables all animation; keyboard-navigable nav, accordion, stepper; skip-link on every page.
- Static, fast: two font families (Fraunces + Inter via Google Fonts), one CSS file, one JS file.
