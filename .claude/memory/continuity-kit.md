---
name: continuity-kit
description: How session orientation, the hooks, and the character budget work; commands to verify, check budgets, or repair the kit
---

`.claude/continuity/` force-loads orientation before the agent's first turn.
Upstream: github.com/ArkodaAI/continuity (MIT), installed standalone because
`/plugin` does not work in Claude Code on the web.

    python3 .claude/continuity/verify.py                    # acceptance test
    python3 .claude/continuity/session_start.py --check      # budget breakdown
    python3 .claude/continuity/identity.py --check           # ROLE.md budget
    python3 .claude/continuity/recall.py <terms> [--deep]    # search this dir

Two hook entries, two separate ~9,000 budgets: `identity.py` loads `ROLE.md`
first, `session_start.py` loads PROJECT + DECISIONS + STATE. The limit is per
hook ENTRY, not per session - if a document outgrows its door, add another hook
entry rather than cutting content.

**`.claude/settings.json` is a union**: Superpowers keys AND the continuity
hooks. Merge into it; rewriting it wholesale silently disables one half.

Failure mode to respect: an over-budget payload is replaced with a small preview
stub, so the session looks completely normal while the agent wakes on a
fragment. That is what `verify.py`'s negative control exists to catch.
