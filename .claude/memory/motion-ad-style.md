---
name: motion-ad-style
description: Charles wants the Null Motion "launch film" video style for both EpiVail and AiRE Estate - the motion-ad skill makes it, one brand per video, free and code-drawn
---

On 2026-11-02 Charles got Null Motion running on Windows (`tools/null-motion/`).
He liked its Infinite ad (dark grid, glass logo tile, wordmark wipe, mono end
card) and asked for that style "in your skills" for EpiVail and AiRE Estate.

It lives in `.claude/skills/motion-ad/`: a no-library HTML engine plus
`render.mjs` (Playwright frames into ffmpeg MP4), with one brand file each.
`brands/*.json` `guards` enforce the hard rules before rendering:
- no blending
- no "Epique Mountain Collective"
- no Charles, Epique, or EpiVail on AiRE Estate
- "(not included)" next to Claude Code
- an `audience` on every EpiVail video

Fix the copy, never the guard. It costs nothing and uses no credits, so it fits
`no-paid-ai-tools`.

The first two ads (EpiVail agent attraction, AiRE Lead to Keys) are in
`examples/`. Drafts are ours; posting is Charles's call.
