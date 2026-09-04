# West Power Summit promo — v2 re-cut

Re-cut of the Epique Realty "Region 1 · West Power Summit" promo.
**30s → 40s**, 1280×720, 30fps, scored.

| | v1 | v2 |
|---|---|---|
| Cold open | UFO / lightning over a city, 1.4s | 7s cinematic build + title card |
| Audio | transition whooshes only, no music | composed 120 BPM score, −15.5 LUFS |
| Leadership grid | repeated look, narrow casting | 15 people, mixed ethnicity, gender, 20s–50s |
| State timing | 0.9s – 2.4s, uneven | 2.0s every state |
| Housing | mostly luxury hero homes | mixed, mostly mid-range neighbourhoods |

## Timeline (120 BPM, one bar = 2.0s, every cut on a bar)

| Time | Segment |
|---|---|
| 0:00–0:04 | Dawn ridgelines, rising from black. No type — this is the beat the UFO used to hold. |
| 0:04–0:08 | Gold light network over the West + `EPIQUE REALTY` / `REGION 1 · WEST POWER SUMMIT` title card |
| 0:08–0:12 | Leadership call grid, recast |
| 0:12–0:14 | `THE WEST IS BUILDING THE FUTURE` (reused from v1) |
| 0:14–0:36 | 11 state cards × 2.0s |
| 0:36–0:40 | End card, slow push in |

## Footage

Nine of eleven state cards are new Higgsfield plates (Kling 3.0 Turbo, 720p 16:9).
Reused from v1: **Washington** (coast + Rainier) and **Wyoming** (prairie homestead).

Three cards were regenerated because of defects inherited from v1, not because of
the brief:

* **Oregon** — v1 ran the Seattle skyline, Space Needle and all, under the OREGON label.
* **Colorado** — v1 showed hillside homes with multiple swimming pools.
* **New Mexico** — v1 carried an all-male headshot grid and no homes at all.

## Brand overlays

Rebuilt in `build.py` rather than reused, so new and reused shots carry an
identical lockup. Sampled from v1: gold `#DCB573`, Montserrat, corner plate at
(35, 24)–(291, 113). The lower third is opaque black from y=592, which fully
covers v1's baked-in labels on the reused shots — verified per state card
(sampled band mean 0.00 on all eleven).

## Running it

```
# needs, in the working directory:
#   src.mp4          the v1 cut
#   g01..g12.mp4     the generated plates
#   wordmark.png     EPIQUE wordmark, keyed off the v1 end card
python3 pipeline/build.py     # -> west-power-summit-v2.mp4
python3 pipeline/score.py out.wav 40.0   # score on its own
```

`score.py` is written to the edit: sub drone and pad on the chord bars, pulse
from 0:12, a gold-shimmer arp over the states, risers into each act break, and a
whoosh landing just before every state cut.
