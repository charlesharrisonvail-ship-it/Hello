# Harrison Development (preview site)

Development marketing and licensed sales site for Charles Harrison's proposed brand. Plain HTML, CSS and JS: no framework, no build step, no paid dependencies, no third-party requests.

**Status: local preview only. Not deployed, not broker-approved, not trademark-cleared.** The brand is separate from EpiVail and AiRE Estate; nothing here touches `docs/` (the public AiRE site) or `.claude/`.

## Run it

```bash
python3 -m http.server 8765 --directory harrison-development
# open http://localhost:8765
```

## Test it

Needs Playwright (preinstalled in the Claude Code cloud environment).

```bash
node harrison-development/tests/check.mjs     # 54 checks; also regenerates screenshots and og-image.png
node harrison-development/tests/build-pdf.mjs # re-renders the downloadable checklist PDF
```

## Where things are

| Path | What |
|---|---|
| `index.html`, `privacy.html` | The pages |
| `js/config.js` | **All** brand, contact and form settings. Unknown values stay empty. |
| `css/styles.css` | Styles and color tokens (contrast notes inline) |
| `assets/brand/` | **Approved logo** (`hd-logo-approved-original.png`) plus transparent light versions used on the site; `alt-svg/` holds the earlier editable SVG marks; `og-source.html` makes `og-image.png` |
| `assets/fonts/` | Inter and Fraunces, SIL OFL, self-hosted |
| `docs/VERIFICATION.md`, `docs/LAUNCH-CHECKLIST.md` | What is and isn't verified, and what must happen before launch |
| `docs/PITCH-AND-PROPOSAL-TEMPLATE.md` | Editable pitch and proposal outline |
| `docs/PRESENTATIONS-REVIEW.md` | Why earlier project presentations are not on the public site |
| `assets/downloads/` | Launch-readiness checklist (HTML source and PDF) |
| `docs/COMPETITIVE-BENCHMARK.md` | What competitors do and what this site was missing |
| `screenshots/` | Desktop and mobile previews |

## Contact form

With no `formEndpoint`, the form is visibly **preview only**: it validates, sends nothing, and never shows a success message. It offers an "Open in my email app" button that creates a draft in the visitor's own mail app. When an approved endpoint is set, success shows only after the server returns OK.

## Live site

**https://harrison-development.charlesharrisonvail.workers.dev** (launched 2026-11-09 at Charles's direction).

Hosted free on Cloudflare Workers, with the files in Workers KV. To redeploy after any change, run this from the repo root in a Claude Code cloud session (the Cloudflare credential comes from the session; none is stored in the repo):

```bash
bash harrison-development/deploy/deploy.sh
```

Only the public files are uploaded: never `docs/`, `tests/`, `screenshots/` or `deploy/`, and internal comments are stripped from `js/config.js`. Search engines are still asked not to index the site (`noindex` and `robots.txt`) until Charles's own domain is connected; remove both then.

## Deploy notes (earlier plan)

Any static host works (Netlify, Vercel, Cloudflare Pages, GitHub Pages from its own repo or branch). Publish the `harrison-development/` folder as the site root, after completing `docs/LAUNCH-CHECKLIST.md`. Do not publish from the branch that serves `learn.aireestate.com`.
