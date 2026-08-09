# CLAUDE.md

This file provides context and conventions for AI assistants (like Claude) working in this repository.

## Project Overview

**Hello** is a beginner GitHub learning repository. Its purpose is to practice GitHub workflows such as creating repositories, writing README files, making commits, opening pull requests, and collaborating with others.

There is no application code, build system, or test suite — this is purely a documentation/learning project.

## Repository Structure

```
Hello/
├── README.md     # Project introduction and "About Me" content
├── AI agents     # Placeholder file (currently empty)
└── CLAUDE.md     # This file
```

## Branch Conventions

- `main` — the default branch; stable content lives here
- Feature/topic branches are merged into `main` via pull requests (e.g., `readme-edits`)
- Claude-created branches follow the pattern `claude/<task-slug>`

## Development Workflow

Since there is no code to build or test, the workflow is purely documentation-focused:

1. Create a branch for each change
2. Edit or add Markdown files
3. Commit with a clear, descriptive message
4. Push to the remote branch
5. Open a pull request to merge into `main`

## Key Conventions

- **Markdown only** — all content is in `.md` files (GitHub-flavored Markdown)
- **No build steps** — there is nothing to install, compile, or run
- **No tests** — there is no test suite to execute
- **Commit messages** — use the imperative mood and be descriptive (e.g., `Add information about myself`)

## Git Configuration

- Remote: `charlesharrisonvail-ship-it/Hello` (GitHub)
- Default branch: `main`
- GPG/SSH signing is enabled on commits

## Notes for AI Assistants

- This repo has no dependencies, no scripts, and no CI/CD pipeline
- Changes are limited to Markdown content and plain-text files
- Always develop on the designated feature branch and push before considering the task complete
- Do not create a pull request unless the user explicitly requests one
