---
name: epivail-voice-clone
description: Charles's cloned speaking voice for EpiVail - where it lives, how to make audio in it, and the rules (free local Chatterbox only, never in automated calls, never committed)
---

Charles wants his speaking voice cloned for EpiVail and kept on record here.
He chose the **free local route** (2026-10-28), in line with `no-paid-ai-tools`.

**Tool:** Chatterbox by Resemble AI (MIT, code and weights), pinned to upstream
commit `5de7a54`. Setup notes and the `speak.py` script are in
`tools/voice-clone/`.

**Where the voice lives:** only on Charles's Windows laptop, in
`%USERPROFILE%\EpiVail-Voice\`:
- `my-voice.wav` - his 10-20 second source recording
- `charles-voice-nano.pt` (and `-turbo.pt` if made) - the clone itself
- `out\` - the audio it speaks

Neither the recording nor the clone ever goes in this repo. A cloud session
cannot speak in the voice; it can write the script for him to run with
`speak.py say --file script.txt`.

**Status:** notes and script written 2026-10-28 but not yet run on his laptop.
Update this line once the clone exists.

**Rules:** his voice only; never in a dialer, Lofty, robocall or voicemail
drop (FCC, February 2024: AI voices are "artificial" under the TCPA); every
send is his, after the `CLAUDE.md` do-not-contact check; keep the Perth
watermark; scripts follow the EpiVail rules (signature, Southern manners, no
banned Collective phrase). Use for AiRE Estate only with his say-so.

Paid alternatives (HeyGen `clone_voice`, Higgsfield `create_voice`) are
connected but spend credits. Don't use them unless he says to.
