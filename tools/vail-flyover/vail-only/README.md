# Vail only — the village, every Back Bowl, Blue Sky Basin (2-minute winter reel)

The scene `vail.html` and the camera path `path_vail.py` are 3600 frames at 30 fps, run from the scratch `vail/` folder with `SCENE=ski/vail.html node render.js 0 3600 1 framesV`.

- **Vail Village:** an orbit over the Covered Bridge, where Bridge Street crosses Gore Creek, and the Clock Tower beside it. Both are modeled. Buildings get pitched, snowy roofs.
- **The Back Bowls, west to east:** Game Creek, Sun Down, Sun Up, Tea Cup, China, Siberia, Inner Mongolia and Outer Mongolia.
- **Blue Sky Basin:** Pete's Bowl, Big Rock Park, Lover's Leap, Belle's Camp and Earl's Bowl.
- **Run labels:** shown in trail-map style (● green, ■ blue, ◆ black, ◆◆ double black) from OpenSkiMap names. They appear near the camera's aim and hide when a ridge blocks them.
- **Branding:** "Charles Harrison - Epique Realty Vail" stays on screen and closes the reel. Per Charles, there are no credit lines.
- **Positions:** checked against Vail's 2026-27 front side, Back Bowls and Blue Sky trail maps.
- **Village ground:** real USDA NAIP aerial photos (public domain; USGS NAIP ImageServer, about 0.6 m) over the village, given a winter look by `village_photo.py`. The roofs, conifers and plowed streets come from the photo, and the open ground is snowed over. The 3D buildings in the village carry the photo's real roofs. Run it as `python3 village_photo.py <ski dir> naip.jpg`. The older map-drawn version, `village_ground.py`, is kept for reference.
