# What this project is

`charlesharrisonvail-ship-it/Hello` is Charles Harrison's Claude Code
configuration repository. It started as a hello-world repo and is now where his
agents, skills, and session tooling are version-controlled so that every Claude
Code session - web, desktop, or CLI - loads the same setup.

It is not a product. Its users are Claude Code sessions.

## What lives here

- `.claude/agents/` - subagent definitions: `lead-enrichment`,
  `recruitment-outreach`, `linkedin-content`
- `.claude/skills/` - project skills, currently `linkedin-optimizer`
- `.claude/continuity/` - the continuity kit (this file is loaded by it)
- `.claude/memory/` - one fact per file, frontmatter-indexed, searched on
  demand via `recall.py`
- `AI agents/`, `README.md` - earlier scratch content, not load-bearing

## What done looks like

A fresh session in any of Charles's projects wakes up already knowing who it is
and what is in flight, and `python3 .claude/continuity/verify.py` prints
`CONTINUITY: PASS`. Beyond that, "done" is per-piece: each agent and skill
triggers when it should and stays in brand voice.

<!-- TODO Charles: if this repo has a real finish line beyond "the tooling
     works", write it here as something checkable. -->

## Stack and how to run it

Markdown and Python 3 only. No build, no dependencies, no services.

- Verify the continuity install: `python3 .claude/continuity/verify.py`
- Preview what a session will be told: `python3 .claude/continuity/session_start.py`
- Check the budget: `python3 .claude/continuity/session_start.py --check`
- Search memory: `python3 .claude/continuity/recall.py <terms>` (`--deep` for bodies)

Use `python` instead of `python3` on machines where `python3` is not on PATH,
and update `.claude/settings.json` to match - the hook command is run through
the shell, and a wrong interpreter name fails silently.
