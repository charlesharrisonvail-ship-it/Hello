"""Vail 3D trailer: cards + Higgsfield clips, 1920x1080 30fps, 0.5 s crossfades.
AI clips carry the "AI-generated footage" tag; the cards and the real-game beat do not.
Also writes the 10 s homepage loop (MP4 + WebM + poster)."""
import os, subprocess

os.chdir(os.path.dirname(os.path.abspath(__file__)))
FPS, X = 30, 0.5
SCALE = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p"

def run(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))

def clip(src, out, label=True):
    if label:
        run("-i", src, "-i", "ai-label.png", "-filter_complex", f"[0:v]{SCALE}[v];[v][1:v]overlay=0:0",
            "-an", "-c:v", "libx264", "-crf", "18", out)
    else:
        run("-i", src, "-vf", SCALE, "-an", "-c:v", "libx264", "-crf", "18", out)

def still(img, secs, out):
    run("-loop", "1", "-t", str(secs), "-i", img, "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-crf", "18", out)

segs = []
still("card-title.png", 3.5, "s0.mp4"); segs.append("s0.mp4")
for i in range(1, 6):
    clip(f"clip{i}.mp4", f"s{i}.mp4"); segs.append(f"s{i}.mp4")
still("card-proof.png", 4.5, "s6.mp4"); segs.append("s6.mp4")
clip("clip6.mp4", "s7.mp4"); segs.append("s7.mp4")
still("card-end.png", 4, "s8.mp4"); segs.append("s8.mp4")

parts, prev, t = [], "[0:v]", 0.0
for i in range(1, len(segs)):
    t += dur(segs[i - 1]) - X           # each crossfade starts X seconds before the previous segment ends
    out = "[vout]" if i == len(segs) - 1 else f"[x{i}]"
    parts.append(f"{prev}[{i}:v]xfade=transition=fade:duration={X}:offset={t:.3f}{out}")
    prev = out
inputs = sum((["-i", s] for s in segs), [])
run(*inputs, "-filter_complex", ";".join(parts), "-map", "[vout]", "-c:v", "libx264", "-crf", "19",
    "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "vail-3d-trailer.mp4")
print("trailer", round(dur("vail-3d-trailer.mp4"), 1), "s")

# homepage loop: fold the last second over the first so it loops without a jump
d = dur("clip0.mp4")
run("-i", "clip0.mp4", "-i", "clip0.mp4", "-i", "ai-label.png", "-filter_complex",
    f"[0:v]{SCALE},trim=1:{d},setpts=PTS-STARTPTS[a];[1:v]{SCALE},trim=0:1,setpts=PTS-STARTPTS[b];"
    f"[a][b]xfade=transition=fade:duration=1:offset={d - 2:.3f}[l];[l][2:v]overlay=0:0",
    "-an", "-c:v", "libx264", "-crf", "21", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "vail-3d-loop.mp4")
run("-i", "vail-3d-loop.mp4", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-an", "vail-3d-loop.webm")
run("-i", "vail-3d-loop.mp4", "-frames:v", "1", "-q:v", "3", "vail-3d-loop-poster.jpg")
print("loop", round(dur("vail-3d-loop.mp4"), 1), "s")
