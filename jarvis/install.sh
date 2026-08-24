#!/usr/bin/env bash
# JARVIS personal OS installer — creates the vault, installs the skills,
# and reports which optional pieces (voice, HUD vitals) are wired.
#
#   ./jarvis/install.sh                 # install to ~/.claude/skills, vault at ~/Vault
#   JARVIS_VAULT=~/Notes ./install.sh   # custom vault location
#   ./jarvis/install.sh --project       # install skills into ./.claude/skills instead
#   ./jarvis/install.sh --dry-run       # print what would happen, change nothing
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
SKILL_SRC="$REPO/.claude/skills"
VAULT="${JARVIS_VAULT:-$HOME/Vault}"
SKILL_DEST="$HOME/.claude/skills"
DRY=0

while [ $# -gt 0 ]; do
  case "$1" in
    --project) SKILL_DEST="$(pwd)/.claude/skills" ;;
    --dry-run) DRY=1 ;;
    -h|--help) sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

run() { if [ "$DRY" = 1 ]; then echo "   would: $*"; else "$@"; fi; }
say() { printf '%s\n' "$*"; }

say "JARVIS install"
say "  vault:  $VAULT"
say "  skills: $SKILL_DEST"
[ "$DRY" = 1 ] && say "  (dry run — nothing will be written)"
say ""

# 1. The memory ---------------------------------------------------------------
say "1/4  vault"
for d in raw wiki outputs outputs/briefs outputs/plans outputs/reports system; do
  if [ -d "$VAULT/$d" ]; then say "   ok   $d"; else say "   new  $d"; run mkdir -p "$VAULT/$d"; fi
done

seed() { # seed <path> <heredoc-content-on-stdin> — never clobbers an existing file
  if [ -e "$1" ]; then say "   keep $(basename "$1") (exists)"; cat >/dev/null; return; fi
  say "   new  $(basename "$1")"
  if [ "$DRY" = 1 ]; then cat >/dev/null; else cat > "$1"; fi
}

seed "$VAULT/system/schedule.md" <<'NOTE'
# Daily routine

| Time  | What happens                                      |
|-------|---------------------------------------------------|
| 07:00 | Morning brief — inbox, calendar, AI news          |
| 09:00 | Plan today — top 3 priorities saved to the vault  |
| 14:00 | Metrics pull — subs, views, followers tracked     |
| 19:00 | Close the day — reflection logged, tomorrow queued|
NOTE

seed "$VAULT/system/metrics.json" </dev/null
seed "$VAULT/system/queue.jsonl" </dev/null

seed "$VAULT/wiki/JARVIS.md" <<'NOTE'
---
type: wiki
tags: [system]
links: []
---

# JARVIS

Personal OS: Claude Code (engine) + this vault (memory) + local voice + terminal HUD.

- Skills live in `~/.claude/skills/jarvis*`
- Everything JARVIS produces lands in `outputs/`
- Rule: if it's not in the vault, it didn't happen.
NOTE

# 2. The brain ----------------------------------------------------------------
say ""
say "2/4  skills"
run mkdir -p "$SKILL_DEST"
for s in "$SKILL_SRC"/jarvis*/; do
  name="$(basename "$s")"
  if [ "$SKILL_DEST" = "$SKILL_SRC" ]; then say "   ok   $name (already here)"; continue; fi
  if [ -e "$SKILL_DEST/$name" ] && [ ! -L "$SKILL_DEST/$name" ]; then
    say "   skip $name (already installed, not a link — remove it to relink)"
    continue
  fi
  say "   link $name"
  run ln -sfn "${s%/}" "$SKILL_DEST/$name"
done

# 3. The voice ----------------------------------------------------------------
say ""
say "3/4  voice (optional)"
have() { command -v "$1" >/dev/null 2>&1; }
pyhas() { python3 -c "import $1" >/dev/null 2>&1; }

if pyhas sounddevice; then say "   ok   sounddevice (mic capture)"
else say "   miss sounddevice   -> pip install sounddevice numpy"; fi
if pyhas faster_whisper; then say "   ok   faster-whisper (local STT)"
else say "   miss faster-whisper -> pip install faster-whisper"; fi
if [ "$(uname -s)" = "Darwin" ] && have say; then say "   ok   say (macOS TTS)"
elif have piper; then say "   ok   piper (local TTS)"
elif have espeak-ng || have espeak; then say "   ok   espeak (local TTS)"
else say "   miss TTS            -> brew install piper  |  apt install espeak-ng"; fi

# 4. The face -----------------------------------------------------------------
say ""
say "4/4  HUD"
if pyhas psutil; then say "   ok   psutil (full system vitals)"
else say "   note psutil not found — HUD falls back to /proc (Linux) or partial vitals"; fi
say "   run  python3 $HERE/hud/hud.py"

say ""
say "Done. Next:"
say "  1.  python3 $HERE/hud/hud.py        # the face"
say "  2.  python3 $HERE/voice/ptt.py      # the voice"
say "  3.  claude  -> say \"morning brief\"  # the brain"
