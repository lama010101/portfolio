# PLACEHOLDERS — Laurent Martenot Portfolio V2

Every `[[PLACEHOLDER: ...]]` marker below is **visible on the site by design** so nothing unverified can ship by accident. Replace each with real content, then confirm none remain (`grep -r "PLACEHOLDER" .` before deploy).

## Config-driven (`config.js`)

| Key | Where it appears | What's needed |
|---|---|---|
| `linkedin` | Footer (all pages), Hire Me, About | LinkedIn profile URL |
| `gameUrl` | Home project card, BackToThePast hero + screenshot note | Public URL of the live Guess-History game |
| `likedUrl` | Home project card, footer, Hire Me references | Public URL of LIKED (when public) |
| `promptPulseUrl` | Home project card, footer, Hire Me references | Public URL of PromptPulse (when public) |
| `formEndpoint` | About & Contact | Optional form service URL (Formspree/Basin). Empty = mailto only. If set, a form with honeypot renders automatically. |
| `siteUrl` | Canonical, og:url, sitemap.xml, robots.txt | Production domain (e.g. `https://portfolio-psi-topaz-22.vercel.app`). Also update `sitemap.xml` + `robots.txt` `YOUR-DOMAIN.example.com`. |

## Home (`index.html`)

- **Portrait** — professional photo of Laurent Martenot (hero card). Drop a real photo in `assets/img/` and replace the slot.
- **BackToThePast screenshots** — gameplay captures for the featured project card.
- **LIKED screenshots/mockups** — product visuals (concept stage is fine if labeled).
- **PromptPulse visuals** — mechanics diagram or mock interface.

## Hire Me (`hire-me.html`)

- No inline placeholders — all contact points are config-driven (`email` is real: laurent.martenot@gmail.com; `linkedin` pending).

## BackToThePast (`backtothepast.html`)

- **3 game screenshots** — lobby/round setup, guessing interface, results & AI opponents.
- **Dataset schema confirmation** — confirm final field list for the event record table.
- **Licensing terms** — rights/usage terms per record (needs counsel/partner input).
- **Methodology M1–M6** — event selection, source identification, conflicting accounts, fact review, provenance, rights & licenses.
- **Sample download** — publish the 50–100 event sample when verified (do NOT fabricate).

## How I Work (`how-i-work.html`)

- **Problem statement** — the real problem Guess-History solves.
- **Product decisions** — 2–4 real decisions + reasoning from the build.
- **2 agent-instruction docs** — real prompts/requirements used (shown in editor-style cards).
- **Agent coordination** — 4 items: task scoping, change review, regression guards, test supervision.
- **"When the AI got it wrong"** — 2 example slots × (problem / wrong output / my correction). Spec allows 2–3; add a third grid if a third real case exists.
- **3 result screenshots** — game in play, AI model results, deployed build.
- **Workflow video** — short screen-recording embed slot.
- **Second case study** — "Building this portfolio with AI" (post-launch).

## About & Contact (`about.html`)

- **Portrait** — same professional photo as Home.
- **Extra link** — any additional professional link (GitHub, Substack, etc.).

## Assets & metadata

- **`assets/og.svg`** — social card is SVG; replace with a 1200×630 PNG/JPG for full platform support, then update `og:image`/`twitter:image` in all 5 pages.
- **`sitemap.xml` / `robots.txt`** — replace `YOUR-DOMAIN.example.com` with the real domain.
