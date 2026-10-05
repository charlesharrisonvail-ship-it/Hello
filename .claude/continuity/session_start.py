#!/usr/bin/env python3
"""Orientation payload. Printed into every session before the agent's first turn.

MEASURE BOTH BYTES AND CHARACTERS, AND CAP ON WHICHEVER IS LARGER.

The door is ~10KB, and a payload over it is silently replaced with a ~2KB
preview stub -- the session looks completely normal and the agent wakes on a
fragment of its own orientation.

For plain ASCII, bytes and characters are the same number, so the distinction
never shows up in testing. They diverge exactly where nobody thinks to look: an
em-dash is 1 character but 3 bytes, an emoji is 1 character but 4. A document
that measures characters and fills up on symbols sails past the byte door while
its own check still cheerfully reports "within budget".

So this file takes no position on which unit the door actually uses. It
measures both and stops at whichever limit is reached first, which is correct
under either rule.

A MISSING FILE IS NOT AN EMPTY SECTION. If a document cannot be read, that is
printed as an explicit MISSING marker. Rendering it as nothing would tell the
agent "there is no state", which is a different claim, and a false one.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CLAUDE = os.path.dirname(HERE)

BUDGET = 9000      # applies to BOTH chars and UTF-8 bytes; headroom under ~10KB

DOCS = [
    ("PROJECT.md", "WHAT THIS PROJECT IS"),
    ("DECISIONS.md", "SETTLED DECISIONS -- do not re-litigate these"),
    ("STATE.md", "WHERE THE WORK STANDS RIGHT NOW"),
]


def size(text):
    """-> (chars, bytes). Cap on the LARGER; they differ on non-ASCII."""
    return len(text), len(text.encode("utf-8"))


def read(name):
    """-> (text, ok). ok=False means UNKNOWN, which is not the same as empty."""
    path = os.path.join(CLAUDE, name)
    if not os.path.exists(path):
        return None, False
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return fh.read().strip(), True
    except Exception as e:
        return "unreadable: %s" % e, False


def build():
    """-> (payload, report). report rows are (name, chars, bytes, status)."""
    parts, report, used = [], [], 0
    header = "# SESSION ORIENTATION (auto-loaded)\n"
    parts.append(header)
    used += max(size(header))

    for name, title in DOCS:
        text, ok = read(name)

        if not ok:
            block = ("\n## %s\n[MISSING: %s -- this section is UNKNOWN, "
                     "not empty]\n" % (title, name))
            parts.append(block)
            report.append((name, 0, 0, "MISSING"))
            used += max(size(block))
            continue

        block = "\n## %s\n%s\n" % (title, text)
        bc, bb = size(block)

        if used + max(bc, bb) > BUDGET:
            room = max(BUDGET - used - 240, 0)
            tc, tb = size(text)
            # NEVER trim silently. Name what was cut and by how much, so the
            # agent knows its picture is incomplete rather than assuming it
            # holds the whole thing.
            warn = ("\n## %s\n[TRUNCATED: %s is %d chars / %d bytes; only "
                    "about %d fit inside the %d budget. THIS SECTION IS "
                    "INCOMPLETE -- read the file directly before relying on "
                    "it.]\n" % (title, name, tc, tb, room, BUDGET))
            parts.append(warn)
            report.append((name, tc, tb, "TRUNCATED"))
            used += max(size(warn))
            continue

        parts.append(block)
        report.append((name, bc, bb, "ok"))
        used += max(bc, bb)

    return "".join(parts), report


def main():
    payload, report = build()
    if "--check" in sys.argv:
        c, b = size(payload)
        print("total: %d chars / %d bytes  (budget %d, whichever is larger)"
              % (c, b, BUDGET))
        for name, nc, nb, status in report:
            print("  %-14s %6d ch %6d by  %s" % (name, nc, nb, status))
        print("OVER BUDGET" if max(c, b) > BUDGET else "within budget")
        return 0
    sys.stdout.write(payload)
    return 0


if __name__ == "__main__":
    # ALWAYS exit 0. A hook that exits non-zero can block the session, and a
    # broken orientation must degrade -- never lock the user out of their own
    # project.
    try:
        main()
    except Exception as e:
        sys.stdout.write("\n[CONTINUITY HOOK FAILED: %s -- orientation is "
                         "MISSING this session, do not assume context]\n" % e)
    sys.exit(0)
