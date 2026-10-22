# Vail 3D: an interactive ski and ride map of Vail Mountain

A browser game laid over the real mountain. You ski or snowboard down true-to-elevation
terrain, ride the actual lifts, and see the real run names as you pass them. It covers
the Front Side, the Back Bowls and Blue Sky Basin. An EpiVail website attraction.

Open `index.html` through any static web server. It has no build step and no API keys,
and it costs nothing to run.

## What's in it

- **Terrain:** a 699 × 530 elevation grid at about 22 m per cell, from USGS 3DEP data
  served as AWS Terrain Tiles. Summit and base heights match Vail's published figures:
  the top of Mountaintop Express reads 11,249 ft in game against 11,250 ft published.
- **Runs and lifts:** every downhill run and lift that OpenStreetMap maps inside the Vail
  box, with OSM's difficulty mapped to green, blue, black and double black. Forest comes
  from OSM's wood polygons, so the glades and tree lines sit where they really are.
- **Gameplay:**
  - Carve, tuck, brake and jump, and catch air off real rollovers.
  - Spins and air time are scored, and you wipe out on bad landings.
  - Lifts are rideable: press `E` at a lift's base. Chairs and gondola cabins move.
  - A rotating minimap; the full trail map (`M`) lets you fast-travel to any lift top
    or set a waypoint.
  - Banners name each area as you enter it ("CHINA BOWL", "BLUE SKY BASIN"), and signs
    float over the head of each run.
  - Flyover mode orbits the whole mountain.
  - Touch controls for phones.
- **Brand line:** "Presented by EpiVail · Epique Realty Colorado Mountain Region" (bottom
  of the screen). Edit `#credit` in `index.html`.

## Put it on a website

Host the whole `vail-3d/` folder as it is (GitHub Pages, Netlify, or any host), then
embed it:

```html
<iframe src="https://YOUR-HOST/vail-3d/" style="width:100%;height:80vh;border:0"
        allow="fullscreen; gamepad" loading="lazy" title="Vail Mountain 3D"></iframe>
```

The data is about 3 MB. Phones load the lighter 2K texture and fewer trees.

## Refresh the data (once a season)

```bash
cd vail-3d/build
python3 fetch_dem.py   # elevation tiles -> raw/dem.npy (rarely changes)
python3 fetch_osm.py   # runs, lifts, woods -> raw/osm/*.json (~20 min; Overpass is slow)
python3 bake.py        # -> ../data/*
```

`raw/` is git-ignored. If a run or lift is missing or wrong, fix it on openstreetmap.org.
The next bake picks it up, and it improves every ski app that uses OSM.

## Sources and required credit

Keep this credit visible; it is on the start screen now:

- Runs and lifts © OpenStreetMap contributors, ODbL. The derived `map.json` falls
  under ODbL too, so it must stay open if redistributed.
- Terrain from USGS 3DEP, via AWS Terrain Tiles (Mapzen/Tilezen).
- **Not an official Vail Resorts map.** The game says so and tells players to follow
  posted signage and ski patrol. It does not copy the official trail map artwork (James
  Niehues' painting and Vail Resorts' maps are copyrighted). It redraws the mountain
  from open data instead.

Maps of Vail reviewed while building this:

- Vail Resorts' official trail maps for the Front Side, Back Bowls and Blue Sky Basin.
- James Niehues' painted Vail map.
- EverySki's 3D viewer (everyski.com/resorts/us/vail/3d).
- OpenSkiMap.
- OnTheSnow, Skiresort.info and WeSki map pages.
