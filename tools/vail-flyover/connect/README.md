# Vail to Beaver Creek — the Minturn connection (concept flyover)

A 42-second winter flyover tracing a concept route between Vail and Beaver Creek, in the same trail-map style as `../winter-tour/`.

Route, east to west (scene metres from UTM 13N 360123 E, 4380285 N; positions from USGS GNIS):

1. **Minturn Mile** (existing backcountry route, red): Eagle's Nest → Game Creek Bowl → down Game Creek to Minturn. 6.2 km, 3147 → 2385 m.
2. **Gondola** (concept, gold): Minturn, across the Eagle River, up Meadow Mountain's open slopes. 4.4 km, 2385 → 3034 m.
3. **Meadow Mountain to Beaver Creek** (concept, gold): 1.7 km to the Larkspur-side lift base at about 2855 m.
4. **Down to Beaver Creek Village** (existing runs, red): 2.8 km to 2473 m.

Total about 15.1 km (9.4 miles).

Files:
- `route.py` traces segments 1, 3 and 4 by least-cost path on USGS 3DEP terrain. It avoids climbing and, for Beaver Creek, timber. Segment 2 is a straight line.
- `path_connect.py` holds the camera keys and checks ground clearance (at least 568 m).
- `connect.html` is the Three.js scene: route tubes drawn in as the camera travels, the Eagle River from USGS NHD, labels, step captions and the closing card.
- `caption.md` is the post caption.

The output is `../output/vail-beaver-creek-connection.mp4`. Render it with `SCENE=ski/connect.html node render.js 0 1260 1 framesC` from the scratch `vail/` folder (see `../winter-tour/`).
