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

`.claude/settings.json` is committed and already registers all three hooks, so a
fresh checkout wakes oriented with nothing to run. If it ever gets clobbered or
you install this kit into another repo, restore it from the template:

```sh
cp .claude/continuity/settings.example.json .claude/settings.json
python3 .claude/continuity/verify.py
```

Expect `CONTINUITY: PASS`.

**The interpreter name matters.** `settings.json` names the interpreter as a bare
word that Claude Code runs through the shell, and which one exists varies by
machine - macOS often has no `python`, some Windows setups have no `python3`. A
wrong name fails silently: the session starts, the agent sounds confident, and
orientation never arrives. So each hook command is `python3 <script> || python
<script>` and works either way. The scripts always exit 0, so the fallback fires
only when the interpreter itself is absent, never because a script errored.
`verify.py` checks that at least one branch resolves here.

## Then

Fill in the `TODO Charles` blocks in `ROLE.md`, `PROJECT.md` and
`DECISIONS.md`, start a fresh session, and ask *"who are you and what are we
working on?"* - both answers should arrive without being told.
