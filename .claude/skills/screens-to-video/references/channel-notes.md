# mobile-motion channel: vetted blocks

Channel: https://www.are.na/blake-shao/mobile-motion-mnpotx847ma (blake-shao). At the
2026-11-20 check it had 52 blocks, almost all mp4 attachments. List it again every time,
because new blocks show first in the sheet. The rows below were downloaded, sheeted and
looked at. Anything else in the channel has not been vetted yet.

| block | what it is | good for |
|---|---|---|
| 52995427 | cal.com film: blurred words come into focus on an off-white radial seamless; two-tone type, phone, laptop, end title | m: per-word blur-to-sharp titles (0-2.5s); a: off-white palette + one accent |
| 52995477 | "Organise Nothing" onboarding: an image cloud gathers around a center, tag chips float off one card, then the cloud scatters | m: many images gathering around one and scattering (0-5s); a: labels floating free of the ui |
| 52995494 | "Introducing the new travel map": phone on white with a long soft shadow; a globe bigger than the screen shrinks into it | m: content bigger than the screen (0.8-2.4s; reverse it for a breakout turn); a: the floating phone look |
| 52995372 | "Meet obeo.": big centered title with one blue dot, phones sweep through, rings, floating cards | a: end card composition; m: title-to-phone handoff |
| 52995354 | commerce film: frosted glass pills, big numbers, a glossy blue orb, tilted phone | a: frosted white glass for captions and chips |
| 52995504 | AI Passport: a carousel of round app icons above a connector list inside a phone | m: a carousel of round icons; a: a phone close-up on white |
| 52995472 | journal app: a collage page in a phone zooms out to a stack of pages and back | m: zooming out from one item to the whole collection |
| 52995476 | fasting timer: gradient screen, rolling digits, sky colour shifts | m: number roll; a: a gradient sky inside the screen |
| 52995382 | "Meet Moneybot": white title, dark interludes, cards flying past, end logo | m: a dark contrast beat, cards passing the camera |
| 52995377 | Veri: dark phone, glass widgets peel off over a silhouette | m: widgets leaving the phone; a: dark variant |
| 52995376 | Orion: phone in hand, gradient cards, heavy blur transitions | m: blur-through cuts between phone angles |
| 37244652 | images arc across a window, then fan into a 3D deck | m: images collecting into a stack (save / collection beats) |

## camera (k1)

Vetted for how the frame and the phone move, not for the screen. Measured on dense
sheets (`arena.py sheet <mp4> <png> 36`); "phone" is the phone's height against the frame's.

| block | shots | framings | tilt and roll | how shots start | take |
|---|---|---|---|---|---|
| 52995376 | Orion, 12.6s: a new shot every 0.75-1.5s, eleven in the first 9s | macro on one control (phone about 350%, the bezel a diagonal across the frame) -> whole phone in hand (50%) -> one ui card alone on a full-bleed blurred backdrop -> medium (115%, cut off at the bottom) | macro laid back and rolled 25-35deg; medium rolled 6-8deg | no cut joins two frames at rest: each is a blur and a bloom to white, about 4 frames out and 6 in, with both shots already moving; the opening is a montage of 2-frame flashes | the alternation macro / whole / medium and its pace; each shot creeps in about 4% a second, none is still. The default k1 |
| 52995452 | drum machine, 24.8s: three shots (0-2s, 2-10s, 10-24.8s) | whole phone for the first 2s only, then macro at about 220% for the rest | laid back about 55deg, turned 30deg, the orange edge of the body in view the whole time | one push in, one cut | a macro that tracks along the ui for seconds without stopping while the taps happen inside it; the thickness of a laid-back phone |
| 52995372 | obeo, 15.6s: a new framing every 1.5-2.5s | title alone -> phones sweeping through the corners -> the phone rising from below with only its top 45% in frame (180%) under a title -> a phone entering from the right edge, laid back, half cut off | sweeping phones rolled 25-30deg | no cuts at all: the phone turns from one pose to the next in about 0.4s; the backdrop changes colour with each beat | the phone cut off by the frame under a level title; entering laid back from an edge |
| 52995494 | travel map: one shot, the phone static, the content moves | wide only | none | - | a calm hold for a single beat; never the film's whole camera |

What they share, and what `scripts/camera.py` checks: the whole phone is in frame for
less than half the runtime, the closest shot is three times the widest or more, the
phone is laid back or rolled in most shots, shots start on cuts that carry their motion or on a turn of the phone, and no frame is
still.

The phone in all four is a lit 3D render: a metal frame with a highlight along one edge,
a thin black bezel, a thick rounded side with speaker holes and a port when it lies back,
and a soft shadow. `template/phone.xml` draws those from the pose; a flat rounded rect
next to these clips looks like a sticker.

Weak for camera: 52995382 (cuts, phone static), 52995493 (phone static, only crops).

The Same Mood film used a1 52995494, a2 52995427, a3 52995354, a4 52995372 and
a5 52995477, plus m1 52995427, m2 52995477 and m3 52995494.
