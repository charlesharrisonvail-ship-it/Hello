# Listing Media Without the Invoice — re-cut lessons

The original AiRE course's lesson videos (hosted in Higgsfield; the links were in
`docs/course.html` before 2026-10-05) re-cut with the new visuals over their existing
narration. Same builder as Build Your AI Assistant (`../build_lesson.py`).

- `lm1-script.txt` — Module 1 narration, transcribed locally (`hyperframes transcribe`,
  whisper small.en); one paragraph per slide. Spelling of names may be off (e.g. "Vale").
- `lm1-starts.json` — the second each slide starts.
- Slides: `../beats_lm1.py`; pictures: `LM1` in `../images.py` (files numbered from 1100).

```
python3 build_lesson.py beats_lm1 "MODULE 1" course-8.mp4 listing-media/lm1-script.txt out/lm1 \
  listing-media/lm1-starts.json --visuals LM1 --images imgs/ --course "LISTING MEDIA WITHOUT THE INVOICE"
```
