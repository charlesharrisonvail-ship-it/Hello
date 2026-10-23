# Lesson video production (HyperFrames)

Each lesson video = the presenter's HeyGen narration (right) + on-screen beats (left),
assembled and rendered locally with HyperFrames (open source, free; `npx hyperframes@0.8.190`).

- `beats_m1.py` — Module 1's on-screen beats, one per narration paragraph.
- `build_m1.py` — builds the HyperFrames project from the HeyGen MP4 and the script,
  timing each beat to its paragraph (word-proportional).
- `gsap.min.js` — GSAP 3.14.2, vendored so renders work offline.

```
python3 build_m1.py avatar.mp4 m1-script.txt out/m1
cd out/m1
export HYPERFRAMES_BROWSER_PATH=<path to Chrome headless shell>
npx hyperframes@0.8.190 check
npx hyperframes@0.8.190 render
```

Narration (Charles's choice, 2026-10-23): HeyGen avatar "Charles2" → look "Confident man
in a suit", his cloned voice, Avatar IV engine, 9:16.
