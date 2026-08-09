#!/usr/bin/env bash
# Set up the agent-reach sandbox: an isolated venv + isolated HOME so the CLI
# never touches your real user profile.
#
# Usage:
#   ./scripts/setup-sandbox.sh
#
# After running, load the wrapper with:
#   source scripts/areach.sh
# then:
#   areach install --env=local
#   areach doctor
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SANDBOX="${AGENT_REACH_SANDBOX:-$HOME/agent-reach-sandbox}"

echo "repo:    $REPO_DIR"
echo "sandbox: $SANDBOX"

python3 -m venv "$SANDBOX/venv"
# shellcheck disable=SC1091
source "$SANDBOX/venv/bin/activate"
python -m pip install --upgrade pip >/dev/null
pip install -e "$REPO_DIR"

mkdir -p "$SANDBOX/home/.config"

echo
echo "Sandbox ready. Next:"
echo "  source $REPO_DIR/scripts/areach.sh"
echo "  areach install --env=local"
echo "  areach doctor"
