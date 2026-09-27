# MCP servers

The project file `.mcp.json` at the repo root configures eight MCP servers.
Because it lives in the repo, any machine that checks this repo out and runs
`claude` from the repo root gets the same set.

Claude Code asks you to approve project-scoped servers the first time you start
it in this directory. Run `claude`, approve the list, then confirm with
`claude mcp list`.

## What's configured

| Server | Transport | How it runs | Key needed |
| --- | --- | --- | --- |
| `playwright` | stdio | `npx @playwright/mcp` | no |
| `perplexity` | stdio | `npx server-perplexity-ask` | `PERPLEXITY_API_KEY` |
| `firecrawl` | stdio | `npx firecrawl-mcp` | `FIRECRAWL_API_KEY` |
| `higgsfield` | HTTP | `https://mcp.higgsfield.ai/mcp` | sign-in (OAuth) |
| `filesystem` | stdio | `npx @modelcontextprotocol/server-filesystem` | no |
| `serena` | stdio | `uvx --from git+https://github.com/oraios/serena` | no |
| `context7` | stdio | `npx @upstash/context7-mcp` | optional |
| `sequential-thinking` | stdio | `npx @modelcontextprotocol/server-sequential-thinking` | no |

Nothing is vendored into this repo. `npx` and `uvx` fetch each server on first
use and cache it, so a checkout stays small and updates come along on their own.

## Prerequisites

- **Node.js 18+** — supplies `npx`, which runs seven of the eight servers.
- **[uv](https://docs.astral.sh/uv/)** — supplies `uvx`, which Serena needs.
  Install with `curl -LsSf https://astral.sh/uv/install.sh | sh`.
- **Git** — Serena is built from its GitHub source on first run. Expect that
  first start to take a minute or two; later starts are fast.

Playwright downloads a browser the first time it is asked to open a page.

## API keys

Keys are read from the environment, never stored in the repo. Put them in your
shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export PERPLEXITY_API_KEY="pplx-..."
export FIRECRAWL_API_KEY="fc-..."
export CONTEXT7_API_KEY="..."        # optional, raises rate limits
```

Open a new terminal afterward so the values are live, then start `claude`.

Until `PERPLEXITY_API_KEY` and `FIRECRAWL_API_KEY` are set, `claude mcp list`
reports a warning for those two servers and their tools stay unavailable. Every
other server works without any key.

Higgsfield uses sign-in rather than an environment variable. On first use Claude
Code opens a browser window to authorize the connection against your Higgsfield
account.

## Choosing the filesystem root

The `filesystem` server only exposes directories it is handed, and it defaults
to the directory you started `claude` from. To point it somewhere else, set the
root before starting:

```bash
export MCP_FILESYSTEM_ROOT="$HOME/Projects"
```

Give it the narrowest directory that covers the work — it grants read and write
access to everything underneath.

## Checking the setup

```bash
cd Hello
claude mcp list
```

Healthy servers report `✓ Connected`. A server listed as pending just needs the
one-time approval described at the top of this page.

## A note on Higgsfield

The npm package named `higgsfield-mcp` is published by a third party, not by
Higgsfield. This repo points at Higgsfield's own hosted server instead, so your
credentials go only to Higgsfield.
