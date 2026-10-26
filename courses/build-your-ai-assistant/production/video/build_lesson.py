#!/usr/bin/env python3
"""Build the HyperFrames project for one lesson: narration avatar on the right, on-screen
beats on the left, each beat timed to its narration paragraph.

    python3 build_lesson.py <beats_module> <module_label> <avatar.mp4> <script.txt> <out_dir> [starts.json]
                            [--visuals M2 --images <dir with 201.png, 202.png ...>] [--course "COURSE NAME"]
                            [--full] [--captions transcript.json]
    e.g. python3 build_lesson.py beats_m2 "MODULE 2" avatar.mp4 m2-script.txt out/m2 m2-starts.json --visuals M2 --images imgs

Paragraph start times come from starts.json (exact, from the narration timings) or,
without it, are spread across the narration in proportion to word count.
With --visuals, each beat gets its image from images.py: a photo backdrop with a slow
push-in, or a hand-drawn sketch card (which replaces the beat's text) that draws in.
"""
import json, re, shutil, subprocess, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import importlib

VIS, IMGS, COURSE, FULL, CAPS = {}, None, "BUILD YOUR AI ASSISTANT", False, None
if "--full" in sys.argv:  # narrator-only lesson (AiRE): no presenter on screen, slides use the full width
    sys.argv.remove("--full"); FULL = True
if "--captions" in sys.argv:  # word timings (hyperframes transcribe JSON) -> on-screen captions
    k = sys.argv.index("--captions"); CAPS = Path(sys.argv[k + 1]); del sys.argv[k:k + 2]
if "--course" in sys.argv:
    k = sys.argv.index("--course"); COURSE = sys.argv[k + 1]; del sys.argv[k:k + 2]
if "--visuals" in sys.argv:
    k = sys.argv.index("--visuals"); key = sys.argv[k + 1]; del sys.argv[k:k + 2]
    k = sys.argv.index("--images"); IMGS = Path(sys.argv[k + 1]); del sys.argv[k:k + 2]
    images = importlib.import_module("images")
    VIS = {b: (kind, images.CAPTIONS.get((key, b), "")) for b, (kind, _) in getattr(images, key).items()}
    base = getattr(images, "BASE", {}).get(key) or int(key[1:]) * 100  # image files are <base + beat>.png
BEATS = importlib.import_module(sys.argv[1]).BEATS
label = sys.argv[2]
avatar, script, out = Path(sys.argv[3]), Path(sys.argv[4]), Path(sys.argv[5])
sys.argv = sys.argv[2:]  # keep the optional starts.json at sys.argv[4]
paras = [p for p in script.read_text().split("\n\n") if p.strip()]
assert len(paras) == len(BEATS), (len(paras), len(BEATS))
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(avatar)]).decode())
words = [len(p.split()) for p in paras]
total = sum(words)
starts, t = [], 0.0
if len(sys.argv) > 4:  # exact paragraph start times (JSON list), e.g. from the narration's chunk timings
    starts = json.load(open(sys.argv[4]))
else:
    for w in words:
        starts.append(round(t, 2)); t += dur * w / total
lens = [round((starts[i + 1] if i + 1 < len(starts) else dur) - starts[i], 2) for i in range(len(starts))]

if out.exists(): shutil.rmtree(out)
(out / "compositions").mkdir(parents=True); (out / "assets" / "fonts").mkdir(parents=True)
shutil.copy(avatar, out / "assets" / "avatar.mp4")
shutil.copy(Path(__file__).parent / "gsap.min.js", out / "assets" / "gsap.min.js")  # GSAP 3.14.2, vendored so renders work offline
fonts = Path(__file__).resolve().parents[4] / "marketing/remotion/aire-vs-bootcamps/public"
shutil.copy(fonts / "archivo.woff2", out / "assets/fonts/archivo.woff2")
shutil.copy(fonts / "manrope.woff2", out / "assets/fonts/manrope.woff2")
if VIS:  # photos to 1600px JPEG, sketches to 2048px, so renders stay quick
    (out / "assets" / "v").mkdir()
    for b, (kind, _) in VIS.items():
        src = IMGS / f"{base + b}.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", f"scale={2048 if kind == 'sketch' else 1600}:-1",
                        "-q:v", "2", str(out / "assets" / "v" / f"{b:02d}.jpg")], check=True)

CSS = """
@font-face{font-family:'ArchivoX';src:url('assets/fonts/archivo.woff2');font-weight:100 900}
@font-face{font-family:'ManropeX';src:url('assets/fonts/manrope.woff2');font-weight:200 800}
#root{position:absolute;inset:0;font-family:'ManropeX';color:#dbe2ec}
#root .stage{position:absolute;left:96px;top:110px;width:1130px;height:860px;display:flex;flex-direction:column;justify-content:center;gap:34px}
#root .kick{position:absolute;left:96px;top:72px;font-weight:700;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:#38bdf8}
#root h1{font-family:'ArchivoX';font-weight:800;font-size:96px;line-height:1.02;margin:0;color:#fff;letter-spacing:-.02em}
#root h2{font-family:'ArchivoX';font-weight:800;font-size:64px;line-height:1.08;margin:0;color:#fff;letter-spacing:-.015em}
#root h2.big{font-size:84px}
#root h3{font-family:'ArchivoX';font-size:34px;margin:0 0 14px;color:#fff}
#root em{font-style:normal;color:#fbbf24}
#root .lede{font-size:38px;line-height:1.35;margin:0;color:#cbd5e1}
#root .chip{align-self:flex-start;font-size:30px;font-weight:600;padding:12px 22px;border-radius:999px;background:rgba(56,189,248,.14);border:1px solid rgba(56,189,248,.5);color:#e0f2fe}
#root .chip.warn{background:rgba(251,191,36,.12);border-color:rgba(251,191,36,.5);color:#fde68a}
#root .row{display:flex;gap:22px}
#root .row.wrap{flex-wrap:wrap}
#root .pill{font-size:32px;font-weight:700;padding:18px 28px;border-radius:999px;background:#0d1524;border:1px solid rgba(255,255,255,.16);color:#fff}
#root .pill.ok{border-color:rgba(52,211,153,.6);background:rgba(52,211,153,.1)}
#root .pill.no{border-color:rgba(248,113,113,.6);background:rgba(248,113,113,.08);color:#fecaca;text-decoration:line-through;text-decoration-thickness:3px}
#root .card{flex:1;display:flex;flex-direction:column;gap:12px;padding:30px 32px;border-radius:24px;background:#0d1524;border:1px solid rgba(255,255,255,.14)}
#root .card b{font-family:'ArchivoX';font-size:36px;color:#fff}
#root .card span{font-size:28px;line-height:1.4;color:#cbd5e1}
#root .card.hi{border-color:#fbbf24;box-shadow:0 0 0 2px rgba(251,191,36,.25)}
#root .card.tall{min-height:240px}
#root .card.wide{flex:none}
#root .steps{margin:0;padding-left:56px;font-size:40px;line-height:1.5;color:#fff;font-weight:600}
#root .steps.sm{font-size:34px}
#root .checks,#root .miss{list-style:none;margin:0;padding:0;font-size:34px;line-height:1.7;color:#fff}
#root .checks li::before{content:'\\2713  ';color:#34d399;font-weight:800}
#root .miss li::before{content:'\\2717  ';color:#f87171;font-weight:800}
#root .miss i{display:block;width:fit-content;margin:4px 0 10px 40px;font-style:normal;font-size:24px;font-weight:800;letter-spacing:.04em;padding:4px 10px;border-radius:8px;background:rgba(248,113,113,.15);color:#fca5a5}
#root .cols{display:grid;grid-template-columns:1fr 1fr;gap:48px}
#root .chat{display:flex;flex-direction:column;gap:16px}
#root .msg{max-width:900px;font-size:30px;line-height:1.4;padding:18px 24px;border-radius:20px}
#root .msg.u{align-self:flex-end;background:rgba(56,189,248,.2);color:#fff}
#root .msg.a{background:#111b2c}
#root .grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;font-size:28px;font-weight:700}
#root .grid span{padding:12px 8px;text-align:center;border-radius:12px;background:#111b2c;border:1px solid rgba(255,255,255,.1)}
#root .bad{font-size:34px;font-weight:700;color:#fecaca}
#root .bad s{color:#f87171}
#root .tag{align-self:flex-start;font-family:'ArchivoX';font-size:44px;letter-spacing:.06em;padding:16px 30px;border:3px solid #fbbf24;color:#fbbf24;border-radius:14px}
#root .quote{font-size:36px;line-height:1.4;padding:26px 32px;border-radius:20px;background:#0d1524;border-left:6px solid #38bdf8;color:#fff}
#root .quote.ok{border-left-color:#34d399}
#root .quote.no{border-left-color:#f87171;color:#fecaca}
#root .hl{color:#fbbf24;text-decoration:underline;text-decoration-thickness:4px}
#root h1,#root h2,#root .lede,#root .steps,#root .checks,#root .miss{text-shadow:0 2px 18px rgba(0,0,0,.65)}
#root .card,#root .quote,#root .pill,#root .msg.a,#root .grid span{background:rgba(9,14,26,.66);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 18px 50px rgba(0,0,0,.35)}
#root .kline{position:absolute;left:96px;top:58px;width:120px;height:3px;background:linear-gradient(90deg,#fbbf24,#38bdf8);transform-origin:left center}
#root .chat{padding:26px 28px 30px;border-radius:26px;background:rgba(9,14,26,.7);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14);box-shadow:0 24px 70px rgba(0,0,0,.45)}
#root .chat::before{content:'';display:block;height:14px;width:62px;margin-bottom:6px;background:radial-gradient(circle at 7px 7px,#f87171 6px,transparent 7px),radial-gradient(circle at 31px 7px,#fbbf24 6px,transparent 7px),radial-gradient(circle at 55px 7px,#34d399 6px,transparent 7px)}
#root .phone{align-self:center;width:520px;padding:64px 26px 40px;border-radius:56px;background:rgba(9,14,26,.78);backdrop-filter:blur(14px);border:3px solid rgba(255,255,255,.22);box-shadow:0 30px 80px rgba(0,0,0,.5);position:relative}
#root .phone::before{content:'';position:absolute;top:22px;left:50%;width:110px;height:22px;margin-left:-55px;border-radius:12px;background:#000}
#root .phone .bub{font-size:28px;line-height:1.42;padding:20px 22px;border-radius:24px 24px 24px 8px;background:#1d2a40;color:#fff}
#root .phone .from{font-size:24px;font-weight:700;color:#7dd3fc;margin:0 0 12px 6px}
#root .sheet{position:absolute;left:-30px;top:40px;width:1150px;height:647px;border-radius:26px;overflow:hidden;background:#fff;box-shadow:0 30px 90px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.4)}
#root .sheet img{width:100%;height:100%;object-fit:cover;display:block}
#root .cap{position:absolute;left:0;top:722px;width:1120px;font-family:'ArchivoX';font-weight:800;font-size:44px;line-height:1.15;color:#fff;text-shadow:0 2px 18px rgba(0,0,0,.6)}
#root .term{width:1000px;border-radius:18px;overflow:hidden;background:rgba(6,10,18,.88);border:1px solid rgba(255,255,255,.16);box-shadow:0 26px 80px rgba(0,0,0,.55);font-family:ui-monospace,Menlo,Consolas,monospace}
#root .term .tbar{height:44px;background:rgba(255,255,255,.07);display:flex;align-items:center;gap:10px;padding:0 18px;font:600 22px 'ManropeX';color:#94a3b8}
#root .term .tbar i{width:14px;height:14px;border-radius:50%;background:#f87171;display:inline-block}
#root .term .tbar i+i{background:#fbbf24}#root .term .tbar i+i+i{background:#34d399;margin-right:12px}
#root .term .ln{font-size:32px;line-height:1.6;padding:0 28px;color:#e2e8f0;white-space:pre}
#root .term .ln:first-of-type{padding-top:20px}#root .term .ln:last-child{padding-bottom:24px}
#root .term .pr{color:#38bdf8}#root .term .cm{color:#64748b}
#root .term .cur{display:inline-block;width:18px;height:34px;background:#fbbf24;vertical-align:middle}
#root .dialog{width:820px;padding:36px 40px;border-radius:24px;background:rgba(245,248,252,.96);color:#0f172a;box-shadow:0 30px 90px rgba(0,0,0,.55)}
#root .dialog b{display:block;font-family:'ArchivoX';font-size:38px;margin-bottom:14px}
#root .dialog p{font-size:28px;line-height:1.45;margin:0 0 26px;color:#334155}
#root .dialog .btns{display:flex;justify-content:flex-end;gap:16px}
#root .dialog .btns span{font:700 26px 'ManropeX';padding:12px 26px;border-radius:12px;background:#e2e8f0}
#root .dialog .btns span.go{background:#0ea5e9;color:#fff}
"""
if FULL:
    CSS += """
#root .stage{width:1560px}
#root .sheet{left:255px;top:4px;width:1209px;height:680px}
#root .cap{left:155px;top:704px;width:1410px;text-align:center}
"""

SRC = [i for i, (_, body) in enumerate(BEATS, 1) if body == "@source"]  # beats that show the original footage
hosts = []
for i, ((kick, body), st, ln) in enumerate(zip(BEATS, starts, lens), 1):
    if i in SRC:
        continue
    cid = f"b{i:02d}"
    kind, cap = VIS.get(i, ("", ""))
    if kind == "sketch":  # the drawing explains the beat; a one-line caption carries the point
        body = f'<div class="sheet r" data-at="0.02"><img src="assets/v/{i:02d}.jpg"></div>' + (f'<div class="cap r" data-at="0.3">{cap}</div>' if cap else "")
    ids = []
    def tag(m):
        ids.append((m.group(1)[1:], m.group(2).split()))
        return f'{m.group(1)} id="{cid}-r{len(ids)}" class="{m.group(2)}"'
    body2 = re.sub(r'(<[a-z0-9]+) class="([^"]*\br\b[^"]*)"', tag, body)
    ats = [float(a) for a in re.findall(r'data-at="([0-9.]+)"', body2)]

    def enter(k, el, cls, at):
        sel, t = f'"#{cid}-r{k}"', round(at * ln, 2)
        if "sheet" in cls:  # the drawing appears as if sketched left to right, then breathes slowly
            return (f'tl.fromTo({sel},{{opacity:0,y:30,clipPath:"inset(0% 100% 0% 0%)"}},{{opacity:1,y:0,clipPath:"inset(0% 0% 0% 0%)",duration:1.4,ease:"power2.inOut"}},{t});'
                    f'tl.fromTo("#{cid}-r{k} img",{{scale:1.0}},{{scale:1.045,duration:{max(1, ln - t)},ease:"none"}},{t});')
        if "tag" in cls:  # lands like a rubber stamp
            return f'tl.fromTo({sel},{{opacity:0,scale:1.7,rotation:-9}},{{opacity:1,scale:1,rotation:-3,duration:0.42,ease:"back.out(2.2)"}},{t});'
        if el in ("h1", "h2"):  # headline wipes up from a mask
            return f'tl.fromTo({sel},{{opacity:0,y:50,clipPath:"inset(0% 0% 100% 0%)"}},{{opacity:1,y:0,clipPath:"inset(0% 0% -20% 0%)",duration:0.8,ease:"power3.out"}},{t});'
        if el == "li" or "pill" in cls:
            return f'tl.fromTo({sel},{{opacity:0,x:-40}},{{opacity:1,x:0,duration:0.5,ease:"power3.out"}},{t});'
        return f'tl.fromTo({sel},{{opacity:0,y:34,filter:"blur(8px)"}},{{opacity:1,y:0,filter:"blur(0px)",duration:0.65,ease:"power3.out"}},{t});'
    tw = "\n".join(enter(k + 1, el, cls, a) for k, ((el, cls), a) in enumerate(zip(ids, ats)))
    tw = f'tl.fromTo("#{cid}-kl",{{scaleX:0}},{{scaleX:1,duration:0.6,ease:"power3.out"}},0);tl.fromTo("#{cid}-kk",{{opacity:0,x:-20}},{{opacity:1,x:0,duration:0.5}},0.1);\n' + tw
    html = f"""<template>
<style>{CSS}</style>
<div id="root" data-composition-id="{cid}" data-width="1920" data-height="1080">
  <div class="kline" id="{cid}-kl"></div>
  <div class="kick" id="{cid}-kk">{kick}</div>
  <div class="stage">{body2}</div>
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{tw}
tl.to({{}}, {{duration:{max(0.1, ln-0.05)}}}, 0);
window.__timelines["{cid}"] = tl;
</script>
</template>
"""
    (out / "compositions" / f"{cid}.html").write_text(html)
    hosts.append(f'<div id="{cid}" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" data-start="{st}" data-duration="{ln}" data-track-index="2" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index:3"></div>')

# Backdrop per beat, stacked in order: each fades in over the one before it, then pushes in slowly.
bds, mtw = [], [f'm.fromTo("#prog",{{scaleX:0}},{{scaleX:1,duration:{round(dur, 2)},ease:"none"}},0);']
for i, (st, ln) in enumerate(zip(starts, lens), 1):
    kind = VIS.get(i, ("", ""))[0]
    t0 = max(0, round(st - 0.5, 2))
    if i in SRC:  # original footage full-screen; the overlay labels step aside (the footage has its own captions)
        end = round(st + ln, 2)
        mtw.append(f'm.set("#avatar",{{left:0,top:0,width:1920,height:1080,opacity:1,zIndex:6}},{st});m.set("#avatar",{{left:1313,top:0,width:{2 if FULL else 607},height:{2 if FULL else 1080},opacity:{0 if FULL else 1},zIndex:2}},{end});')
        mtw.append(f'm.set("#label,#brand,#narr",{{opacity:0}},{st});m.set("#label,#brand,#narr",{{opacity:1}},{end});')
        bds.append(f'<div class="bd deep" id="bd{i}" style="opacity:0"></div>')
        mtw.append(f'm.set("#bd{i}",{{opacity:1}},{st});')
        continue
    if kind == "photo":
        bds.append(f'<div class="bd" id="bd{i}"><img src="assets/v/{i:02d}.jpg"><div class="shade"></div></div>')
        dx = 40 if i % 2 else -40
        mtw.append(f'm.fromTo("#bd{i} img",{{scale:1.06,x:{-dx}}},{{scale:1.2,x:{dx},duration:{round(ln + 1.5, 2)},ease:"none"}},{t0});')
    else:
        bds.append(f'<div class="bd deep" id="bd{i}"></div>')
    mtw.append(f'm.fromTo("#bd{i}",{{opacity:0}},{{opacity:1,duration:{0.01 if i == 1 else 0.9},ease:"power1.inOut"}},{t0});')
    if i + 1 < len(starts):  # hide once the next two have covered it, to keep the page light
        mtw.append(f'm.set("#bd{i}",{{display:"none"}},{round(starts[i + 1] + 1, 2)});')

caps = []
if CAPS:  # short phrases, broken at pauses and punctuation, shown as the words are spoken
    cw = json.load(open(CAPS)); cw = cw if isinstance(cw, list) else cw["words"]
    groups, cur = [], []
    for k, x in enumerate(cw):
        cur.append(x)
        nxt = cw[k + 1] if k + 1 < len(cw) else None
        if len(cur) >= 7 or x["text"][-1:] in ".?!:" or (nxt and nxt["start"] - x["end"] > 0.5) or not nxt:
            groups.append(cur); cur = []
    srcr = [(starts[i - 1], starts[i - 1] + lens[i - 1]) for i in SRC]
    groups = [g for g in groups if not any(a - 0.2 <= g[0]["start"] < b for a, b in srcr)]
    for k, g in enumerate(groups):
        txt = " ".join(x["text"] for x in g).replace("&", "&amp;").replace("<", "&lt;")
        end = groups[k + 1][0]["start"] if k + 1 < len(groups) and groups[k + 1][0]["start"] - g[-1]["end"] < 1.2 else g[-1]["end"] + 0.4
        caps.append(f'<div class="cc" id="cc{k}">{txt}</div>')
        mtw.append(f'm.set("#cc{k}",{{opacity:1}},{round(g[0]["start"], 2)});m.set("#cc{k}",{{opacity:0}},{round(end, 2)});')

index = f"""<!doctype html>
<html>
<head><meta charset="utf-8">
<script src="assets/gsap.min.js"></script>
<style>
@font-face{{font-family:'ManropeX';src:url('assets/fonts/manrope.woff2');font-weight:200 800}}
#bg{{position:absolute;inset:0;background:radial-gradient(1200px 800px at 20% 10%,#0c2236 0%,#04070d 60%)}}
#avatar{{position:absolute;left:1313px;top:0;width:607px;height:1080px;object-fit:cover;z-index:2}}
#fade{{position:absolute;left:1243px;top:0;width:140px;height:1080px;background:linear-gradient(90deg,rgba(4,7,13,0),rgba(4,7,13,.7) 50%,rgba(4,7,13,0));z-index:2}}
#label{{position:absolute;right:28px;top:28px;z-index:4;font:700 28px 'ManropeX';letter-spacing:.04em;color:#e0f2fe;background:rgba(4,7,13,.6);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:8px 14px}}
#brand{{position:absolute;left:96px;bottom:44px;z-index:4;font:700 28px 'ManropeX';letter-spacing:.08em;color:#94a3b8;text-shadow:0 2px 10px rgba(0,0,0,.7)}}
.bd{{position:absolute;left:0;top:0;width:1360px;height:1080px;overflow:hidden;z-index:1}}
.bd img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.bd .shade{{position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,6,12,.9) 0%,rgba(3,6,12,.66) 48%,rgba(3,6,12,.3) 100%),linear-gradient(180deg,rgba(3,6,12,.55) 0%,rgba(3,6,12,0) 22%,rgba(3,6,12,0) 70%,rgba(3,6,12,.8) 100%)}}
.bd.deep{{background:radial-gradient(900px 600px at 30% 35%,#123049 0%,#060b14 62%,#03060c 100%)}}
.cc{{position:absolute;left:50%;bottom:98px;transform:translateX(-50%);z-index:5;opacity:0;max-width:1500px;text-align:center;font:700 34px 'ManropeX';color:#fff;background:rgba(3,6,12,.72);padding:8px 20px;border-radius:12px;white-space:nowrap}}
#narr{{position:absolute;right:28px;bottom:36px;z-index:4;font:700 24px 'ManropeX';color:#e0f2fe;background:rgba(4,7,13,.6);border:1px solid rgba(56,189,248,.45);border-radius:999px;padding:8px 16px}}
{".bd{width:1920px !important} #prog{width:1920px !important} #avatar{width:2px;height:2px;opacity:0}" if FULL else ""}
#prog{{position:absolute;left:0;bottom:0;width:1313px;height:5px;z-index:4;background:linear-gradient(90deg,#38bdf8,#fbbf24);transform-origin:left center}}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{round(dur,2)}" data-width="1920" data-height="1080">
  <div id="bg"></div>
  {chr(10).join(bds)}
  <div id="prog"></div>
  <video id="avatar" class="clip" src="assets/avatar.mp4" data-start="0" data-duration="{round(dur,2)}" data-track-index="1" data-has-audio="true" playsinline></video>
  {'<div id="narr">Narrated by AiRE &middot; AI instructor</div>' if FULL else '<div id="fade"></div>'}
  {chr(10).join(caps)}
  <div id="label">Made with AI</div>
  <div id="brand">AiRE ESTATE ACADEMY &middot; {COURSE} &middot; {label}</div>
  {chr(10).join(hosts)}
</div>
<script>window.__timelines = window.__timelines || {{}}; const m = gsap.timeline({{ paused: true }});
{chr(10).join(mtw)}
window.__timelines["main"] = m;</script>
</body></html>
"""
(out / "index.html").write_text(index)
json.dump({"duration": dur, "beats": [{"n": i + 1, "start": s, "len": l} for i, (s, l) in enumerate(zip(starts, lens))]},
          open(out / "beats.json", "w"), indent=1)
print(f"built {out} — {len(BEATS)} beats over {dur:.1f}s")
