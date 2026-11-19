# Vail Valley flyover — free Windows setup notes

How to make a Google-Earth-style 3D flyover reel of the Vail Valley (Vail
Mountain, Beaver Creek, Arrowhead) for **EpiVail**, using only free software and
public-domain map data. The reel's caption and on-screen text are in
[`reel-copy.md`](reel-copy.md).

These notes have **not been run on Charles's laptop yet**. Fix them with
whatever you hit.

## Why not Google Earth Studio

Google Earth Studio is free, but Google's Geo Guidelines forbid using its footage
"for promotional films, advertisements or commercials ... anything used
specifically to sell or promote a product, business, or organization", and they
name this exact case: *"A real estate company showing where their properties are
located in a company video."* (about.google/brand-resource-center/products-and-services/geo-guidelines,
checked 2026-11-19). A reel signed by an Epique Area/Growth Leader counts as
promotion. Google Maps and Bing satellite basemaps (the ones BlenderGIS offers
from its Basemap menu) carry the same kind of restrictions, **so do not use the
BlenderGIS basemap menu for this reel.**

This route uses U.S. government data instead, which is public domain and fine for
business use:

| Data | Source | Licence |
|---|---|---|
| Terrain (the 3D mountains) | USGS 3DEP 1/3 arc-second DEM (about 10 m) | Public domain (USGS) |
| Aerial photo laid over it | USDA NAIP aerial imagery (0.6 to 1 m) | Public domain (USDA FSA) |

Credit them anyway; it costs nothing and looks professional:
`Terrain: USGS 3DEP · Imagery: USDA NAIP`.

## What you need (all free)

| Tool | What it does here | Where |
|---|---|---|
| **Blender** (current release) | Builds the 3D valley, flies the camera, renders the video | blender.org |
| **BlenderGIS** add-on (domlysz/BlenderGIS, GPL) | Imports the map files into Blender in the right place | github.com/domlysz/BlenderGIS → Code → Download ZIP |
| **QGIS** (LTR version) | Trims and lines up the map files before Blender | qgis.org |
| **USGS EarthExplorer** account | Downloads the aerial photos | earthexplorer.usgs.gov (free sign-up) |
| **CapCut** or **DaVinci Resolve** (free) | Titles, music, final MP4 | capcut.com / blackmagicdesign.com |

Your laptop is an AMD Ryzen AI machine. Use Blender's **Eevee** renderer, which
runs fine on AMD graphics; skip Cycles for this job.

## Step 1 — Download the terrain

1. Go to **apps.nationalmap.gov/downloader**.
2. Zoom to the Vail Valley. Under **Data**, tick **Elevation Products (3DEP)** →
   **1/3 arc-second DEM**, file format **GeoTIFF**.
3. Click **Search Products**. You want the tile named like `USGS_13_n40w107`
   (it covers latitude 39–40 N, longitude 106–107 W, which holds the whole
   valley). Download it.

## Step 2 — Download the aerial photos

1. Sign in at **earthexplorer.usgs.gov**.
2. Search criteria: draw a box roughly from **Vail Pass on the east to Edwards on
   the west**, Gore Creek to the top of the Back Bowls and Beaver Creek. As
   coordinates: latitude **39.57 to 39.68 N**, longitude **106.30 to 106.60 W**.
3. Data Sets → **Aerial Imagery → NAIP**. Pick the newest Colorado year offered.
4. Download every tile that touches the box (expect several). Choose the GeoTIFF
   download.

## Step 3 — Trim and line up the files in QGIS

Both files must be in the same map projection and cut to the same box, or
the photo will not sit on the mountains. Use **UTM zone 13N (EPSG:26913)**.

1. Open QGIS and drag in the DEM and all the NAIP tiles.
2. **Merge the photos:** Raster → Miscellaneous → **Merge**, input = all NAIP
   tiles, save as `naip_merged.tif`.
3. **Reproject and clip both** with Raster → Projections → **Warp (Reproject)**:
   - Target CRS: **EPSG:26913**
   - Under advanced options, set the clipping extent to the box from Step 2
     (use "Draw on canvas" and drag across Vail Pass to Edwards)
   - DEM: output resolution **10** (metres). Save as `dem_vail.tif`.
   - Photo: output resolution **3** (metres). Full resolution over this area is
     far too big for a laptop. Save as `photo_vail.tif`.
   - Under **Advanced Parameters → Additional creation options**, choose **no
     compression**. BlenderGIS reads plain GeoTIFFs most reliably.

## Step 4 — Install BlenderGIS

1. Open Blender → **Edit → Preferences → Add-ons**.
2. Click the drop-down arrow at the top right → **Install from Disk…** and pick the
   BlenderGIS ZIP you downloaded. Tick the box to enable it.
3. A **GIS** menu appears in the 3D viewport header.

## Step 5 — Build the valley in Blender

1. **GIS → Georeferencing → set scene CRS** to **EPSG:26913**.
2. **GIS → Import → Georeferenced raster** → pick `dem_vail.tif`. Mode:
   **DEM raw data build** (slow, but makes real 3D mountains). Wait; it is a big
   mesh.
3. **GIS → Import → Georeferenced raster** → pick `photo_vail.tif`. Mode:
   **On mesh UV**, and choose the terrain mesh from Step 2. The photo now drapes
   over the mountains.
4. Add sunlight: **Add → Light → Sun**, strength about 4, angled from the
   south-west for long afternoon shadows.
5. **The one setting everyone misses:** the valley is about 26 km wide, and
   Blender's camera stops seeing anything past 1 km. Select the camera →
   Camera properties → **Clip End = 100000 m** (100 km). Do the same for the
   viewport: press N → View → **Clip End = 100000 m**.
6. World colour: a pale blue (World properties → Colour) so the sky is not grey.

## Step 6 — Fly the camera

Set up the reel once, then add each shot:

- **Output properties:** resolution **1080 × 1920** (vertical), frame rate **30**.
- **Render engine:** Eevee.

Two moves cover every shot in the shot list:

**Glide (straight flight, shots 1, 3, 4, 6):**
1. Move the camera to the start view (Numpad 0 looks through it; in that view,
   N panel → View → tick **Lock Camera to View** and fly with the mouse).
2. At frame 1, hover over the viewport and press **I → Location & Rotation**.
3. Jump ahead 150 frames (5 seconds), fly to the end view, press **I** again.
4. Untick Lock Camera to View when done so you don't nudge it by accident.

**Orbit (slow circle, shots 2, 5, the cathedral-tower move):**
1. **Add → Empty → Plain Axes**, and place it over the spot (Vail Village,
   Beaver Creek Village).
2. Select the camera, then shift-select the Empty, press **Ctrl+P → Object**
   (the camera now follows the Empty).
3. Camera → **Object Constraints → Track To**, target = the Empty, so the camera
   always looks at the spot.
4. Keyframe the Empty's Z rotation: **0° at the first frame, 60° about 6 seconds
   later**. A slow 60° reads better on a phone than a full spin.

Make the moves feel like a drone, not a robot: in the **Graph Editor**, select all
keys → **T → Bézier** so each move eases in and out.

Rough timing for a 40-second reel (1,200 frames), to match `reel-copy.md`:

| Shot | Frames | Move |
|---|---|---|
| 1 Valley opener | 1–150 | Glide, high and dropping |
| 2 Vail Mountain | 151–330 | Orbit Vail Village |
| 3 Back Bowls | 331–480 | Glide over the bowls |
| 4 West to Avon | 481–600 | Glide west down the valley |
| 5 Beaver Creek | 601–780 | Orbit Beaver Creek Village |
| 6 Arrowhead | 781–930 | Glide across to Arrowhead Village |
| 7 Pull back | 931–1200 | Climb high to show all three; closing card |

## Step 7 — Render

1. Output properties → output folder, file format **PNG**. (A sequence of images
   survives a crash; a video file does not.)
2. **Render → Render Animation.** On a laptop this can take hours; start it
   before bed.
3. Turn the images into a video: in CapCut or DaVinci Resolve, import the PNG
   folder as an image sequence at 30 fps.

## Step 8 — Titles, music, export

- Add the on-screen text and closing card from [`reel-copy.md`](reel-copy.md).
- Keep text in the **middle of the frame**. Instagram puts the username and
  caption at the bottom and the like/comment buttons down the right side; the
  Frankfurt reel's titles sit just above them.
- Add the small credit line `Terrain: USGS 3DEP · Imagery: USDA NAIP` in a
  corner.
- Music: use the platform's own licensed library inside Instagram, Facebook or
  LinkedIn when you post. A business account gets a smaller library; pick from
  what it offers rather than adding a commercial song in CapCut.
- Export 1080 × 1920, 30 fps, MP4.

## Before posting

Posting is Charles's call. Check the closing card signature reads exactly
**Charles Harrison, Epique Area/Growth Leader**, and nothing says "Epique
Mountain Collective".

## The finished reel (already made)

`output/vail-valley-flyover.mp4` is the finished reel: 42 seconds, 1080 × 1920,
30 fps, no music. Claude rendered it on 2026-11-19 using the code in `render/`
(Three.js in headless Chromium, `node render.js 0 1260 1 frames`, then ffmpeg).
The map data it reads is not committed; it came from the USGS 3DEP elevation
and USGS NAIP imagery ImageServers (`exportImage`, UTM 13N, EPSG:26913) and goes
in `render/data/` to re-render. The Blender steps above are only needed if
Charles wants to make a different one himself.

### Winter version (use this one)

`output/vail-valley-flyover-winter.mp4` is the winter cut Charles asked for:
snow-covered mountains so the ski runs show, and about 6,000 buildings in 3D at
Vail Village, Lionshead, Beaver Creek, Bachelor Gulch and Arrowhead, with low
orbits around the villages. Same length and format as above.

- The snow is a winter look painted over the summer NAIP photos by
  `render/prep_winter.py` (forest stays dark, open slopes and runs go white,
  more snow higher up). No public-domain winter aerial photo covers the valley.
- Building footprints come from Overture Maps (release 2026-11-18.0), which
  carries OpenStreetMap data under the ODbL; the credit on screen reads
  `Buildings: © OpenStreetMap contributors, Overture Maps`. Buildings are
  flat-roofed blocks with snow on top, height from the map tags where given.
- To re-render: run `prep_winter.py` on the downloaded data in `render/data/`,
  then `node render.js 0 1260 1 frames` and ffmpeg (CRF 23 keeps it under 50 MB).
