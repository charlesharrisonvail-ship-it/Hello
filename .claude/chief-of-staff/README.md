# Chief of Staff

Mike Murchison's AI Chief of Staff starter kit for Claude Code
([mimurchison/claude-chief-of-staff](https://github.com/mimurchison/claude-chief-of-staff),
commit `2a10609`, MIT; see `LICENSE`). Installed at project scope, so every
session in this repo has it.

## What it adds

| Command | Does |
|---|---|
| `/gm` | Morning briefing: calendar, tasks, goals, urgent mail, focus for the day |
| `/triage [quick\|digest]` | Scans mail, sorts into tiers, drafts replies. Never sends without "Send" |
| `/my-tasks list\|add\|complete\|execute\|overdue` | Task list in `my-tasks.yaml`, tied to `goals.yaml` |
| `/enrich all\|stale\|<name>` | Personal relationship notes in `contacts/` |

The commands live in `.claude/commands/`; everything they read is here.

## How it differs from upstream

- **Not installed with `install.sh`.** That script writes to `~/.claude/` and
  replaces `~/.claude/CLAUDE.md`. In a cloud session `~/.claude/` is thrown away
  with the container, so the kit lives in the repo instead and every path points
  here.
- Upstream's `CLAUDE.md` is `operating-system.md`, so it cannot replace the
  repo's `CLAUDE.md`. The repo `CLAUDE.md` wins on brand, signatures and the
  "Do not contact" list.
- Filled in: name, both businesses, voice, both signatures, timezone
  (America/Denver), currency, connected tools. Lofty is the record for EpiVail
  leads and recruits; `/enrich` contact files are for personal relationships only.
- `contacts/` is git-ignored except the example, because contact files hold
  personal details.
- Upstream's `docs/` (setup guide, MCP servers, customization) is not copied.
  Read it on GitHub.

## Left for Charles to fill in

In `operating-system.md`, the `{{...}}` placeholders that only he can answer:
work and personal email, family, assistant, dinner and earliest-meeting times,
yearly themes, key people, and three example emails (the best way to teach it
his voice). Then replace the example objectives in `goals.yaml` with real ones.

In a cloud session, edits to `goals.yaml` and `my-tasks.yaml` vanish with the
container unless committed. On his own computer they stay in his clone.
