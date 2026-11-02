---
name: motion-ad
description: >
  Make a short motion-graphics ad (MP4, 15-30s, landscape or vertical Reel) in
  the Null Motion "launch film" style: dark grid ground, glass logo tile,
  wordmark reveal, one clean move per section, mono end card. Use whenever
  Charles asks for a motion graphic, promo video, launch video, animated ad,
  Reel/Short intro, logo reveal, or "a video like Null Motion" for EpiVail or
  for AiRE Estate. Each video is for exactly one brand; the renderer refuses a
  spec that blends them. Free: code-drawn, no AI generation, no credits.
---

# Motion ad: the Null Motion style, for EpiVail or AiRE Estate

Charles liked the Infinite ad in Null Motion (`tools/null-motion/`): a near-black
grid with soft light, a glass app-tile logo, the wordmark wiping in beside a
two-line tagline, and an end card of spaced mono caps (`GET STARTED` /
`INFINITE.DEV`). This skill rebuilds that look as a small engine that renders
straight to MP4.

## First: which business?

Ask if it is not obvious. **Never one video for both.** They are separate
businesses (`CLAUDE.md`).

| | EpiVail | AiRE Estate |
|---|---|---|
| Brand file | `brands/epivail.json` | `brands/aire-estate.json` |
| Look | Navy `#0a1628`, gold `#c9a84c`, Cormorant Garamond / DM Sans / Bebas Neue, mountain-peak tile | Near-black `#04070d`, signal blue `#38bdf8`, Archivo / Manrope / IBM Plex Mono, the site's ring-dot tile |
| End card | Signature added automatically: **Charles Harrison, Epique Area/Growth Leader** | No personal name. Never Charles, Epique, or EpiVail |
| Must have | `"audience"`: `agent-attraction` **or** `luxury-resimercial`, one per video | Any Claude Code mention says **(not included)**; prices are $67 (Part One) and $97 (Lead to Keys) unless Charles changes them |
| Voice | Courteous, warm, confident, never hypey | Plain, numbers first, no hype; source every number |

The renderer enforces the hard rules in each brand file's `guards`: banned
phrases (including "Epique Mountain Collective"), the AiRE no-name rule, the
Claude Code "(not included)" rule, and the EpiVail one-audience rule. If the
check fails, fix the copy. Don't loosen the guard.

## How to build one

1. **Plan 4-6 sections.** Each section is one idea and one move, about 3-4.5s.
   The usual order is Hook, Reveal (logo), Proof or Value, Detail, Price or
   Number, End card. Keep the total around 15-25s.
2. **Write the spec** as JSON. Copy `examples/epivail-agent-attraction.json` or
   `examples/aire-lead-to-keys.json` and change it. Use only facts you can stand
   behind. For AiRE Estate, take them from `docs/`. For EpiVail, don't invent
   numbers, splits, or Epique claims.
3. **Check, look, render:**

   ```sh
   cd .claude/skills/motion-ad
   node engine/render.mjs my-ad.json --check                 # brand guard only
   node engine/render.mjs my-ad.json --stills /tmp/ad-stills # one JPG per section: look at them
   node engine/render.mjs my-ad.json --out ad.mp4 --html ad.html
   ```

   Look at every still before rendering. Check for text wrapping badly, words
   running off the edge, or anything off-brand. A 20s MP4 takes about a minute
   in a cloud session. `--html` writes a self-playing preview that opens in any
   browser.
4. **Hand it over, don't post it.** Send the MP4 to Charles. Posting is his call.
   AiRE Estate posts go through `marketing/social/` only after he approves.

## Spec reference

```json
{ "brand": "epivail | aire-estate", "audience": "(EpiVail only)",
  "format": "landscape (1920x1080) | vertical (1080x1920)", "fps": 30,
  "scenes": [ { "label": "Hook", "type": "...", "dur": 3.4, "...": "..." } ] }
```

| `type` | Fields | What moves |
|---|---|---|
| `hook` | `text` (string or list of lines), `eyebrow`, `accent` (words to color), `size` (px, default 170) | Words rise in one by one from a blur |
| `logo` | `tagline` (optional, 2 lines; defaults to the brand's) | Tile pops and turns, wordmark wipes in, tagline fades |
| `stat` | `value`, `prefix`, `suffix`, `decimals`, `from`, `countFor`, `eyebrow`, `caption` | Number counts up |
| `list` | `items`, `eyebrow`, `step` | Items slide in with glowing ticks |
| `cards` | `cards: [{k, t, s}]` (2-3), `eyebrow` | Glass cards rise in a stagger |
| `end` | `cta` (2 lines: soft, then strong), `signature: false` to drop it | Tile + wordmark, then mono CTA lines |

Any scene can take `fine` for small print at the bottom, such as the Claude Code
cost line. The engine (`engine/motion-ad.html`) is plain HTML with no
libraries. Every frame is a pure function of time, so export never drops a frame.

## Needs

Node 18+, Playwright with Chromium, and `ffmpeg`. A cloud session already has
all three. On Charles's Windows laptop it would need `npm i playwright`,
`npx playwright install chromium`, and `winget install Gyan.FFmpeg`. Fonts load
from Google Fonts, so rendering needs internet.

There's no audio. The MP4 is silent, so add music in CapCut or wherever the
post is made.
