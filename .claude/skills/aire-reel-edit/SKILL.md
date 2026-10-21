---
name: aire-reel-edit
description: >
  Edits a clip into a vertical AiRE Estate reel for Instagram Reels, TikTok and
  Facebook: 9:16 framing, colour grade, burned-in captions in ten styles
  (kinetic, clean, card, podcast, iphone, collage, pastel, timeline, Instagram
  UI, motion callouts), a "Made with AI" tag, and three cover looks. Use
  whenever Charles uploads or names a video for AiRE Estate social, asks to
  caption a clip, make a reel, "edit this for TikTok/Instagram", make a reel
  cover or thumbnail, or turn a talking-head or lesson clip into a short. AiRE
  Estate only; not for EpiVail.
---

# AiRE reel edit

Free and local: everything runs on ffmpeg through `reel.py` in this folder. No
paid editor, no transcription service, no upload anywhere (Charles pays for no AI
tools: `recall.py paid`).

## What you need from Charles

1. **The clip.** Any shape; landscape and square are fine.
2. **The words said in it, as text.** Captions are timed from the script against
   the pauses in the audio, so the script has to match what is said. There is no
   transcription here, so if he has no script, ask him to paste what he said.
   A clip with no speech (a flight, a slideshow) needs no script: skip `edit` and
   make a `cover`, and let the caption carry the words.
3. **Which look**, or pick one. Ten edit styles and three covers, standing in for
   the twelve in Mohammed Farshan's pack (his are unseen; these match the names
   and thumbnails, in AiRE colours). `reel.py styles` lists them.

   | Style | Looks like | Use for | His |
   |---|---|---|---|
   | `kinetic` | 2-3 big words, current one blue | hooks, talking heads | kinetic-talking-head-edit |
   | `clean` | one line on a dark band | lessons, lots of words | |
   | `card` | clean + 2.5s title card (`--title`) | opening on a question | |
   | `podcast` | clean + live blue sound wave + label | voice-led clips (needs sound) | podcast-reel-edit |
   | `iphone` | clip inside a rounded phone screen | demos, "on my phone" | iphone-style |
   | `collage` | raspberry tint, tilted photo tiles | Lead to Keys, bold hooks | red-kinetic-collage-edit |
   | `pastel` | soft grade, dark words on light pill | calm, friendly | pastel-reel-edit |
   | `timeline` | dark grade, chapter counter, progress bar | lists, "3 things" | dark-red-timeline-motion-graphics |
   | `igui` | Instagram-style overlay (`--handle`) | native-looking reels | instagram-ui / -english |
   | `motion` | kinetic + big animated callouts | prices, numbers | motion-graphics |
   | cover `bar` | frame, dark band, title | default cover | farshans-cover |
   | cover `glow` | blurred frame, glowing title box | quote, question | glow-card-reel-cover |
   | cover `split` | huge two-colour title on black | series, bold claims | knc-reel-cover |

   His two Malayalam styles are Malayalam-language captions; AiRE is English, so
   they map to `pastel` and `motion`. In `motion`, any word with a digit, `$` or
   `%` pops up big; wrap any other word in `*stars*` in the script to pop it too.
   The `igui` overlay shows icons, the handle and a line of text, never made-up
   like or view counts.
4. Whether any picture in it was made with AI. If so, use `--ai-label`.

## Commands

    python3 .claude/skills/aire-reel-edit/reel.py edit IN.mp4 OUT.mp4 --script said.txt --style kinetic
    python3 .claude/skills/aire-reel-edit/reel.py edit IN.mp4 OUT.mp4 --script said.txt --style card --title "What a drone\nshoot costs" --ai-label
    python3 .claude/skills/aire-reel-edit/reel.py cover IN.mp4 OUT.png --look split --title "One photo.\nOne drone flight." --at 2
    python3 .claude/skills/aire-reel-edit/reel.py styles

- `--fit crop` (default) fills the frame: right for a person talking. `--fit pad`
  keeps the whole picture on a blurred fill: use it when the clip is square or
  landscape and has text or a logo near its edges, or the crop would cut it off.
- `\n` in a title is a line break. Cover titles shrink to fit; short lines read best.
- Output is 1080x1920 H.264 with AAC audio, which Instagram, TikTok and Facebook
  all accept.

Put finished reels in `marketing/social/media/` (or `vertical/` for 9:16 stills),
named like the queue's files, so `post.py` and the queue can find them.

## Check before handing it over

Grab frames and look at them; do not hand over a reel you have not seen.

    ffmpeg -v error -ss 3 -i OUT.mp4 -frames:v 1 -vf scale=360:-1 peek.png

- Captions in sync at the start, middle and end. If they drift, the script does
  not match the audio: fix the script, not the timings.
- Nothing important cut off at the edges (switch to `--fit pad`).
- **No "Charles Harrison" anywhere** in the picture, captions or cover
  (`recall.py fronted`). Inside course lesson clips his name may appear; on a
  social reel it may not.
- Any AI-made picture is labelled, in the video and in the caption.
- Claude Code named on screen says "(not included)" (`recall.py not-included`).
- No prompts or step-by-step method on screen: show the result, sell the lesson.

The caption text and hashtags come from the `aire-social` skill.

## Limits

- Brand fonts (Archivo, Manrope) are not installed in the cloud box; DejaVu Sans
  Bold stands in. Colours are the brand's: `#04070d` ground, `#38bdf8` blue.
- Timing is estimated from pauses, not word-perfect. Good for short reels; for a
  long lesson clip, split it first.
- No music, B-roll cutting or camera zooms. Add them to `reel.py` when Charles
  asks for a specific look, and test on a real clip before saying it works.
- Every look was tested on `03-working-agent.mp4` (no sound) and Eva's
  `07-eva-part-1.mp4` (2026-10-21).
