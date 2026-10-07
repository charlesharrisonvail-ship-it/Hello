# CLAUDE.md

This repository holds Charles Harrison's working setup for two separate
businesses. Keep them apart:

- **EpiVail / Epique Realty** (Colorado Mountain Region) — the Claude Code
  configuration in `.claude/`: agents, skills, and settings. The brand, signature,
  and voice rules under "EpiVail conventions" below are EpiVail's.
- **AiRE Estate** — the course site in `docs/`, published at
  `learn.aireestate.com`. It is its own brand. The EpiVail rules below do not
  apply to it; its brand notes are in `.claude/ROLE.md`.

There is no build, test, or lint step: the configuration is Markdown and Python,
and the site is plain HTML.

## Layout

- `.claude/agents/` — subagents (EpiVail)
  - `lead-enrichment.md` — enrich a name, company, LinkedIn URL, or email into a full contact card
  - `recruitment-outreach.md` — agent recruitment emails, DMs, SMS, call scripts, and sequences
  - `linkedin-content.md` — LinkedIn posts, content calendars, and carousel/Reel concepts
  - `lofty-crm.md` — Lofty contacts, tiers, tags, recruit pipeline stages, and follow-up tasks
- `.claude/skills/linkedin-optimizer/` — LinkedIn analytics and profile optimization
- `.claude/skills/` also holds five general skills from ComposioHQ/awesome-claude-skills (commit `be2a406`, Apache-2.0): `lead-research-assistant`, `content-research-writer`, `competitive-ads-extractor`, `meeting-insights-analyzer`, `domain-name-brainstormer`. They are third-party and brand-neutral; EpiVail and AiRE Estate rules in this file still govern anything they produce.
- `.claude/settings.json` — project settings; enables the Superpowers plugin and registers the Continuity session-orientation hooks
- `.claude/continuity/` — the Continuity kit that loads `ROLE.md`, `PROJECT.md`, `DECISIONS.md`, and `STATE.md` at every session start
- `.claude/memory/` — one fact per file, searched with `python3 .claude/continuity/recall.py <terms>`
- `docs/` — the AiRE Estate site (public; carries pricing, refund terms, privacy, and terms of service)
- `tools/jarvis/` — Windows setup script and notes for installing Jarvis (third-party local voice assistant); source is not vendored
- `is-this-for-you-script.md` — script for the Lead to Keys screening video

## Conventions

- Agents and skills use YAML frontmatter (`name`, `description`) followed by Markdown instructions.
- Work on a feature branch and merge through a pull request.
- Never overwrite `.claude/settings.json`; it holds both the Superpowers plugin and the Continuity hooks, so merge into it.

## EpiVail conventions

- Brand name is written **EpiVail**; the region is **Epique Realty Colorado Mountain Region**.
- **Never use "Epique Mountain Collective"** anywhere — not in messages, signatures, or materials — even if a brand skill suggests it.
- Sign off client and lead messages, and byline posts, with exactly:
  **Charles Harrison, Epique Area/Growth Leader** — never append a regional
  descriptor. This is the only EpiVail signature; it matches
  `recruitment-outreach.md` and `linkedin-content.md`.
- Voice is courteous and warm, with Southern manners.

## AiRE Estate conventions

- Sign AiRE Estate emails exactly: **AiRE Estate Academy**. It is not the EpiVail
  signature.
- The rest of its brand notes are in `.claude/ROLE.md`.

## Do not contact

Never email, text, call, or enroll these people in any sequence, even if Lofty
flags them as past due or needing attention:

- Jeff Karpel (karpel@karpel.com) — inactive, asked not to be contacted

Before sending any message to a lead, check this list and confirm the lead is
still active. When in doubt, draft and show Charles instead of sending.
