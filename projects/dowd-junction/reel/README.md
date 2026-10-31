# Dowd Junction reel

A 30-second vertical (1080×1920, 30 fps) reel that goes with the concept site in
`../redesign`. It is built in Remotion and renders free. The only paid step is
two AI motion clips, listed under Credits. It is
held to the video standard in `.claude/memory/video-minimum-bar.md`.

It is a pitch piece for the developer or project manager, **not a public post**.
EpiVail has no appointment on this project; post publicly only if the owner
approves.

## Render

    cd projects/dowd-junction/reel
    npm install
    npm run render     # out/dowd-junction-reel.mp4
    npm run studio     # live preview and editing

In the cloud session, point Remotion at the pre-installed browser:
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

The video is silent by Charles's choice (2026-10-31); the burned-in captions carry the words.

## Scenes

| Time | Scene | Headline |
|---|---|---|
| 0–5 s | Eagle River photo | A new chapter on the *Eagle River.* |
| 5–11 s | USGS aerial, phases drawn on | About *300* homes, in two phases. |
| 11–17 s | Annexation → Zoning → Subdivision, source card typing | What it *takes.* |
| 17–24 s | Place story → Digital home → Interest list, then the real site scrolling | EpiVail tells the *story.* |
| 24–30 s | Contact card | Let's build the *next chapter.* |

## Against the minimum bar

1. A kinetic headline with an italic serif accent word, in every scene.
2. Floating proof chips, three or four per scene. Figures come from the Avon
   PZC packet of July 13, 2026, printed page 27.
3. Diagrams that show the mechanism: the Town of Avon's process, and EpiVail's
   proposed flow, with labeled arrows.
4. A dark code card typing out the source's facts, and the real concept site
   scrolling in a phone frame.
5. An illustrated guide who points at each scene. It is a generic character,
   not a likeness of Charles.
6. Halftone dots, grain, a vignette and hard drop shadows throughout.
7. Captions burned in. Content stays left of the right-hand buttons and above
   the bottom caption area.
8. Something new lands every second or two.

## Credits (shown in the video)

- Eagle River at Minturn: Jeffrey Beall, CC BY 4.0.
- Gore Range from Vail: David Herrera, CC BY 2.0.
- AI motion: `public/eagle-river-motion.mp4` and `public/gore-range-motion.mp4`
  were made from the two photos above (cropped to 9:16) with Higgsfield, Kling
  3.0 image-to-video: 5 s each, standard mode, no sound. Job IDs are
  e8e44b7e-1d89-4c07-9768-7b3f786ecc4c and 7a6bd484-90ce-43eb-bce1-60b76978265f.
  They cost 15 credits in total, approved by Charles on 2026-10-31. The prompts
  allowed motion only, with no new buildings, people or objects. The video
  labels them "AI motion from the real photo".
- Aerial: USDA/USGS The National Map, public domain. The phase areas are
  approximate and labeled as not boundaries.
- Fonts: Manrope, Cormorant Garamond, JetBrains Mono (all SIL OFL).
