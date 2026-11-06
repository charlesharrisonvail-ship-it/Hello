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

THE BUDGET IS PER HOOK ENTRY, NOT PER SESSION. When the documents outgrow one
door, split them across SessionStart entries with --docs, e.g.

    session_start.py --docs PROJECT.md,DECISIONS.md     # one entry
    session_start.py --docs STATE.md                    # another entry

Each entry gets its own BUDGET. No argument prints all of DOCS, as before.
--check with no --docs reports every session_start.py entry registered in
settings.json, each against its own budget.
"""
import json
import os
import shlex
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


TITLES = dict(DOCS)


def parse_docs(argv):
    """-> list of doc names from --docs A,B (or --docs=A,B); None if absent."""
    val = None
    for i, a in enumerate(argv):
        if a == "--docs" and i + 1 < len(argv):
            val = argv[i + 1]
        elif a.startswith("--docs="):
            val = a.split("=", 1)[1]
    if val is None:
        return None
    return [n.strip() for n in val.split(",") if n.strip()]


def build(names=None):
    """-> (payload, report). report rows are (name, chars, bytes, status).

    names: which documents to print, in that order; None means all of DOCS.
    A name not in DOCS is reported as MISSING, never silently skipped.
    """
    if names is None:
        names = [n for n, _ in DOCS]
    parts, report, used = [], [], 0
    if names and names[0] != DOCS[0][0]:
        header = "# SESSION ORIENTATION, continued (auto-loaded)\n"
    else:
        header = "# SESSION ORIENTATION (auto-loaded)\n"
    parts.append(header)
    used += max(size(header))

    for name in names:
        title = TITLES.get(name, name)
        text, ok = read(name) if name in TITLES else (None, False)

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


def registered_entries():
    """-> list of doc-name lists (None = default), one per SessionStart entry
    in settings.json that runs this script. Reads the first `||` branch only;
    the fallback branches repeat it with another interpreter."""
    path = os.path.join(CLAUDE, "settings.json")
    try:
        with open(path, "r", encoding="utf-8") as fh:
            cfg = json.load(fh)
    except Exception:
        return []
    out = []
    for group in cfg.get("hooks", {}).get("SessionStart", []):
        for h in group.get("hooks", []):
            branch = (h.get("command") or "").split("||")[0]
            try:
                words = shlex.split(branch)
            except ValueError:
                continue
            for i, w in enumerate(words):
                if w.endswith("session_start.py"):
                    out.append(parse_docs(words[i + 1:]))
                    break
    return out


def report_entry(label, names):
    """Print one entry's budget breakdown; -> True if within budget."""
    payload, report = build(names)
    c, b = size(payload)
    over = max(c, b) > BUDGET or any(r[3] != "ok" for r in report)
    print("%s: %d chars / %d bytes  (budget %d per entry, whichever is "
          "larger)" % (label, c, b, BUDGET))
    for name, nc, nb, status in report:
        print("  %-14s %6d ch %6d by  %s" % (name, nc, nb, status))
    print("  OVER BUDGET" if over else "  within budget  (%d left)"
          % (BUDGET - max(c, b)))
    return not over


def main():
    names = parse_docs(sys.argv[1:])
    if "--check" in sys.argv:
        if names is not None:
            report_entry("--docs " + ",".join(names), names)
            return 0
        entries = registered_entries()
        if not entries:
            report_entry("default (all docs; no entry in settings.json)", None)
            return 0
        for i, e in enumerate(entries, 1):
            label = "default (all docs)" if e is None else ",".join(e)
            report_entry("entry %d [%s]" % (i, label), e)
        covered = [n for e in entries for n in (e or [d for d, _ in DOCS])]
        for d, _ in DOCS:
            k = covered.count(d)
            if k != 1:
                print("WARNING: %s is printed by %d entries (want exactly 1)"
                      % (d, k))
        return 0
    sys.stdout.write(build(names)[0])
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
