#!/usr/bin/env python3
"""On-demand memory search. NOT force-loaded -- this is the escape hatch.

THE FRONTMATTER IS THE INDEX. Each memory is one file carrying its own
`name:` and `description:`, and search reads those lines directly. There is
deliberately no separate index file, because an index maintained by hand
drifts, and a drifted index silently hides memories that exist -- you get a
confident "nothing found" for something sitting right there on disk.

Force-loading everything is not the alternative: the orientation payload has a
hard character budget, and memory grows without limit. So the split is
resident-vs-on-demand, and this is the on-demand half.

  python recall.py deploy staging      # match name + description
  python recall.py --deep timeout      # also search bodies
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
MEM = os.path.join(os.path.dirname(HERE), "memory")

FM = re.compile(r"^---\s*$(.*?)^---\s*$", re.M | re.S)


def parse(path):
    """-> (name, description, body). Missing frontmatter degrades to filename."""
    try:
        with open(path, "r", encoding="utf-8") as fh:
            text = fh.read()
    except Exception:
        return None
    m = FM.search(text)
    name = os.path.splitext(os.path.basename(path))[0]
    desc = ""
    body = text
    if m:
        block = m.group(1)
        body = text[m.end():]
        for line in block.splitlines():
            if line.lower().startswith("name:"):
                name = line.split(":", 1)[1].strip() or name
            elif line.lower().startswith("description:"):
                desc = line.split(":", 1)[1].strip()
    return name, desc, body


def search(terms, deep=False):
    if not os.path.isdir(MEM):
        return []
    hits = []
    for fn in sorted(os.listdir(MEM)):
        if not fn.endswith(".md") or fn == "README.md":
            continue
        got = parse(os.path.join(MEM, fn))
        if not got:
            continue
        name, desc, body = got
        hay = (name + " " + desc).lower()
        if deep:
            hay += " " + body.lower()
        score = sum(1 for t in terms if t.lower() in hay)
        if score:
            hits.append((score, name, desc, os.path.join(MEM, fn)))
    hits.sort(key=lambda r: -r[0])
    return hits


def main(argv):
    deep = "--deep" in argv
    terms = [a for a in argv if not a.startswith("-")]
    if not terms:
        print("usage: recall.py [--deep] <terms>")
        return 2
    hits = search(terms, deep)
    if not hits:
        # Say which surface was searched. "Nothing found" without saying where
        # you looked is the same shape of claim as an unverified absence.
        print("no match in %s (%s). Try --deep to search bodies."
              % (MEM, "name+description+body" if deep else "name+description"))
        return 1
    for _, name, desc, path in hits:
        print("%s -- %s [%s]" % (name, desc or "(no description)", path))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
