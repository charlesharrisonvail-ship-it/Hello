#!/usr/bin/env python3
"""Download Starfish narration chunks, join them with a short gap, and compute each
paragraph's start time (word-proportional within its chunk, exact chunk offsets).

    python3 join_narration.py <work_dir> <module_n> <chunk_audio_url>...

Expects <work_dir>/m<N>-chunk<k>.txt (the text of each chunk, paragraphs split by blank lines).
Writes <work_dir>/m<N>-starfish.wav, .mp3 and m<N>-starts.json.
"""
import json, subprocess, sys, urllib.request
from pathlib import Path

work, n, urls = Path(sys.argv[1]), sys.argv[2], sys.argv[3:]
GAP = 0.35
parts, starts, t = [], [], 0.0
for k, url in enumerate(urls, 1):
    f = work / f"m{n}-sf{k}.audio"
    subprocess.run(["curl", "-sf", "-o", str(f), url], check=True)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]).decode())
    paras = [p for p in (work / f"m{n}-chunk{k}.txt").read_text().split("\n\n") if p.strip()]
    words = [len(p.split()) for p in paras]
    acc = 0
    for w in words:
        starts.append(round(t + d * acc / sum(words), 2)); acc += w
    parts.append(f); t += d + GAP
gap = work / "gap.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-t", str(GAP), "-i", "anullsrc=r=44100:cl=mono", str(gap)], check=True)
inputs, labels = [], []
for i, p in enumerate(parts):
    inputs += ["-i", str(p)]
    if i < len(parts) - 1:
        inputs += ["-i", str(gap)]
count = len(inputs) // 2
filt = "".join(f"[{i}:a]" for i in range(count)) + f"concat=n={count}:v=0:a=1[a]"
out = work / f"m{n}-starfish.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", filt, "-map", "[a]", "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", str(out)], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out), "-c:a", "libmp3lame", "-q:a", "2", str(work / f"m{n}-starfish.mp3")], check=True)
json.dump(starts, open(work / f"m{n}-starts.json", "w"))
print(f"m{n}: {len(starts)} paragraphs, {t - GAP:.1f}s")
