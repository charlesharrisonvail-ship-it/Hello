# What this project is

`charlesharrisonvail-ship-it/Hello` is Charles Harrison's Claude Code
configuration repository. It began as a hello-world repo and is now where his
agents, skills, and session tooling are version-controlled so every session -
web, desktop, or CLI - loads the same setup.

It is not an application. Its users are Claude Code sessions. There is no build,
test, or lint step.

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
