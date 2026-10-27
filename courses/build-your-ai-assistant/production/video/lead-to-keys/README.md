# Lead to Keys — re-cut lessons

Part 2's lesson videos (hosted in Higgsfield; the links were in `docs/lead-to-keys-course.html`
before commit eafa3ee, page keys "3"-"10") re-cut with the new visuals over AiRE's existing
narration. Same builder as Build Your AI Assistant (`../build_lesson.py`). The modules are
numbered 8-14 in the originals because they follow Part 1's 1-7.

`lkN-transcript.json` is the local transcript (`hyperframes transcribe`, whisper medium.en);
`../lesson_text.py` turns it into `lkN-captions.json` (names corrected), `lkN-starts.json` and
`lkN-script.txt`. Slides are `../beats_lkN.py`; pictures are `LKN` in `../images.py`.

| Files | Lesson | Source video |
|---|---|---|
| `lk1-*` | Module 8 · The listing | lead-to-keys-course-2 |
| `lk2-*` | Module 9 · Know who's reading it | lead-to-keys-course-3 |
| `lk3-*` | Module 10 · The numbers | lead-to-keys-course-4 |
| `lk4-*` | Module 11 · Sellers | lead-to-keys-course-5 |

```
python3 build_lesson.py beats_lk1 "MODULE 8" lead-to-keys-course-2.mp4 lead-to-keys/lk1-script.txt out/lk1 \
  lead-to-keys/lk1-starts.json --visuals LK1 --images imgs/ --course "LEAD TO KEYS" --full \
  --captions lead-to-keys/lk1-captions.json
```
