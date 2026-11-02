"""vcheck.py <n>: compare what the voice said (tr<n>) with the script; print inserted/replaced runs of 2+ words."""
import json, re, sys, difflib
n = sys.argv[1]
norm = lambda s: re.sub(r"[^a-z']", "", s.lower())
num = {"1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine","10":"ten"}
script = [norm(x) for x in open(f"scripts/e{n}-script.txt").read().split() if norm(x)]
w = json.load(open(f"tr{n}/transcript.json")); w = w if isinstance(w, list) else w["words"]
said = [(norm(num.get(re.sub(r'[^0-9]','',x["text"]), x["text"])), x["start"]) for x in w]
said = [s for s in said if s[0]]
sm = difflib.SequenceMatcher(None, script, [s[0] for s in said], autojunk=False)
for op, a1, a2, b1, b2 in sm.get_opcodes():
    if op in ("insert", "replace") and (b2 - b1) >= 2:
        print(f"m{n} {op} @{said[b1][1]:.1f}-{said[b2-1][1]:.1f}: said '{' '.join(s[0] for s in said[b1:b2])}' | script '{' '.join(script[a1:a2])}'")
