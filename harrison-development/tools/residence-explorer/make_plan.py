"""Build a true-scale landscape plan (feet) of the Residence Explorer yard from the model's own layout data.
Outputs: DXF (R2010) for PRO Landscape / AutoCAD, plus a colored plan sheet PNG and PDF."""
import json, math, sys
import ezdxf
from ezdxf.enums import TextEntityAlignment
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Circle

D = sys.argv[1]
P = json.load(open(D + "/plan-data.json"))
inside_bldg = lambda x, z: (-7.2 < x < 7.2 and -5.2 < z < 5.2) or (-14 < x < -7 and -3.5 < z < 3.5)
P["globes"] = [g for g in P["globes"] if not inside_bldg(g[0], g[1])]
FT = 3.28084
X = lambda x: x * FT
Y = lambda z: -z * FT              # front of the house (model +z) is down the sheet

doc = ezdxf.new("R2010", setup=True)
doc.header["$INSUNITS"] = 2        # feet
doc.header["$MEASUREMENT"] = 0
msp = doc.modelspace()
if "DASHED" not in doc.linetypes:
    doc.linetypes.add("DASHED", pattern=[0.5, 0.25, -0.25])

LAYERS = {
    "L-HOUSE": 7, "L-DECK-OVERHEAD": 8, "L-PATIO-SILOAM": 30, "L-WALL-SILOAM-DRYSTACK": 32,
    "L-STAIR-SILOAM-7IN": 34, "L-STEPPERS-SILOAM": 40, "L-BED-EDGE-MULCH": 42, "L-BOULDERS": 9,
    "L-LIGHTING": 2, "L-SPOT-ELEV": 1, "L-TEXT": 7,
    "P-TREE-PINON-PINE": 94, "P-TREE-CONIFER-EXISTING": 96, "P-SHRUB-GLOBE-BLUE-SPRUCE": 150,
    "P-PEREN-RUSSIAN-SAGE": 202, "P-PEREN-MAY-NIGHT-SALVIA": 182, "P-PEREN-BLACK-EYED-SUSAN": 50,
    "P-PEREN-CONEFLOWER": 220, "P-PEREN-BLUE-FESCUE": 140, "P-GRASS-FEATHER-REED": 52,
    "P-ANNUAL-EDGING": 240, "GC-CREEPING-THYME": 212, "GC-ICE-PLANT-PURPLE": 230,
    "GC-ICE-PLANT-YELLOW": 51, "GC-CREEPING-PHLOX": 172, "GC-SEDUM": 72,
}
for n, c in LAYERS.items():
    doc.layers.add(n, color=c)
doc.layers.get("L-DECK-OVERHEAD").dxf.linetype = "DASHED"

def poly(pts, layer, closed=True):
    msp.add_lwpolyline([(X(x), Y(z)) for x, z in pts], close=closed, dxfattribs={"layer": layer})

def rect(cx, cz, w, d, ry, layer):
    # model slab: local x along (cos ry, -sin ry) in (x,z); local z along (sin ry, cos ry)
    ux, uz = math.cos(ry), -math.sin(ry)
    vx, vz = math.sin(ry), math.cos(ry)
    c = [(-w / 2, -d / 2), (w / 2, -d / 2), (w / 2, d / 2), (-w / 2, d / 2)]
    pts = [(cx + a * ux + b * vx, cz + a * uz + b * vz) for a, b in c]
    poly(pts, layer)
    return pts

def text(s, x, z, h=1.0, layer="L-TEXT", align=TextEntityAlignment.MIDDLE_CENTER):
    msp.add_text(s, height=h, dxfattribs={"layer": layer}).set_placement((X(x), Y(z)), align=align)

def circ(x, z, r, layer):
    msp.add_circle((X(x), Y(z)), r * FT, dxfattribs={"layer": layer})

# --- house, chimney and overhead deck
poly([(-7.2, -5.2), (7.2, -5.2), (7.2, 5.2), (-7.2, 5.2)], "L-HOUSE")
poly([(-14, -3.5), (-7.2, -3.5), (-7.2, 3.5), (-14, 3.5)], "L-HOUSE")
poly([(7.2, 1.2), (8.4, 1.2), (8.4, 2.8), (7.2, 2.8)], "L-HOUSE")
poly([(-18.2, -3.6), (-14, -3.6), (-14, 3.5), (-7, 3.5), (-7, 5), (7, 5), (7, 7.2), (-18.2, 7.2)], "L-DECK-OVERHEAD")
text("RESIDENCE  (WALKOUT LEVEL FFE 0'-0\")", 0, 0, 1.4)
text("DINING PAVILION ABOVE", -10.5, 0, 0.9)
text("CANTILEVER DECK ABOVE (DASHED)", -16.1, 1.5, 0.7)

# --- Siloam flagstone patio, ashlar pattern
poly([(-7.6, 5.0), (7.6, 5.0), (7.6, 9.05), (-7.6, 9.05)], "L-PATIO-SILOAM")
for x, z, w, d in P["pavers"]:
    rect(x, z, w, d, 0, "L-PATIO-SILOAM")
text("SILOAM SIENNA BUFF FLAGSTONE PATIO, ASHLAR PATTERN", 0, 7.2, 0.8)

# --- dry-stack wall: inside face, outside face, cap; open at the stair
yp = P["yard"]
cum = [0.0]
for i in range(1, len(yp)):
    cum.append(cum[-1] + math.dist(yp[i], yp[i - 1]))
g = P["gap"]
def offset(i, d):
    a, b = yp[max(0, i - 1)], yp[min(len(yp) - 1, i + 1)]
    tx, tz = b[0] - a[0], b[1] - a[1]
    l = math.hypot(tx, tz) or 1
    nx, nz = -tz / l, tx / l           # outward (downhill)
    return (yp[i][0] + nx * d, yp[i][1] + nz * d)
runs = [[i for i in range(len(yp)) if cum[i] < g["s"] - 0.95], [i for i in range(len(yp)) if cum[i] > g["s"] + 0.95]]
for run in runs:
    inner = [offset(i, -0.17) for i in run]
    outer = [offset(i, 0.28) for i in run]
    poly(inner + outer[::-1], "L-WALL-SILOAM-DRYSTACK")
    poly([offset(i, -0.3) for i in run], "L-WALL-SILOAM-DRYSTACK", closed=False)   # capstone edge
mid = yp[len(yp) // 3]
text("DRY-STACK SILOAM SIENNA BUFF WALL", mid[0] - 3.5, mid[1] + 2.0, 0.8)
text("3\"-5\" HAND-STACK COURSES, CAPSTONE; APPROX. 30\" EXPOSED", mid[0] - 3.5, mid[1] + 2.7, 0.65)

# --- stair cut into the wall (7" risers) with cheek walls, then steppers on grade
ryw = -math.atan2(g["nz"], g["nx"])
steps = [q for q in P["path"] if q["step"]]
for k, q in enumerate([{"x": g["x"], "z": g["z"]}] + steps):
    for sgn in (-1, 1):
        rect(q["x"] + g["tx"] * sgn * 0.95, q["z"] + g["tz"] * sgn * 0.95, 0.48, 0.44, ryw, "L-WALL-SILOAM-DRYSTACK")
for k, q in enumerate(steps):
    rect(q["x"], q["z"], 1.42, 0.62, q["ry"], "L-STAIR-SILOAM-7IN")
    text(f"T{k+1}", q["x"], q["z"], 0.45, "L-STAIR-SILOAM-7IN")
for q in P["path"]:
    if not q["step"]:
        rect(q["x"], q["z"], 1.3, 0.72, q["ry"], "L-STEPPERS-SILOAM")
s0 = steps[-1] if steps else g
text(f"({len(steps)}) SILOAM TREADS, 7\" RISE, 2'x4'+/-", g["x"] + 4.2, g["z"] + 0.6, 0.65, "L-STAIR-SILOAM-7IN")
text("SILOAM FLAGSTONE STEPPERS ON GRADE, GROUNDCOVER JOINTS", P["path"][-1]["x"] + 3.0, P["path"][-1]["z"] + 0.8, 0.65, "L-STEPPERS-SILOAM")

# --- spot elevations
text("PATIO 0'-0\"", 5.8, 8.6, 0.55, "L-SPOT-ELEV")
text("TW +0'-8\"", g["x"] - 3.2, g["z"] + 0.1, 0.55, "L-SPOT-ELEV")
text("BW -2'-0\" +/-", g["x"] - 3.2, g["z"] + 1.1, 0.55, "L-SPOT-ELEV")

# --- bed edge (mulch) = inside face of the wall back to the house
text("BARK MULCH PLANTING BED", -4.2, 11.6, 0.7, "L-BED-EDGE-MULCH")

# --- boulders, trees, shrubs, perennials, grasses, annuals, groundcover
for x, z, s, b in P["rocks"]:
    if math.hypot(x, z) < 40:
        circ(x, z, 0.5 * s + 0.2, "L-BOULDERS")
counts = {}
def add(layer, n=1):
    counts[layer] = counts.get(layer, 0) + n
for x, z, k, h in P["trees"]:
    if k == "pinon":
        circ(x, z, 1.9, "P-TREE-PINON-PINE"); circ(x, z, 0.12, "P-TREE-PINON-PINE"); add("P-TREE-PINON-PINE")
    elif math.hypot(x + 2, z - 4) < 32:
        circ(x, z, max(1.6, h * 0.17), "P-TREE-CONIFER-EXISTING"); circ(x, z, 0.12, "P-TREE-CONIFER-EXISTING"); add("P-TREE-CONIFER-EXISTING")
for x, z, s in P["globes"]:
    circ(x, z, s, "P-SHRUB-GLOBE-BLUE-SPRUCE"); add("P-SHRUB-GLOBE-BLUE-SPRUCE")
PER = {"russian sage": "P-PEREN-RUSSIAN-SAGE", "salvia": "P-PEREN-MAY-NIGHT-SALVIA", "black-eyed susan": "P-PEREN-BLACK-EYED-SUSAN",
       "coneflower": "P-PEREN-CONEFLOWER", "blue fescue": "P-PEREN-BLUE-FESCUE"}
for x, z, r, n in P["per"]:
    circ(x, z, r, PER[n]); add(PER[n])
for x, z in P["grass"]:
    circ(x, z, 0.45, "P-GRASS-FEATHER-REED"); add("P-GRASS-FEATHER-REED")
for x, z, c in P["ann"]:
    circ(x, z, 0.2, "P-ANNUAL-EDGING"); add("P-ANNUAL-EDGING")
GC = ["GC-CREEPING-THYME", "GC-ICE-PLANT-PURPLE", "GC-ICE-PLANT-YELLOW", "GC-CREEPING-PHLOX", "GC-SEDUM"]
for x, z, s, k in P["gc"]:
    circ(x, z, s, GC[k]); add(GC[k])

# --- legend, title, north arrow, scale note (placed left of the house)
LX, LZ = -36, -8
names = {
    "P-TREE-PINON-PINE": "Pinon pine (Pinus edulis), 6-8' B&B",
    "P-TREE-CONIFER-EXISTING": "Existing conifers, protect in place",
    "P-SHRUB-GLOBE-BLUE-SPRUCE": "Globe blue spruce (Picea pungens 'Globosa'), #10",
    "P-PEREN-RUSSIAN-SAGE": "Russian sage (Perovskia), #1",
    "P-PEREN-MAY-NIGHT-SALVIA": "Salvia 'May Night', #1",
    "P-PEREN-BLACK-EYED-SUSAN": "Black-eyed Susan (Rudbeckia), #1",
    "P-PEREN-CONEFLOWER": "Coneflower (Echinacea), #1",
    "P-PEREN-BLUE-FESCUE": "Blue fescue (Festuca glauca), #1",
    "P-GRASS-FEATHER-REED": "Feather reed grass 'Karl Foerster', #1",
    "P-ANNUAL-EDGING": "Annual edging, mixed color, 4\" pots",
    "GC-CREEPING-THYME": "Creeping thyme (Thymus serpyllum), plugs",
    "GC-ICE-PLANT-PURPLE": "Ice plant, purple (Delosperma cooperi), plugs",
    "GC-ICE-PLANT-YELLOW": "Ice plant, yellow (Delosperma nubigenum), plugs",
    "GC-CREEPING-PHLOX": "Creeping phlox (Phlox subulata), plugs",
    "GC-SEDUM": "Sedum, mixed groundcover, plugs",
}
text("HARRISON DEVELOPMENT", LX, LZ - 6, 1.6, align=TextEntityAlignment.LEFT)
text("RESIDENCE EXPLORER - SAMPLE HOME - LANDSCAPE PLAN (CONCEPT)", LX, LZ - 4.6, 0.9, align=TextEntityAlignment.LEFT)
text("Scale: 1 unit = 1 foot. Concept for presentation, not for construction.", LX, LZ - 3.7, 0.6, align=TextEntityAlignment.LEFT)
text("PLANT LEGEND (layer / qty)", LX, LZ - 2.4, 0.8, align=TextEntityAlignment.LEFT)
row = 0
for lay, label in names.items():
    if counts.get(lay):
        text(f"{label}  -  {counts[lay]}  [{lay}]", LX, LZ - 1.4 + row * 0.75, 0.5, align=TextEntityAlignment.LEFT)
        row += 1
na = (LX + 2, LZ + 13)
msp.add_lwpolyline([(X(na[0]), Y(na[1])), (X(na[0]), Y(na[1] - 3))], dxfattribs={"layer": "L-TEXT"})
text("N (plan up = uphill)", na[0], na[1] - 3.6, 0.6)
doc.saveas(D + "/residence-explorer-landscape-plan.dxf")

# --- colored plan sheet
fig, ax = plt.subplots(figsize=(17, 11), dpi=150)
fig.patch.set_facecolor("#f4f1ea"); ax.set_facecolor("#f4f1ea")
def mpoly(pts, **kw):
    ax.add_patch(Polygon([(X(x), Y(z)) for x, z in pts], closed=True, **kw))
outline = [tuple(p) for p in yp] + [(10.4, 6), (-8.4, 6)]
mpoly(outline, fc="#6b5442", ec="none", alpha=.55)
mpoly([(-18.2, -3.6), (-14, -3.6), (-14, 3.5), (-7, 3.5), (-7, 5), (7, 5), (7, 7.2), (-18.2, 7.2)], fc="none", ec="#555", ls="--", lw=1)
for pts in ([(-7.2, -5.2), (7.2, -5.2), (7.2, 5.2), (-7.2, 5.2)], [(-14, -3.5), (-7.2, -3.5), (-7.2, 3.5), (-14, 3.5)]):
    mpoly(pts, fc="#3a3f45", ec="#1d2023", lw=1.5)
for x, z, w, d in P["pavers"]:
    mpoly([(x - w / 2, z - d / 2), (x + w / 2, z - d / 2), (x + w / 2, z + d / 2), (x - w / 2, z + d / 2)], fc="#d9b58d", ec="#9d7f5f", lw=.4)
for run in runs:
    mpoly([offset(i, -0.17) for i in run] + [offset(i, 0.28) for i in run][::-1], fc="#c9a07a", ec="#7d6247", lw=.8)
for q in steps:
    ux, uz = math.cos(q["ry"]), -math.sin(q["ry"]); vx, vz = math.sin(q["ry"]), math.cos(q["ry"])
    mpoly([(q["x"] + a * ux + b * vx, q["z"] + a * uz + b * vz) for a, b in [(-.71, -.31), (.71, -.31), (.71, .31), (-.71, .31)]], fc="#e3c8a3", ec="#7d6247", lw=.8)
for q in P["path"]:
    if not q["step"]:
        ux, uz = math.cos(q["ry"]), -math.sin(q["ry"]); vx, vz = math.sin(q["ry"]), math.cos(q["ry"])
        mpoly([(q["x"] + a * ux + b * vx, q["z"] + a * uz + b * vz) for a, b in [(-.65, -.36), (.65, -.36), (.65, .36), (-.65, .36)]], fc="#d8ab8e", ec="#7d6247", lw=.6)
COL = {"P-PEREN-RUSSIAN-SAGE": "#9c8fd0", "P-PEREN-MAY-NIGHT-SALVIA": "#5e3fa6", "P-PEREN-BLACK-EYED-SUSAN": "#e0a81e",
       "P-PEREN-CONEFLOWER": "#d0628f", "P-PEREN-BLUE-FESCUE": "#7f9fa8"}
for x, z, s, k in P["gc"]:
    ax.add_patch(Circle((X(x), Y(z)), s * FT, fc=["#9a5aa6", "#c93f86", "#e0b43a", "#a995d6", "#a8bb4c"][k], ec="none", alpha=.85))
for x, z, c in P["ann"]:
    ax.add_patch(Circle((X(x), Y(z)), .22 * FT, fc="#%06x" % c, ec="none"))
for x, z, r, n in P["per"]:
    ax.add_patch(Circle((X(x), Y(z)), r * FT, fc=COL[PER[n]], ec="#2f3b28", lw=.3, alpha=.9))
for x, z in P["grass"]:
    ax.add_patch(Circle((X(x), Y(z)), .45 * FT, fc="#b9a86a", ec="#5b5230", lw=.4))
for x, z, s in P["globes"]:
    ax.add_patch(Circle((X(x), Y(z)), s * FT, fc="#4f7a80", ec="#23383b", lw=.8))
for x, z, k, h in P["trees"]:
    if k == "pinon":
        ax.add_patch(Circle((X(x), Y(z)), 1.9 * FT, fc="#3e5a35", ec="#1f2d1a", lw=1, alpha=.8))
    elif math.hypot(x + 2, z - 4) < 32:
        ax.add_patch(Circle((X(x), Y(z)), max(1.6, h * .17) * FT, fc="#24402f", ec="#12201a", lw=.8, alpha=.55))
for x, z, s, b in P["rocks"]:
    if math.hypot(x, z) < 40:
        ax.add_patch(Circle((X(x), Y(z)), (0.5 * s + .2) * FT, fc="#9a9590", ec="#5c5853", lw=.6))
ax.set_xlim(X(-30), X(26)); ax.set_ylim(Y(26), Y(-12)); ax.set_aspect("equal"); ax.axis("off")
ax.set_title("Harrison Development  |  Residence Explorer sample home  |  Landscape plan (concept)", fontsize=15, color="#1d2023", loc="left")
ax.text(X(-29), Y(-11), "Dry-stack Siloam Sienna Buff wall (3-5\" courses, ~30\" exposed) | Siloam flagstone patio | (%d) 7\" Siloam treads cut into the wall | Siloam steppers in groundcover\nPinon pine, globe blue spruce, perennial drifts, annual edging. Scale: 1 grid unit = 1 ft. Concept for presentation, not for construction." % len(steps), fontsize=9, color="#333")
fig.savefig(D + "/residence-explorer-landscape-plan.png", bbox_inches="tight", facecolor=fig.get_facecolor())
fig.savefig(D + "/residence-explorer-landscape-plan.pdf", bbox_inches="tight", facecolor=fig.get_facecolor())
print("counts", counts)
