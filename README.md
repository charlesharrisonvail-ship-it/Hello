# Hello World

This is my first GitHub repository!

## About Me

I'm learning how to use GitHub and excited to collaborate on projects!

## MCP Setup

This repository is configured to use the [Higgsfield](https://higgsfield.ai) MCP
server via `.mcp.json`. Claude Code picks it up automatically when you open the
project.

### Prerequisites

- [Node.js](https://nodejs.org) (provides `npx`)
- A Higgsfield API key

### Configuration

The API key is read from the `HIGGSFIELD_API_KEY` environment variable so no
secret is committed to the repo. Set it before starting Claude Code:

```bash
export HIGGSFIELD_API_KEY="your_api_key_here"
```

Once set, the `higgsfield` MCP server will start via
`npx -y @higgsfield/mcp-server`.
