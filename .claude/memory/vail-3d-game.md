---
name: vail-3d-game
description: Vail 3D - the interactive ski/snowboard game map of Vail Mountain in vail-3d/, an EpiVail website attraction; how it is built, what it may not copy, and what still needs Charles
---

Charles asked (2026-10-22) for a game-style 3D Vail Mountain map, accurate down to
the Back Bowls, to run on his website as an attraction for his business. It is
EpiVail work, not AiRE Estate - keep it out of `docs/`.

Built in `vail-3d/` as plain three.js (no build, no keys, free to host): USGS
elevation via AWS Terrain Tiles plus OpenStreetMap pistes, lifts and woods, baked
by `vail-3d/build/bake.py`. Patrol HQ reads 11,249 ft in game vs 11,250 published.

Never copy Vail Resorts' official trail map art or James Niehues' painting; they
are copyrighted. Keep the OSM (ODbL), USGS and "not an official Vail Resorts map"
lines visible.

Higgsfield video for it spends his credits (279.79 on the basic plan at 2026-10-22);
propose with an estimate and wait for his "go". FreeLLMAPI offers no video
generation (checked 2026-10-22).
