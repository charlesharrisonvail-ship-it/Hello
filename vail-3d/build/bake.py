"""Bake Vail 3D game data from raw sources.

Inputs (made by fetch_osm.py and fetch_dem.py, kept out of git):
  raw/dem.npy      elevation grid (meters), web-mercator pixels at zoom 14
  raw/osm/*.json   OpenStreetMap elements: pistes, lifts, woods, restaurants

Outputs in ../data/:
  meta.json, grid.png (16-bit height in R/G, forest in B), map.json,
  terrain.jpg (4096 wide) and terrain_2k.jpg (phones)

Run:  python3 bake.py   (needs numpy and Pillow)
"""
import glob, json, math, os, re
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
OUT = os.path.join(HERE, "..", "data")
S, W, N, E = 39.555, -106.45, 39.66, -106.27   # must match the fetch scripts
Z = 14
STRIDE = 3          # game grid = every 3rd DEM pixel (~22 m)
TEX_W = 4096

def merc(lat, lon):
    n = 2 ** Z * 256
    return ((lon + 180) / 360 * n,
            (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)

PX0, PY0 = merc(N, W)
M_PER_PX = 40075016.686 * math.cos(math.radians((N + S) / 2)) / (2 ** Z * 256)

dem = np.load(os.path.join(RAW, "dem.npy"))
rows_px, cols_px = dem.shape
W_M, D_M = (cols_px - 1) * M_PER_PX, (rows_px - 1) * M_PER_PX

def to_m(lat, lon):
    """lat/lon -> game meters, origin at the grid centre, +x east, +z south."""
    x, y = merc(lat, lon)
    return (x - PX0) * M_PER_PX - W_M / 2, (y - PY0) * M_PER_PX - D_M / 2

# ---------- OSM ----------
els = {}
for f in glob.glob(os.path.join(RAW, "osm", "*.json")):
    for e in json.load(open(f)):
        els[(e["type"], e["id"])] = e

DIFF = {"novice": "green", "easy": "green", "intermediate": "blue",
        "advanced": "black", "expert": "dbl", "freeride": "dbl", "extreme": "dbl"}
runs, lifts, woods, pois, roads = [], [], [], [], []
for e in els.values():
    t = e.get("tags", {})
    if e["type"] == "node":
        if "name" in t:
            x, z = to_m(e["lat"], e["lon"])
            pois.append({"n": t["name"], "t": t.get("amenity"), "x": round(x), "z": round(z)})
        continue
    geo = e.get("geometry") or []
    if len(geo) < 2 or any(g is None for g in geo):
        continue
    pts = [to_m(g["lat"], g["lon"]) for g in geo]
    closed = geo[0] == geo[-1]
    if t.get("piste:type") == "downhill":
        d = "park" if t.get("piste:grooming") == "park" or "park" in t.get("name", "").lower() else DIFF.get(t.get("piste:difficulty"), "blue")
        runs.append({"n": re.sub(r"(\w)'S\b", r"\1's", t.get("name", "")), "d": d, "area": bool(closed and t.get("area") == "yes"), "pts": pts,
                     "groomed": t.get("piste:grooming") in ("classic", "mogul", "classic+skating")})
    elif "aerialway" in t and t["aerialway"] not in ("station", "pylon", "zip_line", "goods"):
        name = t.get("name", t.get("ref", "Lift")).replace(" Lift", "")
        lifts.append({"n": name, "t": t["aerialway"], "pts": pts})
    elif t.get("natural") == "wood" or t.get("landuse") == "forest":
        if closed:
            woods.append(pts)
    elif t.get("highway") == "motorway":
        roads.append(pts)

# drop duplicate run segments with no name that sit on a named run? keep all: they are real piste geometry.
print(f"runs {len(runs)} (named {sum(1 for r in runs if r['n'])}), lifts {len(lifts)}, woods {len(woods)}, pois {len(pois)}")

# ---------- elevation grid for the game ----------
g = dem[::STRIDE, ::STRIDE]
rows, cols = g.shape
cell = M_PER_PX * STRIDE
# the game grid spans (cols-1)*cell; re-centre so it matches to_m() exactly
gx_off = -W_M / 2
minE = float(np.floor(g.min()))
scale = 20.0  # 5 cm steps
os.makedirs(OUT, exist_ok=True)
hq = np.round((g - minE) * scale).astype(np.uint16)  # packed into grid.png below with the forest mask
GW, GD = (cols - 1) * cell, (rows - 1) * cell

def to_game(x, z):
    """to_m() is centred on the full DEM; the stride grid is centred on its own extent."""
    return x + W_M / 2 - GW / 2, z + D_M / 2 - GD / 2

for r in runs: r["pts"] = [to_game(*p) for p in r["pts"]]
for l in lifts: l["pts"] = [to_game(*p) for p in l["pts"]]
woods = [[to_game(*p) for p in w] for w in woods]
roads = [[to_game(*p) for p in w] for w in roads]
for p in pois: p["x"], p["z"] = (round(v) for v in to_game(p["x"], p["z"]))

# ---------- rasters: forest and piste masks at texture resolution ----------
TEX_H = round(TEX_W * GD / GW)
tpx = TEX_W / GW
def tp(p): return ((p[0] + GW / 2) * tpx, (p[1] + GD / 2) * tpx)

forest = Image.new("L", (TEX_W, TEX_H), 0)
fd = ImageDraw.Draw(forest)
for w in woods:
    fd.polygon([tp(p) for p in w], fill=255)
piste = Image.new("L", (TEX_W, TEX_H), 0)
pd = ImageDraw.Draw(piste)
for r in runs:
    pts = [tp(p) for p in r["pts"]]
    if r["area"]:
        pd.polygon(pts, fill=255)
    else:
        pd.line(pts, fill=255, width=max(3, int(32 * tpx)), joint="curve")
for l in lifts:  # lift lines are cut through the trees too
    pd.line([tp(p) for p in l["pts"]], fill=255, width=max(2, int(14 * tpx)))
piste = piste.filter(ImageFilter.GaussianBlur(2))
forest_a = (np.asarray(forest, np.float32) / 255) * (1 - np.asarray(piste, np.float32) / 255)

# ---------- texture ----------
demF = Image.fromarray(g.astype(np.float32), mode="F").resize((TEX_W, TEX_H), Image.BILINEAR)
H = np.asarray(demF, np.float32)
px_m = GW / TEX_W
dzdx = np.gradient(H, axis=1) / px_m
dzdy = np.gradient(H, axis=0) / px_m
slope = np.arctan(np.hypot(dzdx, dzdy))
# sun from the south-west, 40 deg up (matches the in-game sun closely enough)
az, alt = math.radians(200), math.radians(40)
lx, ly, lz = math.sin(az) * math.cos(alt), -math.cos(az) * math.cos(alt), math.sin(alt)
nx, ny, nz = -dzdx, dzdy, np.ones_like(H)
nl = np.sqrt(nx * nx + ny * ny + 1)
shade = np.clip((nx * lx + ny * -ly + nz * lz) / nl, 0, 1)
shade = 0.78 + 0.22 * shade   # live lighting does most of the shading; keep the bake bright

rng = np.random.default_rng(3)
noise = np.asarray(Image.fromarray((rng.random((TEX_H // 4, TEX_W // 4)) * 255).astype(np.uint8))
                   .resize((TEX_W, TEX_H), Image.BICUBIC), np.float32) / 255
fine = rng.random((TEX_H, TEX_W)).astype(np.float32)

snow_lit = np.array([255, 255, 255], np.float32)
snow_dark = np.array([196, 214, 240], np.float32)
img = snow_dark + (snow_lit - snow_dark) * shade[..., None]
img *= (0.97 + 0.03 * noise)[..., None]

# exposed rock on the steepest faces and cliff bands
rock = np.clip((np.degrees(slope) - 38) / 10, 0, 1)[..., None] * (0.6 + 0.4 * noise[..., None])
rock_col = np.array([105, 100, 98], np.float32) * shade[..., None]
img = img * (1 - rock) + rock_col * rock

# groomed runs read slightly brighter
pa = (np.asarray(piste, np.float32) / 255)[..., None]
img = img * (1 - 0.25 * pa) + np.minimum(img * 1.05, 255) * 0.25 * pa

# forest: dark green canopy with snow between the crowns
tree_col = np.array([34, 58, 44], np.float32) * (0.6 + 0.6 * shade[..., None]) * (0.8 + 0.4 * fine[..., None])
canopy = (forest_a * (0.55 + 0.45 * (fine > 0.35)))[..., None]
img = img * (1 - canopy * 0.6) + tree_col * canopy * 0.6

# I-70 through the valley
road = Image.new("L", (TEX_W, TEX_H), 0)
rd = ImageDraw.Draw(road)
for w in roads:
    rd.line([tp(p) for p in w], fill=255, width=max(2, int(12 * tpx)))
ra = (np.asarray(road, np.float32) / 255)[..., None]
img = img * (1 - ra) + np.array([70, 74, 82], np.float32) * ra

im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
im.save(os.path.join(OUT, "terrain.jpg"), quality=84, optimize=True, progressive=True)
im.resize((2048, round(2048 * TEX_H / TEX_W)), Image.LANCZOS).save(os.path.join(OUT, "terrain_2k.jpg"), quality=82, optimize=True)

# ---------- game mask: bit0 forest ----------
fm = Image.fromarray((forest_a * 255).astype(np.uint8)).resize((cols, rows), Image.BILINEAR)
mask = (np.asarray(fm) > 140).astype(np.uint8)
# one lossless PNG: R = height high byte, G = height low byte, B = 255 where forest
rgb = np.dstack([(hq >> 8).astype(np.uint8), (hq & 255).astype(np.uint8), mask * 255])
Image.fromarray(rgb, "RGB").save(os.path.join(OUT, "grid.png"), optimize=True)
for old in ("height.bin", "mask.bin"):
    if os.path.exists(os.path.join(OUT, old)): os.remove(os.path.join(OUT, old))

# ---------- zones, spawns ----------
def runs_named(*names):
    out = []
    for r in runs:
        if any(n.lower() in r["n"].lower() for n in names):
            out += r["pts"]
    return out
def lift_named(name):
    for l in lifts:
        if name.lower() in l["n"].lower():
            return l
def lift_ends(l):
    a, b = l["pts"][0], l["pts"][-1]
    ha, hb = height(*a), height(*b)
    return (a, b) if ha < hb else (b, a)
def height(x, z):
    i = min(max(int(round((x + GW / 2) / cell)), 0), cols - 1)
    j = min(max(int(round((z + GD / 2) / cell)), 0), rows - 1)
    return float(g[j, i])
def zone(n, pts, s="", rmin=350):
    if not pts:
        print("zone missing:", n); return None
    xs, zs = [p[0] for p in pts], [p[1] for p in pts]
    cx, cz = sum(xs) / len(xs), sum(zs) / len(zs)
    r = max(rmin, 0.6 * max(max(xs) - min(xs), max(zs) - min(zs)))
    return {"n": n, "s": s, "x": round(cx), "z": round(cz), "r": round(r)}
def lift_pts(*names):
    out = []
    for n in names:
        l = lift_named(n)
        if l: out += l["pts"]
    return out
def lift_end(name, top=True, r=260, label=None, s=""):
    l = lift_named(name)
    if not l:
        print("lift missing:", name); return None
    lo, hi = lift_ends(l)
    p = hi if top else lo
    return {"n": label or name, "s": s, "x": round(p[0]), "z": round(p[1]), "r": r}

zones = [z for z in [
    lift_end("Gondola One", top=False, label="Vail Village", s="Front Side base", r=450),
    lift_end("Eagle Bahn", top=False, label="Lionshead", s="Front Side base", r=450),
    lift_end("Riva Bahn", top=False, label="Golden Peak", s="Front Side base", r=450),
    lift_end("Eagle Bahn", top=True, label="Eagle's Nest", s="Front Side", r=330),
    lift_end("Gondola One", top=True, label="Mid-Vail", s="Front Side", r=330),
    zone("Game Creek Bowl", lift_pts("Game Creek"), "Front Side bowl"),
    zone("Northeast Bowl", lift_pts("Northwoods"), "Front Side"),
    zone("Sun Down Bowl", runs_named("Forever", "Campbell", "Milt's", "Wow", "Headwall", "Yonder", "Seldom", "Never", "Ricky"), "Back Bowls"),
    zone("Sun Up Bowl", runs_named("Sunup Bowl", "Sun Up Bowl", "Ramshorn", "Cow's Face", "Chicken Yard", "Apres Vous"), "Back Bowls"),
    zone("Tea Cup Bowl", runs_named("Tea Cup", "Teacup", "Flap Jack", "Chopstix", "Sleepytime"), "Back Bowls"),
    zone("China Bowl", runs_named("Genghis", "Jade Glade", "Dragon", "Shangri", "Poppyfields", "Emperor", "Sweet N Sour", "Red Zinger"), "Back Bowls"),
    zone("Siberia Bowl", runs_named("Siberia", "Bolshoi", "Rasputin", "Gorky", "Orient Express"), "Back Bowls"),
    zone("Inner Mongolia", runs_named("Inner Mongolia", "Mongolia Bowl", "Bowl Weevil"), "Back Bowls"),
    zone("Outer Mongolia", runs_named("Outer Mongolia", "Shaggy", "Yak"), "Back Bowls"),
    zone("Blue Sky Basin", lift_pts("Skyline", "Earl", "Pete"), "Back Bowls", rmin=900),
] if z]
for p in pois:
    if "two elk" in p["n"].lower():
        zones.append({"n": "Two Elk Lodge", "s": "Back Bowls", "x": p["x"], "z": p["z"], "r": 180})
    if "wildwood" in p["n"].lower():
        zones.append({"n": "Wildwood", "s": "Front Side", "x": p["x"], "z": p["z"], "r": 180})
# smaller (more specific) zones win ties: sort by radius so the game checks them sensibly
zones.sort(key=lambda z: z["r"])

def spawn(name, label, s):
    l = lift_named(name)
    if not l:
        print("spawn missing:", name); return None
    lo, hi = lift_ends(l)
    dx, dz = hi[0] - lo[0], hi[1] - lo[1]
    k = 26 / math.hypot(dx, dz)
    return {"n": label, "s": s, "x": round(hi[0] + dx * k), "z": round(hi[1] + dz * k)}
spawns = [s for s in [
    spawn("Mountain Top", "Patrol Headquarters", "Top of Mountaintop Express · Front Side"),
    spawn("Eagle Bahn", "Eagle's Nest", "Top of the Eagle Bahn Gondola"),
    spawn("Tea Cup", "Back Bowls", "Top of Tea Cup Express"),
    spawn("Orient", "China & Siberia Bowls", "Top of Orient Express"),
    spawn("Skyline", "Blue Sky Basin", "Top of Skyline Express"),
    spawn("Game Creek", "Game Creek Bowl", "Top of Game Creek Express"),
    spawn("Riva Bahn", "Golden Peak", "Top of Riva Bahn Express"),
    spawn("Gondola One", "Mid-Vail", "Top of Gondola One"),
] if s]

# names to label in the HUD: prefer named runs; unnamed ones still map as connectors
def flat(pts): return [round(v) for p in pts for v in p]
out_runs = [{"n": r["n"], "d": r["d"], "area": r["area"], "p": flat(r["pts"])} for r in runs]
out_lifts = [{"n": l["n"], "t": l["t"], "p": flat(l["pts"])} for l in lifts]
cx = sum(s["x"] for s in spawns) / max(1, len(spawns))
cz = sum(s["z"] for s in spawns) / max(1, len(spawns))
xs = [p[0] for r in runs for p in r["pts"]] + [p[0] for l in lifts for p in l["pts"]]
zs = [p[1] for r in runs for p in r["pts"]] + [p[1] for l in lifts for p in l["pts"]]
bounds = [round(min(xs)) - 300, round(min(zs)) - 300, round(max(xs)) + 300, round(max(zs)) + 300]
json.dump({"bounds": bounds, "runs": out_runs, "lifts": out_lifts, "pois": pois, "zones": zones, "spawns": spawns,
           "center": {"x": round(cx), "z": round(cz)}},
          open(os.path.join(OUT, "map.json"), "w"), separators=(",", ":"))
json.dump({"cols": cols, "rows": rows, "cell": round(cell, 4), "minE": minE, "scale": scale,
           "bbox": [S, W, N, E], "source": "AWS Terrain Tiles (terrarium) z14; OpenStreetMap"},
          open(os.path.join(OUT, "meta.json"), "w"))
print(f"grid {cols}x{rows} @ {cell:.1f} m, tex {TEX_W}x{TEX_H}, zones {len(zones)}, spawns {[s['n'] for s in spawns]}")
print("lifts:", sorted(l["n"] for l in lifts))
