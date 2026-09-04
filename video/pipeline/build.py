#!/usr/bin/env python3
"""Re-cut of the Epique Realty "Region 1 West Power Summit" promo.

What changes versus the v1 cut:
  * the alien/UFO cold open is replaced by two cinematic plates and a proper
    title card, over a composed score;
  * the leadership video-call grid is regenerated with a more diverse cast;
  * every state card gets exactly the same screen time (2.0s);
  * six of the eleven state cards swap luxury hero homes for mid-range,
    mixed-price neighbourhoods;
  * the whole thing runs 40s instead of 30s so the open can breathe.

Runs in a directory holding: src.mp4 (the v1 cut), g01..g09.mp4 (the new
Higgsfield plates), wordmark.png, fonts/, score.py.
"""
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1280, 720, 30
XF = 0.20                      # dissolve length between segments
GOLD = (220, 181, 115, 255)    # sampled off the v1 lower-thirds
WHITE = (255, 255, 255, 255)

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")


def font(weight, size):
    return ImageFont.truetype(os.path.join(FONTS, f"Montserrat-{weight}.ttf"), size)


def run(args):
    p = subprocess.run(args, capture_output=True, text=True)
    if p.returncode != 0:
        sys.stderr.write(" ".join(args) + "\n" + p.stderr[-4000:] + "\n")
        raise SystemExit(f"ffmpeg failed ({p.returncode})")
    return p


# --------------------------------------------------------------------------
# Overlay drawing
# --------------------------------------------------------------------------

def tracked_text(draw, xy, text, fnt, fill, tracking=0.0, anchor_x="left"):
    """Draw text with manual letter-spacing; xy is (x, baseline_y)."""
    x, y = xy
    widths = [draw.textlength(ch, font=fnt) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    if anchor_x == "center":
        x -= total / 2.0
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=fnt, fill=fill, anchor="ls")
        x += w + tracking
    return total


def corner_lockup(im, wordmark):
    """The EPIQUE REALTY plate in the top-left.

    Drawn as an opaque black plate at the exact position v1 uses, so on the
    reused shots it lands squarely on top of the baked-in one (no ghosting)
    and on the new shots it recreates it.
    """
    d = ImageDraw.Draw(im)
    d.rectangle([35, 24, 291, 113], fill=(0, 0, 0, 255))
    mark = wordmark.resize((228, 75), Image.LANCZOS)
    im.alpha_composite(mark, (47, 31))


def lower_band(im, top_solid=592, top_fade=536):
    """Black lower third: soft ramp in, fully opaque under the type.

    Opaque from `top_solid` down, which completely covers the v1 baked label
    (its type sits between y=607 and y=687).
    """
    band = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = band.load()
    for y in range(top_fade, H):
        if y >= top_solid:
            a = 255
        else:
            a = int(255 * ((y - top_fade) / float(top_solid - top_fade)) ** 1.6)
        for x in range(W):
            px[x, y] = (0, 0, 0, a)
    im.alpha_composite(band)


def state_overlay(name, wordmark):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    lower_band(im)
    corner_lockup(im, wordmark)
    d = ImageDraw.Draw(im)
    tracked_text(d, (60, 647), name, font(800, 57), GOLD, tracking=1.0)
    tracked_text(d, (62, 687), "REGION 1   •   ACTIVE MARKET",
                 font(700, 20), WHITE, tracking=2.0)
    return im


def title_overlay(wordmark):
    """Replaces the alien cold open: centred lockup, rule, summit line."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # a wide, very soft vignette so type holds over any plate
    veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vp = veil.load()
    for y in range(H):
        a = int(150 * max(0.0, 1.0 - abs(y - 360) / 330.0) ** 1.2)
        for x in range(W):
            vp[x, y] = (0, 0, 0, a)
    im.alpha_composite(veil)

    mark = wordmark.resize((430, 141), Image.LANCZOS)
    im.alpha_composite(mark, (W // 2 - 215, 250))
    d.line([(W // 2 - 190, 432), (W // 2 + 190, 432)], fill=(220, 181, 115, 150), width=1)
    tracked_text(d, (W // 2, 480), "REGION 1   •   WEST POWER SUMMIT",
                 font(700, 25), WHITE, tracking=4.0, anchor_x="center")
    tracked_text(d, (W // 2, 516), "13 WESTERN STATES   •   11 ACTIVE MARKETS",
                 font(600, 17), GOLD, tracking=3.0, anchor_x="center")
    return im


def grid_overlay():
    """Band under the leadership call grid."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    lower_band(im, top_solid=600, top_fade=548)
    d = ImageDraw.Draw(im)
    tracked_text(d, (W // 2, 650), "THE CALL ECHOES ACROSS THE WEST",
                 font(800, 30), GOLD, tracking=2.0, anchor_x="center")
    tracked_text(d, (W // 2, 686), "REGION 1 LEADERS ANSWER",
                 font(700, 17), WHITE, tracking=3.0, anchor_x="center")
    return im


# --------------------------------------------------------------------------
# The cut
# --------------------------------------------------------------------------
# Each entry: (id, seconds on screen, source spec, overlay key)
# source spec is ("gen", file, start) for the new plates, or
# ("src", start, length) for a window of the v1 cut, retimed to fit.

STATES = [
    ("WASHINGTON", ("src", 6.40, 1.85)),
    ("OREGON",     ("src", 8.45, 1.80)),
    ("CALIFORNIA", ("gen", "g04.mp4", 0.80)),
    ("MONTANA",    ("gen", "g05.mp4", 0.80)),
    ("IDAHO",      ("gen", "g06.mp4", 0.80)),
    ("WYOMING",    ("src", 14.95, 1.80)),
    ("NEVADA",     ("gen", "g07.mp4", 0.80)),
    ("UTAH",       ("gen", "g08.mp4", 0.80)),
    ("COLORADO",   ("src", 20.95, 1.80)),
    ("ARIZONA",    ("gen", "g09.mp4", 0.80)),
    ("NEW MEXICO", ("src", 25.35, 1.80)),
]

SEG_STATE = 2.0
SEG_INTRO = 4.0
SEG_FUTURE = 2.0
SEG_END = 4.0

# Mild grade so the new plates sit in the same world as the v1 footage:
# a touch more contrast, a hair less saturation, gentle warm lift.
GRADE = "eq=contrast=1.07:saturation=0.97:gamma=0.98,colorbalance=rs=0.02:bs=-0.02"

# Retiming and zoompan can land a frame or two short; cloning the tail frame
# guarantees every segment hits its exact target so the xfade offsets hold.
PAD = "tpad=stop_mode=clone:stop_duration=0.5"


def seg_filter(spec, out_dur, grade=False):
    """Return (input_args, filter_string) rendering `out_dur` seconds."""
    kind = spec[0]
    if kind == "gen":
        _, fn, start = spec
        ins = ["-ss", f"{start}", "-t", f"{out_dur}", "-i", fn]
        vf = f"scale={W}:{H},fps={FPS}"
    else:
        _, start, length = spec
        factor = out_dur / length
        ins = ["-ss", f"{start}", "-t", f"{length}", "-i", "src.mp4"]
        vf = f"scale={W}:{H},setpts={factor:.6f}*PTS,fps={FPS}"
    if grade:
        vf += "," + GRADE
    return ins, vf


def render_segment(idx, spec, overlay_png, out_dur, extra_vf="", grade=False,
                   overlay_fade=None):
    ins, vf = seg_filter(spec, out_dur, grade=grade)
    if extra_vf:
        vf += "," + extra_vf
    out = f"seg_{idx:02d}.mp4"
    args = ["ffmpeg", "-v", "error", "-y"] + ins
    if overlay_png:
        args += ["-loop", "1", "-i", overlay_png]
        ov = "[1:v]format=rgba"
        if overlay_fade:
            st, d = overlay_fade
            ov += f",fade=in:st={st}:d={d}:alpha=1"
        ov += "[ov]"
        fc = (f"[0:v]{vf},format=rgba[base];{ov};"
              f"[base][ov]overlay=0:0,{PAD},format=yuv420p[v]")
    else:
        fc = f"[0:v]{vf},{PAD},format=yuv420p[v]"
    args += ["-filter_complex", fc, "-map", "[v]", "-an",
             "-t", f"{out_dur}", "-r", str(FPS),
             "-c:v", "libx264", "-preset", "medium", "-crf", "16",
             "-pix_fmt", "yuv420p", out]
    run(args)
    return out


def main():
    wordmark = Image.open("wordmark.png").convert("RGBA")
    os.makedirs("ov", exist_ok=True)

    title_overlay(wordmark).save("ov/title.png")
    grid_overlay().save("ov/grid.png")
    for name, _ in STATES:
        state_overlay(name, wordmark).save(f"ov/st_{name.replace(' ', '_')}.png")

    segs = []          # (file, seconds on screen)
    i = 0

    # 1. Cold open: dawn ridgelines, rising out of black. No type at all --
    #    this is the beat the UFO used to occupy.
    segs.append((render_segment(
        i, ("gen", "g01.mp4", 0.40), None, SEG_INTRO + XF,
        extra_vf="fade=in:st=0:d=1.1", grade=True), SEG_INTRO))
    i += 1

    # 2. Title card: gold light network over the West + the summit lockup.
    segs.append((render_segment(
        i, ("gen", "g02.mp4", 0.40), "ov/title.png", SEG_INTRO + XF,
        grade=True, overlay_fade=(0.55, 0.9)), SEG_INTRO))
    i += 1

    # 3. The leadership call, recast.
    segs.append((render_segment(
        i, ("gen", "g03.mp4", 0.40), "ov/grid.png", SEG_INTRO + XF,
        grade=True, overlay_fade=(0.35, 0.5)), SEG_INTRO))
    i += 1

    # 4. "THE WEST IS BUILDING THE FUTURE" -- reused from v1, type and all.
    segs.append((render_segment(
        i, ("src", 4.78, 1.46), None, SEG_FUTURE + XF), SEG_FUTURE))
    i += 1

    # 5. Eleven states, identical screen time each.
    for name, spec in STATES:
        png = f"ov/st_{name.replace(' ', '_')}.png"
        segs.append((render_segment(
            i, spec, png, SEG_STATE + XF, grade=(spec[0] == "gen")), SEG_STATE))
        i += 1

    # 6. End card, held long enough to read, with a slow push in.
    segs.append((render_segment(
        i, ("src", 28.00, 2.10), None, SEG_END,
        extra_vf=(f"scale={int(W*1.12)}:{int(H*1.12)},"
                  f"zoompan=z='min(zoom+0.0006,1.06)':d=1:"
                  f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS},"
                  f"scale={W}:{H}")), SEG_END))
    i += 1

    total = sum(d for _, d in segs)
    print(f"{len(segs)} segments, {total:.2f}s on screen")

    # ---- dissolve the chain together --------------------------------------
    inputs = []
    for f, _ in segs:
        inputs += ["-i", f]
    parts = []
    cur = "0:v"
    acc = None
    for n in range(1, len(segs)):
        acc = segs[n - 1][1] if acc is None else acc + segs[n - 1][1]
        off = acc - XF
        lab = f"x{n}"
        parts.append(f"[{cur}][{n}:v]xfade=transition=fade:duration={XF}:offset={off:.4f}[{lab}]")
        cur = lab
    fc = ";".join(parts)
    run(["ffmpeg", "-v", "error", "-y"] + inputs +
        ["-filter_complex", fc, "-map", f"[{cur}]", "-an",
         "-c:v", "libx264", "-preset", "slow", "-crf", "17",
         "-pix_fmt", "yuv420p", "-r", str(FPS), "picture.mp4"])

    # ---- score and mux -----------------------------------------------------
    run([sys.executable, os.path.join(HERE, "score.py"), "score.wav", f"{total}"])
    run(["ffmpeg", "-v", "error", "-y", "-i", "picture.mp4", "-i", "score.wav",
         "-map", "0:v", "-map", "1:a", "-shortest",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
         "west-power-summit-v2.mp4"])
    print("wrote west-power-summit-v2.mp4")


if __name__ == "__main__":
    main()
