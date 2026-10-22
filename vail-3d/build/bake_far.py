"""Bake the distant ranges around Vail (Gore Range, Holy Cross, Sawatch) for the horizon.

Downloads AWS Terrain Tiles at zoom 12 for a ~64 km box centred on the ski area and
writes, in ../data/:
  far.png    16-bit height packed in R (high byte) / G (low byte), 2 m steps
  far.jpg    snow / rock / forest colour with hillshade, sun from the south-west
  far.json   grid size, cell size and the offset to the game's origin

Run:  python3 bake_far.py   (needs numpy and Pillow; re-run only if the box changes)
"""
import json, math, os, subprocess
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "data")
TILES = os.path.join(HERE, "raw", "far")
Z = 12
C_LAT, C_LON = 39.6075, -106.36          # centre of the near box in bake.py
HALF_KM = 32
NEAR = (39.555, -106.45, 39.66, -106.27)  # S, W, N, E of the near terrain (bake.py)
OUT_N = 512                               # far grid is OUT_N x OUT_N

def merc(lat, lon, z):
    n = 2 ** z * 256
    return ((lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)

dlat = HALF_KM / 111.32
dlon = HALF_KM / (111.32 * math.cos(math.radians(C_LAT)))
x0, y0 = merc(C_LAT + dlat, C_LON - dlon, Z)
x1, y1 = merc(C_LAT - dlat, C_LON + dlon, Z)
os.makedirs(TILES, exist_ok=True)
rows = []
for ty in range(int(y0 // 256), int(y1 // 256) + 1):
    row = []
    for tx in range(int(x0 // 256), int(x1 // 256) + 1):
        f = os.path.join(TILES, f"{Z}_{tx}_{ty}.png")
        if not os.path.exists(f):
            subprocess.run(["curl", "-s", "--max-time", "40", "-o", f,
                            f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{tx}/{ty}.png"], check=True)
        a = np.asarray(Image.open(f).convert("RGB")).astype(np.float64)
        row.append(a[:, :, 0] * 256 + a[:, :, 1] + a[:, :, 2] / 256 - 32768)
    rows.append(np.hstack(row))
h = np.vstack(rows)
ox, oy = int(y0 // 256) * 256, int(x0 // 256) * 256
h = h[int(y0) - ox:int(y1) - ox, int(x0) - oy:int(x1) - oy]
h = np.asarray(Image.fromarray(h.astype(np.float32), "F").resize((OUT_N, OUT_N), Image.BILINEAR), np.float32)

m_per_px_z12 = 40075016.686 * math.cos(math.radians(C_LAT)) / (2 ** Z * 256)
size_m = (x1 - x0) * m_per_px_z12
cell = size_m / (OUT_N - 1)

# where is the game origin inside this grid? (the near grid is centred on its own box)
nx, ny = merc((NEAR[0] + NEAR[2]) / 2, (NEAR[1] + NEAR[3]) / 2, Z)
off_x = (nx - x0) * m_per_px_z12 - size_m / 2
off_z = (ny - y0) * m_per_px_z12 - size_m / 2

minE = float(np.floor(h.min()))
hq = np.clip(np.round((h - minE) / 2), 0, 65535).astype(np.uint16)
Image.fromarray(np.dstack([(hq >> 8).astype(np.uint8), (hq & 255).astype(np.uint8), np.zeros_like(hq, np.uint8)]), "RGB") \
    .save(os.path.join(OUT, "far.png"), optimize=True)

# colour: snow above treeline and on gentle slopes, spruce below ~3,400 m, rock on steep faces
TEX = 2048
H = np.asarray(Image.fromarray(h, "F").resize((TEX, TEX), Image.BILINEAR), np.float32)
px = size_m / TEX
gx, gy = np.gradient(H, axis=1) / px, np.gradient(H, axis=0) / px
slope = np.degrees(np.arctan(np.hypot(gx, gy)))
az, alt = math.radians(200), math.radians(40)
lx, ly, lz = math.sin(az) * math.cos(alt), math.cos(az) * math.cos(alt), math.sin(alt)
shade = np.clip((-gx * lx + gy * ly + lz) / np.sqrt(gx * gx + gy * gy + 1), 0, 1)
shade = 0.5 + 0.5 * shade
rng = np.random.default_rng(5)
noise = np.asarray(Image.fromarray((rng.random((TEX // 8, TEX // 8)) * 255).astype(np.uint8)).resize((TEX, TEX), Image.BICUBIC), np.float32) / 255
snow = np.array([248, 251, 255], np.float32); shadow = np.array([120, 150, 205], np.float32)
img = shadow + (snow - shadow) * shade[..., None]
treeline = 3420 + 120 * (noise - 0.5)
forest = np.clip((treeline - H) / 120, 0, 1) * np.clip((40 - slope) / 8, 0, 1) * (0.55 + 0.45 * noise)
tree = np.array([58, 74, 70], np.float32) * (0.55 + 0.6 * shade[..., None])
img = img * (1 - forest[..., None] * 0.7) + tree * forest[..., None] * 0.7
rock = np.clip((slope - 36) / 10, 0, 1)[..., None] * (0.5 + 0.5 * noise[..., None])
img = img * (1 - rock) + np.array([96, 92, 92], np.float32) * shade[..., None] * rock
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).filter(ImageFilter.SMOOTH) \
    .save(os.path.join(OUT, "far.jpg"), quality=82, optimize=True, progressive=True)

json.dump({"n": OUT_N, "cell": round(cell, 3), "minE": minE, "scale": 0.5,
           "offX": round(off_x, 1), "offZ": round(off_z, 1)}, open(os.path.join(OUT, "far.json"), "w"))
print(f"far grid {OUT_N}^2 @ {cell:.0f} m, {size_m/1000:.1f} km, elev {h.min():.0f}-{h.max():.0f} m, offset {off_x:.0f},{off_z:.0f}")
