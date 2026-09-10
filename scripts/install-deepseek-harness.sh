#!/usr/bin/env bash
# Install DeepSeek Harness (dsh) from source and optionally link this repo's
# Claude skills into it. See docs/deepseek-harness-eval.md for the rationale.
#
# Usage:
#   ./scripts/install-deepseek-harness.sh [target-dir]
#
# Requires: git, Node.js ^22.19.0 or >=24, corepack (ships with Node).

set -euo pipefail

TARGET="${1:-$HOME/deepseek-harness}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PNPM_VERSION="11.7.0"

command -v git >/dev/null || { echo "git is required." >&2; exit 1; }
command -v node >/dev/null || { echo "Node.js is required (^22.19.0 or >=24)." >&2; exit 1; }

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
NODE_MINOR="$(node -p 'process.versions.node.split(".")[1]')"
if [ "$NODE_MAJOR" -lt 22 ] || { [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -lt 19 ]; } || [ "$NODE_MAJOR" -eq 23 ]; then
  echo "Node $(node -v) is unsupported. DeepSeek Harness needs ^22.19.0 or >=24.0.0." >&2
  exit 1
fi

if [ -d "$TARGET/.git" ]; then
  echo "==> Updating existing checkout at $TARGET"
  git -C "$TARGET" pull --ff-only
else
  echo "==> Cloning DeepSeek Harness into $TARGET"
  git clone https://github.com/deepseek-ai/deepseek-harness.git "$TARGET"
fi

cd "$TARGET"

echo "==> Activating pnpm $PNPM_VERSION"
corepack enable
corepack prepare "pnpm@$PNPM_VERSION" --activate

echo "==> Installing dependencies"
pnpm install

echo "==> Building"
pnpm run build

# Reuse the skills already written for Claude Code. dsh discovers project
# skills under .dsh/skills and .agents/skills, using the same SKILL.md shape.
if [ -d "$REPO_ROOT/.claude/skills" ]; then
  mkdir -p "$TARGET/.agents/skills"
  for skill in "$REPO_ROOT"/.claude/skills/*/; do
    [ -d "$skill" ] || continue
    name="$(basename "$skill")"
    ln -sfn "$skill" "$TARGET/.agents/skills/$name"
    echo "    linked skill: $name"
  done
fi

cat <<'DONE'

==> Done.

Start the Web UI:      cd TARGET_DIR && pnpm dsh web      # http://127.0.0.1:3080
One-shot headless run: pnpm dsh --profile headless "your task"
Add a plugin:          pnpm dsh plugin --profile web add <package>

Configure a model provider before first use — DeepSeek direct via
@deepseek-ai/dsh-llm-deepseek, or another provider via @deepseek-ai/dsh-llm-pi-ai
(OpenAI, Anthropic Messages, Bedrock, OpenRouter, or any OpenAI-compatible gateway).
DONE
echo "    (TARGET_DIR = $TARGET)"
