---
name: harrison-development
description: >
  Brand card for Harrison Development (HD), Charles Harrison's development
  marketing and licensed sales brand at harrisondev.org. Use this skill whenever
  Charles mentions Harrison Development, HD, harrisondev.org, the HD logo, a
  developer or landowner pitch, a project concept page, or asks for anything
  made in the HD look: site changes, pitch presentations, social graphics,
  banners, email signatures, video reels, or proposals. It holds the official
  logos, colors, type, voice, site and publishing steps, and the rules Charles
  has set. HD is separate from EpiVail and AiRE Estate; their rules do not apply.
---

# Harrison Development brand card

Harrison Development (HD) is Charles Harrison's third brand: **development
marketing plus licensed real estate sales** for developers, builders and
landowners. It is not construction, fundraising or project ownership.

Every dated decision behind this card is in
`.claude/memory/harrison-development.md`. Read it before a change that touches
positioning, photos of Charles, or anything public. Where this card and that file
disagree, the newer dated line in the memory file wins.

## Identity

- **Name:** Harrison Development. Monogram: HD.
- **Descriptor:** Development Marketing & Sales.
- **Site:** https://harrisondev.org (the only address to print or link).
- **Charles's title:** exactly `Owner, CEO`. Nothing appended. No LLC claim.
- **Positioning line:** Knows the market. Teaches the AI. Carries the sale.
- **Service area:** Colorado statewide, with a focus on the mountain markets.
- **Attribution:** Led by Charles Harrison. Real estate brokerage services
  provided through Epique Realty.
- **Contact:** 970-904-0600, charlesharrison@epique.me (shown as an address
  only).
- **Signature for HD email:** Charles Harrison, Harrison Development |
  Development Marketing & Sales. Never the EpiVail or AiRE Estate signature.

## Official logos

Charles supplied these on 2026-11-12 as the official set. Use them as they are:
never redraw, recolor, restyle, stretch or regenerate the logo. If a size or
layout is missing, ask Charles for it rather than making one.

Files live in `harrison-development/assets/brand/official/`:

| File | Layout | Use it for |
|---|---|---|
| `hd-logo-stacked.webp` (1254 x 1254) | Monogram above the name | Square placements, covers, profile images |
| `hd-logo-horizontal.png` (1200 x 400) | Monogram left, name right | Site footer, document headers, wide placements |
| `hd-logo-horizontal-small.png` (600 x 200) | Same, small | Email signatures, small web uses |
| `hd-social-card.png` (1640 x 856) | Horizontal with harrisondev.org | Link previews and social share images |
| `hd-banner.png` (1512 x 256) | Wide strip with harrisondev.org | Page and profile banners |

Charles has also shown more official layouts that are **not saved in the
repository yet** (they arrived as chat images only): a 1584 x 396 profile banner,
a tall poster with the web address, a 1080 x 1350 post frame with the logo on top
and the descriptor at the bottom, a 1080 x 1080 square with the web address, a
monogram-only mark, a 1200 x 630 share card, a 1080 x 1920 story layout, a
1500 x 500 banner, and 16:9 title cards. Ask him for the files (Google Drive
works) before a job needs one.

Older working files in `harrison-development/assets/brand/` (transparent logo and
mark, favicon) are derived from the same approved logo and stay in use on the
site.

Logo rules:

- The logos are silver on black. Place them on black or near-black only. On the
  site's charcoal, use `mix-blend-mode: screen` so the black box disappears.
- Keep clear space around the logo at least the height of the "H".
- The logo still needs trademark clearance and a vector version. Do not claim it
  is registered.

## Look

- **All dark.** Charcoal `#14181C`, raised `#1A2026`, deep `#0E1114`, cool-white
  text `#EEF1F3`, soft text `#A9B1B7`.
- **Accent:** neon yellow `#DFFF1A` at full strength, with dark text on it.
- **Never** cream, off-white, brown or copper. Charles rejected all of them.
- **Type:** Space Grotesk for display, set light (hero 300, headings 400), with
  tight tracking. Inter for body. No serifs and no heavy weights; he called both
  "elementary".
- **Motion:** he wants full motion: video, scroll effects, hover effects. Every
  effect must stop for reduced motion and for the site's Pause motion button.
- **Everything on the homepage.** No tabs and no extra pages.

## Voice

Confident, specific, commercially useful. Courteous and warm. Describe services,
never outcomes: no promised demand, sales pace, price or return. No invented
results, clients, testimonials or production numbers.

## Charles's standing rules

- **No links to Epique or EpiVail websites** from anything HD. A site test
  enforces it. His epique.me email as plain text is fine.
- **Never say he is "the only one"** who does this.
- **Landscape architecture background** appears in About only. Never "architect",
  and no school, degree or year.
- **He teaches AI** (instructor), and he calls himself an AI real estate industry
  leader in About.
- **Photos and video of Charles:** use only what he supplies or picks. Never
  generate his likeness. In his event footage he is the man in the navy blazer,
  white shirt and sunglasses on his head; his wife is usually beside him.
- **In footage,** leave out close-ups of other guests, store signs, the Epique
  Estates sign and house numbers.
- **Do not raise** broker review or anyone "above" him. He is the only boss.
- **Spending:** he pays for no more domains or AI tools. Ask before any spend.
- **Sending and publishing:** drafts are yours; sending is his. No outreach goes
  out without his say, and the do-not-contact list in `CLAUDE.md` applies.

## The site

- Source: `harrison-development/` (static HTML, CSS and JS; settings in
  `js/config.js`).
- Test: `python3 -m http.server 8765 --directory harrison-development`, then
  `node harrison-development/tests/check.mjs`. All checks must pass.
- Publish: `bash harrison-development/deploy/deploy.sh` (Cloudflare Workers + KV).
  Then load https://harrisondev.org in a browser and confirm the change.
- The Markets map is Google's 3D map. Its key only works on harrisondev.org, so
  it cannot be tested locally; the page falls back to a self-hosted 3D map.
- The site is hidden from search engines until Charles says to list it.
- Work on a branch and merge through a pull request when he asks.

## Private pitch work

Pitch packages and prototypes for named projects (for example Edwards River Park
and West Riverview Townhomes) are private. **This repository is public: never
commit them.** Build them as single self-contained HTML files outside the repo
and hand them to Charles. Each must carry the "independent concept, not
endorsed" notice, and no buyer forms, prices, dates or invented buildings.
