# Your AI Video Spokesperson — lesson video production

Presenter: **Eva Vail**, AiRE Estate Academy's AI presenter (not a real person). Look: black skirt
suit with gold accents (Charles, 2026-11-02). Voice: her approved Higgsfield voice (`seed_audio`,
cloned from 20 s of her screening video). Every lesson carries "Made with AI".

How each lesson is made (files in this folder; slides and pictures live with the shared builder in
`courses/build-your-ai-assistant/production/video/`: `beats_ev1..8.py`, `images.py` keys `EV1..EV8`):

1. `e<n>-script.txt` — the narration (from the module's section 2; "AiRE" written "Air" so it is said "air").
2. Voice each chunk in Higgsfield, then `join.sh <n> <chunks>` → `m<n>.wav`.
3. Transcribe, then `starts.py <n>` → `m<n>-starts.json` (slide times) and `m<n>-display.txt` (on-screen text).
4. `vcheck.py <n>` compares what the voice said with the script. Slips found and cut with `cut.py`:
   Module 2 (195.0–197.95 s, garbled "and top a few … plans"), Module 3 (129.2–132.15 s, "Willow Fork, fine"
   said twice), Module 4 (12.85–13.75 s, "by talk" said twice).
5. Eva on camera: HeyGen lip-sync of her black-suit photo for each lesson's opening and closing
   (`create_video_from_image`, 9:16, 1080p). In between, a slow push-in on the same portrait while her voice
   narrates the slides. `compose.py <n> open.mp4 close.mp4` → `m<n>-avatar.mp4` (audio = the full narration).
6. `build_lesson.py beats_ev<n> "MODULE <n>" m<n>-avatar.mp4 m<n>-display.txt out m<n>-starts.json
   --visuals EV<n> --images imgs --course "YOUR AI VIDEO SPOKESPERSON"`, then HyperFrames render.

Cost (Nov 2, 2026): Higgsfield ~170 credits (voice ~150, 13 pictures ~22); HeyGen lip-sync ~6.5 min.
Higgsfield's own talking video (Intone) would have cost ~11,700 credits, so it was not used.
