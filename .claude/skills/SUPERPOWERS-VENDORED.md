# Superpowers (vendored)

The skill directories listed below are vendored from
[obra/superpowers](https://github.com/obra/superpowers), MIT licensed.

- **Upstream version:** 6.3.0
- **Vendored from commit:** `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (2026-08-12)
- **License:** MIT — see `SUPERPOWERS-LICENSE` in this directory
- **Author:** Jesse Vincent

## Why vendored instead of installed as a plugin

Superpowers ships as a Claude Code *plugin*, installed with:

```
/plugin marketplace add obra/superpowers
/plugin install superpowers@superpowers
```

That install clones into `~/.claude/plugins/repos/` on whichever machine ran
the command. Claude Code on the web runs each session in a fresh, ephemeral
container that receives only claude.ai account-level skills and plugins —
community marketplaces are not part of that sync, so a local CLI install is
never visible in a web session.

Committing the skills here makes them load from `.claude/skills/` in every
session on this repo, local or remote.

## Vendored skills

brainstorming, dispatching-parallel-agents, executing-plans,
finishing-a-development-branch, receiving-code-review, requesting-code-review,
subagent-driven-development, systematic-debugging, test-driven-development,
using-git-worktrees, using-superpowers, verification-before-completion,
writing-plans, writing-skills

`linkedin-optimizer` in this directory is a local skill, not part of Superpowers.

## The session-start hook

Upstream ships a SessionStart hook that injects `using-superpowers` into every
session, which is what makes the rest of the skills fire reliably rather than
only when a description happens to match. The adapted script lives at
`.claude/hooks/superpowers-session-start` and is **active**, wired up in
`.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR/.claude/hooks/superpowers-session-start\"",
            "shell": "bash",
            "async": false
          }
        ]
      }
    ]
  }
}
```

It runs on session startup, `/clear`, and post-compact, and emits the full
`using-superpowers` skill wrapped in an `<EXTREMELY_IMPORTANT>` block. That block
instructs the agent to invoke a matching skill before responding to anything —
including before asking clarifying questions. This applies to every session on
this repo, for anyone working in it.

To turn it off, delete `.claude/settings.json` (or just its `SessionStart` entry).
The skills still load and stay invocable by name (`/brainstorming`,
`/systematic-debugging`, ...); they are simply not force-injected up front.

The script's exec bit is tracked in git as mode `100755`, so it survives a fresh
clone into a new container.

Two adaptations were made to that script versus upstream:

1. The skills root resolves to this repo's `.claude/` rather than
   `${CLAUDE_PLUGIN_ROOT}`.
2. It emits only Claude Code's `hookSpecificOutput.additionalContext` shape.
   Upstream also branched for Cursor and Copilot CLI, neither of which loads a
   repo-local `.claude/` hook.

## Updating

Re-clone upstream and copy `skills/` over this directory, then update the
version and commit pinned above:

```
git clone --depth 1 https://github.com/obra/superpowers.git /tmp/superpowers
cp -a /tmp/superpowers/skills/. .claude/skills/
```
