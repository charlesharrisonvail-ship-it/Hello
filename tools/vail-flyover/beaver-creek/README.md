# Beaver Creek, Bachelor Gulch & Arrowhead — 2-minute winter reel

The scene is `bc.html` and the camera path is `path_bc.py`. The reel is 3,600 frames at 30 fps, 1080×1920. Render it from a scratch folder holding `render.js`, `ski/` and `data/` (the Vail `data/` folder supplies the valley backdrop) with `SCENE=ski/bc.html node render.js 0 3600 1 frames`.

## The flight

1. It opens high over Avon looking at the whole of Beaver Creek Mountain.
2. It orbits **Beaver Creek Village**, with the Centennial Express marked.
3. It goes up Centennial to **Spruce Saddle Lodge**, then follows **Birds of Prey**, the World Cup downhill (Golden Eagle).
4. It passes the **summit (11,440 ft)**, then **Rose Bowl**, **Grouse Mountain** and **Larkspur Bowl**.
5. It orbits **Bachelor Gulch Village**, with The Ritz-Carlton marked, then **Arrowhead Village**.
6. It pulls back for the close: "Beaver Creek, Colorado. Ski it. Live it." with Charles's line.

## Labels and branding

- **Run labels:** shown in trail-map style (● green, ■ blue, ◆ black, ◆◆ double black) from OpenSkiMap names, the same as the Vail reel. Labels hide while a big title is on screen.
- **Branding:** "Charles Harrison - Epique Realty Vail" stays on screen throughout. Per Charles, there are no credit lines.

## Data

All of it is free and public.

| What | Source | Script |
|---|---|---|
| Terrain | USGS 3DEP at 10 m | `fetch.py` |
| Mountain look | USDA NAIP aerial photo at 2 m, painted to winter | `prep_mtn.py` |
| Villages | NAIP at about 0.6 m plus NAIP's near-infrared band | `mkvillage.py` |
| Buildings and roads | Overture Maps | `roads.py`, `mkbld.py` |
| Runs and lifts | OpenSkiMap | — |

In the villages, the infrared band separates evergreens (dark in infrared) from aspens (bright). Evergreens stay green, and aspens become bare and snowy, as they are in winter. Roofs are the real roofs from the photo with a dusting of snow, and streets are plowed.

Positions were checked against OpenSkiMap lift stations and OSM restaurant points (the Ritz-Carlton's restaurants mark Bachelor Gulch). Bachelor Gulch and Arrowhead lie **west** of Beaver Creek Village.
