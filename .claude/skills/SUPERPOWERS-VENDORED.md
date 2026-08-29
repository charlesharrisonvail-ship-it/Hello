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

## Not wired up: the session-start hook

Upstream ships a SessionStart hook that injects `using-superpowers` into every
session, which is what makes the rest of the skills fire reliably. The adapted
script is committed at `.claude/hooks/superpowers-session-start` but is **not
active** — activating it requires a `.claude/settings.json` that runs a command
on every session start, which is a deliberate decision for a repo owner to make
rather than something to land silently.

To enable it, create `.claude/settings.json`:

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

Without the hook the skills still load and remain invocable by name
(`/brainstorming`, `/systematic-debugging`, ...); they just are not force-injected
at the top of every session.

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
