# CLAUDE.md

This repository holds Charles Harrison's Claude Code configuration for
EpiVail / Epique Realty (Colorado Mountain Region). It is a config repo,
not an application: there is no build, test, or lint step.

## Layout

- `.claude/agents/` — subagents
  - `lead-enrichment.md` — enrich a name, company, LinkedIn URL, or email into a full contact card
  - `recruitment-outreach.md` — agent recruitment emails, DMs, SMS, call scripts, and sequences
  - `linkedin-content.md` — LinkedIn posts, content calendars, and carousel/Reel concepts
  - `lofty-crm.md` — Lofty contacts, tiers, tags, recruit pipeline stages, and follow-up tasks
- `.claude/skills/linkedin-optimizer/` — LinkedIn analytics and profile optimization
- `.claude/settings.json` — project settings; enables the Superpowers plugin

## Conventions

- Agents and skills use YAML frontmatter (`name`, `description`) followed by Markdown instructions.
- Brand name is written **EpiVail**; the region is **Epique Realty Colorado Mountain Region**.
- **Never use "Epique Mountain Collective"** anywhere — not in messages, signatures, or materials — even if a brand skill suggests it.
- Sign off client and lead messages: **Charles Harrison | EpiVail | Epique Realty**
- Voice is courteous and warm, with Southern manners.
- Work on a feature branch and merge through a pull request.

## Do not contact

Never email, text, call, or enroll these people in any sequence, even if Lofty
flags them as past due or needing attention:

- Jeff Karpel (karpel@karpel.com) — inactive, asked not to be contacted

Before sending any message to a lead, check this list and confirm the lead is
still active. When in doubt, draft and show Charles instead of sending.
