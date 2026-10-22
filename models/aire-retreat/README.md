# AiRE mountain retreat: procedural Three.js model

A code-only rebuild of the house in `docs/media/aire-retreat-poster.jpg`. That image
is on the live-site branch `claude/stan-store-access-k4hjdu`, not on `main`. There
are no mesh files: every part is built from the numbers in `retreat.js`.

This folder sits outside `docs/`, so nothing here changes `learn.aireestate.com`.

## Files

- `retreat.js`: the model. `buildRetreat(THREE)` returns the house, site and
  backdrop. `lightScene(THREE, scene)` sets up the blue-hour sky and lights.
  `DIMS` and `PALETTE` hold every measurement and colour.
- `index.html`: an orbit viewer. Three.js 0.160.0 loads from jsDelivr. Add
  `?still` to the URL to hold the poster camera.
- `compare-poster-vs-model.jpg`: the poster (top) and the model rendered from
  the poster camera (bottom).

To view it, serve this folder (for example `python3 -m http.server`) and open
`index.html`. Opening it as a `file://` URL won't load the ES modules.

## Proportions

Measured off the poster, with the main gable set to 10 m wide:

| Part | Model | Poster estimate |
|---|---|---|
| Main roof pitch | 48.2° | about 49° |
| Main wall height : roof rise | 5.2 m : 5.6 m (0.93) | about 0.93 |
| Side-wing roof pitch | 16° | low pitch, about 15° |
| Stone plinth height | 2.4 m | about 2.3 m |
| Glazing | 4 bays plus a transom at the eave | 4 bays plus a transom |

## Colours

Every pixel in the poster is lit at blue hour, so the sampled values are very
dark. For example, the roof samples at `#00102a` and the cedar at `#1c0f08`. The
model uses the daylight colours those samples imply:

- roof `#2a2f36` (charcoal standing-seam metal)
- cedar `#7b4a2b`
- soffit `#b7773f`
- stone `#8b8781`
- frames `#18191d`

The poster's night look comes from the lighting instead: a blue sky and fill
light, warm light glowing from the windows, and downlights in the soffit.

## Inferred regions (not visible in the poster)

- The rear gable wall and the side wing's rear wall.
- The back half of both roofs.
- The chimney's hidden faces and its base below the plinth.
- Steel struts under the cantilevered deck, which are in shadow in the poster.
- The interior, simplified to a warm glowing backdrop, a stone fireplace with a
  fire, furniture blocks and a chandelier.
- The left half of the side wing's glazing grid.
- The site and backdrop: hillside, boulders, pines and low-poly snow peaks. These
  are stand-ins and do not reproduce the poster's terrain.

## Checks run

- The page renders headless with no console errors.
- About 29,000 triangles.
- Roof pitch and wall-to-rise ratio are within about 1° of the poster.
- The side-by-side comparison from the poster camera is above.
