# AiRE Estate: the six skills we recommend

A 37-second vertical reel (1080×1920, 30 fps) in AiRE Estate's look (near-black,
sky/violet/pink gradients, Archivo). It is built in Remotion from the EpiVail
reel components and held to `.claude/memory/video-minimum-bar.md`.

AI footage (Higgsfield, Kling 3.0 text-to-video, 5 s each, no sound; 22.5
credits, approved by Charles on 2026-11-01). Each clip is tagged "AI-generated
footage" on screen:
- `public/aire-hook-home.mp4`: golden-hour drone glide toward a mountain home (job b3075c70-8c54-48e1-a1fd-c124c39021ef)
- `public/aire-move-room.mp4`: dolly through a staged living room (job 68c76980-a21e-4219-b6b7-5f953a9ddbed)
- `public/aire-cta-light.mp4`: abstract sky/violet/pink light (job a87ad978-fa7f-45ed-aa4c-c69d5ec7658c)

None of it is a real listing.

Output: `marketing/social/media/23-six-skills.mp4` (+ `-cover.jpg`). **Not
queued**: it is added to `marketing/social/queue.json` only when Charles says so.

    npm install
    npm run render     # out/aire-six-skills.mp4
    # cloud session: add --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell

## The six

| # | Skill | What the reel says | Source |
|---|---|---|---|
| 1 | Taste | Fixes what you can feel but can't name; spacing, type, layout and why | Part One, Module 3 narration |
| 2 | Impeccable | By Paul Bakaus; a second set of eyes; polish · audit · critique | Module 3 narration |
| 3 | Emil Kowalski | A skill about motion; "it's the movement" | Module 3 narration |
| 4 | Remotion | Video built with code; new address + price = new video; this reel is Remotion | Module 3 narration |
| 5 | AI Real Estate | Comps, rentals, investment numbers, flip math, neighborhoods into a PDF; analysis, not an appraisal | Module 3 narration |
| 6 | Superpowers | obra/superpowers (Jesse Vincent): Claude plans before it builds, then tests. **Not in the course**, labeled "our pick" | This repo's `.claude/settings.json` |

Course narration: `courses/build-your-ai-assistant/production/video/listing-media/lm3-script.txt`
on branch `claude/stan-store-access-k4hjdu`. Price ($67 once) and Claude Pro
($20/month) are from learn.aireestate.com, read 2026-11-01.

## AiRE Estate rules, checked

- Charles's name is not on screen, and there is no Epique or EpiVail.
- Claude Code is marked "(not included)" with Claude Pro at $20 a month.
- AiRE is labeled as AI on its chest badge and in the closing note.
- No install lines or prompts are shown (the method stays in the course).
- Skill names belong to their makers; the reel says so.
