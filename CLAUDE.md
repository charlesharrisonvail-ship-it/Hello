# CLAUDE.md

This repository holds Charles Harrison's Claude Code configuration for
EpiVail / Epique Realty (Colorado Mountain Region). It is a config repo,
not an application: there is no build, test, or lint step.

## Layout

- `.claude/agents/` — subagents
  - `lead-enrichment.md` — enrich a name, company, LinkedIn URL, or email into a full contact card
  - `recruitment-outreach.md` — agent recruitment emails, DMs, SMS, call scripts, and sequences
  - `linkedin-content.md` — LinkedIn posts, content calendars, and carousel/Reel concepts
- `.claude/skills/linkedin-optimizer/` — LinkedIn analytics and profile optimization
- `.claude/settings.json` — project settings; enables the Superpowers plugin

## Conventions

- Agents and skills use YAML frontmatter (`name`, `description`) followed by Markdown instructions.
- Brand name is written **EpiVail**; the region is **Epique Realty Colorado Mountain Region**.
- Voice is courteous and warm, with Southern manners.
- Work on a feature branch and merge through a pull request.
