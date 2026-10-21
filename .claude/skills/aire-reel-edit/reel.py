#!/usr/bin/env python3
"""Edit a clip into an AiRE Estate reel, using only ffmpeg.

    reel.py edit IN.mp4 OUT.mp4 --script said.txt [--style STYLE]
                [--title "What a drone\\nshoot costs"] [--handle aireestate]
                [--fit crop|pad] [--ai-label]
    reel.py cover IN.mp4 OUT.png --title "One photo.\\nOne drone flight."
                [--look bar|glow|split] [--at 2.0] [--fit crop|pad]
    reel.py styles

edit   frames the clip 9:16 (1080x1920), grades it, and burns captions. Captions
       come from the script: its words are spread over the stretches where the
       speaker is talking (ffmpeg silencedetect). The script must match what is
       said. Wrap a word in *stars* to make it a big callout in the motion style.
cover  saves one frame as a 1080x1920 cover with a title in AiRE colours.
"""
import argparse, re, subprocess, sys, tempfile
from pathlib import Path

W, H = 1080, 1920
FONT, MONO = "DejaVu Sans", "DejaVu Sans Mono"  # Archivo and Plex Mono are the brand faces
FONT_FILE = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MONO_FILE = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

# ASS colours are &HAABBGGRR; inline tags are &HBBGGRR&
WHITE, INK, PAPER = "&H00FFFFFF", "&H2004070D", "&H00F9F5F1"
TAG = {"blue": "&HF8BD38&", "rasp": "&H733AD6&", "white": "&HFFFFFF&", "ink": "&H0D0704&"}

GRADES = {
    "aire": "eq=contrast=1.06:saturation=0.92:gamma=0.98,colorbalance=bs=0.04:bm=0.02",
    "rasp": "hue=s=0,lutrgb=r='val*0.78+42':g='val*0.42+6':b='val*0.52+22'",
    "pastel": "eq=contrast=0.86:brightness=0.06:saturation=0.72,colorbalance=bs=0.08:bm=0.05:rh=0.03",
    "night": "eq=contrast=1.15:brightness=-0.05:saturation=0.8,vignette=PI/4",
}

# Each style: grade, caption mode (words or lines), size, distance from the
# bottom, highlight colour, and whether captions sit on a box. The name in
# [brackets] is the look in Mohammed Farshan's pack it stands in for.
STYLES = {
    "kinetic":  dict(grade="aire",   mode="words", size=92, margin=520, hi="blue",
                     about="big words, current one in blue  [kinetic-talking-head-edit]"),
    "clean":    dict(grade="aire",   mode="lines", size=60, margin=260, box=True,
                     about="one line on a dark band, lower third"),
    "card":     dict(grade="aire",   mode="lines", size=60, margin=260, box=True,
                     about="clean, plus a title card for 2.5s  (needs --title)"),
    "podcast":  dict(grade="aire",   mode="lines", size=58, margin=300, box=True,
                     about="clean, live sound wave and an AiRE ESTATE label  [podcast-reel-edit]"),
    "iphone":   dict(grade="aire",   mode="lines", size=54, margin=250, box=True,
                     about="clip inside a rounded phone screen  [iphone-style]"),
    "collage":  dict(grade="rasp",   mode="words", size=92, margin=430, hi="blue",
                     about="raspberry tint, tilted photo tiles, kinetic words  [red-kinetic-collage-edit]"),
    "pastel":   dict(grade="pastel", mode="lines", size=58, margin=300, box=True, light=True,
                     about="soft pastel grade, dark words on a light pill  [pastel-reel-edit]"),
    "timeline": dict(grade="night",  mode="words", size=88, margin=520, hi="rasp",
                     about="dark grade, chapter counter, filling progress bar  [dark-timeline-motion-graphics]"),
    "igui":     dict(grade="aire",   mode="words", size=84, margin=760, hi="blue",
                     about="Instagram-style overlay with your handle  [instagram-ui]  (--handle)"),
    "motion":   dict(grade="aire",   mode="words", size=84, margin=460, hi="blue",
                     about="kinetic words plus big animated number callouts  [motion-graphics]"),
}
COVERS = {
    "bar":   "frame on top, dark band and title below  [farshans-cover]",
    "glow":  "blurred frame, glowing centred title  [glow-card-reel-cover]",
    "split": "frame on top, huge two-colour title on black  [knc-reel-cover]",
}


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode:
        sys.exit(p.stderr[-2500:])
    return p


def probe(path, entry):
    return run(["ffprobe", "-v", "error", "-show_entries", entry, "-of", "csv=p=0",
                str(path)]).stdout.strip()


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
    timed, i = [], 0
    for s, e in spans:
        t = s
        while i < len(words) and (t + weight[i] * per <= e + 1e-6 or (s, e) == spans[-1]):
            d = weight[i] * per
            timed.append((words[i], t, t + d))
            t += d
            i += 1
    return timed


def sentence_starts(plain):
    starts, new = [], True
    for w, s, _ in plain:
        if new:
            starts.append(s)
        new = w[-1] in ".?!"
    return starts


def ts(sec):
    h, rem = divmod(max(sec, 0), 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def ass_doc(styles, events):
    return (f"[Script Info]\nPlayResX: {W}\nPlayResY: {H}\nWrapStyle: 0\n\n[V4+ Styles]\n"
            "Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, "
            "Alignment, MarginL, MarginR, MarginV, BorderStyle, Outline, Shadow\n"
            + "".join(f"Style: {s}\n" for s in styles)
            + "\n[Events]\nFormat: Layer, Start, End, Style, Text\n"
            + "".join(f"Dialogue: {e}\n" for e in events))


def captions(timed, name, title, total):
    st = STYLES[name]
    light, box = st.get("light"), st.get("box")
    styles = [
        f"Cap,{FONT},{st['size']},{'&H000D0704' if light else WHITE},"
        f"{(PAPER if light else INK) if box else '&H00000000'},&H00000000,1,2,80,80,{st['margin']},"
        f"{3 if box else 1},{14 if box else 6},0",
        f"Title,{FONT},96,{WHITE},{INK},&H00000000,1,5,90,90,0,3,28,0",
        f"Call,{FONT},230,&H00F8BD38,&H0004070D,&H00000000,1,5,60,60,0,1,10,0",
        f"Label,{MONO},34,&H00F8BD38,&H6004070D,&H00000000,0,7,60,60,110,3,12,0",
    ]
    plain = [(w.strip("*"), s, e) for w, s, e in timed]
    ev = []
    if st["mode"] == "words":
        hi, back = "{\\c" + TAG[st["hi"]] + "}", "{\\c" + TAG["white"] + "}"
        for k in range(0, len(plain), 3):
            group = plain[k:k + 3]
            for j, (_, s, e) in enumerate(group):
                words = " ".join(hi + w.upper() + back if n == j else w.upper()
                                 for n, (w, _, _) in enumerate(group))
                pop = "{\\fscx108\\fscy108\\t(0,90,\\fscx100\\fscy100)}" if j == 0 else ""
                ev.append(f"0,{ts(s)},{ts(e)},Cap,{pop}{words}")
    else:
        line, start = [], None
        for w, s, e in plain:
            start = s if start is None else start
            line.append(w)
            if len(" ".join(line)) > 26 or w[-1] in ".?!" or (w, s, e) == plain[-1]:
                ev.append(f"0,{ts(start)},{ts(e)},Cap,{' '.join(line)}")
                line, start = [], None
    if name == "card":
        ev.append(f"1,{ts(0)},{ts(2.5)},Title,{{\\fad(150,250)}}{title}")
    if name == "podcast":
        label = (title or "Straight talk").replace("\\N", " ").upper()
        ev.append(f"1,{ts(0)},{ts(total)},Label,AiRE ESTATE  ·  {label}")
    if name == "timeline":
        chapters = sentence_starts(plain)
        for n, s in enumerate(chapters):
            e = chapters[n + 1] if n + 1 < len(chapters) else total
            ev.append(f"1,{ts(s)},{ts(e)},Label,{{\\fad(120,0)}}{n + 1:02d} / {len(chapters):02d}")
    if name == "motion":
        for w, s, _ in timed:
            if (w.startswith("*") and w.endswith("*")) or re.search(r"[\d$%]", w):
                word = w.strip("*").rstrip(".,!?;:")
                ev.append(f"2,{ts(s)},{ts(s + 1.3)},Call,{{\\move(540,1120,540,760,0,220)"
                          f"\\fad(80,200)\\fscx70\\fscy70\\t(0,220,\\fscx100\\fscy100)}}{word}")
    return ass_doc(styles, ev)


def frame(fit):
    """crop fills the frame (talking heads); pad keeps the whole picture on a blurred fill."""
    if fit == "crop":
        return f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1"
    return (f"split[pa][pb];[pa]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
            f"boxblur=40:2,eq=brightness=-0.12[pbg];[pb]scale={W}:{H}:force_original_aspect_ratio=decrease[pfg];"
            f"[pbg][pfg]overlay=(W-w)/2:(H-h)/2,setsar=1")


def esc(s):
    """Text for drawtext."""
    return s.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


def style_graph(name, total, d, handle, chapters):
    """Filters from the graded frame [v0] to [v1], where captions go on."""
    if name == "podcast":
        return ("[0:a]showwaves=s=960x150:mode=cline:scale=sqrt:draw=full:colors=#38bdf8:rate=30,"
                "format=yuva420p[wav];[v0]drawbox=x=0:y=ih-240:w=iw:h=210:color=0x04070d@0.7:t=fill[vb];"
                "[vb][wav]overlay=60:H-210:shortest=1[v1]")
    if name == "iphone":
        from PIL import Image, ImageDraw
        pw, ph = 880, 1564
        mask = Image.new("L", (pw, ph), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, pw - 1, ph - 1), radius=70, fill=255)
        mask.save(Path(d) / "mask.png")
        # status bar above the picture, so the clock and notch never cover a face
        return (f"[v0]scale={pw}:{ph - 90},pad={pw}:{ph}:0:90:black,"
                f"drawbox=x=(iw-200)/2:y=22:w=200:h=44:color=0x1b2433:t=fill,"
                f"drawtext=fontfile={FONT_FILE}:text='9\\:41':fontsize=34:fontcolor=white:x=60:y=28,"
                f"format=rgba[scr];[1:v]format=gray[m];[scr][m]alphamerge[phr];"
                f"color=c=0x04070d:s={W}x{H}:d={total:.3f}[bg];"
                f"[bg][phr]overlay=(W-w)/2:200:shortest=1,"
                f"drawtext=fontfile={MONO_FILE}:text='AiRE ESTATE':fontsize=32:fontcolor=0x38bdf8:"
                f"x=(w-tw)/2:y=110[v1]")
    if name == "collage":
        return ("[v0]split=3[ca][cb][cc];"
                "[ca]scale=1404:2496,crop=1080:1920,boxblur=24:2,eq=brightness=-0.18[cbg];"
                "[cb]scale=780:-2,pad=iw+28:ih+28:14:14:white,format=rgba,"
                "rotate=-3*PI/180:ow=rotw(iw):oh=roth(ih):c=none[t1];"
                "[cc]crop=iw*0.6:ih*0.3:iw*0.2:ih*0.15,scale=440:-2,pad=iw+20:ih+20:10:10:white,format=rgba,"
                "rotate=5*PI/180:ow=rotw(iw):oh=roth(ih):c=none[t2];"
                "[cbg][t1]overlay=(W-w)/2:(H-h)/2-60[c1];[c1][t2]overlay=W-w-30:110[v1]")
    if name == "timeline":
        ticks = ",".join(f"drawbox=x={int(W * s / total)}:y=ih-28:w=4:h=28:color=white@0.85:t=fill"
                         for s in chapters[1:]) or "null"
        return (f"color=c=0xd63a73:s={W}x16:d={total:.3f}[bar];"
                f"[v0]drawbox=x=0:y=ih-16:w=iw:h=16:color=white@0.15:t=fill,{ticks}[vt];"
                f"[vt][bar]overlay=x='-W+W*t/{total:.3f}':y=H-16:shortest=1[v1]")
    if name == "igui":
        icons = "".join(f"drawtext=fontfile={FONT_FILE}:text='{c}':fontsize=64:fontcolor=white:"
                        f"x=w-110:y={y}:shadowcolor=black@0.5:shadowx=2:shadowy=2,"
                        for c, y in (("♥", 1180), ("✉", 1320), ("➤", 1460), ("⋯", 1600)))
        return (f"[v0]drawbox=x=0:y=ih-520:w=iw:h=520:color=black@0.35:t=fill,{icons}"
                f"drawtext=fontfile={FONT_FILE}:text='{esc('@' + handle.lstrip('@'))}':fontsize=42:"
                f"fontcolor=white:x=48:y=h-330,"
                f"drawtext=fontfile={FONT_FILE}:text='Real estate courses for working agents':fontsize=36:"
                f"fontcolor=white@0.92:x=48:y=h-260,"
                f"drawtext=fontfile={FONT_FILE}:text='♫  Original audio  ·  AiRE Estate':fontsize=32:"
                f"fontcolor=white@0.85:x=48:y=h-195[v1]")
    return "[v0]null[v1]"


def edit(a):
    total = float(probe(a.input, "format=duration"))
    if a.style == "podcast" and "audio" not in probe(a.input, "stream=codec_type"):
        sys.exit("the podcast style needs a clip with sound")
    words = Path(a.script).read_text(encoding="utf-8").split()
    timed = time_words(words, speech_spans(a.input, total))
    title = a.title.replace("\\n", "\\N") if a.title else None
    chapters = sentence_starts([(w.strip("*"), s, e) for w, s, e in timed])
    with tempfile.TemporaryDirectory() as d:
        sub = Path(d) / "caps.ass"
        sub.write_text(captions(timed, a.style, title, total), encoding="utf-8")
        graph = (f"[0:v]{frame(a.fit)},{GRADES[STYLES[a.style]['grade']]}[v0];"
                 f"{style_graph(a.style, total, d, a.handle, chapters)};[v1]ass={sub}")
        if a.ai_label:
            graph += (f",drawtext=fontfile={FONT_FILE}:text='Made with AI':fontsize=34:"
                      "fontcolor=white@0.85:x=w-tw-48:y=120:box=1:boxcolor=0x04070d@0.6:boxborderw=14")
        inputs = ["-i", str(a.input)]
        if a.style == "iphone":
            inputs += ["-loop", "1", "-i", str(Path(d) / "mask.png")]
        run(["ffmpeg", "-y", "-hide_banner", *inputs, "-filter_complex", graph + "[out]",
             "-map", "[out]", "-map", "0:a?", "-t", f"{total:.3f}",
             "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(a.output)])
    print(f"wrote {a.output} ({total:.1f}s, {len(words)} words, style {a.style})")


def fit_size(lines, size, width):
    """Shrink a title until its longest line fits the width (DejaVu Bold is ~0.62em a letter)."""
    return min(size, int(width / (0.62 * max(len(ln) for ln in lines))))


def cover(a):
    lines = a.title.split("\\n")
    body = "\\N".join(lines)
    base = f"{frame(a.fit)},{GRADES['aire']}"
    if a.look == "bar":
        vf = (f"{base},drawbox=y=ih*0.62:w=iw:h=ih*0.38:color=0x04070d@0.82:t=fill,"
              f"drawbox=x=90:y=ih*0.62+70:w=120:h=10:color=0x38bdf8:t=fill")
        styles = [f"T,{FONT},{fit_size(lines, 88, 900)},{WHITE},&H00000000,&H00000000,1,7,90,90,0,1,0,0",
                  f"U,{MONO},38,&H00F8BD38,&H00000000,&H00000000,0,1,90,90,130,1,0,0"]
        ev = [f"0,0:00:00.00,0:00:09.00,T,{{\\pos(90,1312)}}{body}",
              "0,0:00:00.00,0:00:09.00,U,learn.aireestate.com"]
    elif a.look == "glow":
        vf = (f"{base},boxblur=18:2,eq=brightness=-0.22,"
              f"drawbox=x=90:y=640:w=900:h=640:color=0x04070d@0.7:t=fill,"
              f"drawbox=x=90:y=640:w=900:h=640:color=0x38bdf8@0.9:t=5")
        gs = fit_size(lines, 100, 820)
        styles = [f"G,{FONT},{gs},&H00F8BD38,&H00F8BD38,&H00000000,1,5,120,120,0,1,10,0",
                  f"T,{FONT},{gs},{WHITE},&H00000000,&H00000000,1,5,120,120,0,1,0,0",
                  f"U,{MONO},36,&H00F8BD38,&H00000000,&H00000000,0,2,90,90,180,1,0,0"]
        ev = [f"0,0:00:00.00,0:00:09.00,G,{{\\pos(540,960)\\blur18}}{body}",
              f"1,0:00:00.00,0:00:09.00,T,{{\\pos(540,960)}}{body}",
              "1,0:00:00.00,0:00:09.00,U,AiRE ESTATE  ·  learn.aireestate.com"]
    else:  # split
        vf = (f"{base},drawbox=y=ih*0.56:w=iw:h=ih*0.44:color=0x04070d:t=fill,"
              f"drawbox=y=ih*0.56:w=iw:h=8:color=0x38bdf8:t=fill")
        ss = fit_size(lines, 128, 940)
        styles = [f"A,{FONT},{ss},{WHITE},&H00000000,&H00000000,1,7,70,70,0,1,0,0",
                  f"B,{FONT},{ss},&H00F8BD38,&H00000000,&H00000000,1,7,70,70,0,1,0,0",
                  f"U,{MONO},36,&H00B29684,&H00000000,&H00000000,0,7,70,70,0,1,0,0"]
        ev = ["0,0:00:00.00,0:00:09.00,U,{\\pos(70,1130)}AiRE ESTATE"]
        for n, ln in enumerate(lines[:3]):
            ev.append(f"0,0:00:00.00,0:00:09.00,{'A' if n == 0 else 'B'},{{\\pos(70,{1200 + n * int(ss * 1.25)})}}{ln}")
    with tempfile.TemporaryDirectory() as d:
        sub = Path(d) / "cover.ass"
        sub.write_text(ass_doc(styles, ev), encoding="utf-8")
        run(["ffmpeg", "-y", "-hide_banner", "-ss", str(a.at), "-i", str(a.input),
             "-frames:v", "1", "-vf", f"{vf},setpts=PTS-STARTPTS,ass={sub}", str(a.output)])
    print(f"wrote {a.output} (look {a.look})")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    e = sp.add_parser("edit")
    e.add_argument("input", type=Path)
    e.add_argument("output", type=Path)
    e.add_argument("--script", required=True, help="text file with exactly what is said")
    e.add_argument("--style", choices=list(STYLES), default="kinetic")
    e.add_argument("--title", help="title card (card) or label (podcast); \\n breaks a line")
    e.add_argument("--handle", default="aireestate", help="handle the igui style shows")
    e.add_argument("--fit", choices=["crop", "pad"], default="crop",
                   help="pad when the clip is not vertical and has text near its edges")
    e.add_argument("--ai-label", action="store_true", help="add a 'Made with AI' tag")
    c = sp.add_parser("cover")
    c.add_argument("input", type=Path)
    c.add_argument("output", type=Path)
    c.add_argument("--title", required=True, help="\\n breaks a line")
    c.add_argument("--look", choices=list(COVERS), default="bar")
    c.add_argument("--fit", choices=["crop", "pad"], default="crop")
    c.add_argument("--at", type=float, default=1.0, help="second to take the frame from")
    sp.add_parser("styles")
    a = p.parse_args()
    if a.cmd == "styles":
        for k, v in STYLES.items():
            print(f"edit   {k:9} {v['about']}")
        for k, v in COVERS.items():
            print(f"cover  {k:9} {v}")
        return
    if a.cmd == "edit" and a.style == "card" and not a.title:
        p.error("--style card needs --title")
    (edit if a.cmd == "edit" else cover)(a)


if __name__ == "__main__":
    main()
