"""Write the Vail Valley flyover as a Google Earth Studio project (.esp).

Same camera path as the 3D-map reel (render/scene.html), converted from local
UTM 13N metres to longitude/latitude. Altitudes are metres above sea level.
Format follows Earth Studio project files (modelVersion 18).
Run: python3 make_esp.py  ->  vail-valley-flyover.esp
"""
import json, math
from pyproj import Transformer

FPS, FRAMES, W, H = 30, 1260, 1080, 1920
OX, OY = 360123, 4380285                      # local origin, UTM 13N
to_ll = Transformer.from_crs(26913, 4326, always_xy=True)

KEYS = []                                      # (frame, cam(e,n,alt), target(e,n,alt))
def key(f, p, t): KEYS.append((f, p, t))
def orbit(f0, f1, c, r, h, a0, a1, th, n=8):
    for s in range(n):
        u = s / (n - 1); a = math.radians(a0 + (a1 - a0) * u)
        key(f0 + (f1 - f0) * u, (c[0] + r * math.sin(a), c[1] + r * math.cos(a), h), (c[0], c[1], th))

VV, BC, AH, BB = (21960, 8453), (9682, 4642), (5748, 8074), (23500, 3200)
# v2 (2026-11-19): higher, wider, slower. Checked against USGS terrain: the camera
# stays at least ~620 m above the ground along the whole spline.
key(0,    (9000, 17000, 6200), (21500, 6500, 3000))   # opener, high in the north-west
key(120,  (15500, 14200, 5200), (21000, 7000, 2900))
orbit(220, 420, VV, 2800, 3800, -50, 60, 2490, 8)     # wide arc around Vail Village
key(470,  (25600, 9600, 4500), (BB[0], BB[1], 3300))  # over the ridge to the Back Bowls
key(545,  (26800, 6900, 4700), (23000, 2600, 3200))
key(615,  (22000, 10600, 5000), (12000, 5500, 2700))  # west down the valley, high
key(685,  (14500, 10300, 4300), (BC[0], BC[1], 2470))
orbit(720, 890, BC, 2700, 3800, 25, -45, 2470, 8)     # wide arc around Beaver Creek
key(950,  (6500, 10600, 3600), (AH[0], AH[1], 2250))  # Arrowhead
key(1020, (3600, 10900, 3500), (6000, 7500, 2300))
key(1110, (2000, 14500, 5500), (14000, 6000, 2800))   # climb out
key(1260, (-1500, 18500, 8000), (15000, 6000, 2800))

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
        "settings": {"name": "Vail Valley Flyover", "frameRate": FPS, "dimensions": {"width": W, "height": H},
                     "duration": FRAMES, "timeFormat": "frames"},
        "scenes": [{"animationModel": {"roving": False, "logarithmic": False, "groupedPosition": True},
                    "duration": FRAMES, "attributes": [camera, env],
                    "cameraExport": {"logarithmic": False, "modelVersion": 2}}],
        "playbackManager": {"range": {"start": 0, "end": FRAMES}}}
json.dump(proj, open("vail-valley-flyover.esp", "w"), indent=1)
print("keys", len(KEYS), "first cam", cam[0], "Vail Village orbit target", tgt[4])
