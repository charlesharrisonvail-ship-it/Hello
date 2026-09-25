#!/usr/bin/env python3
"""Bank the working thread immediately before compaction eats it.

Compaction summarises the conversation, and a summary is lossy in exactly the
places that matter: what you were mid-way through, what was just decided, what
the next step was. This appends that to STATE.md so the next session reads it
back through the orientation payload.

BOUNDED ON PURPOSE -- keeps only the newest 3 blocks. An unbounded bank grows
until it blows the character budget in session_start.py, at which point the
whole orientation payload silently truncates. That is the exact failure this
kit exists to prevent, caused by the kit itself. Growth must be capped at the
point of writing, not hoped about.

NEVER open(path, "w") ON THE LIVE FILE. That truncates on open, so any error
between open and write leaves the only copy destroyed. Read, modify, write to
a temp file, then atomically replace.
"""
import os
import re
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
STATE = os.path.join(os.path.dirname(HERE), "STATE.md")

HEADING = "## Working thread (auto-banked)"
KEEP = 3
BLOCK_RE = re.compile(r"^### banked ", re.M)


def read_state():
    if not os.path.exists(STATE):
        return "# STATE\n\nWhat is being worked on, what is blocked, what is next.\n"
    with open(STATE, "r", encoding="utf-8") as fh:
        return fh.read()


def trim(body):
    """Keep only the newest KEEP banked blocks. Newest is appended last."""
    starts = [m.start() for m in BLOCK_RE.finditer(body)]
    if len(starts) <= KEEP:
        return body
    return body[:starts[0]] + body[starts[len(starts) - KEEP]:]


def bank(note=None):
    text = read_state()
    stamp = time.strftime("%Y-%m-%d %H:%M", time.localtime())
    entry = ("### banked %s\n%s\n\n"
             % (stamp, note or "(compaction point -- the thread above this "
                               "line was summarised; anything not written "
                               "down here is gone)"))

    if HEADING in text:
        head, _, tail = text.partition(HEADING)
        tail = trim(tail.lstrip("\n") + "\n" + entry)
        out = head + HEADING + "\n\n" + tail
    else:
        out = text.rstrip() + "\n\n" + HEADING + "\n\n" + entry

    tmp = STATE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        fh.write(out)
    os.replace(tmp, STATE)      # atomic; a half-written state loses everything
    return out


if __name__ == "__main__":
    try:
        note = " ".join(a for a in sys.argv[1:] if not a.startswith("-")) or None
        bank(note)
    except Exception as e:
        # Never block a compaction. Losing the bank is bad; wedging the user's
        # session is worse.
        sys.stderr.write("continuity bank failed: %s\n" % e)
    sys.exit(0)
