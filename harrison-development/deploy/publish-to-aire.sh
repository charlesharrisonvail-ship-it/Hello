#!/usr/bin/env bash
# Publishes the Harrison Development site to learn.aireestate.com/development/ (Charles's choice,
# 2026-11-09): copies the public files into docs/development/ of a checkout of the live AiRE
# branch, claude/stan-store-access-k4hjdu. The page stays unlinked from AiRE and noindex.
# Usage (from the repo root): bash harrison-development/deploy/publish-to-aire.sh /path/to/aire-checkout
# Then commit and push that checkout. GitHub Pages republishes in a minute or two.
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:?path to a checkout of claude/stan-store-access-k4hjdu}/docs/development"
rm -rf "$DEST" && mkdir -p "$DEST"
cp "$SRC/index.html" "$SRC/privacy.html" "$DEST"/
cp -r "$SRC/css" "$SRC/js" "$SRC/assets" "$DEST"/
rm -f "$DEST/assets/brand/og-source.html"
python3 -I - "$DEST/js/config.js" <<'PY'
import sys,re
p=sys.argv[1]; s=open(p).read()
s=re.sub(r'/\*.*?\*/\s*','',s,flags=re.S)
s='\n'.join(l for l in s.splitlines() if not re.match(r'\s*//',l))
open(p,'w').write(re.sub(r'\n{3,}','\n\n',s))
PY
if grep -rIlE 'href="https?://[^"]*(epique|epivail)' "$DEST" >/dev/null; then echo "Refusing: a link to Epique or EpiVail is in the build" >&2; exit 1; fi
echo "Copied to $DEST"
