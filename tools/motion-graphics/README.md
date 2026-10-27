# Motion graphics stack: the 28 Claude Code installs

Saved from a post by Prakhar Saxena (screenshot shared 2026-10-27): "Claude can
(finally) generate motion graphics. 28 Claude Code installs that do the job."
Each item below is checked against this repo and this session, then marked:

- **Have** - already working in Charles's Claude sessions.
- **Added** - added to this repo in this change.
- **Laptop** - free; Charles installs it on his Windows ThinkPad.
- **Hold** - paid, needs an account or key, or its license is unclear. Not set up.
  See `.claude/memory/no-paid-ai-tools.md` before touching any of these.

Nothing here sends, posts, or spends. Libraries (npm, pip) belong to each
project that needs them, not to this notes repo.

## What changed in this repo

- `.claude/skills/threejs-*` (13 skills) - vendored from
  [CloudAI-X/threejs-skills](https://github.com/CloudAI-X/threejs-skills)
  (MIT, commit `0e18186`). The license is in `.claude/skills/LICENSE-threejs-skills.txt`.
- `.claude/settings.json` - the GreenSock `gsap-skills` plugin
  ([greensock/gsap-skills](https://github.com/greensock/gsap-skills), MIT,
  commit `aed9cfd`) added as a marketplace and enabled. The existing Superpowers,
  Ponytail, ECC and Continuity entries are untouched.

## The 28

| # | Item | What it does | Status | Next step |
|---|---|---|---|---|
| **Engines** | | | | |
| 1 | three.js | 3D scenes, cameras, light | **Have** (Three.js viewer MCP) + **Added** (threejs skills) | Library per project: `npm install three` |
| 2 | anime.js | Animates text, shapes, SVG | Not installed | Per project: `npm install animejs` (MIT, free) |
| 3 | motion | Springy motion for sites | Not installed | Per project: `npm install motion` (MIT, free) |
| 4 | react-three-fiber | 3D scenes from React | **Added** (`threejs-react-three-fiber` skill) | Per project: `npm install three @react-three/fiber` |
| 5 | lottie-web | Plays After Effects files on the web | Not installed | Per project: `npm install lottie-web` (MIT, free) |
| 6 | gsap | Times every move to the frame | **Added** (`gsap-skills` plugin) | Per project: `npm install gsap` (free, plugins included per the skill) |
| **Render** | | | | |
| 7 | ffmpeg | Cuts, joins, converts video | Have in the cloud container; not on the laptop | **Laptop:** `winget install Gyan.FFmpeg` (run `winget search ffmpeg` first if the ID differs) |
| 8 | remotion | Makes MP4s from React | Partly **Have** (`remotion-epivail-video` skill) | **Hold** the official pack: it has no LICENSE file, and the post says Remotion charges at 4+ staff. Read remotion.dev/license first. Install command, when cleared: `npx skills add remotion-dev/skills` |
| 9 | hyperframes | Turns an HTML page into an MP4 | **Have** (HyperFrames MCP connected) | Optional local skills: `npx skills add heygen-com/hyperframes` (license not checked) |
| 10 | manim | Math and diagram animations (Python) | Not installed | **Laptop:** `pip install manim`. LaTeX (MiKTeX, free) only for math text |
| 11 | motion-canvas | Explainer animation, live preview | Not installed | Scaffold with `npm init @motion-canvas@latest` (check its README) |
| 12 | revideo | Video built from code, on a server | Not installed | Install from its GitHub README (not checked here) |
| **UI parts** | | | | |
| 13 | shadcn/ui | Base component kit | Not installed | In a React project: `npx shadcn@latest init` (MIT, free) |
| 14 | react-bits | Animated text, backgrounds, effects | Not installed | Copy-paste components from its site (not checked here) |
| 15 | magicui | Animated parts for landing pages | Not installed | Add via the shadcn registry (not checked here) |
| 16 | motion-primitives | Drop-in moving text and UI | Not installed | Copy-paste components (not checked here) |
| 17 | magic-mcp (21st.dev) | Claude builds UI from a parts library | **Hold** | Needs a 21st.dev API key; the free tier was not verified. Not set up |
| **Sound** | | | | |
| 18 | whisper | Captions from a voiceover | Not installed | **Laptop:** `pip install -U openai-whisper` (MIT, free; needs ffmpeg) |
| 19 | tone.js | Music and sound in code | Not installed | Per project: `npm install tone` (MIT, free) |
| 20 | wavesurfer.js | Audio waveforms | Not installed | Per project: `npm install wavesurfer.js` (BSD-3, free) |
| 21 | elevenlabs/skills | Voice, music, SFX | **Hold** | Needs an ElevenLabs account and API key. The Remotion voiceover guide uses it by default. Charles decides |
| **Skills and MCP** | | | | |
| 22 | anthropics/skills | Art, canvas, GIF and document skills | **Have** (`anthropic-skills:*` in session) | None |
| 23 | mcp-for-blender | Claude drives Blender (3D) | **Hold** | Needs Blender (free) and the MCP. License not checked |
| 24 | gsap-skills | Teaches Claude correct GSAP | **Added** (plugin enabled) | Takes effect on the next session start |
| 25 | remotion/skills | Teaches Claude Remotion | Same as #8 | Same hold |
| 26 | threejs-skills | Teaches Claude Three.js | **Added** (13 skills, MIT) | None |
| 27 | after-effects-mcp | Drives After Effects | **Hold** | Needs Adobe After Effects, which is paid software |
| 28 | motion-graphics-skills | 13 launch-grade motion skills | Not added | The post does not name the repo. Send the link and it can be reviewed and added |

## Not done, and why

- **No npm or pip packages were installed here.** They are project dependencies,
  not Claude Code installs. Add them in the project that needs them.
- **Remotion's pack was not copied in.** It has no LICENSE file, and the post notes
  paid use at 4+ staff. Charles should read the license first.
- **Held items (8/9 remotion pack, 17, 21, 23, 27) were not set up.** Each one is
  paid, needs an account, or has an unclear license. Charles said no paid AI tools
  (memory: `no-paid-ai-tools`).
- **Items marked "not checked here"** come from general knowledge, not from a
  look at their repos. Check the README before installing.
