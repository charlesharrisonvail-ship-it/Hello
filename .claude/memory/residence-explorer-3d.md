---
name: residence-explorer-3d
description: Charles's 3D "roof lifts off" residence explorer demo for Harrison Development; his scores, what he asked for, and how it is built
---

Started 2026-11-24 from a reel Charles sent ("Claude built this": Opus + Claude Code +
Higgsfield, an isometric condo unit picker). He wants the same for Harrison Development
(HD) work: pick a level, the roof and upper floors lift off, rooms show furnished with
pins, a card slides out with photos, size, ft²/m² toggle and Book a Call.

His scores, in order: flat photo with pins 5/10 ("the roof coming off is what captures
you"); first 3D chalet 6.7/10 with a concept house ("looks 2018"). He then asked for real
3D models, refined images, exterior potted plants and landscape plantings and trees.

How the current version is built (free, no paid AI): three.js r170 (the copy in
`harrison-development/js/vendor/`), Poly Haven CC0 models, textures and dusk HDRI
(furniture, plants, boulders, grasses, ferns), the Khronos GlamVelvetSofa (CC BY 4.0,
credit Eric Chadwick / Khronos, shown on the page), and Poly Haven trees rendered once
into cut-outs, because the source trees are millions of triangles. GTAO, bloom and
SMAA post-processing. Everything is bundled into one self-contained HTML file (about
17 MB), plus a recorded walk-through MP4 ending on the official HD title card.

His landscape direction (2026-11-24; he has a landscape architecture background): a
dry-stack Siloam stone retaining wall on one gently curving, flowing line that follows the
yard's contour; a Siloam flagstone patio; 7" Siloam steppers as stairs leaving the porch
and going down the hill; the front bed between patio and wall filled with mixed
perennials, annuals and evergreen shrubs, with piñon pine and globe spruce for depth.
He found the house had too much glass (walkout front now mostly stone, cable deck
rails) and the lower floors "flickered like a dancefloor" (ground was level with the
floor; fixed). A "Grounds" view in the level menu flies to the landscape. He has PRO
Landscape on his computer; a plan exported from it (DXF/DWG plus plant list) would let
the model follow his real design.

LIVE on harrisondev.org (2026-11-24, Charles: "put on our website"): a third card in
the Concepts section ("Residence Explorer", id residence-explorer) with a lazy walk-through
video and an "Explore the residence in 3D" button that opens the live model over the
homepage (js/explorer.js; no separate page). The model is
harrison-development/assets/explorer/residence-explorer.html (about 18 MB, loads only on
request, unloads on close); its Contact and Book a Call buttons close the overlay and go
to the consultation form. Source to rebuild it: harrison-development/tools/residence-explorer/.
Eight tests in tests/check.mjs guard it. A social post (4:5 video in the HD post frame,
LinkedIn and Instagram copy) was drafted and NOT posted.

Earlier versions were built in the session scratchpad; nothing published. The house,
rooms and square footage are samples and the page says so. Next step to a 10 is a real
project's floor plans and photos. Publishing it on harrisondev.org only on his say.
