"""Vail 3D trailer, vertical 9:16 (1080x1920) for Reels, TikTok and Shorts.
Reframes the same seven Higgsfield clips (no new generations). Text and the AI tag sit in
the zones the apps leave clear: below the top bar, above the caption area."""
import os, subprocess
from PIL import Image, ImageDraw, ImageFont

os.chdir(os.path.dirname(os.path.abspath(__file__)))
W, H, FPS, X = 1080, 1920, 30, 0.5
INK, SIG, TXT, DIM, FAINT = (4, 7, 13), (56, 189, 248), (236, 242, 250), (140, 155, 175), (90, 105, 125)
A = lambda s: ImageFont.truetype("Archivo.ttf", s)
M = lambda s: ImageFont.truetype("Manrope.ttf", s)
P = lambda s: ImageFont.truetype("IBMPlexMono.ttf", s)
SHOTS = "/tmp/claude-0/-home-user-Hello/c50d89cf-8d23-5f11-8425-ce4a2e60c0ba/scratchpad/shots/"

def run(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))

def card(draw_fn, out):
    im = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(im); draw_fn(im, d); im.save(out)

def kicker(d, x, y, t):
    d.ellipse((x, y + 10, x + 16, y + 26), fill=SIG); d.text((x + 30, y), t, font=P(32), fill=SIG)

def title(im, d):
    kicker(d, 90, 640, "VAIL MOUNTAIN  ·  COLORADO")
    d.text((84, 700), "Play the", font=A(150), fill=TXT)
    d.text((84, 860), "real", font=A(150), fill=TXT)
    d.text((84, 1020), "mountain.", font=A(150), fill=SIG)
    d.text((90, 1250), "True USGS elevation", font=M(44), fill=DIM)
    d.text((90, 1310), "283 named runs  ·  31 lifts", font=M(44), fill=DIM)

def proof(im, d):
    kicker(d, 90, 300, "THE GAME ITSELF  ·  NO AI IMAGERY")
    d.text((84, 355), "Real terrain.", font=A(96), fill=TXT)
    d.text((84, 460), "Real runs. Real lifts.", font=A(96), fill=TXT)
    for i, (f, lab) in enumerate([("aire-ride.png", "Tea Cup Bowl, on Chopstix"), ("9-map.png", "The trail map, from OpenStreetMap")]):
        s = Image.open(SHOTS + f).convert("RGB").resize((900, 506), Image.LANCZOS)
        y = 640 + i * 600
        im.paste(s, (90, y)); d.rectangle((89, y - 1, 990, y + 506), outline=(40, 55, 75), width=2)
        d.text((90, y + 520), lab, font=M(34), fill=DIM)

def end(im, d):
    kicker(d, 90, 680, "FREE IN YOUR BROWSER")
    d.text((84, 740), "Vail 3D", font=A(200), fill=TXT)
    d.text((90, 1000), "learn.aireestate.com", font=M(60), fill=SIG)
    d.text((90, 1075), "/vail-3d", font=M(60), fill=SIG)
    d.text((90, 1190), "Built in Claude Code by AiRE Estate", font=M(40), fill=DIM)
    d.text((90, 1500), "Not an official Vail Resorts map.", font=P(26), fill=FAINT)
    d.text((90, 1540), "AiRE Estate is independent of", font=P(26), fill=FAINT)
    d.text((90, 1580), "Vail Resorts and Anthropic.", font=P(26), fill=FAINT)

card(title, "v-title.png"); card(proof, "v-proof.png"); card(end, "v-end.png")

ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
t, f = "AI-GENERATED FOOTAGE", P(28); w = d.textlength(t, font=f)
d.rounded_rectangle((60, 250, 60 + w + 44, 306), radius=10, fill=(4, 7, 13, 170)); d.text((82, 259), t, font=f, fill=(200, 215, 230, 255))
ov.save("v-ai-label.png")

# horizontal centre of the action in each 1280x720 clip, as a fraction of width
FOCUS = {1: 0.5, 2: 0.47, 3: 0.5, 4: 0.52, 5: 0.5, 6: 0.55}

def vclip(i, out):
    cw = 720 * 9 / 16  # 405 px wide slice of the 720p source
    x = max(0, min(1280 - cw, FOCUS[i] * 1280 - cw / 2))
    run("-i", f"clip{i}.mp4", "-i", "v-ai-label.png", "-filter_complex",
        f"[0:v]crop={cw:.0f}:720:{x:.0f}:0,scale={W}:{H}:flags=lanczos,unsharp=5:5:0.6,fps={FPS},format=yuv420p[v];[v][1:v]overlay=0:0",
        "-an", "-c:v", "libx264", "-crf", "18", out)

def still(img, secs, out):
    run("-loop", "1", "-t", str(secs), "-i", img, "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-crf", "18", out)

segs = []
still("v-title.png", 3, "v0.mp4"); segs.append("v0.mp4")
for i in range(1, 6):
    vclip(i, f"v{i}.mp4"); segs.append(f"v{i}.mp4")
still("v-proof.png", 4.5, "v6.mp4"); segs.append("v6.mp4")
vclip(6, "v7.mp4"); segs.append("v7.mp4")
still("v-end.png", 4, "v8.mp4"); segs.append("v8.mp4")

parts, prev, t = [], "[0:v]", 0.0
for i in range(1, len(segs)):
    t += dur(segs[i - 1]) - X
    out = "[vout]" if i == len(segs) - 1 else f"[x{i}]"
    parts.append(f"{prev}[{i}:v]xfade=transition=fade:duration={X}:offset={t:.3f}{out}")
    prev = out
inputs = sum((["-i", s] for s in segs), [])
run(*inputs, "-filter_complex", ";".join(parts), "-map", "[vout]", "-c:v", "libx264", "-crf", "19",
    "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "vail-3d-trailer-9x16.mp4")
print("vertical trailer", round(dur("vail-3d-trailer-9x16.mp4"), 1), "s")
