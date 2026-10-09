---
name: continuity-kit
description: How session orientation, the hooks, and the character budget work; the decisions behind the Continuity install; commands to verify, check budgets, or repair the kit
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

## Decisions behind this install

Moved here from `DECISIONS.md` to keep the force-loaded budget clear. Nothing was
dropped.

**Continuity installed standalone, not as a plugin** - `/plugin` does not work in
Claude Code on the web, where much of this work happens. Copying the kit into
`.claude/continuity/` makes it version-controlled and dependent on nothing.
Upstream: github.com/ArkodaAI/continuity, MIT. (2026-09-24)

**`.claude/settings.json` holds both Superpowers and the continuity hooks** -
disjoint top-level keys, so the file is a union, not a choice. An edit that
rewrites it wholesale silently disables whichever half it drops. Merge into it;
never overwrite it. (2026-09-24)

**Identity gets its own SessionStart hook entry** - the ~10KB door is per hook
entry, not per session, so `ROLE.md` costs the project orientation nothing, and
it loads first because identity frames what is read after it. (2026-09-24)

**Hook commands try `python3` then fall back to `python`** - which one exists
varies by machine, and a wrong name fails silently: session starts, agent sounds
confident, orientation never arrives. (2026-09-24)

**The banked working thread is capped at 3 blocks** - unbounded growth would blow
the character budget and silently truncate the whole payload, which is the exact
failure the kit exists to prevent. (2026-09-24)

**Memory frontmatter is the index** - no separate index file, because one
maintained by hand drifts, and a drifted index hides memories that exist. Put
the words you would actually search into `description:`. (2026-09-24)
