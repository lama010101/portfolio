# PLACEHOLDERS

Every item below is shown on the site as a visible yellow `[[PLACEHOLDER: ...]]` marker across the Editorial edition (`/`), the Studio edition (`/studio/`), and the Play edition (`/play/`). Search the built site for `PLACEHOLDER` before launch: there must be zero left (or each remaining one must be deliberate).

> Note: `/` and `/studio/` both read directly from `src/config.ts` and `src/data/assets.ts`. `/play/` is a standalone static edition under `public/play/` and reads from `public/play/config.js`.

## Global config (`src/config.ts`)
| Field | Needed |
|---|---|
| `email` | Contact email. Until set, every "mailto" button is disabled and flagged. |
| `linkedin` | LinkedIn profile URL. |
| `gameUrl` | Live BackToThePast / Guess-History URL. |
| `likedUrl` | LIKED project URL. |
| `promptPulseUrl` | PromptPulse project URL. |
| ~~`siteUrl`~~ | Done: `https://portfolio-psi-topaz-22.vercel.app` (the indexable production domain; the `portfolio-lolos-projects-dc7e07be.vercel.app` alias sends `X-Robots-Tag: noindex`). Change if you add a custom domain. |
| `ogImage` | 1200x630 social sharing image (path under `/public`). None yet. |
| `formEndpoint` | Optional. Form service URL. Empty = mailto only, no form shown. |

## Images (`src/data/assets.ts`, files in `public/images/`)
`portrait` (Home, About), `gameScreen1-3` (Home, BackToThePast), `likedScreen`, `promptPulseScreen`, `caseResult`, `datasetPreview` (unused for now).

## Home
- Status labels for LIKED and PromptPulse: launched / prototype / concept.
- Portrait, screenshots and project URLs as above.

## Hire Me
- Verified roles, employers and dates from the CV.
- Short professional biography (2-3 sentences).

## BackToThePast
- Accurate description of game concept and rules.
- Game screenshots (3) and a short demo (video or GIF).
- Downloadable sample dataset (50-100 events) or keep the development-stage notice.
- Dataset methodology (6 items: selection, sources, conflicting accounts, review, provenance) and licensing terms.

## How I Work
- Real content for the Guess-History case study: original idea, problem, product decisions, prompts/instructions, agent coordination.
- 2-3 real "when the AI got it wrong" examples (problem, wrong output, correction).
- Working-result screenshot, workflow video embed.
- Portfolio case study (after launch).

## About & Contact
- Bio and career history exactly as in the CV (employers, titles, dates).
- Second (American) MBA: institution and year. The specs conflict (one MBA vs two): confirm or remove.
- Google/Apple roles and dates from the CV.
- Professional photograph; optional additional link.

## Lens (`/lens/`)
- Everything above applies (same `config.ts` + `assets.ts` sources). Additional slots:
- Portrait photo (`assets.portrait`); project screenshots (`assets.gameScreen1-3`, `likedScreen`, `promptPulseScreen`).
- `[[PLACEHOLDER: status: launched / prototype / concept]]` for LIKED and PromptPulse.
- Portrait, LIKED/PromptPulse URLs, email and LinkedIn come from `src/config.ts`.
- 3 "when the AI got it wrong" examples (problem / wrong output / correction), workflow video embed, Guess-History case-study prompts and agent instructions, portfolio case study.
- Game concept/rules description, demo video/GIF, dataset sample + methodology + licensing, verified CV roles/dates, bio, second MBA, additional link.

## Atelier (`/atelier/`)
All values live in `src/data/atelier.ts` (empty string = visible placeholder) — it does not read `src/config.ts`. Email is already set (`laurent.martenot@gmail.com`).
- **Global**: `linkedin` (profile URL), `gameUrl` (live BackToThePast URL), `likedUrl`, `promptPulseUrl`, `formEndpoint` (optional; mailto is the working mechanism). Image slots in `atelierAssets`: `portrait`, `gameScreen1-3`, `likedScreen`, `promptPulseScreen`, `caseResult`, `datasetSample`, `workflowVideo`.
- **Home** (`/atelier/`): LIKED status chip + LIKED process detail; PromptPulse process detail; BackToThePast screenshot; LIKED/PromptPulse URLs.
- **Hire** (`/atelier/hire/`): LinkedIn URL only — all other contact paths use the verified email.
- **BackToThePast** (`/atelier/backtothepast/`): live game URL (Play CTA), 3 screenshots, gameplay demo video/GIF, downloadable dataset sample (50–100 events), 6 methodology items + licensing terms.
- **How I Work** (`/atelier/how-i-work/`): 5 case-study evidence blocks (idea, problem, decisions, prompts/instructions, agent coordination), 3 "when the AI got it wrong" examples (problem / wrong output / correction), working-result screenshot, workflow video embed, portfolio case study.
- **About** (`/atelier/about/`): professional photograph (real photo only — monogram panel shown meanwhile), LinkedIn URL, optional additional link.

## Open decisions
- Public name: BackToThePast or Guess-History (both shown for now).
