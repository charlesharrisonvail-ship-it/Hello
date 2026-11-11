#!/usr/bin/env python3
"""Builds the 3D Colorado map's data (run once; outputs are committed).

Imagery: USGS National Map "USGSImageryOnly" (public domain).
Elevation: AWS Terrain Tiles / Mapzen terrarium (USGS 3DEP, SRTM and others).
Colorado is a lat/lon rectangle, so the crop is the state itself.
Usage: python3 harrison-development/tools/build-terrain.py
"""
import io, math, os, urllib.request
import numpy as np
from PIL import Image, ImageEnhance

W, E, S, N = -109.06, -102.04, 36.99, 41.0
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "map")
IMG = "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
DEM = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"

def px(lon, lat, z):
    n = 256 * 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y

def mosaic(url, z, mode):
    x0, y0 = px(W, N, z); x1, y1 = px(E, S, z)
    tx0, ty0, tx1, ty1 = int(x0 // 256), int(y0 // 256), int(x1 // 256), int(y1 // 256)
    m = Image.new(mode, ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            req = urllib.request.Request(url.format(z=z, x=tx, y=ty), headers={"User-Agent": "terrain-build"})
            m.paste(Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=60).read())).convert(mode), ((tx - tx0) * 256, (ty - ty0) * 256))
    return m.crop((round(x0 - tx0 * 256), round(y0 - ty0 * 256), round(x1 - tx0 * 256), round(y1 - ty0 * 256)))

img = mosaic(IMG, 10, "RGB")
w = 2048; img = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
img = ImageEnhance.Contrast(ImageEnhance.Color(img).enhance(0.9)).enhance(1.12)
img = ImageEnhance.Brightness(img).enhance(0.88)
img.save(os.path.join(OUT, "colorado-imagery.webp"), quality=82)

d = np.asarray(mosaic(DEM, 8, "RGB")).astype(np.float64)
elev = d[..., 0] * 256 + d[..., 1] + d[..., 2] / 256 - 32768
lo, hi = elev.min(), elev.max()
g = Image.fromarray(np.uint8(np.clip((elev - lo) / (hi - lo), 0, 1) * 255))
g = g.resize((512, round(g.height * 512 / g.width)), Image.LANCZOS)
g.save(os.path.join(OUT, "colorado-height.png"), optimize=True)
print("imagery", img.size, "height", g.size, "elevation m", round(lo), round(hi))
