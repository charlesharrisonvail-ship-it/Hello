"""Vail 3D reel, 1080x1920 30fps: real gameplay frames + AiRE Estate captions + end card.
Captions sit on dark glass panels in the empty snow below the rider, clear of the HUD at the
top, the minimap and app buttons at the bottom, and the app's icon column on the right."""
import os, subprocess
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FR = os.path.join(HERE, "raw", "reel-frames")  # written by reel_capture.js
FONTS = os.path.join(HERE, "fonts")  # Archivo, Manrope, IBM Plex Mono (Google Fonts, OFL)
os.chdir(HERE)
W, H, FPS = 1080, 1920, 30
INK, SIG, TXT, DIM = (4, 7, 13), (56, 189, 248), (240, 245, 252), (150, 165, 185)
A = lambda s: ImageFont.truetype(os.path.join(FONTS, "Archivo.ttf"), s)
M = lambda s: ImageFont.truetype(os.path.join(FONTS, "Manrope.ttf"), s)
P = lambda s: ImageFont.truetype(os.path.join(FONTS, "IBMPlexMono.ttf"), s)

def run(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)

def caption(name, title, sub=None, y=1180):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    tf, sf = A(78), M(40)
    lines = title.split("\n")
    tw = max(d.textlength(l, font=tf) for l in lines)
    sw = d.textlength(sub, font=sf) if sub else 0
    w = int(max(tw, sw)) + 96
    h = 60 + len(lines) * 92 + (62 if sub else 0)
    d.rounded_rectangle((60, y, 60 + w, y + h), radius=26, fill=(4, 7, 13, 205), outline=(255, 255, 255, 40), width=2)
    d.rectangle((60, y + 30, 68, y + h - 30), fill=SIG + (255,))
    for i, l in enumerate(lines):
        d.text((108, y + 28 + i * 92), l, font=tf, fill=TXT)
    if sub:
        d.text((110, y + 40 + len(lines) * 92), sub, font=sf, fill=SIG)
    im.save(name)

def tag(name):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    t, f = "REAL GAMEPLAY  ·  NOT AI VIDEO", P(28); w = d.textlength(t, font=f)
    d.rounded_rectangle((36, 228, 36 + w + 44, 284), radius=12, fill=(4, 7, 13, 190))
    d.ellipse((52, 249, 64, 261), fill=(255, 69, 58, 255))
    d.text((74, 237), t, font=f, fill=(225, 232, 242, 255))
    im.save(name)

def end_card(name):
    im = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(im)
    d.ellipse((90, 700, 106, 716), fill=SIG); d.text((122, 690), "FREE IN YOUR BROWSER", font=P(32), fill=SIG)
    d.text((84, 740), "Vail 3D", font=A(210), fill=TXT)
    d.text((90, 1010), "learn.aireestate.com", font=M(62), fill=SIG)
    d.text((90, 1086), "/vail-3d", font=M(62), fill=SIG)
    d.text((90, 1210), "Built in Claude Code by AiRE Estate", font=M(42), fill=DIM)
    for i, l in enumerate(["Not an official Vail Resorts map.", "AiRE Estate is independent of", "Vail Resorts and Anthropic."]):
        d.text((90, 1520 + i * 42), l, font=P(26), fill=(90, 105, 125))
    im.save(name)

caption("c0.png", "We built Vail Mountain\nas a video game.", "With AI, in a browser", y=1120)
caption("c1.png", "Real USGS elevation.", "Every ridge where it really is")
caption("c2.png", "283 named runs.\n31 lifts.", "Mapped from open data")
caption("c3.png", "Ride the real lifts.")
caption("c4.png", "Free to play.\nNo download.")
caption("c5.png", "Front Side · Back Bowls\n· Blue Sky Basin", y=1380)
tag("tag.png"); end_card("end.png")

def seg(shot, cap, out, show_tag=True):
    """frames -> clip, caption fading in at 0.25 s, the gameplay tag throughout"""
    inputs = ["-framerate", str(FPS), "-i", os.path.join(FR, shot, "%04d.jpg"), "-loop", "1", "-i", cap]
    flt = f"[0:v]scale={W}:{H},format=yuva420p[b];[1:v]format=rgba,fade=in:st=0.25:d=0.35:alpha=1[c];[b][c]overlay=0:0:shortest=1[v1]"
    if show_tag:
        inputs += ["-loop", "1", "-i", "tag.png"]; flt += ";[v1][2:v]overlay=0:0:shortest=1[v]"
    else:
        flt = flt.replace("[v1]", "[v]")
    run(*inputs, "-filter_complex", flt, "-map", "[v]", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), out)

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))

seg("flyover", "c0.png", "s0.mp4")
seg("board", "c1.png", "s1.mp4")
seg("ski", "c2.png", "s2.mp4")
seg("lift", "c3.png", "s3.mp4")
seg("air", "c4.png", "s4.mp4")
# trail map: a slow push-in on the real map screen
run("-loop", "1", "-i", os.path.join(FR, "map", "0000.jpg"), "-loop", "1", "-i", "c5.png", "-loop", "1", "-i", "tag.png", "-filter_complex",
    f"[0:v]scale=2160:3840,zoompan=z='1+0.0016*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=90:s={W}x{H}:fps={FPS},format=yuva420p[b];"
    "[1:v]format=rgba,fade=in:st=0.25:d=0.35:alpha=1[c];[b][c]overlay=0:0:shortest=1[v1];[v1][2:v]overlay=0:0:shortest=1[v]",
    "-map", "[v]", "-t", "3", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "s5.mp4")
run("-loop", "1", "-t", "3.5", "-i", "end.png", "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-crf", "18", "s6.mp4")

segs = [f"s{i}.mp4" for i in range(7)]
X, t, parts, prev = 0.35, 0.0, [], "[0:v]"
for i in range(1, len(segs)):
    t += dur(segs[i - 1]) - X
    out = "[vout]" if i == len(segs) - 1 else f"[x{i}]"
    parts.append(f"{prev}[{i}:v]xfade=transition=fade:duration={X}:offset={t:.3f}{out}")
    prev = out
run(*sum((["-i", s] for s in segs), []), "-filter_complex", ";".join(parts), "-map", "[vout]", "-c:v", "libx264", "-crf", "19",
    "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "vail-3d-reel.mp4")
print("reel", round(dur("vail-3d-reel.mp4"), 1), "s")
