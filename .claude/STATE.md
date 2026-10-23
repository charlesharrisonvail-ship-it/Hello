# Where the work stands

_Keep this tidy. `pre_compact.py` appends banked blocks below it._

## Working on now

Continuity is merged to `main` (PRs #10, #18). EpiVail and AiRE Estate are kept
separate, each with its own signature. The AiRE Estate referral links are all
labeled (#19), and Lead to Keys' stale module numbers are corrected. `CONTINUITY: PASS`.

Open Generative AI (Anil Matcha's studio) has free Windows setup notes in
`tools/open-generative-ai/` (#24). Its Cinema Studio tab needs a paid key, so the
notes use the free local Image Studio plus Cinema Studio's camera wording. Charles
pays for no AI tools (`recall.py paid`). #24 also stopped `verify.py` leaving test
entries in this file.

AiRE Estate Facebook (2026-10-10): posts go out via `marketing/social/post.py` to the
AIRE Estate page, ID 1345476315318631 only, using the "Aire Poster" system-user token
(Aire Estate business portfolio) set as the environment's graph.facebook.com
credential. NBMH has its own business and can never post there. A Mon/Wed/Fri
Routine posts the queue from branch `ccr-754bcf55-qiikmr`. The live site publishes
from `claude/stan-store-access-k4hjdu`, not `main`. ChatGPT makes cards from
`marketing/chatgpt-brief.md`; check every image (no name, Claude Code "(not
included)", $67/$97) before queuing.

## Open question for Charles

The agents say "powered by Epique X"; some skills say "EpiqueAI". `CLAUDE.md` does
not rule on it, so ask rather than pick.

## Next

1. Watch orientation size - roughly 7,300 of the 9,000-character budget. When
   `DECISIONS.md` outgrows its share, add a fourth hook entry rather than cutting
   a rule; the limit is per hook entry, not per session
2. When a rule changes in `CLAUDE.md`, change it in `DECISIONS.md` and the memory
   index too, or a future session acts on the old one with full confidence
3. Charles installed Open Generative AI v2.0.0 on Windows (hash verified,
   2026-10-08). Next for him: sd.cpp engine + first local model. Fix the notes
   with whatever he hits

## Working thread (auto-banked)

### banked 2026-10-23
EpiVail homepage v4 (epivail-home-FINAL-v4.html, ~119 KB): comparison -> footer now
sit over a fixed animated backdrop (topographic contour lines, v5: colour cycles 9 hues, 5 s hold + 2 s ease fade, via marching
squares on a canvas, drifting gold/blue glows, grain); those sections are
transparent, table/calculator/FAQ on dark glass. Charles: never touch his AiRE
site (docs/ or the live-site branch) unless he asks. The models/aire-retreat
Three.js rebuild was rejected ("looks like shit"); folder kept pending his call.

### banked 2026-10-22 04:30
Live-page fixes (epivail-home-FINAL-v2.html, 112 KB): Lofty's custom-code box
silently truncates around 1 MB, so the 1.5 MB page (base64 photos) was cut off
after "Epique Estates". All photos now hosted in his Higgsfield storage; NEVER
embed base64 images in Lofty code again. Also: removed stray </div> that closed
Lofty's wrapper, forced full-bleed sections (Lofty padding made a frame round the
hero), fixed heading-reveal bug (IntersectionObserver never fires on a
clip-path-hidden target - observe the parent), added dark Featured Areas section
(Edwards/Avon/Eagle/Gypsum, location-verified Unsplash photos, links to his
/neighborhood/ pages). v3 hides Lofty's own Featured Areas block automatically (JS finds the "FEATURED AREAS" heading outside .ev-areas and hides its top-level block).

### banked 2026-10-22 03:45
EpiVail homepage FINISHED and delivered (epivail-home-FINAL.html; film hosted in
his Higgsfield storage, media b4585d08). Final film: real Vail (valley aerial,
Bridge St, rooftops as a no-AI pan of the real photo - the AI version morphed,
pink-sunset runs) + AI apres (deck, fire pit, champagne, fondue) + closing hot tub
from the image Charles made himself in Higgsfield (no-AI push-in + snow).
Higgsfield's filter refused 4 bikini edits with his/Eva's avatar refs; I declined
to reword around it - Charles generated the shot in the app himself.
Eva Vail = AI spokeswoman avatar (Higgsfield element eva-vail); Charles's face =
HeyGen avatar Charles2 / element charles-approved.

### banked 2026-10-22 02:40
EpiVail homepage, round 3. Charles: the stock ski clips were obviously NOT Vail
("people can tell"). Rule: footage on his site must read as Vail. Now a 40s film
(Higgsfield, Kling 2.6, 10 credits/clip, ~280 credits left): 4 real Vail photos
from Unsplash (location-verified: Bridge St/Pepi Sports, Village rooftops, valley
aerial, pink-sunset runs) animated image-to-video, plus 5 AI apres clips (deck,
fire pit, champagne, fondue, hot tub). AI covered bridge PULLED - Charles: Vail
landmarks MUST be the real thing; waiting on his photo of the real bridge. All Pexels stock
removed. Hosted in his Higgsfield storage. Added motion layer: custom cursor with
Book/View/Learn labels, magnetic buttons, 3D tilt + glare, word-by-word headline,
heading wipes, hero parallax + pointer spotlight, scroll progress, hide-on-scroll
glass header, scroll-speed ticker. No Vail footage in his Google Drive; this cloud
session cannot reach his C: drive. Best next upgrade: his own phone clips of Vail.

### banked 2026-10-22 02:00
EpiVail homepage (Lofty custom-code block, charlesharrison.epiquerealty.com).
Charles called the plain and photo heroes boring; he wants real ski/apres footage.
Now: a 28s looping montage behind the hero and the closing "Your move" section -
4 real Pexels clips (free licence) + 3 Higgsfield Kling 2.6 AI clips (gondola,
apres fire pit, village at night; 30 credits, ~370 left; Seedance needs the Plus
plan). Montage is hosted in his Higgsfield storage (CloudFront URL in the page).
Also fixed: his original code never closed `.mold-section`, so every section
below it sat in a two-column grid; footer rebuilt as `.ev-footer` with his exact
signature; "AiRE Estate" top-nav and footer link (`recall.py epivail-links-aire`).
Page lives only in Lofty; nothing in this repo.
