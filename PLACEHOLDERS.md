# PLACEHOLDERS

Every item below is shown on the site as a visible yellow `[[PLACEHOLDER: ...]]` marker. Search the built site for `PLACEHOLDER` before launch: there must be zero left (or each remaining one must be deliberate).

## Global config (`src/config.ts`)
| Field | Needed |
|---|---|
| `email` | Contact email. Until set, every "mailto" button is disabled and flagged. |
| `linkedin` | LinkedIn profile URL. |
| `gameUrl` | Live BackToThePast / Guess-History URL. |
| `likedUrl` | LIKED project URL. |
| `promptPulseUrl` | PromptPulse project URL. |
| ~~`siteUrl`~~ | Done: `https://portfolio-lolos-projects-dc7e07be.vercel.app`. Change if you add a custom domain. |
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

## Open decisions
- Public name: BackToThePast or Guess-History (both shown for now).
