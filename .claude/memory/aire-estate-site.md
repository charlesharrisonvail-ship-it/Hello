---
name: aire-estate-site
description: AiRE Estate - a separate business from EpiVail that Charles owns - its course website in docs/, email sign-off, brand name styling, voice, design colors and fonts, Lead to Keys pricing, referral-link disclosure, and what needs Charles before it changes
---

**AiRE Estate is a separate business from EpiVail** (Charles, 2026-10-02). The
EpiVail naming, signature, voice and positioning rules in `CLAUDE.md` do not apply
here. The brand rules are in `.claude/ROLE.md`, taken from the live site.

`docs/` is a static site at **learn.aireestate.com** (`aireestate.com` redirects
there; `docs/CNAME`, `.nojekyll`). The live page was byte-identical to
`docs/index.html` on 2026-10-02, so the repo is the source of truth.

## What it is

"Real estate courses built in Claude Code", for agents. Two paid courses:
**Part One, Listing Media Without the Invoice** (8 video lessons, $67) and
**Part Two, Lead to Keys** (7 modules plus a Capstone, $97), plus a Team &
Brokerage tier. Prices are Charles's; they were correct as of Oct 2026. Free
install lesson at `install-claude-code.html`. Certificates at `certification.html`
and `lead-to-keys-certification.html`. `is-this-for-you-script.md` scripts the
screening video, narrated by the Eva Vail avatar.

Legal entity **AiRE Estate, LLC** (Colorado), contact hello@aireestate.com.
Privacy and terms are dated September 25, 2026.

## Brand, as observed

- Name is "AiRE Estate". "AiRE" alone is the AI instructor who narrates lessons and
  "tells you plainly that it's AI". Never "Aire" or "AIRE".
- The instructor is "a licensed, practicing agent", credentials "RSPS · MRP ·
  AI PRO", "25 years selling real estate in Colorado's Vail Valley". **Charles's
  name is never fronted** on the site, ads, posts or images (see
  `aire-name-not-fronted`); it may appear inside course videos. No Epique, no EpiVail.
- Voice: plain, numbers first, anti-hype. Sections like "The arithmetic" and
  "Straight Talk"; "who I am, and what I'm not going to oversell you"; "source every
  number"; "it isn't free, and here's what it costs".
- Disclaimers are explicit: independent of and not affiliated with Anthropic,
  OpenAI, Google, Higgsfield, Apify or any listing platform; teaches real estate use
  of these tools and gives no Claude Code technical support; not legal advice.
- Look: near-black `#04070d` ground, signal blue `#38bdf8`, white headings. Archivo
  (headings), Manrope (body), IBM Plex Mono (labels).

## Rules

- Draft changes freely. Do not change prices, refund wording, privacy or terms
  without Charles, and assume a merge to `main` publishes.
- Do not give away the course method on public pages (commit 8eace3d removed a
  demo that exposed a whole module). Show the proof, not the verbatim prompt.
- Referral links carry a visible "(referral link)" label right after the link, as
  the terms promise. All four Higgsfield links in `docs/index.html` do (two were
  missing it until the label fix). Keep it that way for any link added.
- **Always say which course a "Module N" is.** Both have a Module Three and Four.
  Part One has modules 01-08 (Module Four is the drone lesson). Part Two, Lead to
  Keys, has 01-07, renumbered from 08-14, which left stale "Ten and Eleven" and
  "Thirteen and Fourteen" text on three pages until it was fixed. Prose spells the
  number out ("Modules Three and Four"); card labels use digits ("Module 03").
  Check every spelled-out module word against that map when editing course copy.

## Settled by Charles (2026-10-04)

- He is the **owner and representative** of AiRE Estate.
- **Sign AiRE Estate emails exactly: `AiRE Estate Academy`.** Read as the whole
  sign-off. It is not the EpiVail signature.
- "Academy" appears nowhere on the site, which says "AiRE Estate". The sign-off is
  for emails only; do not rename anything on the site to match.
