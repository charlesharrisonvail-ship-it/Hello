"""starts.py <n>: paragraph start times for module n, by matching each paragraph's first words in tr<n>/transcript.json.
Writes m<n>-starts.json and m<n>-display.txt (the script as shown on screen: AiRE spelled correctly)."""
import json, re, sys
n = sys.argv[1]
paras = open(f"scripts/e{n}-script.txt").read().strip().split("\n\n")
w = json.load(open(f"tr{n}/transcript.json")); w = w if isinstance(w, list) else w["words"]
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower().replace("’", "'"))
t = [norm(x["text"]) for x in w]
starts, pos = [], 0
for k, p in enumerate(paras):
    words = [norm(x) for x in p.split() if norm(x)]
    found = None
    for off in (0, 1, 2, 3):              # skip leading words whisper writes differently ("one" -> "1.")
        for L in (4, 3):
            key = words[off:off + L]
            for i in range(pos + off, len(t) - L + 1):
                if t[i:i + L] == key: found = i - off; break
            if found is not None: break
        if found is not None: break
    if found is None:
        print("NOT FOUND", k + 1, p[:50]); starts.append(None); continue
    starts.append(0.0 if k == 0 else round(w[found]["start"] - 0.15, 2)); pos = found + 1
print(starts)
json.dump(starts, open(f"m{n}-starts.json", "w"))
open(f"m{n}-display.txt", "w").write("\n\n".join(p.replace("Air Estate", "AiRE Estate") for p in paras) + "\n")
