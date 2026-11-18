---
name: video-making
description: Charles Harrison's normal video making skill - the front door for any video, reel, short, film, explainer, promo, B-roll, animation or music video for EpiVail, AiRE Estate or Harrison Development. Use it whenever Charles asks to make, cut, animate or render a video and has not named one tool. It picks the right tool from everything he has - HyperFrames, Take One, Claude Animation Base, Lemo-Opuscar, the Remotion plugin, remotion-epivail-video, it-reelsmaker, epique-billboard-reveal, video-shotcraft, slack-gif-creator, Figma motion, Null Motion, Freefield, Open Generative AI, and the Higgsfield, HeyGen and OpusClip connectors - keeps the free route first, and keeps each brand's rules apart.
---

# Video making

Charles's one entry point for video. Pick the tool from the table, then load that
tool's own skill and follow it. The free code tools come first; the laptop
tools and the paid connectors come after (see Money).

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
| Any React/Remotion video that is not EpiVail navy/gold (AiRE Estate, HD, general), captions, maps, rendering | **Remotion plugin**: `remotion:remotion-best-practices` first, then `remotion-create`, `-captions`, `-render`, `-studio`, `-multimedia`, `-maps` and the rest | Free |
| A shot list, camera moves or framing plan for a video | `video-shotcraft` (his plugin) - read its SKILL.md before use; its files were not on disk 2026-11-18 | Free |
| An animated GIF (Slack, email, site) | `slack-gif-creator` | Free |
| Motion designed in Figma, or a Figma animation built in code | `figma:figma-use-motion`, `figma:figma-implement-motion` | Free |
| **On his laptop:** a finished motion-graphics ad over HyperFrames drafts, MP4 | **Null Motion**: `tools/null-motion/` | Free, local |
| **On his laptop:** Higgsfield-style image/video (Cinema Studio) with free models | **Freefield**: `tools/freefield/` (ComfyUI; AMD untested) | Free, local |
| **On his laptop:** AI stills for a video | **Open Generative AI** Image Studio: `tools/open-generative-ai/` | Free, local (its Cinema Studio is paid - not used) |
| An Epique billboard mockup from a property photo, turned into a reel where the house breaks out | `epique-billboard-reveal` | Mockup free; reel step **spends Higgsfield credits** |
| Photoreal AI video, images, ads, AI influencer, Eva Vail (`eva-vail` element) | **Higgsfield** connector | **Credits** |
| A talking avatar video, voice, or a translated version of a video | **HeyGen** connector | **Credits** |
| A hosted, shareable HyperFrames project (list, status, cloud render) | **HyperFrames by HeyGen** connector - from Claude Code only read tools work; build with the local skills | Credits to render |
| Long video cut into short clips, captions, scheduled posts | **OpusClip** connector | **Credits**; scheduling a post is publishing - his call |

Two tools that fit together: cut the reel in `it-reelsmaker`, make the inserts in
HyperFrames or Take One, and drop them in as B-roll.

## Money - read before any generation

Charles does not pay for AI generation services (`recall.py paid`). So:

- Default to the free, code-rendered route. Take One, HyperFrames, Lemo-Opuscar
  and Claude Animation Base all make finished films with no paid service.
- For a paper-collage look, use HyperFrames `style-sampling` (Collage
  Explainer). Collage B-Roll was removed at Charles's word (2026-11-18).
- Order of preference: code tools here (free) -> laptop tools (free, but he
  runs them; a cloud session can't drive them) -> connectors (credits).
- Before any Higgsfield, HeyGen, HyperFrames-render or OpusClip job: check the
  balance, quote the cost (e.g. `estimate_video_cost`, `balance`), and wait for
  his "go" on that number. A "go" covers that one spend.
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
- Posting is Charles's call. Render, show him, and wait. That includes OpusClip
  scheduling and HyperFrames sharing.

## Sources of the tools installed in this repo (third-party, licenses kept in each folder)

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
