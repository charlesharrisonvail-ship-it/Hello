#!/usr/bin/env bash
# Clone and install Jarvis (github.com/isair/jarvis) from source on macOS.
#
# Jarvis is a third-party, local-first voice assistant. This script does not
# vendor its code into this repository; it clones upstream into ~/src/jarvis
# and runs the project's own setup script.
#
# NOTE ON LICENSING: Jarvis is released under a non-commercial licence.
# Business use (EpiVail / Epique Realty work) requires a separate commercial
# licence from the author. See tools/jarvis/README.md before relying on it.

set -euo pipefail

REPO_URL="https://github.com/isair/jarvis.git"
INSTALL_DIR="${JARVIS_INSTALL_DIR:-$HOME/src/jarvis}"
PYTHON_BIN="${JARVIS_PYTHON:-python3.12}"

say() { printf '\n==> %s\n' "$1"; }
die() { printf '\nError: %s\n' "$1" >&2; exit 1; }

[ "$(uname -s)" = "Darwin" ] || die "This script targets macOS. On Linux use scripts/run_linux.sh, on Windows scripts/run_windows.ps1."

command -v git >/dev/null 2>&1 || die "git not found. Install the Xcode command line tools: xcode-select --install"

# Jarvis pins numpy<2.0.0, which has no wheels for Python 3.13+. Prefer 3.12.
if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  say "$PYTHON_BIN not found; falling back to python3"
  PYTHON_BIN="python3"
  command -v "$PYTHON_BIN" >/dev/null 2>&1 || die "No python3 found. Install Python 3.12: brew install python@3.12"
fi
PY_VER="$("$PYTHON_BIN" -c 'import sys; print("%d.%d" % sys.version_info[:2])')"
case "$PY_VER" in
  3.10|3.11|3.12) ;;
  *) say "Warning: Python $PY_VER may fail on the numpy<2.0.0 pin. Python 3.12 is the safe choice (brew install python@3.12)." ;;
esac

if [ -d "$INSTALL_DIR/.git" ]; then
  say "Jarvis already cloned at $INSTALL_DIR — updating"
  git -C "$INSTALL_DIR" pull --ff-only
else
  say "Cloning Jarvis into $INSTALL_DIR"
  mkdir -p "$(dirname "$INSTALL_DIR")"
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

if ! command -v ollama >/dev/null 2>&1; then
  say "Ollama is not installed. Jarvis needs a local model server."
  echo "    Install it with:  brew install --cask ollama"
  echo "    Then pull a model: ollama pull gemma4:e2b"
  echo "    (Or point Jarvis at LM Studio / llama.cpp in its setup wizard.)"
fi

say "Running Jarvis's own macOS setup (creates .venv, installs requirements, starts the daemon)"
echo "    This downloads speech and language models on first run and can take a while."
echo "    Grant microphone access when macOS asks. Ctrl-C to stop the daemon."
echo
cd "$INSTALL_DIR"
exec bash scripts/run_macos.sh
