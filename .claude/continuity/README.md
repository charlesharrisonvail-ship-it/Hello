# Continuity (standalone install)

From [ArkodaAI/continuity](https://github.com/ArkodaAI/continuity) (MIT, see
`LICENSE`), installed as the self-contained kit rather than as a plugin -
`/plugin` is not available in Claude Code on the web.

## Files

| File | What it does |
| --- | --- |
| `identity.py` | SessionStart hook. Prints `.claude/ROLE.md` - who the agent is here. Its own hook entry, its own ~9,000 char/byte budget. Loads first, so identity frames everything after it. |
| `session_start.py` | SessionStart hook. Prints `PROJECT.md`, `DECISIONS.md`, `STATE.md` under a shared 9,000 budget. `--check` prints the budget breakdown instead. |
| `pre_compact.py` | PreCompact hook. Banks the live working thread into `STATE.md` before compaction summarises it away. Keeps the most recent 3 blocks only. |
| `recall.py` | On-demand memory search over `.claude/memory/`. `recall.py <terms>`, `--deep` to search bodies too. |
| `verify.py` | Acceptance test. Executes the real hooks and inspects the real output, including a negative control that removes `PROJECT.md` and confirms the payload says MISSING rather than dropping the section silently. |
| `settings.example.json` | The hook registration to merge into `.claude/settings.json`. |

`identity.py` is the plugin build's script adapted to this layout: it resolves
the documents relative to itself instead of `CLAUDE_PROJECT_DIR`. The upstream
reference kit ships `ROLE.md` but never loads it; this install does.

## Activating it

The hooks only run once they are registered. Merge
`settings.example.json` into `.claude/settings.json` (create it if absent,
merge if it already has content - do not overwrite):

```sh
cp .claude/continuity/settings.example.json .claude/settings.json
python3 .claude/continuity/verify.py
```

Expect `CONTINUITY: PASS`. Until `.claude/settings.json` exists, nothing loads
automatically and the verifier will fail on the hook-registration checks.

**The interpreter name matters.** `settings.json` names `python3` as a bare
word that Claude Code runs through the shell. On a machine where only `python`
resolves (some Windows setups), swap all three commands to `python` - a wrong
name fails silently: the session starts, the agent sounds confident, and
orientation never arrives. `verify.py` checks that the name resolves.

## Then

Fill in the `TODO Charles` blocks in `ROLE.md`, `PROJECT.md` and
`DECISIONS.md`, start a fresh session, and ask *"who are you and what are we
working on?"* - both answers should arrive without being told.
