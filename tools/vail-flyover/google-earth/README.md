# Vail Valley flyover — Google Earth Studio version

Charles chose Google Earth Studio for the realistic 3D look of the reel he wanted to
match. Earth Studio runs only in his own browser under his Google login, so Claude
built the project file and Charles renders it.

**Licence note (told to Charles 2026-11-19, his call):** Google's Geo Guidelines bar
Earth Studio footage from promotional films and name "a real estate company showing
where their properties are located in a company video" as not allowed. Keep the
"Google Earth" credit that Earth Studio puts on the frames.

## Steps for Charles (about 10 minutes plus render time)

1. Open **earth.google.com/studio** in Chrome and sign in.
2. **New Project → Import** (Earth Studio Project) and pick `vail-valley-flyover.esp`.
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
