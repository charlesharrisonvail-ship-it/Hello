# EPIVAIL: 8,150 FT — trailer graphics

The animated name cards, title, and end card for the trailer in
`marketing/epivail-8150-trailer.md`. Made locally, free: HTML + Playwright + ffmpeg.

## Files in `out/`

| File | What it is | Use it |
|------|------------|--------|
| `charles-alpha.webm`, `olaf-…`, `darrell-…`, `eva-…` | Name cards, 3.5 s, **transparent background** | Drop on the track above that person's shot |
| `charles.mp4` etc. | The same cards on black | For editors that can't read transparent WebM: set blend mode to **Screen** |
| `title-alpha.webm` / `title.mp4` | EPIVAIL / 8,150 ft title, 5 s | Full screen at 1:15 |
| `end-alpha.webm` / `end.mp4` | End card with region and signature, 6 s | Full screen at the end |
| `reel-preview.mp4` | Every graphic in order on the sunset background, 25 s | Just to watch |

CapCut desktop and DaVinci Resolve (both free) read the transparent WebM files. If
the background shows up black instead of clear, use the `.mp4` with **Screen** blend.

## Change a name, a role, or a color

Edit the `CARDS` list near the bottom of `graphics.html`, then re-render:

    node render.js out

Open `graphics.html?preview` in a browser to watch the loop without rendering.

Fonts: Anton (SIL Open Font License) and Yellowtail (Apache 2.0), both free, in `fonts/`.
