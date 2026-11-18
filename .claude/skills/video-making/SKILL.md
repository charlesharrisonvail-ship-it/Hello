---
name: video-making
description: Charles Harrison's normal video making skill - the front door for any video, reel, short, film, explainer, promo, B-roll, animation or music video for EpiVail, AiRE Estate or Harrison Development. Use it whenever Charles asks to make, cut, animate or render a video and has not named one tool. It picks the right installed tool (HyperFrames, Take One, Claude Animation Base, Lemo-Opuscar, it-reelsmaker, remotion-epivail-video), keeps the free route first, and keeps each brand's rules apart.
---

# Video making

Charles's one entry point for video. Pick the tool from the table, then load that
tool's own skill and follow it. Everything here is installed in this repo
(added 2026-11-18); the sources and licenses are listed at the bottom.

## First, three questions (one round, only what is not already known)

1. **Which brand?** EpiVail, AiRE Estate or Harrison Development. Each keeps its
   own rules: EpiVail per `CLAUDE.md`; AiRE Estate per `.claude/ROLE.md` (never
   Charles's name on ads or social; fine inside course videos); HD per the
   `harrison-development` skill. Never blend them in one video.
2. **What is it?** Reel from his own footage, a film made in code, a short B-roll
   insert, a character animation, or a film in a named style.
3. **Length and shape.** Vertical 9:16 for Reels/Shorts/TikTok, 16:9 for site and
   YouTube.

## Which tool

| He wants | Use | Cost |
|---|---|---|
| A Reel/Short cut from his own footage (talking head, subtitles, hook, end card) | `it-reelsmaker` (his plugin) | Free, local |
| An EpiVail navy/gold Remotion component, site background or listing reel template | `remotion-epivail-video` (his account skill) | Free |
| A finished short film from one line - launch, explainer, brand or music video - with a reviewer pass | **One take**: `take-one` skill | Free on the code route |
| HTML/GSAP motion graphics, kinetic type, captions, charts, title cards; or rebuilding a video he likes | **HyperFrames**: `hyperframes` first, then `hyperframes-cli`, `hyperframes-registry`, `media-use`, `reverse-any-video`, `style-sampling`, `remotion-to-hyperframes`, `slideshow`, `hyperframes-figma` | Free, local (`npx hyperframes`) |
| A film in a named look (oil paint, watercolor, ukiyo-e, satellite briefing, product teardown - 99 styles) | **Lemo-Opuscar**: `/lemo-opuscar:lemo-opuscar` plugin | Free; styles marked ✦ need an image generator |
| A hand-painted cartoon character acting out a moment | **Claude Animation Base**: `tools/claude-animation-base/` - read its `ANIMATION_GUIDE.md` first | Free |

Two tools that fit together: cut the reel in `it-reelsmaker`, make the inserts in
HyperFrames or Take One, and drop them in as B-roll.

## Money - read before any generation

Charles does not pay for AI generation services (`recall.py paid`). So:

- Default to the free, code-rendered route. Take One, HyperFrames, Lemo-Opuscar
  and Claude Animation Base all make finished films with no paid service.
- For a paper-collage look, use HyperFrames `style-sampling` (Collage
  Explainer). Collage B-Roll was removed at Charles's word (2026-11-18).
- Take One and `media-use` offer paid extras (Higgsfield, Seedance, Kling, Suno,
  ElevenLabs, HeyGen). Anything generated from a cloud session spends his
  credits: say the price first and never spend without his "go".

## Where it runs

Rendering needs Node 20+, ffmpeg and Chrome/Chromium. A cloud session has them
(ffmpeg 6.1 - Lemo-Opuscar wants 7+, so render Lemo films on his laptop or use a
static ffmpeg build). On a machine with no graphics card, Claude Animation Base's
watercolor fills take seconds per frame: ask the kit to swap them for flat fills
on long pieces. The HyperFrames MCP's `compose`/`render_video` are disabled from
Claude Code; use the local skills, which write HTML he can edit and commit.

## Brand cautions

- **Clawd** (the orange character in Claude Animation Base and some Lemo-Opuscar
  styles) belongs to Anthropic and is not licensed for reuse. Never put Clawd in
  an EpiVail, AiRE Estate or HD video; swap in an original character.
- Label AI as AI in AiRE Estate pieces. Sign-offs and naming follow `CLAUDE.md`
  (EpiVail) and `ROLE.md` (AiRE Estate); "Epique Mountain Collective" is banned.
- Posting is Charles's call. Render, show him, and wait.

## Sources (third-party, licenses kept in each folder)

- HyperFrames: heygen-com/hyperframes `ebddc42`, Apache-2.0 - its nine skills ->
  `.claude/skills/hyperframes*`, `media-use`, `remotion-to-hyperframes`,
  `reverse-any-video`, `slideshow`, `style-sampling` (its `figma` skill renamed
  `hyperframes-figma` so it does not clash with the Figma plugin)
- One take: talsiach/take-one `43fd27b`, MIT -> `.claude/skills/take-one/`
- Claude Animation Base: JohnHeibel/ClaudeAnimationBase `0ac8bf2`, MIT (Clawd
  excepted) -> `tools/claude-animation-base/`
- Lemo-Opuscar: lemomo-ai/lemo-opuscar, MIT/CC BY 4.0 (Clawd excepted) - enabled
  as plugin `lemo-opuscar@lemolab` in `.claude/settings.json`; it downloads its
  style library to `~/lemo-opuscar` on first use
