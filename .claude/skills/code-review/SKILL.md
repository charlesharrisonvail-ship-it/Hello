---
name: code-review
description: Auto-activate on code review tasks. Reviews diffs for correctness, security, style, and CLAUDE.md compliance.
---

# Code Review Skill

## When to use
Activate when the user asks to review code, audit a PR, or check a diff.

## Steps
1. Read the diff (`git diff`).
2. Cross-check against project conventions in `CLAUDE.md`.
3. Flag correctness, security, and style issues with file:line references.

## Resources
- `scripts/` — executable helpers
- `references/` — review checklists
- `assets/` — templates and static files
