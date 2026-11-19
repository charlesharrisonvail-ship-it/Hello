# Vail drone reel (real footage)

`../output/vail-drone-reel.mp4` — 39 s, 1080 × 1920, 30 fps, no music. Made 2026-11-19
from real winter drone footage, after the 3D-map versions were judged not realistic enough.

## Footage (free, commercial use allowed under the Pexels licence)

All three clips are by Jaxon Matthew Willis on Pexels. Pexels lists no location;
Claude identified them as Vail from the frames (Gore Creek, Vail Village, Golden Peak
runs, the run into Vail Village).

| Clip | Pexels ID | Used |
|---|---|---|
| Vail Village at sunrise | 16342706 | 0–7 s |
| Flight over the runs, ski-down into Vail Village | 16342705 | 4–11 s, 56–66 s, 76–87 s |
| Tree-lined run with valley view | 16342707 | 26–32.5 s |

Download: `https://www.pexels.com/download/video/<ID>/`. The corner credit
`Footage: Jaxon Matthew Willis / Pexels` is a courtesy; Pexels does not require it.

**No free Beaver Creek or Arrowhead footage was found** (checked Pexels for both;
Pixabay blocks automated access). The paid iStock/Getty/Shutterstock libraries have
some.

## Rebuild

`node overlays.js` writes the title PNGs (Playwright), then ffmpeg crops each
1920 × 1440 clip to the vertical frame, cross-fades them (0.6 s), and overlays
the titles. See the git log for the exact ffmpeg command.
