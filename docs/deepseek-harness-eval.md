# DeepSeek Harness — Evaluation for the EpiVail Stack

**Date:** 2026-09-10
**Repo evaluated:** https://github.com/deepseek-ai/deepseek-harness (MIT, developer preview)
**Verdict:** Worth keeping as a second, low-cost harness for batch work. Not a replacement for Claude Code, and not something to move the EpiVail production workflow onto yet.

---

## What it actually is

`dsh` ("DeepSeek Harness") is DeepSeek AI's open-source **agent harness** — the same category of tool as Claude Code, not a model and not a real-estate tool. It is built on the Cordis plugin system under an "everything is a plugin" design: models, tools, skills, sessions, sandboxes, storage, scheduling, and the UI are all swappable plugin packages.

It ships a local Web UI (default `http://127.0.0.1:3080`), a TUI profile, and a headless profile for one-shot tasks.

## Verified in this session

Cloned, installed, built, and ran the CLI successfully:

| Step | Result |
|---|---|
| `git clone` (~10,300 files) | OK |
| `pnpm install` (pnpm 11.7.0 via corepack) | OK, ~31s |
| `pnpm run build` | OK, 234 client artifacts |
| `pnpm dsh --help` | OK, CLI boots and lists profiles |

**Requirements:** Node `^22.19.0 || >=24.0.0`, pnpm 11.7.0 (corepack activates it), roughly 2 GB of disk for the checkout plus dependencies.

## Where it overlaps your existing setup

Capabilities relevant to how you already work:

- **Skills** — `packages/skill/*` reads `SKILL.md` files, discovered from `.dsh/skills` and `.agents/skills` (project) and the equivalents under the user home. Your `.claude/skills/` content is the same shape, so the LinkedIn optimizer, EpiVail brand system, Lofty workflows, and Epique recruitment skills can be reused with a copy or a symlink — not a rewrite.
- **MCP** — `packages/mcp/mcp-client` bridges external MCP servers as native tools. Important caveat: **tools only**. MCP resources and prompts are not supported, and nothing is enabled by default; every server is opted into by config entry.
- **Subagents** — `packages/subagent/*` includes `subagent-claude-code` and `subagent-codex`, so it can drive Claude Code as a child agent rather than competing with it.
- **Scheduling** — in-session reminders that survive restarts, but they never leave the session. No email, SMS, or push. Not a substitute for your Routines.
- **Models** — a DeepSeek-direct adapter plus `llm-pi-ai`, a multi-provider adapter that speaks `openai`, `openai-responses`, `anthropic-messages`, `bedrock-converse-stream`, and `openrouter` protocols, or any OpenAI-compatible gateway. So it is not locked to DeepSeek models.

## Honest assessment for your scope

**What it would buy you.** Cheap, high-volume agent runs on DeepSeek models for the grinding work — scoring and enriching large agent lists before they hit Lofty, drafting first-pass outreach variants across the US/France/Germany/Mexico segments, bulk LinkedIn post drafts for later human edit. Your existing skills carry over, so the brand voice comes with them. It is MIT-licensed and runs entirely on your own machine, which matters for lead data you would rather not push through another vendor.

**What it costs you.** Three real frictions:

1. **Developer preview.** The README states plainly there will be compatibility-breaking changes. Anything you build on it now, you will re-fit later.
2. **It is local-only.** The Web UI binds to `127.0.0.1` on the machine that runs it. You work substantially from claude.ai on web and mobile — you cannot reach a local `dsh` from your phone without setting up your own tunnel. Claude Code on the web has no such gap.
3. **Your leverage is not in the harness.** The Apollo, Gmail, FlexMLS, HeyGen, Windsor, and Lofty connections are where the EpiVail workflow actually lives. Those are already wired into Claude Code. Re-wiring them as `dsh` MCP entries is a project, and MCP resources/prompts would not come across.

**Recommendation.** Install it on your desktop and treat it as a batch-processing sidecar: point it at DeepSeek models, hand it the volume work, and keep client-facing and connector-driven work in Claude Code. Revisit a deeper commitment when it leaves developer preview.

## Install on your own machine

```sh
# Requires Node 22.19+ or 24+
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
corepack enable && corepack prepare pnpm@11.7.0 --activate
pnpm install
pnpm run build
pnpm dsh web        # opens http://127.0.0.1:3080
```

Or, with no checkout at all: `npx @deepseek-ai/dsh web`

`scripts/install-deepseek-harness.sh` in this repo runs the source install and optionally links your existing skills across.

## A note on this session's install

The harness was built and verified inside this session's **ephemeral container**, which is reclaimed when the session ends. Nothing persistent was installed on your machine — the durable output is this document and the setup script. Run the script locally to get a working copy you keep.

## Sources

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- [README](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md)
- [Documentation](https://deepseek-harness.github.io/deepseek-harness/)
