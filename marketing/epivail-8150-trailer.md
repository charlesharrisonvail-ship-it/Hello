# EPIVAIL: 8,150 FT — Trailer Script

A 95-second crime-game-*style* trailer for EpiVail: neon-sunset grading, slow-motion
hero shots, character name cards, a big title slam. The "crimes" are all real estate:
the score is a listing, the getaway car is a closing, the vault is the escrow office.

**Original by design.** No Grand Theft Auto / Rockstar name, logo, font, music, or
lookalike art — those are another company's property and would get the video pulled.
We borrow the *genre* (sunset noir, swagger, cards), not the game.

**Cast:** Charles · Olaf · Eva · Darrell
**Length:** ~95 sec, the same length as the GTA VI launch trailer
(youtu.be/BSIytHG3-Xo), which we use for pacing only, 16:9 for YouTube/LinkedIn, plus a 9:16 cut for Reels
**Music:** a slow, swaggering cover-style track that drops at 0:45 — royalty-free only
(YouTube Audio Library or Pixabay Music, both free)

---

## Cold open (0:00–0:10)

**BLACK.** Sound of a ski lift creaking. Wind.

**FADE IN:** Gore Range at golden hour, color graded hot pink and orange. Slow push
over Vail Village rooftops.

> **CHARLES (V.O., easy drawl):** "They told me the mountain was full. Every agent
> spoken for. Every listing locked up tight."

Beat.

> **CHARLES (V.O.):** "Well, bless their hearts."

## The crew (0:10–0:35)

Each character gets a freeze-frame and a hand-lettered name card, slammed on with a
bass hit.

**1. CHARLES** — steps out of a black SUV at the Covered Bridge, adjusts sunglasses,
tips his head to a passing couple.
> Card: **CHARLES — "THE CLOSER"**

**2. OLAF** — at a whiteboard covered in comps and red string, tapping one listing.
> **OLAF:** "Ski-in, ski-out. Seller wants it gone by spring."
> Card: **OLAF — "THE NUMBERS MAN"**

**3. DARRELL** — behind the wheel, gondola passing overhead, grinning.
> **DARRELL:** "I'll have y'all to the showing in eleven minutes. Ten if Vail Pass
> behaves."
> Card: **DARRELL — "THE WHEELMAN"**

**4. EVA** — slow-motion turn on a balcony, wind in her hair, looking straight at
Charles. He doesn't notice. She sighs.
> **EVA:** "He always gets the deal. Never once looks up."
> Card: **EVA — "THE INSIDE WOMAN"**

## The job (0:35–0:55)

Music drops. Fast cuts:

- Lockbox clicks open in slow motion.
- Olaf slaps a stack of offers on a table. **"Four over asking."**
- Darrell drifts (safely, legally, parked) into a snowy driveway.
- Charles hands a buyer the keys. Fireworks over Vail Mountain.
- Eva, at the closing table, slides Charles a pen. Their hands touch. Freeze.
  Charles: **"Thank you kindly, ma'am."** Eva, to camera: 😩

> **CHARLES (V.O.):** "In these mountains you don't take what you want. You earn it.
> Politely."

## The easy score goes wrong (0:55–1:15)

*(Paced to the launch trailer Charles sent, which runs 1:35: a pair against long odds, an
"easy" job that goes sideways, and the two of them finding they can count on each other.
We follow that shape with our own story, lines, and music.)*

Music cuts out. Silence, then snow falling.

- Olaf, staring at his phone: **"Appraisal came in low."**
- Darrell's car, stuck behind a snowplow on Vail Pass. **"Eleven minutes is gonna be
  forty."**
- A rival agent across the street lifts a coffee cup, smug.
- Charles, alone at the closing table, the buyer's chair empty. Clock ticking.

Eva walks in through the snow carrying the signed counteroffer. She sets it down.

> **EVA:** "You keep saying it's every agent for themselves."
> **CHARLES (looking up at her for the first time):** "Reckon I was wrong."

The music comes back in bigger than before. Darrell shows up with the buyer, dusted in snow.
Olaf runs in: **"Appraisal's revised!"** The pen hits the paper.

## Title slam (1:15–1:25)

Hard cut to black. Then:

> **EPIVAIL**
> **8,150 FT**

(Vail's elevation — the whole joke is that we're operating higher than everybody.)

## Tag (1:25–1:35)

Eva and Charles on the balcony at dusk.

> **EVA:** "So after this one… dinner?"
> **CHARLES:** "Darlin', after this one there's another one."

Darrell honks from below. Olaf leans out the window: **"We've got a showing!"**

End card, white on black:

> **Epique Realty Colorado Mountain Region**
> **Charles Harrison, Epique Area/Growth Leader**
> *Agents: the crew's hiring.*

---

## Making it for free

Charles pays for no AI tools, so every step below is free or local:

1. **Footage** — shoot it on phones. Golden hour in the Village, a borrowed balcony,
   Darrell's own car. That beats AI for faces, and everyone is really in it.
2. **Name cards and title slam** — Null Motion (`tools/null-motion/`), local, MP4 out.
3. **Sunset-noir look** — a free LUT in CapCut or DaVinci Resolve (both free); push
   magenta in highlights, teal in shadows.
4. **B-roll you can't shoot** — Open Generative AI's local Image Studio
   (`tools/open-generative-ai/`) for skyline plates. No real faces in AI shots.
5. **Music** — YouTube Audio Library or Pixabay, royalty-free.

## Before it posts

- **Ask Olaf, Eva, and Darrell** if they're happy with their parts, especially Eva.
  The crush is a gag, but it's her name on LinkedIn too, so get her yes first.
- Nothing posts until Charles approves the final cut.

---

## Shoot-day shot list

Shoot everything **horizontal (16:9), 4K if the phone allows, 30 fps**. Golden hour is
roughly the last 90 minutes before sunset, so plan the outdoor shots for then. A slow-mo
setting (120 fps) is worth using wherever it says *slow-mo*.

Graphics go on top in the edit; the files are in `marketing/trailer/out/`.

| # | Time | Shot | Who | Where | How | Graphic on top |
|---|------|------|-----|-------|-----|----------------|
| 1 | 0:00 | Ski lift creaking, empty chair passing | — | Any lift | Close-up, record 10 s of audio too | — |
| 2 | 0:03 | Rooftops at golden hour, slow push | — | Vail Village from above / parking-deck top | Walk forward slowly, phone at chest height | — |
| 3 | 0:10 | Steps out of black SUV, adjusts sunglasses, nods to a passing couple | Charles | Covered Bridge | Low angle from the curb; *slow-mo* on the step | `charles-alpha.webm` |
| 4 | 0:16 | Taps one listing on a whiteboard of comps and red string | Olaf | Office | Over-the-shoulder, then push on his finger | `olaf-alpha.webm` |
| 5 | 0:22 | Grinning behind the wheel, gondola overhead | Darrell | Parked by Gondola One | Through the passenger window. **Car parked** | `darrell-alpha.webm` |
| 6 | 0:28 | Slow turn on balcony, looks at Charles, sighs | Eva (Charles in the background, not noticing) | Any balcony with a mountain view | *Slow-mo*; a fan or a breezy day helps | `eva-alpha.webm` |
| 7 | 0:35 | Lockbox clicking open | hands | Any listing | Macro, *slow-mo* | — |
| 8 | 0:38 | Slaps a stack of offers on a table: "Four over asking." | Olaf | Conference table | Low angle from the tabletop | — |
| 9 | 0:41 | Car pulls into a snowy driveway | Darrell | Any listing | Wide from the porch. **Normal parking speed — we'll fake the drama in the edit** | — |
| 10 | 0:44 | Hands the buyer the keys | Charles + a friend as buyer | Front door | Tight on the keys, then the smile | — |
| 11 | 0:48 | Hands touch over the pen. "Thank you kindly, ma'am." Eva looks to camera | Charles, Eva | Closing table | Two angles: tight on hands, then Eva's face | — |
| 12 | 0:55 | Snow falling, silence | — | Outdoors at night under a streetlight | Static, 10 s | — |
| 13 | 0:58 | "Appraisal came in low." | Olaf | Office, lit by his phone only | Close-up | — |
| 14 | 1:01 | Stuck behind a snowplow: "Eleven minutes is gonna be forty." | Darrell | Parked roadside (shoot through the windshield; add a plow later or wait for one) | Dash angle | — |
| 15 | 1:04 | Smug rival lifts a coffee cup | a friend | Café window across the street | Long lens / zoom from far off | — |
| 16 | 1:06 | Alone at the table, empty chair, clock ticking | Charles | Closing table | Wide, then tight on a wall clock | — |
| 17 | 1:09 | Walks in through the snow, sets down the counteroffer, then the lines | Eva, Charles | Office door → table | Follow her from behind, then reverse on Charles **looking up** | — |
| 18 | 1:13 | Darrell in with the buyer, snow on shoulders; Olaf runs in: "Appraisal's revised!"; pen hits paper | all four | Office | One wide take, then a pen close-up | — |
| 19 | 1:15 | — | — | — | — | `title.mp4` (full screen) |
| 20 | 1:20 | Dusk balcony: "So after this one… dinner?" / "Darlin', after this one there's another one." | Eva, Charles | Balcony | Two-shot from behind them, mountains beyond | — |
| 21 | 1:27 | Darrell honks from below; Olaf leans out the window: "We've got a showing!" | Darrell, Olaf | Street below the balcony | Looking down from the balcony | — |
| 22 | 1:30 | — | — | — | — | `end.mp4` (full screen) |

**Safety and permissions:** every driving shot is parked or at normal speed. Ask the
owner before filming at a listing, and avoid showing house numbers or anything that
identifies a client's home. Anyone who appears on camera (the "buyer," the "rival")
should be a friend who has said yes.
