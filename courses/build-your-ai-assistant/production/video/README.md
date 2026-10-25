# Lesson video production (HyperFrames)

Each lesson video = the presenter's HeyGen narration (right) + on-screen beats (left),
assembled and rendered locally with HyperFrames (open source, free; `npx hyperframes@0.8.190`).

- `beats_m1.py`, `beats_m2.py`, `beats_m3.py` — each module's on-screen beats, one per
  narration paragraph.
- `join_narration.py` — joins the Starfish speech chunks into one narration file and
  writes each paragraph's start time.
- `build_lesson.py` — builds the HyperFrames project from the avatar MP4, the script and
  (optionally) the paragraph start times.
- `images.py` — the picture for every beat: a hand-drawn sketch (how-it-works beats) or a cinematic
  photo (everything else), as Higgsfield prompts, plus the sketch captions.
- `gsap.min.js` — GSAP 3.14.2, vendored so renders work offline.

```
python3 join_narration.py work/ 2 <chunk urls...>          # -> m2-starfish.wav, m2-starts.json
python3 build_lesson.py beats_m2 "MODULE 2" m2-avatar.mp4 m2-script.txt out/m2 m2-starts.json --visuals M2 --images imgs/
cd out/m2
export HYPERFRAMES_BROWSER_PATH=<path to Chrome headless shell>
npx hyperframes@0.8.190 check
npx hyperframes@0.8.190 render -o m2-lesson.mp4 -f 25 --crf 22
```

Narration (Charles's choice, 2026-10-23/24): HeyGen avatar "Charles2" → look "Confident
man in a suit", his cloned voice **on the Starfish engine only** (other engines sound
Australian). Make the Starfish audio first, lip-sync the avatar to it (Avatar IV, 9:16),
then put the approved Starfish WAV back on as the soundtrack.

Visuals (Charles, 2026-10-25: "AI eye candy... but still professional"): `--visuals` takes the
images generated from `images.py`, saved as `<module><beat>.png` (e.g. `203.png`). Sketches use
the Ian Xiaohei Illustrations style (github.com/helloianneo/ian-xiaohei-illustrations, MIT,
by Ian), English labels. Cost: sketch 2.75 credits, photo 1 credit (Modules 2-3 together: about
64 credits). Check every sketch's labels before rendering; regenerate any with stray words.
