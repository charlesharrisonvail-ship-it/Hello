# What this project is

`charlesharrisonvail-ship-it/Hello` began as a hello-world repo and now does two
jobs:

1. **Charles's Claude Code configuration** - agents, skills and session tooling,
   version-controlled so every session loads the same setup. Its users are Claude
   Code sessions.
2. **The AiRE Estate course site** in `docs/` - static HTML served at
   `learn.aireestate.com` (`CNAME` and `.nojekyll` point to GitHub Pages).

No build, test or lint step for either: the config is Markdown and Python, the
site is plain HTML.

## Layout

- `CLAUDE.md` - repo conventions. **The authority on brand naming and sign-off.**
  Where it and a brand skill disagree, `CLAUDE.md` wins.
- `.claude/agents/` - `lead-enrichment`, `recruitment-outreach`,
  `linkedin-content`, `lofty-crm`. They chain: enrich -> Lofty -> write.
- `.claude/skills/linkedin-optimizer/` - LinkedIn analytics and profile work.
  It measures; `linkedin-content` creates.
- `.claude/settings.json` - enables the Superpowers plugin AND registers the
  continuity hooks. Both key sets must survive any edit.
- `.claude/ROLE.md`, `PROJECT.md`, `DECISIONS.md`, `STATE.md` - force-loaded at
  every session start. Keep each short enough to survive whole.
- `.claude/continuity/` - the orientation kit that loads them.
- `.claude/memory/` - one fact per file, frontmatter-indexed. Start here when you
  need a specific rule: `python3 .claude/continuity/recall.py <terms>`.
- `docs/` - the AiRE Estate site: course landing, Lead to Keys, install guide,
  certificates, privacy, terms. About 14MB, mostly video in `docs/media/`.
  It is public - see `recall.py site`.
- `is-this-for-you-script.md` - script for the Lead to Keys screening video.

## What done looks like

Per piece: each agent and skill triggers when it should and stays in brand voice.
For the tooling: `python3 .claude/continuity/verify.py` prints
`CONTINUITY: PASS`, and a fresh session answers "who are you and what are we
working on?" without being told.

There is no single finish line for the repo - it grows as the operation does.

## How to run things

    python3 .claude/continuity/verify.py                    # acceptance test
    python3 .claude/continuity/session_start.py             # preview orientation
    python3 .claude/continuity/session_start.py --check      # budget breakdown
    python3 .claude/continuity/recall.py <terms> [--deep]    # search memory

Use `python` where `python3` is absent; the hooks already try both.
