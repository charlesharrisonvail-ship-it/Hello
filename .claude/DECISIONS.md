# Settled decisions

Each line is a call that has already been made, with the reason it was made.
Do not re-propose these. If one needs reopening, Charles reopens it.

**Continuity installed standalone, not as a plugin** - `/plugin` is not
available in Claude Code on the web, where much of this work happens. Copying
the kit into `.claude/continuity/` makes it version-controlled with the repo
and dependent on nothing. Upstream: github.com/ArkodaAI/continuity, MIT.
(2026-08-24)

**Identity gets its own SessionStart hook entry** - the ~10KB limit is per hook
entry, not per session. A separate entry for `ROLE.md` means role content costs
the project orientation nothing, and identity loads first so it frames what is
read after it. (2026-08-24)

**Hooks call `python3`, not `python`** - `settings.json` names the interpreter
as a bare word run through the shell, and on macOS `python` frequently does not
exist. A wrong name fails silently: the session starts, the agent sounds
confident, and orientation never arrives. `verify.py` checks the name resolves.
(2026-08-24)

**The banked working thread is capped at 3 blocks** - an unbounded bank grows
until it blows the character budget and silently truncates the whole
orientation payload, which is the exact failure this kit exists to prevent.
(2026-08-24)

**Memory frontmatter is the index** - no separate index file. An index that
must be updated by hand drifts, and a drifted index hides memories that exist.
(2026-08-24)

**Agent and skill definitions carry EpiVail brand voice** - branding was wrong
in committed agent files once and needed a correcting commit (PR #9). Check
naming against the `epivail-brand-system` skill before committing.
(2026-08-24)

<!-- TODO Charles: add the calls you are tired of re-explaining. Format:
     **<decision>** - <why> (<date>). The reason matters more than the
     decision; a decision without one gets re-litigated. -->
