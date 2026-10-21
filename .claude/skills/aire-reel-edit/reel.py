#!/usr/bin/env python3
"""Edit a talking-head clip into an AiRE Estate reel, using only ffmpeg.

    reel.py edit IN.mp4 OUT.mp4 --script script.txt [--style kinetic|clean|card]
                [--title "What a drone shoot costs"] [--fit crop|pad] [--ai-label]
    reel.py cover IN.mp4 OUT.png --title "One photo.\\nOne drone flight." [--at 2.0] [--fit crop|pad]

edit   crops to 9:16 (1080x1920), applies the AiRE grade, and burns captions.
       Captions come from the script: the words are spread across the stretches
       where the speaker is talking (found with ffmpeg silencedetect), so the
       script should match what is said. No transcription service is used.
cover  saves one frame as a 1080x1920 cover with a title in AiRE colours.

Styles
  kinetic  two or three words at a time, big, current word in signal blue
  clean    one line at a time, lower third, white on a dark band
  card     clean captions plus a title card for the first 2.5 seconds
"""
import argparse, re, subprocess, sys, tempfile
from pathlib import Path

W, H = 1080, 1920
BLUE = "&H00F8BD38"   # #38bdf8 in ASS (AABBGGRR)
WHITE = "&H00FFFFFF"
BLUE_TAG, WHITE_TAG = "\\c&HF8BD38&", "\\c&HFFFFFF&"  # inline colour overrides
INK = "&H0D07040"     # #04070d with some transparency for boxes
FONT = "DejaVu Sans"  # Archivo is the brand face; DejaVu ships everywhere
FONT_FILE = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
GRADE = "eq=contrast=1.06:saturation=0.92:gamma=0.98,colorbalance=bs=0.04:bm=0.02"


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode:
        sys.exit(p.stderr[-2000:])
    return p


def duration(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
               "-of", "csv=p=0", str(path)]).stdout
    return float(out.strip())


def speech_spans(path, total):
    """Stretches of speech: everything that is not a silence of 0.35s or more."""
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af",
                          "silencedetect=noise=-32dB:d=0.35", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    spans, t = [], 0.0
    for s, e in zip(starts, ends + [total] * (len(starts) - len(ends))):
        if s - t > 0.2:
            spans.append((t, s))
        t = e
    if total - t > 0.2:
        spans.append((t, total))
    return spans or [(0.0, total)]


def time_words(words, spans):
    """Give each word a start and end, spread by character count over the spans."""
    talk = sum(e - s for s, e in spans)
    weight = [len(w) + 2 for w in words]
    per = talk / sum(weight)
    timed, i, used = [], 0, 0.0
    for s, e in spans:
        t = s
        while i < len(words) and (t + weight[i] * per <= e + 1e-6 or (s, e) == spans[-1]):
            d = weight[i] * per
            timed.append((words[i], t, t + d))
            t += d
            i += 1
    return timed


def ts(sec):
    h, rem = divmod(max(sec, 0), 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def ass(timed, style, title):
    margin_v = 520 if style == "kinetic" else 260
    size = 92 if style == "kinetic" else 60
    border = 1 if style == "kinetic" else 3  # 3 = opaque box behind the text
    head = f"""[Script Info]
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Alignment, MarginL, MarginR, MarginV, BorderStyle, Outline, Shadow
Style: Cap,{FONT},{size},{WHITE},&H00000000,{INK},1,2,80,80,{margin_v},{border},6,0
Style: Title,{FONT},96,{WHITE},&H00000000,{INK},1,5,90,90,0,3,28,0

[Events]
Format: Layer, Start, End, Style, Text
"""
    lines = []
    if style == "kinetic":
        for k in range(0, len(timed), 3):
            group = timed[k:k + 3]
            for j, (_, s, e) in enumerate(group):
                text = " ".join(
                    ("{" + BLUE_TAG + "}" + w.upper() + "{" + WHITE_TAG + "}") if n == j else w.upper()
                    for n, (w, _, _) in enumerate(group))
                pop = "{\\fscx108\\fscy108\\t(0,90,\\fscx100\\fscy100)}" if j == 0 else ""
                lines.append(f"Dialogue: 0,{ts(s)},{ts(e)},Cap,{pop}{text}")
    else:
        line, start = [], None
        for w, s, e in timed:
            start = s if start is None else start
            line.append(w)
            if len(" ".join(line)) > 26 or w[-1] in ".?!" or (w, s, e) == timed[-1]:
                lines.append(f"Dialogue: 0,{ts(start)},{ts(e)},Cap,{' '.join(line)}")
                line, start = [], None
    if title:
        lines.append(f"Dialogue: 1,{ts(0)},{ts(2.5)},Title,{{\\fad(150,250)}}{title}")
    return head + "\n".join(lines) + "\n"


def frame_9x16(fit):
    """crop fills the frame (talking heads); pad keeps the whole picture on a blurred fill."""
    if fit == "crop":
        return f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1"
    return (f"split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
            f"boxblur=40:2,eq=brightness=-0.12[bg];[b]scale={W}:{H}:force_original_aspect_ratio=decrease[fg];"
            f"[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1")


def edit(a):
    total = duration(a.input)
    words = Path(a.script).read_text(encoding="utf-8").split()
    timed = time_words(words, speech_spans(a.input, total))
    title = a.title.replace("\\n", "\\N") if a.style == "card" else None
    with tempfile.TemporaryDirectory() as d:
        sub = Path(d) / "caps.ass"
        sub.write_text(ass(timed, a.style, title), encoding="utf-8")
        vf = f"{frame_9x16(a.fit)},{GRADE},ass={sub}"
        if a.ai_label:
            vf += (f",drawtext=fontfile={FONT_FILE}:text='Made with AI':fontsize=34:"
                   "fontcolor=white@0.85:x=w-tw-48:y=120:box=1:boxcolor=0x04070d@0.6:boxborderw=14")
        run(["ffmpeg", "-y", "-hide_banner", "-i", str(a.input), "-vf", vf,
             "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(a.output)])
    print(f"wrote {a.output} ({total:.1f}s, {len(words)} words, style {a.style})")


def cover(a):
    title = a.title.replace("\\n", "\n").replace("\\", "\\\\").replace(":", "\\:").replace("'", "’")
    vf = (f"{frame_9x16(a.fit)},{GRADE},drawbox=y=ih*0.62:w=iw:h=ih*0.38:color=0x04070d@0.82:t=fill,"
          f"drawbox=x=90:y=ih*0.62+70:w=120:h=10:color=0x38bdf8:t=fill,"
          f"drawtext=fontfile={FONT_FILE}:text='{title}':fontsize=88:fontcolor=white:"
          f"x=90:y=h*0.62+120:line_spacing=18,"
          f"drawtext=fontfile={FONT_FILE}:text='learn.aireestate.com':fontsize=38:"
          f"fontcolor=0x38bdf8:x=90:y=h-170")
    run(["ffmpeg", "-y", "-hide_banner", "-ss", str(a.at), "-i", str(a.input),
         "-frames:v", "1", "-vf", vf, str(a.output)])
    print(f"wrote {a.output}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    e = sp.add_parser("edit")
    e.add_argument("input", type=Path)
    e.add_argument("output", type=Path)
    e.add_argument("--script", required=True, help="text file with exactly what is said")
    e.add_argument("--style", choices=["kinetic", "clean", "card"], default="kinetic")
    e.add_argument("--title", help="title card text (card style)")
    e.add_argument("--fit", choices=["crop", "pad"], default="crop",
                   help="pad when the clip is not vertical and has text near its edges")
    e.add_argument("--ai-label", action="store_true", help="add a 'Made with AI' tag")
    c = sp.add_parser("cover")
    c.add_argument("input", type=Path)
    c.add_argument("output", type=Path)
    c.add_argument("--title", required=True, help="use \\n for a line break")
    c.add_argument("--fit", choices=["crop", "pad"], default="crop")
    c.add_argument("--at", type=float, default=1.0, help="second to take the frame from")
    a = p.parse_args()
    if a.cmd == "edit" and a.style == "card" and not a.title:
        p.error("--style card needs --title")
    (edit if a.cmd == "edit" else cover)(a)


if __name__ == "__main__":
    main()
