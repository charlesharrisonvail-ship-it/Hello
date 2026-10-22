---
name: vail-3d-game
description: Vail 3D - the interactive ski/snowboard game map of Vail Mountain in vail-3d/, an EpiVail website attraction; how it is built, what it may not copy, and what still needs Charles
---

Charles asked (2026-10-22) for a game-style 3D Vail Mountain map, accurate down to
the Back Bowls, as a website attraction. He then chose **AiReEstate.com** as its
home, so it ships in two looks from one engine: `vail-3d/` (EpiVail credit) and
`docs/vail-3d/` (AiRE Estate look, credited "Built in Claude Code by AiRE Estate",
no Epique/EpiVail/Charles). Regenerate the AiRE copy with
`python3 vail-3d/build/make_aire.py` after any game or data change.
The live site publishes from `claude/stan-store-access-k4hjdu`; pushing there needs
his explicit OK.

Built in `vail-3d/` as plain three.js (no build, no keys, free to host): USGS
elevation via AWS Terrain Tiles plus OpenStreetMap pistes, lifts and woods, baked
by `vail-3d/build/bake.py`. Patrol HQ reads 11,249 ft in game vs 11,250 published.

Never copy Vail Resorts' official trail map art or James Niehues' painting; they
are copyrighted. Keep the OSM (ODbL), USGS and "not an official Vail Resorts map"
lines visible.

Higgsfield video for it spends his credits (277.79 on the basic plan at 2026-10-22;
his history: Kling v3.0 6 or 12 per clip, Kling 2.6 10, Nano Banana Pro 2, FLUX 3 Video 110);
propose with an estimate and wait for his "go". FreeLLMAPI offers no video
generation (checked 2026-10-22).

Done 2026-10-22 with his "go A and B": 7 Kling v3.0 clips, 60 credits, started from
real game frames (Pro mode needs Higgsfield Plus; he is on Basic, so Standard).
Kling kept the game's 3D look rather than going photoreal. Trailer (38 s) and the
9 s homepage loop are in `vail-3d/media/`, every AI clip tagged "AI-GENERATED
FOOTAGE"; re-cut with `vail-3d/build/assemble_trailer.py`. The game went live at
learn.aireestate.com/vail-3d/ (pushed to the live branch with his OK). The loop is
on the AiRE homepage as a "Play Vail 3D" section after "Have it built for you"
(his choice, 2026-10-22); it pauses when the site's Motion toggle is off. A free 9:16
cut (reframed, no new credits) is `vail-3d/media/vail-3d-trailer-9x16.mp4`. The
snowboard clip has a brief ghost-rider AI artifact in both cuts.

**Charles's verdict, 2026-10-22: "elementary... not at all what I had in mind."** He
rejected the low-poly three.js look and the Kling clips built from it. His bar is a
real AAA ski/snowboard game look (think Steep, SSX, GTA-level visuals), not simple
shapes. He said "Pause" - do not resume, regenerate, or spend until he reopens it.
The game and the homepage "Play Vail 3D" section are still live on the AiRE site;
ask him before removing or keeping them.
