"""Copy Vail 3D into the AiRE Estate site (docs/vail-3d/), in AiRE Estate's look.

The game engine and data are shared; only the page shell differs. AiRE Estate is a
separate business from EpiVail: this copy names AiRE Estate only (never Epique,
EpiVail, or Charles), uses the site's colors and fonts, and keeps the independence
and data-credit lines.

Run after every bake or game change:  python3 vail-3d/build/make_aire.py
"""
import os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..")
DST = os.path.join(HERE, "..", "..", "docs", "vail-3d")

FONTS = ('<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">',
         '<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;800;900&family=IBM+Plex+Mono:wght@500&family=Manrope:wght@400;600;800&display=swap" rel="stylesheet">')
ICON = ('<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Crect width=%27100%27 height=%27100%27 rx=%2722%27 fill=%27%2304070d%27/%3E%3Ccircle cx=%2750%27 cy=%2750%27 r=%2730%27 fill=%27none%27 stroke=%27%2338bdf8%27 stroke-width=%2714%27 stroke-linecap=%27round%27 stroke-dasharray=%27140 50%27 transform=%27rotate(-38 50 50)%27/%3E%3Ccircle cx=%2750%27 cy=%2750%27 r=%2712%27 fill=%27%2338bdf8%27/%3E%3C/svg%3E">\n'
        '<link rel="canonical" href="https://learn.aireestate.com/vail-3d/">\n')

REPLACE = [
    FONTS,
    ("--ink:#0b1220;", "--ink:#04070d;"),
    ("--glass:rgba(8,14,28,.62);", "--glass:rgba(8,14,24,.74);"),
    ("--gold:#ffcf3f;", "--gold:#38bdf8;"),
    ("--display:'Bebas Neue',sans-serif; --body:Inter,system-ui,sans-serif;",
     "--display:'Archivo',system-ui,sans-serif; --body:'Manrope',system-ui,sans-serif;"),
    ("</style>",
     "/* AiRE Estate: Archivo needs weight where Bebas Neue did not */\n"
     "#banner .t,.card h1,#stats .spd{font-weight:900;letter-spacing:-.04em}\n"
     "#where .zone,.label,#map .head h2{font-family:'IBM Plex Mono',monospace;font-weight:500;font-size:12px;letter-spacing:.22em}\n"
     "#credit a{pointer-events:auto;color:var(--gold);font-weight:800;text-decoration:none}\n"
     "</style>"),
    ('<div id="credit" class="hud">Presented by <b>EpiVail</b> · Epique Realty Colorado Mountain Region</div>',
     '<div id="credit" class="hud">Built in Claude Code by <a href="/">AiRE Estate</a></div>'),
    ("Terrain: USGS 3DEP via AWS Terrain Tiles.",
     "AiRE Estate is independent of Vail Resorts and Anthropic. Built in Claude Code; no AI imagery in the game itself. "
     "Terrain: USGS 3DEP via AWS Terrain Tiles."),
]

src = open(os.path.join(SRC, "index.html")).read()
for a, b in REPLACE:
    assert a in src, f"marker missing from vail-3d/index.html: {a[:60]}"
    src = src.replace(a, b)
src = src.replace("<title>", ICON + "<title>", 1)
assert "EpiVail" not in src and "Epique" not in src and "Charles" not in src

for sub in ("js", "data"):
    shutil.rmtree(os.path.join(DST, sub), ignore_errors=True)
    shutil.copytree(os.path.join(SRC, sub), os.path.join(DST, sub))
open(os.path.join(DST, "index.html"), "w").write(src)
print("wrote", os.path.normpath(DST))
