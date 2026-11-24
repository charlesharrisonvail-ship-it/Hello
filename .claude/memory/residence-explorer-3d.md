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

Built in the session scratchpad, not in this public repo; nothing published. The house,
rooms and square footage are samples and the page says so. Next step to a 10 is a real
project's floor plans and photos. Publishing it on harrisondev.org only on his say.
