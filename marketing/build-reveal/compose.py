"""Build the AiRE Estate "build reveal" Reel: the finished photo on the left,
the AI clip on the right, brand labels around them. 1080x1920, text kept out of
the top and bottom 250 px. Free: needs only ffmpeg.

    python3 compose.py PHOTO CLIP OUT.mp4 [--seconds 12]

PHOTO is the finished-property still the clip ends on; CLIP is the generated
video (any size, it is cropped to fill the panel). No prompt text is drawn:
AiRE shows the result, not the recipe.
"""
import argparse
import os
import shutil
import subprocess
import sys

BG = "0x04070d"
PANEL = "0x0d1524"
BLUE = "0x38bdf8"
WHITE = "0xffffff"
BODY = "0xdbe2ec"
MUTED = "0x8496b2"

# Brand fonts first; DejaVu ships with most Linux boxes; Arial for Windows.
FONT_CANDIDATES = {
    "head": ["Archivo-Black.ttf", "Archivo-ExtraBold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"],
    "body": ["Manrope-SemiBold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "C:/Windows/Fonts/arial.ttf"],
    "mono": ["IBMPlexMono-Medium.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "C:/Windows/Fonts/consola.ttf"],
}


def font(kind):
    here = os.path.dirname(os.path.abspath(__file__))
    for name in FONT_CANDIDATES[kind]:
        for path in (os.path.join(here, "fonts", name), name):
            if os.path.isfile(path):
                # ffmpeg wants forward slashes and an escaped drive colon
                return path.replace("\\", "/").replace(":", "\\:")
    sys.exit(f"No {kind} font found; put one in marketing/build-reveal/fonts/")


def text(s, kind, size, color, x, y, spacing=0):
    s = s.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\u2019")
    return (f"drawtext=fontfile='{font(kind)}':text='{s}':fontsize={size}:"
            f"fontcolor={color}:x={x}:y={y}" + (f":line_spacing={spacing}" if spacing else ""))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("photo")
    ap.add_argument("clip")
    ap.add_argument("out")
    ap.add_argument("--seconds", type=float, default=12)
    ap.add_argument("--headline", default="One photo in.")
    ap.add_argument("--offer", default="AiRE Estate")
    a = ap.parse_args()
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not found on PATH")

    # Right panel: the clip, 600x1066 (9:16), rounded look via a 4px blue frame.
    vx, vy, vw, vh = 420, 380, 600, 1066
    # Left column: the photo, 330x440.
    px, py, pw, ph = 60, 700, 330, 440

    labels = ",".join([
        text("MADE WITH AI  \u00b7  DEMONSTRATION", "mono", 26, MUTED, 60, 262),
        text(a.headline, "head", 64, WHITE, 60, 300),
        text("THE PHOTO", "mono", 26, BLUE, px, py - 50),
        text("+", "head", 72, WHITE, px + pw / 2 - 20, py + ph + 30),
        text("AiRE Estate", "head", 40, WHITE, px, py + ph + 130),
        text("method", "body", 34, BODY, px, py + ph + 182),
        text("Not a real listing.", "body", 26, MUTED, px, py + ph + 260),
        text(a.offer, "head", 46, WHITE, 60, 1500),
        text("learn.aireestate.com", "mono", 32, BLUE, 60, 1572),
    ])

    graph = (
        f"color=c={BG}:s=1080x1920:d={a.seconds}:r=30[bg];"
        f"[0:v]scale={pw}:{ph}:force_original_aspect_ratio=increase,crop={pw}:{ph},"
        f"pad={pw + 8}:{ph + 8}:4:4:color={PANEL}[ph];"
        f"[1:v]fps=30,scale={vw}:{vh}:force_original_aspect_ratio=increase,crop={vw}:{vh},"
        f"pad={vw + 8}:{vh + 8}:4:4:color={BLUE},setpts=PTS-STARTPTS[vid];"
        f"[bg][ph]overlay={px - 4}:{py - 4}[a];"
        f"[a][vid]overlay={vx - 4}:{vy - 4}:eof_action=repeat[b];"
        f"[b]{labels},format=yuv420p[out]"
    )
    cmd = ["ffmpeg", "-y", "-loop", "1", "-i", a.photo, "-i", a.clip,
           "-filter_complex", graph, "-map", "[out]", "-t", str(a.seconds),
           "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-movflags", "+faststart", a.out]
    subprocess.run(cmd, check=True)
    print("wrote", a.out)


if __name__ == "__main__":
    main()
