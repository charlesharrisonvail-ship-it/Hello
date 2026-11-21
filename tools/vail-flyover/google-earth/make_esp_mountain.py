"""Vail Mountain only (Vail Village, Golden Peak, Back Bowls). Write the flyover as a Google Earth Studio project (.esp).

Same camera path as the 3D-map reel (render/scene.html), converted from local
UTM 13N metres to longitude/latitude. Altitudes are metres above sea level.
Format follows Earth Studio project files (modelVersion 18).
Run: python3 make_esp.py  ->  vail-valley-flyover.esp
"""
import json, math
from pyproj import Transformer

FPS, FRAMES, W, H = 30, 1200, 1080, 1920
OX, OY = 360123, 4380285                      # local origin, UTM 13N
to_ll = Transformer.from_crs(26913, 4326, always_xy=True)

KEYS = []                                      # (frame, cam(e,n,alt), target(e,n,alt))
def key(f, p, t): KEYS.append((f, p, t))
def orbit(f0, f1, c, r, h, a0, a1, th, n=8):
    for s in range(n):
        u = s / (n - 1); a = math.radians(a0 + (a1 - a0) * u)
        key(f0 + (f1 - f0) * u, (c[0] + r * math.sin(a), c[1] + r * math.cos(a), h), (c[0], c[1], th))

import json as _j
for f, p, t in _j.load(open('path_mountain.json')): key(f, tuple(p), tuple(t))

def ll(e, n):
    lon, lat = to_ll.transform(OX + e, OY + n); return lon, lat
rel = lambda v, lo, hi: (v - lo) / (hi - lo)
def kf(vals): return [{"time": f / FRAMES, "value": v} for (f, _, _), v in zip(KEYS, vals)]
def attr(t, vals, **rng):
    return {"type": t, "value": {"relative": vals[0], **rng}, "keyframes": kf(vals), "inTimeline": True}

cam = [ll(p[0], p[1]) + (p[2],) for _, p, _ in KEYS]
tgt = [ll(t[0], t[1]) + (t[2],) for _, _, t in KEYS]

pans, tilts = [], []
for (lo, la, al), (tlo, tla, tal) in zip(cam, tgt):
    dy = math.radians(tla - la) * 6371000; dx = math.radians(tlo - lo) * 6371000 * math.cos(math.radians(la))
    pans.append(math.degrees(math.atan2(dx, dy)) % 360)
    tilts.append(math.degrees(math.atan2(math.hypot(dx, dy), max(30, al - tal))))
for i in range(1, len(pans)):                  # no 360-degree spins between keys
    while pans[i] - pans[i - 1] > 180: pans[i] -= 360
    while pans[i] - pans[i - 1] < -180: pans[i] += 360

ALT = dict(minValueRange=-500, maxValueRange=65117481, logarithmic=False)
camera = {"type": "cameraGroup", "inTimeline": True, "attributes": [
    {"type": "cameraPositionGroup", "inTimeline": True, "attributes": [
        {"type": "position", "inTimeline": True, "attributes": [
            attr("longitude", [rel(c[0], -180, 180) for c in cam], minValueRange=-180, maxValueRange=180),
            attr("latitude", [rel(c[1], -90, 90) for c in cam], minValueRange=-90, maxValueRange=90),
            attr("altitude", [rel(c[2], -500, 65117481) for c in cam], **ALT)]}]},
    {"type": "cameraTargetEffect", "inTimeline": True, "attributes": [
        {"type": "enabled", "value": {"relative": 1}},
        {"type": "poi", "inTimeline": True, "attributes": [
            attr("longitudePOI", [rel(t[0], -180, 180) for t in tgt], minValueRange=-180, maxValueRange=180),
            attr("latitudePOI", [rel(t[1], -90, 90) for t in tgt], minValueRange=-90, maxValueRange=90),
            attr("altitudePOI", [rel(t[2], -500, 65117481) for t in tgt], **ALT)]},
        {"type": "influence", "value": {"relative": 1}}]},
    {"type": "cameraRotationGroup", "inTimeline": True, "attributes": [
        attr("rotationX", [rel(p, 0, 360) for p in pans], minValueRange=0, maxValueRange=360),
        attr("rotationY", [rel(t, 0, 180) for t in tilts], minValueRange=0, maxValueRange=180),
        {"type": "rotationZ", "value": {"relative": 0}}]},
    {"type": "cameraLensGroup", "attributes": [{"type": t, "value": {}} for t in ("fov", "exposure", "aperture", "minFocusLength")]}]}
env = {"type": "environmentGroup", "attributes": [
    {"type": "sunGroup", "attributes": [{"type": "sunVisibility", "value": {}}, {"type": "worldTime", "value": {"relative": 0.5}}]},
    {"type": "cloudGroup", "attributes": [{"type": t, "value": {}} for t in ("cloudVisibility", "cloudopacity", "cloudheight", "clouddate")]},
    {"type": "starsPlanetsGroup", "attributes": [{"type": "starsEnabled", "value": {}}]},
    {"type": "buildingsEnabled", "value": {}}]}
proj = {"modelVersion": 18,
        "settings": {"name": "Vail Mountain Flyover", "frameRate": FPS, "dimensions": {"width": W, "height": H},
                     "duration": FRAMES, "timeFormat": "frames"},
        "scenes": [{"animationModel": {"roving": False, "logarithmic": False, "groupedPosition": True},
                    "duration": FRAMES, "attributes": [camera, env],
                    "cameraExport": {"logarithmic": False, "modelVersion": 2}}],
        "playbackManager": {"range": {"start": 0, "end": FRAMES}}}
json.dump(proj, open("vail-mountain-flyover.esp", "w"), indent=1)
print("keys", len(KEYS), "first cam", cam[0], "Vail Village orbit target", tgt[4])
