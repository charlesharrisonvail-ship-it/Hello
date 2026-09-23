# Settled decisions

Each line is a call that has already been made, with the reason it was made.
Do not re-propose these. If one needs reopening, Charles reopens it.

**Continuity installed standalone, not as a plugin** - `/plugin` is not
available in Claude Code on the web, where much of this work happens. Copying
the kit into `.claude/continuity/` makes it version-controlled with the repo
and dependent on nothing. Upstream: github.com/ArkodaAI/continuity, MIT.
(2026-09-23)

**Identity gets its own SessionStart hook entry** - the ~10KB limit is per hook
entry, not per session. A separate entry for `ROLE.md` means role content costs
the project orientation nothing, and identity loads first so it frames what is
read after it. (2026-09-23)

**Hook commands try `python3` then fall back to `python`** - `settings.json`
names the interpreter as a bare word run through the shell, and which one exists
varies by machine: on macOS `python` frequently does not, on some Windows setups
`python3` does not. A wrong name fails silently - the session starts, the agent
sounds confident, and orientation never arrives. `python3 X || python X` works
either way, which is what upstream's plugin `hooks.json` does. The scripts
always exit 0, so the fallback fires only when the interpreter itself is absent.
(2026-09-23)

**The banked working thread is capped at 3 blocks** - an unbounded bank grows
until it blows the character budget and silently truncates the whole
orientation payload, which is the exact failure this kit exists to prevent.
(2026-09-23)

**`.claude/settings.json` holds both Superpowers and the continuity hooks** -
they are disjoint top-level keys (`extraKnownMarketplaces` / `enabledPlugins`
vs `hooks`), so the file is a union, not a choice. An edit that rewrites this
file wholesale silently disables whichever half it drops. Merge into it; never
overwrite it. (2026-09-24)

**`CLAUDE.md` outranks the brand skills on naming** - the `epivail-brand-system`
skill still suggests a Collective phrase that `CLAUDE.md` bans outright, and
that mismatch has already cost two correcting commits (PR #9, PR #15). When a
skill and `CLAUDE.md` disagree, follow `CLAUDE.md`. (2026-09-24)

**Memory frontmatter is the index** - no separate index file. An index that
must be updated by hand drifts, and a drifted index hides memories that exist.
(2026-09-23)

**Agent and skill definitions carry EpiVail brand voice** - branding was wrong
in committed agent files once and needed a correcting commit (PR #9). Check
naming against the `epivail-brand-system` skill before committing.
(2026-09-23)

<!-- TODO Charles: add the calls you are tired of re-explaining. Format:
     **<decision>** - <why> (<date>). The reason matters more than the
     decision; a decision without one gets re-litigated. -->
