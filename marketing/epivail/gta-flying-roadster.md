# GTA-style flying roadster: EpiVail buyer agency (draft)

EpiVail only. Vertical 9:16, about 45 seconds, for Reels, Shorts, and LinkedIn.
The pitch starts when the car leaves the ground.

**Status:** rendered 2026-10-17 after Charles's go. The final cut is
`media/gta-flying-roadster-buyer-agency.mp4` (37s, 1080x1920, with voice).
It has not been posted.

### What was actually used

- **Presenter:** HeyGen avatar Charles2, look "Professional in a black suit"
  (`deee28fd1f61429c991bce7682c34e8f`), default voice, Brand Glossary on. This is
  the same look as the Agency/Vail video "Fresh Energy for Vail". It appears as a
  gold-framed picture-in-picture card. HeyGen ignored the green background
  (photo avatars keep their own), so there is no cutout. Avatar video:
  `c8ea78d33701827d7bc64720dd50d503`.
- **Start frames:** Higgsfield `nano_banana_2`, 5 × 1.5 credits. His face came
  from the avatar look, and the suit lining from the Epique pattern.
- **Motion:** HeyGen `image_to_video`, 5 clips of 8s each at 1080p. Higgsfield
  refused the Kling clips with a "grace period daily generation limit", so the
  plan below that names Kling was not used.
- **Cut:** ffmpeg in the session. Shot 2 is cropped to the queue and crowd,
  because the generated car showed a real automaker's grille and badge.

## Why a flying roadster, and what is real

Tesla has talked about a Roadster that can fly. In August 2026 reports said it
would use cold-gas thrusters built with SpaceX. A demo was scheduled for
October 1, then reportedly moved to October 15. As of October 17, 2026 I have
found **no official footage of it flying**, so this video makes no claim
about the real car. Sources:
[InsideEVs](https://insideevs.com/news/804993/tesla-flying-roadster-spacex-thrusters/),
[Seeking Alpha](https://seekingalpha.com/news/4633293-tesla-is-talking-flying-cars-once-again-as-it-preps-for-a-roadster-demo),
[Glitchwire](https://glitchwire.com/news/the-tesla-roadster-is-almost-here-what-if-it-actually-flies/).

The car on screen is a **generic electric roadster with no Tesla badge or
logo**. That keeps it a parody nod and keeps the post off another company's
trademark.

## Source images (Higgsfield)

| Use | ID | What it is |
|---|---|---|
| Hero identity | `eb0fc420-3899-405d-8764-54a283bab3be` | Charles, canonical GTA trailer portrait (Sept 11 set) |
| Epique theme | `9234021c-52a9-4c50-8fe7-fa0d74211a52` | Navy and gold Epique pattern, for the suit lining, tie, and pocket square |
| Look reference | `0559b6bf-621c-4aaf-90bd-31c0621e1830` | Glenwood Canyon GTA frame, sets the render quality |

In the September set the hero wears a purple racing suit. For this video he
wears a **tailored deep-navy suit with an Epique navy-and-gold pattern lining,
a gold tie, and a gold pocket square**. If Charles meant a different "GTA
image", swap the hero ID before generating.

## Shot list

| # | Time | Picture | Words |
|---|---|---|---|
| 1 | 0–8s | Vail Village at golden hour, GTA trailer look. Charles in the Epique suit walks toward a matte navy roadster, keys spinning on one finger. | On-screen: **"VAIL, COLORADO."** |
| 2 | 8–16s | A line of buyers' cars is stuck behind an OPEN HOUSE sign with a crowd at the door. Charles drops into the driver's seat, and his buyers (a couple) get in beside him. | VO: "Most buyers find out about the good ones the same day everyone else does." |
| 3 | 16–26s | **LIFT-OFF.** Thrusters flare, snow blasts outward, and the roadster rises straight up and banks over the Gore Range. | VO: "Mine don't. This is EpiVail buyer agency." |
| 4 | 26–36s | Flying low over the valley. Gold map-pin markers pop up on homes below, GTA-mission style. | VO: "Instant alerts. Coming-soon previews through the Epique agent network. Pre-approved and ready to write the same day." |
| 5 | 36–41s | The roadster sets down in the driveway of a mountain modern home. Charles opens the door for his buyers as a FOR SALE sign is going up behind them. | VO: "When the right home hits, my buyers are already standing in the driveway." |
| 6 | 41–45s | Freeze frame with a GTA "mission passed" banner. | Banner: **"BUYER ARRIVED FIRST."** End card: *EpiVail · Epique Realty Colorado Mountain Region* / *Charles Harrison, Epique Area/Growth Leader* |

### Compliance guardrails (keep these in the VO)

- Say "coming-soon previews" and "agent network", never "pocket listings" or
  "off-market guaranteed". Under the Clear Cooperation Policy, a listing that
  is marketed publicly has to reach the MLS, so the pitch is speed and
  readiness, not hidden inventory.
- Make no promise about outcomes, prices, or winning offers.
- AI-made footage. Label the post "AI-generated visuals".

## Generation plan and cost (Higgsfield, priced 2026-10-17)

| Step | Model | Count | Credits |
|---|---|---|---|
| Start frames, shots 1–5 | `nano_banana_2` 9:16 | 5 × 1.5 | 7.5 |
| Motion, shots 1–5 | `kling3_0` 10s 9:16, start-image | 5 × 20 | 100 |
| **Total** | | | **≈ 108** |

The balance is **349.79 credits**, so about **242** would be left. Expect one
or two re-rolls of the lift-off shot at 20 credits each.

**Free steps:** the cut, captions, GTA banner, end card, and music are assembled
with `ffmpeg` in this session. For the voiceover, Charles records the VO lines on
his phone, which costs nothing and is his real voice. An AI voice would cost
more credits.

## Start-frame prompts

Every frame begins with: *Photoreal AAA open-world video game trailer frame,
Rockstar/GTA cinematic quality, 9:16 vertical. Reference 1 locks the hero's
exact face, hair, and beard only. Reference 2 supplies the Epique navy-and-gold
pattern for the suit lining, tie, and pocket square. No text, no HUD, no logos,
no Tesla badge. The roadster is a sleek matte-navy two-seat electric roadster
with gold accents and no brand marks.*

1. Vail Village pedestrian street at golden hour, clock tower behind. The hero
   walks toward camera in a tailored deep-navy suit, jacket open to show the
   Epique pattern lining, gold tie, and keys on one finger. The roadster is
   parked to his left.
2. A mountain road with a queue of cars stopped behind an OPEN HOUSE yard sign
   and a crowd at the front door. In the foreground the hero slides into the
   roadster's driver seat while a smiling couple in their 40s takes the
   passenger side.
3. The same roadster hovering three meters above a snowy driveway, with blue-white
   thruster jets under each wheel well and snow blasting outward in a ring. The
   hero is visible at the wheel. Gore Range peaks behind.
4. An aerial chase-cam behind the roadster flying low over the Vail Valley at
   golden hour. Glowing gold map-pin markers float above three homes below.
5. A mountain modern home with board-formed concrete and a glass wall. The
   roadster sits in the driveway, and the hero holds the door for the couple.
   Behind them a worker is planting a FOR SALE yard sign with no readable
   brokerage name.

## Motion prompts (Kling 3.0, 10s each)

1. Slow push-in, the hero walks forward confidently and the keys spin, warm sun flare.
2. The hero drops into the seat, the door swings shut, and the car pulls out past the stalled queue.
3. Thrusters ignite, the car rises straight up, and the camera tilts to follow as it banks right over the peaks.
4. Steady chase-cam forward flight as the gold markers pulse one by one.
5. The car settles onto the driveway with a puff of snow, then the door opens and the couple steps out smiling.
