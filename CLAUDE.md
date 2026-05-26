# Project Overview

Complete Claude Code workspace with Skills, Hooks, MCP, Subagents & Plugins configured for production-grade development.

## Tech Stack & Architecture
- Language: TypeScript
- Runtime: Node.js
- Testing: (configure in `package.json`)
- Deployment: Docker

## Project Conventions & Style Guide
- File naming: `kebab-case` for files, `PascalCase` for components, `camelCase` for utilities.
- Imports: absolute paths from `src/`.
- Format on save; lint before commit.

## Testing Requirements & Patterns
- Unit tests live in `tests/unit/`.
- Integration tests in `tests/integration/`.
- End-to-end tests in `tests/e2e/`.

## Git Workflow & Branch Strategy
- `main` is protected; develop on feature branches.
- Commit messages: short imperative summary, optional body.

## Security & Compliance Rules
- Never commit secrets. Use `.env` files locally and a secret manager in production.
- All inputs validated at system boundaries.
