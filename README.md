# Hello World

This is my first GitHub repository!

## About Me

I'm learning how to use GitHub and excited to collaborate on projects!

## Using Claude Code with this repo

This repo holds my Claude Code agents, skills, and settings (see `.claude/`).

**On your own computer** (needs Node.js 18+):

```bash
npm install -g @anthropic-ai/claude-code@latest
cd Hello
claude
```

The first run signs you in with your Claude account. Update later with `claude update`.

### MCP servers

This repo also configures eight MCP servers in `.mcp.json` — Playwright,
Perplexity, Firecrawl, Higgsfield, filesystem, Serena, Context7, and
sequential thinking. Claude Code asks you to approve them the first time you
run `claude` here. See [docs/MCP.md](docs/MCP.md) for prerequisites and the
two API keys you'll want to set.

**In the browser:** open [claude.ai/code](https://claude.ai/code) and pick this repository.
Nothing needs installing there.
