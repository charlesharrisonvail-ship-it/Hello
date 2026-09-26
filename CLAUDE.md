# CLAUDE.md

This repository holds Charles Harrison's Claude Code configuration for two
separate businesses: **EpiVail / Epique Realty** (Colorado Mountain Region) and
**New Beginnings Mental Health** (NBMH). It is a config repo, not an
application: there is no build, test, or lint step.

**Never mix the two brands.** EpiVail voice, sign-offs, contacts, and branding
must not appear in NBMH work, and NBMH content goes nowhere but the New
Beginnings Mental Health Facebook page. The conventions below are EpiVail's;
NBMH has its own, in `.claude/skills/nbmh-social/`.

## Layout

- `.claude/agents/` — subagents
  - `lead-enrichment.md` — enrich a name, company, LinkedIn URL, or email into a full contact card
  - `recruitment-outreach.md` — agent recruitment emails, DMs, SMS, call scripts, and sequences
  - `linkedin-content.md` — LinkedIn posts, content calendars, and carousel/Reel concepts
  - `lofty-crm.md` — Lofty contacts, tiers, tags, recruit pipeline stages, and follow-up tasks
- `.claude/skills/linkedin-optimizer/` — LinkedIn analytics and profile optimization
- `.claude/skills/nbmh-social/` — New Beginnings Mental Health daily Facebook management
  (brand rules, compliance gate, 1080×1350 renderer, logo and fonts)
- `content/nbmh/` — NBMH daily posts and the posting log
- `.claude/settings.json` — project settings; enables the Superpowers plugin

## Conventions

- Agents and skills use YAML frontmatter (`name`, `description`) followed by Markdown instructions.
- Brand name is written **EpiVail**; the region is **Epique Realty Colorado Mountain Region**.
- **Never use "Epique Mountain Collective"** anywhere — not in messages, signatures, or materials — even if a brand skill suggests it.
- Sign off client and lead messages: **Charles Harrison | EpiVail | Epique Realty**
- Voice is courteous and warm, with Southern manners.
- Work on a feature branch and merge through a pull request.

## New Beginnings Mental Health

A healthcare practice, so the compliance rules are hard limits, not style
preferences. Read `.claude/skills/nbmh-social/SKILL.md` before any NBMH work.

- Public positioning is **Medication Management** and **telehealth across
  Colorado**. Never publicly advertise Psychiatric Diagnostic Evaluations or any
  age range.
- The provider is **Dr. Kristen Vandenberg, DNP, PMHNP-BC, FNP** — never a
  psychiatrist, physician, MD, or medical doctor.
- Never present NBMH as therapy, counseling, crisis, emergency, rehabilitation,
  addiction, or pediatric care. Never promise a prescription or an outcome.
- Never use PHI, patient stories, or testimonials.
- Run `.claude/skills/nbmh-social/scripts/compliance-check.py` on every caption
  before it is shown or posted.
- **Never claim a post was scheduled, published, or verified without visible
  evidence.** Creation and publication are separate facts and are reported
  separately, in `content/nbmh/POSTING_LOG.md`.

## Do not contact

Never email, text, call, or enroll these people in any sequence, even if Lofty
flags them as past due or needing attention:

- Jeff Karpel (karpel@karpel.com) — inactive, asked not to be contacted

Before sending any message to a lead, check this list and confirm the lead is
still active. When in doubt, draft and show Charles instead of sending.
