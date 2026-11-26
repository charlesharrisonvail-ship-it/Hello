#!/usr/bin/env python3
"""Camera and phone rig for screens-to-video: a shot list in, Stewdio XML and a report out. Stdlib only.

  camera.py build <shots.json>                writes rig.xml beside it (the Camera composition with every
                                              keyframe, the Tilt rig and the phone), prints the shot
                                              table, the capture times and the checks. The film's own
                                              layers are spliced in from files beside shots.json:
                                              below.xml and above.xml (world layers behind and in front
                                              of the phone), screens.xml (the screen compositions, between
                                              the phone's body and its glass) and tilt.xml (animations
                                              on Tilt, such as the phone's position)
  camera.py check <camera.xml>                read_xml of the Camera node, saved to a file: samples every
                                              frame and runs the motion checks on what is really in the File
  camera.py point <shots.json> <n> <x> <y>    a screen point in dp -> world and frame px as shot n lands

shots.json (times in seconds on the frame grid, angles in degrees, clockwise positive):
  { "fps": 30, "duration": 30, "frame": [1920, 1080], "world": [5760, 3240], "carry": 1,
    "phone": { "at": [2880, 1620], "scale": 0.945, "screen": [412, 914], "frame": "#B9B5AD", "cutout": "punch" },
    "shots": [
      { "name": "hook", "t": 0, "look": [2880, 1620], "zoom": 1, "roll": 0 },
      { "name": "tap the entry", "t": 6.2, "in": "cut", "look": { "screen": [300, 780] }, "zoom": 3.4,
        "roll": -18, "tilt": "laid-right", "place": [1200, 700],
        "drift": { "zoom": 1.06, "roll": -1.5, "to": { "screen": [280, 760] } } } ] }

  carry   how fast the camera is travelling at a cut: 1 is the default (a quarter of the zoom and
          2.4 deg of roll a second, less around a short shot), 0.6 calmer, 1.5 harder
  phone   at: where the Tilt composition sits in the world; scale: the Phone's scale; screen: its size in
          dp; radius, bezel, band (the frame's lip) and depth (thickness) in dp; frame: the metal's colour;
          cutout: punch, island or none; cutout_top: its centre below the screen's top, in dp;
          shadow: its strength, 0 to 2 (raise it on a light backdrop until the phone sits on the floor)
  look    what the camera looks at: world px, or { "screen": [x, y] } in the phone screen's dp
  zoom    1 = the wide shot the world was laid out for; 3 = three times closer
  roll    camera roll: the whole world turns
  tilt    the phone's pose: flat, lean-right, lean-left, laid-right, laid-left,
          or { "lay": deg, "yaw": deg, "turn": deg }
  place   where the look point sits in the frame (default: the centre). A control near the screen's
          edge goes off-centre toward that edge, so the phone and not the backdrop fills the frame
  in      how the shot starts at t.
          cut: a hard cut inside one slow eased move, and most of a film's transitions. The shot
          before it eases in (quadratic) over up to its last second, so it is travelling, gently,
          when the picture changes; this shot starts at that speed and eases out (quadratic) over
          up to 1.2s into its drift. Nothing flashes, overshoots or snaps;
          fade: the same move with the picture fading to the backdrop and back over 0.9s, for a
          change of chapter (out of the turn, into the end card), twice a film at most;
          hard: a bare cut between two frames at rest, for a montage of flashes only;
          push (1.4s) or glide (2s): one slow continuous move, eased in and out (quadratic), in
          which the phone turns from its old pose to the new one. For a small change of framing
          only: a move that would have to travel fast is a cut instead. "dur" overrides the length
  drift   what keeps moving until the next shot: zoom factor (default 3% a second), roll delta
          (default 0.7 deg a second toward the roll's side, 0.25 on a level shot), look delta in
          world px, or "to" another look point
"""
import json, math, os, re, sys
import xml.etree.ElementTree as ET

LINEAR = "bezier(0 0 1 1)"
CUTS = ("cut", "fade", "hard")
DUR = {"cut": 0, "fade": 0, "hard": 0, "push": 1.4, "glide": 2.0}
EASE_IN, EASE_OUT, FADE = (1.0, 0.42), (1.2, 0.5), (13, 14)
CARRY = {"zoom": 0.26, "roll": 2.4}
CALM, MOVING = 50, 4
TILTS = {"flat": (0, 0, 0), "lean-right": (38, 16, -10), "lean-left": (38, -16, 10), "laid-right": (52, 38, -24), "laid-left": (52, -38, 24)}
PHONE = {"scale": 0.945, "screen": [412, 914], "radius": 38, "bezel": 10, "band": 6.5, "depth": 46, "frame": "#B9B5AD", "cutout": "punch", "cutout_top": 28, "shadow": 1.6}
def rot(deg, x, y):
    a = math.radians(deg)
    return x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a)

def tilt_of(shot):
    t = shot.get("tilt", "flat")
    return TILTS[t] if isinstance(t, str) else (t.get("lay", 0), t.get("yaw", 0), t.get("turn", 0))

def to_world(cfg, tilt, look):
    if not isinstance(look, dict):
        return float(look[0]), float(look[1])
    ph, (lay, yaw, turn) = cfg["phone"], tilt
    x, y = look["screen"][0] - ph["screen"][0] / 2, look["screen"][1] - ph["screen"][1] / 2
    x, y = rot(yaw, x * ph["scale"], y * ph["scale"])
    x, y = rot(turn, x, y * math.cos(math.radians(lay)))
    return ph["at"][0] + x, ph["at"][1] + y

def ease(curve, p):
    m = re.match(r"bezier\(([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)\)", curve or LINEAR)
    if not m:
        return p
    x1, y1, x2, y2 = map(float, m.groups())
    lo, hi = 0.0, 1.0
    for _ in range(40):
        u = (lo + hi) / 2
        if 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u * u * x2 + u ** 3 < p: lo = u
        else: hi = u
    return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u ** 3

def sample(kfs, t):
    if t <= kfs[0][0]: return kfs[0][1]
    for (t0, v0, e), (t1, v1, _) in zip(kfs, kfs[1:]):
        if t <= t1:
            p = ease(e, (t - t0) / (t1 - t0)) if t1 > t0 else 1
            return tuple(a + (b - a) * p for a, b in zip(v0, v1))
    return kfs[-1][1]

def num(v, digits):
    return " ".join(("%.*f" % (digits, x)).rstrip("0").rstrip(".") if digits else "%d" % round(x) for x in v)

def anim(target, kfs, digits, indent, attr="field"):
    kfs = [k for i, k in enumerate(kfs) if not (0 < i < len(kfs) - 1 and kfs[i - 1][1] == k[1] == kfs[i + 1][1])]
    rows = ['%s  <keyframe time="%s" value="%s"%s />' % (indent, num((t,), 3), num(v, digits), ' easing="%s"' % e if e and i < len(kfs) - 1 else "")
            for i, (t, v, e) in enumerate(kfs)]
    return '%s<animation %s="%s">\n%s\n%s</animation>' % (indent, attr, target, "\n".join(rows), indent)

def view(cam, t, frame):
    """zoom, roll and the frame centre in world px at time t."""
    (ax, ay), (zoom, _), (roll,), (px, py) = (sample(cam[f], t) for f in ("anchor", "scale", "rotation", "position"))
    dx, dy = rot(-roll, (frame[0] / 2 - px) / zoom, (frame[1] / 2 - py) / zoom)
    return zoom, roll, (ax + dx, ay + dy)

def corners(cam, t, frame):
    (ax, ay), (zoom, _), (roll,), (px, py) = (sample(cam[f], t) for f in ("anchor", "scale", "rotation", "position"))
    out = []
    for cx, cy in ((0, 0), (frame[0], 0), (0, frame[1]), tuple(frame)):
        dx, dy = rot(-roll, (cx - px) / zoom, (cy - py) / zoom)
        out.append((ax + dx, ay + dy))
    return out

def motion_checks(cam, frame, world, fps, duration):
    """Checks on the camera as it plays, one sample per frame. cam anchors are in world px.
    A cut is two keyframes one frame apart."""
    n = int(round(duration * fps))
    v = [view(cam, i / fps, frame) for i in range(n)]
    cuts = sorted({round(b[0] * fps) for f in ("anchor", "scale", "rotation") for a, b in zip(cam[f], cam[f][1:]) if 0 < b[0] - a[0] < 1.5 / fps and a[1] != b[1]})
    cuts = [c for c in cuts if 0 < c < n]
    speed = [0.0]
    for i in range(1, n):
        (z0, r0, c0), (z1, r1, c1) = v[i - 1], v[i]
        speed.append(math.hypot(c1[0] - c0[0], c1[1] - c0[1]) * z1 + abs(math.log(z1 / z0)) * frame[0] / 2 + abs(math.radians(r1 - r0)) * frame[0] / 2)
    runs, start = [], None
    for i in range(1, n + 1):
        fast = i < n and i not in cuts and speed[i] > 12
        if fast and start is None: start = i
        if not fast and start is not None: runs.append((start, i - 1)); start = None
    moves = sum(1 for a, b in runs if b - a >= 3 and not any(a - 2 <= c <= b + 2 for c in cuts))
    dead = [c / fps for c in cuts if max(speed[max(1, c - 3):c] or [0]) < MOVING or max(speed[c + 1:c + 4] or [0]) < MOVING]
    rushed = sorted(((max(speed[a:b + 1]), (a + b) / 2 / fps) for a, b in runs if max(speed[a:b + 1]) > CALM), reverse=True)
    still, longest, wide, macro, outside = 0, 0, 0, 0, None
    for i in range(1, n):
        still = still + 1 if speed[i] < 0.08 else 0
        longest = max(longest, still)
        wide += v[i][0] < 1.2
        macro += v[i][0] >= 2.8
        if world and outside is None and any(not (0 <= x <= world[0] and 0 <= y <= world[1]) for x, y in corners(cam, i / fps, frame)):
            outside = i / fps
    zooms, rolls = [x[0] for x in v], [x[1] for x in v]
    res = [
        ("framings", len(cuts) + moves + 1 >= duration / 2.5, "%d camera events (%d cuts, %d moves); the references change framing every 1-2.5s, so at least %d" % (len(cuts) + moves, len(cuts), moves, math.ceil(duration / 2.5) - 1)),
        ("cuts", len(cuts) >= 4, "%d cuts at %s; at least 4" % (len(cuts), " ".join("%.2f" % (c / fps) for c in cuts) or "-")),
        ("cuts carry", len(dead) <= 2, "every cut is moving on both sides of it" if not dead else "%d cuts start or end on a camera at rest (%s), which reads as stiff; at most 2, and only for a montage" % (len(dead), " ".join("%.2f" % c for c in dead))),
        ("calm moves", len(rushed) <= 1, "no move is snappy: the camera stays under %d px a frame%s" % (CALM, ", but for the one around %.1fs (%d)" % (rushed[0][1], rushed[0][0]) if rushed else "") if len(rushed) <= 1 else
         "%d moves travel too fast (%s; at most %d px a frame, and one faster move for the turn): give each a longer dur, since its speed falls as the dur grows, or make it a cut" % (len(rushed), ", ".join("%d px at %.1fs" % (v, t) for v, t in rushed), CALM)),
        ("zoom range", max(zooms) / min(zooms) >= 3, "%.2f to %.2f; the closest shot is at least 3x the widest" % (min(zooms), max(zooms))),
        ("macro time", macro / fps >= 2.5, "%.1fs at zoom 2.8 or closer; at least 2.5s" % (macro / fps)),
        ("wide time", wide / n <= 0.4, "%.0f%% of the film wider than zoom 1.2; at most 40%%" % (100 * wide / n)),
        ("roll", max(abs(r) for r in rolls) >= 18, "%.1f to %.1f deg; one shot rolled 18 or more" % (min(rolls), max(rolls))),
        ("no still frame", longest / fps <= 0.5, "longest stretch with a frozen camera %.2fs; at most 0.5s" % (longest / fps)),
    ]
    if world:
        res.append(("inside the world", outside is None, "the frame stays inside the Camera composition" if outside is None else "the frame leaves the Camera composition at %.2fs: enlarge the world or pull the shot in" % outside))
    return res

def report(results):
    bad = 0
    for name, ok, msg in results:
        bad += not ok
        print("%s  %-16s %s" % ("ok  " if ok else "FAIL", name, msg))
    print("\n%d of %d checks failed" % (bad, len(results)) if bad else "\nall %d checks pass" % len(results))
    return 1 if bad else 0

def load(path):
    cfg = json.load(open(path))
    cfg.setdefault("fps", 30); cfg.setdefault("carry", 1); cfg.setdefault("duration", 30); cfg.setdefault("frame", [1920, 1080]); cfg.setdefault("world", [5760, 3240])
    ph = cfg.setdefault("phone", {})
    ph.setdefault("at", [cfg["world"][0] / 2, cfg["world"][1] / 2])
    for k, v in PHONE.items(): ph.setdefault(k, v)
    unknown = sorted({s.get("in", "cut") for s in cfg["shots"]} - set(DUR))
    if unknown:
        sys.exit('unknown "in": %s; use one of %s' % (", ".join(unknown), ", ".join(DUR)))
    cfg["shots"].sort(key=lambda s: s["t"])
    return cfg

def plan(cfg):
    """Every shot resolved: where it enters, lands, drifts to and leaves, and when."""
    fps, shots, out = cfg["fps"], cfg["shots"], []
    for i, s in enumerate(shots):
        kind = "hard" if i == 0 else s.get("in", "cut")
        dur = s.get("dur", DUR[kind]) if DUR[kind] else 0
        nxt = shots[i + 1] if i + 1 < len(shots) else None
        cut_next = nxt is not None and nxt.get("in", "cut") in CUTS
        end = cfg["duration"] if nxt is None else nxt["t"] - (1 / fps if cut_next else 0)
        tilt, d = tilt_of(s), s.get("drift", {})
        look = to_world(cfg, tilt, s["look"])
        look_end = to_world(cfg, tilt, d["to"]) if "to" in d else (look[0] + d.get("look", [0, 0])[0], look[1] + d.get("look", [0, 0])[1])
        eased = [min(EASE_OUT[0], EASE_OUT[1] * (end - s["t"])) if kind in ("cut", "fade") else 0,
                 min(EASE_IN[0], EASE_IN[1] * (end - s["t"] - dur)) if cut_next and nxt.get("in", "cut") != "hard" else 0]
        roll, held = s.get("roll", 0), max(0.5, end - s["t"] - dur)
        out.append(dict(i=i + 1, name=s.get("name", ""), kind=kind, t=s["t"], land=s["t"] + dur, end=end, tilt=tilt, tilt_name=s.get("tilt", "flat"),
                        fade=kind == "fade", on_screen=isinstance(s["look"], dict), eased=[round(d * fps) / fps for d in eased],
                        look=look, look_end=look_end, zoom=s["zoom"], zoom_end=s["zoom"] * d.get("zoom", 1.03 ** held),
                        roll=roll, roll_end=roll + d.get("roll", held * (math.copysign(0.7, roll) if roll else 0.25)),
                        place=tuple(s.get("place", [cfg["frame"][0] / 2, cfg["frame"][1] / 2]))))
    for i, a in enumerate(out):
        for side, other in ((0, out[i - 1]), (1, out[(i + 1) % len(out)])):
            d = a["eased"][side]
            if not d:
                continue
            k = cfg["carry"] * min(1, max(0.6, min(d, other["eased"][1 - side]))) * d / 2
            zoom, turn = (math.copysign(k * CARRY[f], a[f + "_end"] - a[f]) for f in ("zoom", "roll"))
            if side == 0: a["entry"] = dict(zoom=a["zoom"] / math.exp(zoom), roll=a["roll"] - turn, dur=d)
            else: a["exit"] = dict(zoom=a["zoom_end"] * math.exp(zoom), roll=a["roll_end"] + turn, dur=d)
    return out

def shaped(ks):
    """Easing names to curves. A quadratic ease leaves at the speed of the linear stretch before it and
    lands at the speed of the one after it, so a shot never stops between its eases and its drift."""
    out = []
    for i, (t, v, kind) in enumerate(ks):
        if kind in ("in", "out", "inout"):
            t1, v1 = ks[i + 1][:2]
            k = max(range(len(v)), key=lambda j: abs(v1[j] - v[j]))
            span, m0, m1 = v1[k] - v[k], 0, 0
            if span and kind != "out" and i and ks[i - 1][2] == "lin" and t > ks[i - 1][0]:
                m0 = (v[k] - ks[i - 1][1][k]) / (t - ks[i - 1][0]) * (t1 - t) / span
            if span and kind != "in" and i + 2 < len(ks) and ks[i + 1][2] == "lin" and ks[i + 2][0] > t1:
                m1 = (ks[i + 2][1][k] - v1[k]) / (ks[i + 2][0] - t1) * (t1 - t) / span
            m0, m1 = min(1, max(0, m0)), min(1, max(0, m1))
            kind = "bezier(%s)" % num({"in": (1 / 3, m0 / 3, 2 / 3, (1 + m0) / 3), "out": (1 / 3, (2 - m1) / 3, 2 / 3, 1 - m1 / 3), "inout": (0.45, 0.45 * m0, 0.55, 1 - 0.45 * m1)}[kind], 3)
        out.append((t, v, LINEAR if kind == "lin" else kind))
    return out

def tracks(cfg, shots):
    """Keyframes for every animated field of the rig, from one list of (time, state, easing)."""
    fps, keys = cfg["fps"], []
    def along(s, t):
        p = (t - s["land"]) / max(s["end"] - s["land"], 1e-9)
        return dict(look=tuple(a + (b - a) * p for a, b in zip(s["look"], s["look_end"])), zoom=s["zoom"] + (s["zoom_end"] - s["zoom"]) * p,
                    roll=s["roll"] + (s["roll_end"] - s["roll"]) * p, place=s["place"], tilt=s["tilt"])
    for s in shots:
        land, last = along(s, s["land"]), along(s, s["end"])
        if s["kind"] in CUTS:
            if "entry" in s:
                keys.append((s["t"], dict(land, zoom=s["entry"]["zoom"], roll=s["entry"]["roll"]), "out"))
                keys.append((s["t"] + s["entry"]["dur"], along(s, s["t"] + s["entry"]["dur"]), "lin"))
            else:
                keys.append((s["t"], land, "lin"))
        else:
            keys[-1] = (keys[-1][0], keys[-1][1], "inout")
            keys.append((s["land"], land, "lin"))
        if "exit" in s:
            keys.append((s["end"] - s["exit"]["dur"], along(s, s["end"] - s["exit"]["dur"]), "in"))
            keys.append((s["end"], dict(last, zoom=s["exit"]["zoom"], roll=s["exit"]["roll"]), None))
        else:
            keys.append((s["end"], last, None))
    keys = [(round(round(t * fps) / fps, 4), st, e) for t, st, e in keys]
    world = cfg["world"]
    def anchor(st):
        return tuple(round(v / w, 3) * w for v, w in zip(st["look"], world))
    def position(st):
        snapped = anchor(st)
        dx, dy = rot(st["roll"], (snapped[0] - st["look"][0]) * st["zoom"], (snapped[1] - st["look"][1]) * st["zoom"])
        return st["place"][0] + dx, st["place"][1] + dy
    fields = {"anchor": anchor, "scale": lambda st: (st["zoom"],) * 2, "rotation": lambda st: (st["roll"],), "position": position,
              "tilt scale": lambda st: (1, math.cos(math.radians(st["tilt"][0]))), "tilt rotation": lambda st: (st["tilt"][2],),
              "phone rotation": lambda st: (st["tilt"][1],), "lay": lambda st: (st["tilt"][0],), "yaw": lambda st: (st["tilt"][1],)}
    out = {f: shaped([(t, get(st), e) for t, st, e in keys]) for f, get in fields.items()}
    fade = [(0.0, (1,), "lin")]
    for s in shots:
        a, b = s["t"] - FADE[0] / fps, s["t"] + FADE[1] / fps
        if s["fade"] and a > fade[-1][0] and b < cfg["duration"]:
            fade += [(a, (1,), "inout"), (s["t"] - 1 / fps, (0,), "lin"), (s["t"], (0,), "inout"), (b, (1,), "lin")]
    out["opacity"] = shaped([(round(t, 4), v, e) for t, v, e in fade] + [(float(cfg["duration"]), (1,), None)])
    return out

def phone_fill(cfg, s):
    """Share of the frame the phone's body covers when shot s lands."""
    ph, frame, (lay, yaw, turn), hit = cfg["phone"], cfg["frame"], s["tilt"], 0
    hw, hh = ph["screen"][0] / 2 + ph["bezel"] + ph["band"], ph["screen"][1] / 2 + ph["bezel"] + ph["band"]
    for gx in range(24):
        for gy in range(14):
            x, y = rot(-s["roll"], ((gx + 0.5) / 24 * frame[0] - s["place"][0]) / s["zoom"], ((gy + 0.5) / 14 * frame[1] - s["place"][1]) / s["zoom"])
            x, y = rot(-turn, s["look"][0] + x - ph["at"][0], s["look"][1] + y - ph["at"][1])
            x, y = rot(-yaw, x, y / math.cos(math.radians(lay)))
            hit += abs(x) <= hw * ph["scale"] and abs(y) <= hh * ph["scale"]
    return hit / 336

def framing(zoom):
    return "wide" if zoom < 1.2 else "medium" if zoom < 1.9 else "close" if zoom < 2.8 else "macro"

PARTS = {"below": "<!-- WORLD BELOW: layers behind the phone, in world px -->", "tilt": "", "screens": None, "above": "<!-- WORLD ABOVE: layers in front of the phone, in world px -->"}

def rig(cfg, tr, parts):
    """The Camera composition as XML: its keyframes, the Tilt rig, the phone from template/phone.xml and the film's own layers."""
    ph, world, frame = cfg["phone"], cfg["world"], cfg["frame"]
    edge = ph["bezel"] + ph["band"]
    size = [2 * math.ceil(ph["screen"][k] / 2 + edge + 96) for k in (0, 1)]
    pose = "\n".join(anim(f, tr[f], 2, "      ", "input") for f in ("lay", "yaw"))
    fill = {"DURATION": num((cfg["duration"],), 3), "AT": num(ph["at"], 1), "SCALE": num((ph["scale"],), 4), "SCREEN_W": ph["screen"][0], "SCREEN_H": ph["screen"][1],
            "RADIUS": ph["radius"], "BEZEL": ph["bezel"], "BAND": ph["band"], "DEPTH": ph["depth"], "FRAME": ph["frame"], "SHADOW": ph["shadow"],
            "CUTOUT": {"none": 0, "punch": 1, "island": 2}[ph["cutout"]], "CUTOUT_TOP": ph["cutout_top"],
            "PHONE_W": size[0], "PHONE_H": size[1], "PHONE_CX": size[0] // 2, "PHONE_CY": size[1] // 2, "POSE_ANIMS": pose,
            "TILT_ANIMS": anim("scale", tr["tilt scale"], 4, "  ") + "\n" + anim("rotation", tr["tilt rotation"], 2, "  ") + ("\n" + parts["tilt"] if parts["tilt"] else ""),
            "PHONE_ANIMS": anim("rotation", tr["phone rotation"], 2, "    ")}
    template = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "template", "phone.xml")).read()
    phone = re.sub(r"@@([A-Z_]+)@@", lambda m: str(fill[m.group(1)]), template)
    if parts["screens"]:
        phone = re.sub(r"[ \t]*<!-- SCREENS:.*?-->", lambda m: parts["screens"], phone)
    cam = [anim("anchor", [(t, (v[0] / world[0], v[1] / world[1]), e) for t, v, e in tr["anchor"]], 3, "  "), anim("scale", tr["scale"], 3, "  "),
           anim("rotation", tr["rotation"], 2, "  "), anim("position", tr["position"], 1, "  "), anim("opacity", tr["opacity"], 2, "  ")]
    return "\n".join(['<composition name="Camera" background="#00000000" duration="%s" position="%d %d" size="%d %d">' % (fill["DURATION"], frame[0] / 2, frame[1] / 2, world[0], world[1])]
                     + cam + [parts["below"], "\n".join("  " + line for line in phone.rstrip().split("\n")), parts["above"], "</composition>"]) + "\n"

def build(path):
    cfg = load(path); shots = plan(cfg); tr = tracks(cfg, shots)
    fps, frame, world, ph = cfg["fps"], cfg["frame"], cfg["world"], cfg["phone"]
    folder = os.path.dirname(os.path.abspath(path))
    found = [k for k in PARTS if os.path.exists(os.path.join(folder, k + ".xml"))]
    parts = {k: open(os.path.join(folder, k + ".xml")).read().rstrip() if k in found else PARTS[k] for k in PARTS}
    out = os.path.join(folder, "rig.xml")
    open(out, "w").write(rig(cfg, tr, parts))
    print("wrote %s with %s; not there yet: %s\n" % (out, ", ".join(k + ".xml" for k in found) or "the phone alone", ", ".join(k + ".xml" for k in PARTS if k not in found) or "nothing"))
    print(" #  t      in     lands  ends   framing  zoom        roll   tilt        phone/frame  look (world)   name")
    for s in shots:
        long_axis = math.hypot(*rot(s["tilt"][2], *(lambda x, y: (x, y * math.cos(math.radians(s["tilt"][0]))))(*rot(s["tilt"][1], 0, ph["screen"][1] * ph["scale"]))))
        print("%2d  %-6.2f %-6s %-6.2f %-6.2f %-8s %.2f>%-5.2f  %-6.1f %-11s %3d%%         %5d %-5d    %s" % (
            s["i"], s["t"], s["kind"], s["land"], s["end"], framing(s["zoom"]), s["zoom"], s["zoom_end"], s["roll"],
            s["tilt_name"] if isinstance(s["tilt_name"], str) else "custom", round(100 * long_axis * s["zoom"] / frame[1]), s["look"][0], s["look"][1], s["name"]))
    rest = [round(min(s["land"] + s.get("entry", {}).get("dur", 0) + 0.1, (s["land"] + s["end"]) / 2), 2) for s in shots]
    print("\ncapture the root composition once per shot, 8 times a call:")
    for i in range(0, len(rest), 8):
        print("  " + json.dumps(rest[i:i + 8]))
    cut = max((s for s in shots if s["kind"] == "cut"), key=lambda s: s["zoom"], default=None)
    if cut:
        print("and one cut, to see the move run through it:\n  " + json.dumps([round(cut["t"] + k / fps, 3) for k in (-15, -8, -3, -1, 0, 2, 7, 15)]))
    res = []
    grid = [s for s in shots if abs(s["t"] * fps - round(s["t"] * fps)) > 1e-6]
    res.append(("frame grid", not grid, "every t is a whole frame" if not grid else "off the frame grid: " + ", ".join("shot %d" % s["i"] for s in grid)))
    short = [s for s in shots if s["end"] - s["land"] < 0.5 - 1e-6]
    res.append(("room to land", not short, "every shot holds 0.5s or more after it lands" if not short else "no time left after landing: " + ", ".join("shot %d" % s["i"] for s in short)))
    long = [s for s in shots if s["end"] - s["t"] > 3.5]
    res.append(("shot length", not long, "no shot runs past 3.5s" if not long else "longer than 3.5s: " + ", ".join("shot %d (%.1fs)" % (s["i"], s["end"] - s["t"]) for s in long)))
    kinds = {k: sum(framing(s["zoom"]) == k for s in shots) for k in ("wide", "medium", "close", "macro")}
    res.append(("framing mix", kinds["macro"] >= 2 and kinds["close"] + kinds["macro"] >= 4 and kinds["medium"] >= 1, "%(wide)d wide, %(medium)d medium, %(close)d close, %(macro)d macro; at least 2 macro, 4 close or macro, 1 medium" % kinds))
    rolled = sum(abs(s["roll"]) >= 10 for s in shots)
    res.append(("rolled shots", rolled >= 3, "%d shots rolled 10 deg or more; at least 3" % rolled))
    tilted = sum(s["tilt"][0] >= 30 for s in shots)
    res.append(("tilted shots", tilted >= 2, "%d shots with the phone laid back 30 deg or more; at least 2" % tilted))
    turns = sum(1 for a, b in zip(shots, shots[1:]) if b["kind"] not in CUTS and a["tilt"] != b["tilt"])
    res.append(("turning moves", turns >= 2, "%d continuous moves in which the phone turns to a new pose; at least 2" % turns))
    empty = []
    for s in shots:
        need = 0.5 if s["zoom"] >= 2.8 else 0.4
        if s["on_screen"] and s["zoom"] >= 1.9 and phone_fill(cfg, s) < need:
            for k in (1, 1.15, 1.3, 1.5, 1.8):
                best = max(((phone_fill(cfg, dict(s, zoom=s["zoom"] * k, place=(x, y))), x, y) for x in range(480, 1441, 120) for y in range(300, 781, 80)))
                if best[0] >= need: break
            empty.append("shot %d covers %d%%, needs %d%%: place [%d, %d]%s gives %d%%" % (s["i"], round(100 * phone_fill(cfg, s)), round(100 * need), best[1], best[2], " at zoom %.1f" % (s["zoom"] * k) if k > 1 else "", round(100 * best[0])))
    res.append(("phone fills", not empty, "the phone covers half the frame in every macro, 40% in every close shot" if not empty else "too much backdrop; move place toward the control's corner of the screen, or go closer: " + "; ".join(empty)))
    limit = round(2.3 * (ph["bezel"] + ph["band"]))
    res.append(("screen corners", ph["radius"] <= limit, "the screen's corners stay under the bezel" if ph["radius"] <= limit else "radius %s is past %.0f (2.3 x bezel + band): the screen's square corners would stick out of the body" % (ph["radius"], limit)))
    jump = [b for a, b in zip(shots, shots[1:]) if b["kind"] in CUTS and max(a["zoom_end"] / b["zoom"], b["zoom"] / a["zoom_end"]) < 1.5 and a["tilt"] == b["tilt"] and abs(a["roll_end"] - b["roll"]) < 15]
    res.append(("no jump cut", not jump, "every cut changes zoom 1.5x, the tilt, or the roll by 15 deg" if not jump else "cut into nearly the same framing: " + ", ".join("shot %d" % s["i"] for s in jump)))
    fades, cuts = sum(s["kind"] == "fade" for s in shots), sum(s["kind"] in CUTS for s in shots[1:])
    res.append(("plain cuts", fades <= max(1, cuts // 4) and 2 * (len(shots) - 1 - cuts) <= cuts, "%d cuts, %d of them fades, and %d moves; at most 1 cut in 4 fades, and two cuts or more for every move" % (cuts, fades, len(shots) - 1 - cuts)))
    res += motion_checks({f: tr[f] for f in ("anchor", "scale", "rotation", "position")}, frame, world, fps, cfg["duration"])
    print()
    return report(res)

def node_tracks(el):
    def pair(text, n):
        v = [float(x) for x in text.split()]
        return tuple(v * n if len(v) == 1 and n == 2 else v)
    size = pair(el.get("size", "1920 1080"), 2)
    base = {"anchor": pair(el.get("anchor", "0.5 0.5"), 2), "scale": pair(el.get("scale", "1 1"), 2), "rotation": pair(el.get("rotation", "0"), 1), "position": pair(el.get("position", "960 540"), 2)}
    cam = {f: [(0.0, v, None)] for f, v in base.items()}
    for a in el.findall("animation"):
        f = a.get("field")
        if f in cam:
            cam[f] = [(float(k.get("time")), pair(k.get("value"), len(base[f])), k.get("easing")) for k in a.findall("keyframe")]
    cam["anchor"] = [(t, (v[0] * size[0], v[1] * size[1]), e) for t, v, e in cam["anchor"]]
    return cam, size

def check(path):
    text = open(path).read()
    for line in text.splitlines():
        if line.startswith('{"xml"'):
            text = json.loads(line)["xml"]
    root = ET.fromstring(text[text.index("<"):text.rindex(">") + 1])
    el = root if root.get("name") == "Camera" else next((e for e in root.iter() if e.get("name") == "Camera"), root)
    cam, size = node_tracks(el)
    duration = float(el.get("duration", root.get("duration", "30")))
    print("%s %s, %s x %s, %gs" % (el.tag, el.get("name"), size[0], size[1], duration))
    return report(motion_checks(cam, [1920, 1080], size, 30, duration))

def point(path, n, x, y):
    cfg = load(path); s = plan(cfg)[int(n) - 1]
    wx, wy = to_world(cfg, s["tilt"], {"screen": [float(x), float(y)]})
    fx, fy = rot(s["roll"], (wx - s["look"][0]) * s["zoom"], (wy - s["look"][1]) * s["zoom"])
    print(json.dumps({"shot": s["i"], "world": [round(wx, 1), round(wy, 1)], "frame": [round(s["place"][0] + fx, 1), round(s["place"][1] + fy, 1)]}))
    return 0

if __name__ == "__main__":
    cmd, a = (sys.argv[1:2] or ["help"])[0], sys.argv[2:]
    if cmd == "build" and len(a) == 1: sys.exit(build(a[0]))
    if cmd == "check" and len(a) == 1: sys.exit(check(a[0]))
    if cmd == "point" and len(a) == 4: sys.exit(point(*a))
    sys.exit(__doc__)
