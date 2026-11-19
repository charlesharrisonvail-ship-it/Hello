# Vail Valley flyover — Google Earth Studio version

Charles chose Google Earth Studio for the realistic 3D look of the reel he wanted to
match. Earth Studio runs only in his own browser under his Google login, so Claude
built the project file and Charles renders it.

**Licence note (told to Charles 2026-11-19, his call):** Google's Geo Guidelines bar
Earth Studio footage from promotional films and name "a real estate company showing
where their properties are located in a company video" as not allowed. Keep the
"Google Earth" credit that Earth Studio puts on the frames.

**v2 (2026-11-19):** the first path flew into ridges and circled the villages too tight. Use `vail-valley-flyover-v2.esp`; `check_path.py` checks clearance against USGS terrain.

## Steps for Charles (about 10 minutes plus render time)

1. Open **earth.google.com/studio** in Chrome and sign in.
2. **New Project → Import** (Earth Studio Project) and pick `vail-valley-flyover-v2.esp`.
3. Press play to preview. It is 1080 × 1920, 30 fps, 42 seconds, with the same flight
   as before: Lionshead, a circle of Vail Village, the Back Bowls, west down the valley,
   a circle of Beaver Creek, Bachelor Gulch, Arrowhead, then a climb out.
4. **Render** (top right) → choose **Video (MP4)** if offered, otherwise the default
   image sequence → **Start**. Let it finish; it downloads a file.
5. Send that file back. Claude adds the titles, closing card and signature to match
   the first reel.

Earth Studio shows the imagery Google has, which is mostly summer; it cannot make it
winter.

`make_esp.py` regenerates the project file (`python3 make_esp.py`, needs `pyproj`).

## Finished (2026-11-19)

Charles rendered the project in Earth Studio and put the MP4 in Google Drive.
Claude added the pin, titles and closing card with `titles.js` (Playwright, transparent
PNGs) and ffmpeg overlays timed to the shots: `../output/vail-valley-google-earth.mp4`.
Google's own "Google Earth" logo and imagery credits stay on every frame.
The Drive copy was set to "anyone with the link can view" so it could be downloaded;
Charles can set it back to private in Drive.

## v2 finish (2026-11-19)

Rendered from `vail-valley-flyover-v2.esp`. Finishing: scaled 122% and cropped so
Earth Studio's large centered logo falls below the frame, then re-credited small in
the lower-left corner (`credit.js`: "Google Earth" + the imagery providers), a light
contrast/saturation lift, and the same titles (`titles.js`). Google's attribution stays
on screen; it is moved, not removed. Drive copy "vail-valley-flyover-v2 (1).mp4" was
link-shared for download with Charles's OK.
