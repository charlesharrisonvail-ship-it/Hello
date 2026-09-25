#!/usr/bin/env python3
"""Identity payload -- WHO the agent is. Its own hook entry, its own budget.

WHY THIS IS A SEPARATE DOOR AND NOT ANOTHER SECTION
---------------------------------------------------
The limit is per hook ENTRY, not per session. Two entries means two budgets.

That matters more than it sounds. The alternative -- appending role content to
the project payload -- means every character of identity is a character the
project orientation no longer has, so the two compete, and the loser is
whichever one happens to sit last in the file. Splitting them means adding a
role costs the project orientation nothing at all.

IT LOADS FIRST, ON PURPOSE. Identity frames how everything after it is read.
An agent that learns its role after it has already read the work has already
formed an approach; one that learns it first reads the work through it.

A MISSING ROLE IS ANNOUNCED, NOT SKIPPED. If ROLE.md is absent the payload says
so and tells the agent how to fix it -- because a silent absence is
indistinguishable from a role that says "behave normally", and those are
different instructions.
"""
import os
import sys


# Standalone install: the scripts live in .claude/continuity/ inside the project
# they orient, so the documents are one directory up. (The plugin build resolves
# CLAUDE_PROJECT_DIR instead, because there the scripts sit outside the project.)
HERE = os.path.dirname(os.path.abspath(__file__))
CLAUDE = os.path.dirname(HERE)

BUDGET = 9000      # this entry's OWN budget -- it does not share with the
                   # orientation hook, because the limit is per entry

DOC = "ROLE.md"


def size(text):
    """-> (chars, bytes). Cap on the LARGER; they differ on non-ASCII."""
    return len(text), len(text.encode("utf-8"))


def build():
    """-> (payload, chars, bytes, status)."""
    path = os.path.join(CLAUDE, DOC)

    if not os.path.exists(path):
        body = ("# WHO YOU ARE (auto-loaded)\n\n"
                "[MISSING: .claude/%s -- this agent has NO DEFINED ROLE this "
                "session.\n"
                "This is UNKNOWN, not 'behave normally'. Write .claude/ROLE.md "
                "to define one,\n"
                "and until then do not assume any standing rules exist.]\n"
                % DOC)
        c, b = size(body)
        return body, c, b, "MISSING"

    try:
        with open(path, "r", encoding="utf-8") as fh:
            text = fh.read().strip()
    except Exception as e:
        body = ("# WHO YOU ARE (auto-loaded)\n\n"
                "[UNREADABLE: .claude/%s -- %s. Your role this session is "
                "UNKNOWN.]\n" % (DOC, e))
        c, b = size(body)
        return body, c, b, "UNREADABLE"

    header = ("# WHO YOU ARE (auto-loaded)\n"
              "# Read this first. It frames everything loaded after it.\n\n")
    body = header + text + "\n"
    c, b = size(body)

    if max(c, b) > BUDGET:
        # NEVER trim a role silently. A half-loaded identity is worse than a
        # missing one: the agent believes it holds the whole set of standing
        # rules while some of them were cut, and it cannot tell which.
        body = (header +
                "[TRUNCATED: %s is %d chars / %d bytes, over the %d budget.\n"
                "YOUR ROLE IS INCOMPLETE THIS SESSION -- some standing rules "
                "were NOT loaded.\n"
                "Read .claude/%s directly before acting on anything role-"
                "related.]\n" % (DOC, c, b, BUDGET, DOC))
        return body, c, b, "TRUNCATED"

    return body, c, b, "ok"


def main():
    payload, c, b, status = build()
    if "--check" in sys.argv:
        print("%-14s %6d ch %6d by  %s  (budget %d, whichever is larger)"
              # Upstream passes BUDGET and status swapped here, which makes
              # --check raise "%d format: a real number is required, not str".
              % (DOC, c, b, status, BUDGET))
        print("OVER BUDGET" if status == "TRUNCATED" else "within budget")
        return 0
    sys.stdout.write(payload)
    return 0


if __name__ == "__main__":
    # ALWAYS exit 0 -- a broken identity must degrade, never lock the user out.
    try:
        main()
    except Exception as e:
        sys.stdout.write("\n[IDENTITY HOOK FAILED: %s -- your role is MISSING "
                         "this session, do not assume standing rules]\n" % e)
    sys.exit(0)
