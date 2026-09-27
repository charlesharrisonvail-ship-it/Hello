# /brag — AiRE Estate (aireestate.com)

## Angle

The site's own hook, told as a match cut. The finished drone video's first frame **is**
the photograph — so the video opens on a still photo that simply starts flying. That
transition is the entire product argument, and it needs no narration.

The brand voice is anti-hype ("I'd rather you trust me than be impressed by me"), so the
video is restrained and dry. No stock-launch adrenaline, no invented claims. Every number
on screen is lifted verbatim from the page.

## What it is

A real estate education product: two courses that teach a working agent to run listing
media and back-office work in Claude Code. Part One, *Listing Media Without the Invoice*,
$67. Part Two, *Lead to Keys*, $97. Taught by Charles Harrison, 25 years selling in
Colorado's Vail Valley, still practicing.

**Audience:** working real estate agents paying $400–950 per listing for premium media.

**The differentiator:** it's owned and taught by a practicing agent, not a technologist
who studied real estate.

## Hook

A still photograph of Paris, dead still, for two full seconds. Then it moves.

## Highlights

1. **The markup** — the real red flight path and white camera arrows drawn on, reusing the
   site's own SVG paths verbatim.
2. **The flight** — the actual rendered drone shot from the site, the product's real output.
3. **The arithmetic** — `$250–550` what a drone video runs, against `$67` once.

## Punchline

"Taught by a working agent, not a retired one teaching from memory." Then the URL.

## Tone

`polished`, with a deadpan edge — long holds, soft dips through black, no jokes. Matches a
page that spends a whole section listing its own limitations before asking for money.

## Visual identity (lifted from the site's CSS)

| Token | Value |
|---|---|
| Ink (background) | `#04070d` |
| Panel | `#0d1524` |
| Signal (accent) | `#38bdf8` |
| Signal hi | `#7dd3fc` |
| Red (flight path) | `#ff2d2d` / `--rec #ff453a` |
| Head / text / slate | `#ffffff` / `#dbe2ec` / `#8496b2` |
| Display font | Archivo (900/800) |
| Body font | Manrope (300/500) |
| Mono font | IBM Plex Mono (500), `.26em` tracking, uppercase |

Also reused: the site's fixed grain + 78px survey-grid overlay, masked with a radial
gradient, and the pulsing signal dot from the nav.

## Assets reused (not recreated)

- `paris.jpg` — the class photograph, from the site's CDN
- `drone.mp4` — the finished flight, from the site's CDN
- The `<svg class="path">` flight-path and camera-arrow geometry, copied exactly
- Google Fonts: Archivo, Manrope, IBM Plex Mono — the same families the site loads

## Storyboard — 22.0s, 1920×1080, 30fps

| # | Time | Beat | On screen |
|---|---|---|---|
| 1 | 0.0–3.4 | **Hook** | The photograph, still. Mono kicker `ONE PHOTOGRAPH`. Grid + grain settle. Nothing moves. |
| 2 | 3.4–7.0 | **The markup** | Red flight path draws itself along the Seine, then the ellipse, then the return path; white camera arrows fade in. Caption: `RED IS WHERE THE DRONE FLIES` / `WHITE ARROWS ARE WHERE THE CAMERA LOOKS` |
| 3 | 7.0–11.6 | **The flight** | Markup lifts off, the same frame starts moving. The real render plays. Line: **No drone. No pilot. No weather window.** Then `~90 SECONDS` |
| 4 | 11.6–15.4 | **The arithmetic** | `$250–550` (what a drone video runs) struck through against `$67` (once). Footnote in slate: *plus your own Claude plan and a few dollars of tool usage per listing* |
| 5 | 15.4–18.8 | **The product** | `AıRE Estate` — Real estate courses built in Claude Code. Eight video lessons · Part One · $67 |
| 6 | 18.8–22.0 | **Punchline** | *Taught by a working agent, not a retired one teaching from memory.* → `aireestate.com` with the pulsing signal dot |

## Sound

One piece, written together, in A minor at 84bpm: sub bass, a filtered pad, a sparse
mono-synth pluck that answers each caption, a soft kick from scene 3, a riser into the
match cut at 7.0s and a low impact under it. Effects sit in the same key and space as the
music, mixed under it. Ducked ~3dB under the arithmetic so the numbers read in silence.

## Share caption

See `share-copy.txt`.

## Deliberately not in the video

- No refund/pricing terms, certificate claims, or anything needing a disclaimer at 30fps.
- No "3D tour" framing — the site is explicit that it is a cinematic video and not that.
- No EpiVail navy/gold. AiRE Estate is a separate brand with its own palette, and the site
  states it is independent of any brokerage.
