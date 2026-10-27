"""Turn a transcript into corrected captions, a starts file and a one-paragraph-per-slide script.

python3 lesson_text.py transcript.json out_prefix '[0,4.0,...]' '{"wrong":"right",...}'
Fixes replace whole words (punctuation kept); keys with a space match two words in a row.
"""
import json, re, sys

src, out, starts, fixes = sys.argv[1], sys.argv[2], json.loads(sys.argv[3]), json.loads(sys.argv[4])
w = json.load(open(src))
for i, x in enumerate(w):
    core = re.sub(r"[^\w'-]", "", x["text"])
    nxt = re.sub(r"[^\w'-]", "", w[i + 1]["text"]) if i + 1 < len(w) else ""
    for bad, good in fixes.items():
        if " " in bad:
            a, b = bad.split(" ", 1)
            ga, gb = good.split(" ", 1)
            if core == a and nxt == b:
                x["text"] = x["text"].replace(a, ga)
                w[i + 1]["text"] = w[i + 1]["text"].replace(b, gb)
        elif core == bad:
            x["text"] = x["text"].replace(bad, good)
json.dump(w, open(out + "-captions.json", "w"))
json.dump(starts, open(out + "-starts.json", "w"))
paras = [[] for _ in starts]
for x in w:
    k = max(i for i, s in enumerate(starts) if x["start"] >= s - 0.05)
    paras[k].append(x["text"].strip())
open(out + "-script.txt", "w").write("\n\n".join(" ".join(p) for p in paras) + "\n")
