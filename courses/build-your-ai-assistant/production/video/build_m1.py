#!/usr/bin/env python3
"""Build the HyperFrames project for Module 1: narration avatar on the right, on-screen
beats on the left, each beat timed to its narration paragraph (word-proportional).

    python3 build_m1.py <avatar.mp4> <script.txt> <out_dir>
"""
import json, re, shutil, subprocess, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from beats_m1 import BEATS

avatar, script, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
paras = [p for p in script.read_text().split("\n\n") if p.strip()]
assert len(paras) == len(BEATS), (len(paras), len(BEATS))
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(avatar)]).decode())
words = [len(p.split()) for p in paras]
total = sum(words)
starts, t = [], 0.0
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
"""

hosts = []
for i, ((kick, body), st, ln) in enumerate(zip(BEATS, starts, lens), 1):
    cid = f"b{i:02d}"
    ids = []
    def tag(m):
        ids.append(len(ids))
        return f'{m.group(1)} id="{cid}-r{len(ids)}" '
    body2 = re.sub(r'(<[a-z0-9]+)(?= class="[^"]*\br\b)', tag, body)
    ats = [float(a) for a in re.findall(r'data-at="([0-9.]+)"', body2)]
    tw = "\n".join(f'tl.fromTo("#{cid}-r{k+1}",{{opacity:0,y:24}},{{opacity:1,y:0,duration:0.45,ease:"power2.out"}},{round(a*ln,2)});' for k, a in enumerate(ats))
    html = f"""<template>
<style>{CSS}</style>
<div id="root" data-composition-id="{cid}" data-width="1920" data-height="1080">
  <div class="kick">{kick}</div>
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

index = f"""<!doctype html>
<html>
<head><meta charset="utf-8">
<script src="assets/gsap.min.js"></script>
<style>
@font-face{{font-family:'ManropeX';src:url('assets/fonts/manrope.woff2');font-weight:200 800}}
#bg{{position:absolute;inset:0;background:radial-gradient(1200px 800px at 20% 10%,#0c2236 0%,#04070d 60%)}}
#avatar{{position:absolute;left:1313px;top:0;width:607px;height:1080px;object-fit:cover;z-index:2}}
#fade{{position:absolute;left:1213px;top:0;width:140px;height:1080px;background:linear-gradient(90deg,#04070d,rgba(4,7,13,0));z-index:2}}
#label{{position:absolute;right:28px;top:28px;z-index:4;font:700 28px 'ManropeX';letter-spacing:.04em;color:#e0f2fe;background:rgba(4,7,13,.6);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:8px 14px}}
#brand{{position:absolute;left:96px;bottom:44px;z-index:4;font:700 28px 'ManropeX';letter-spacing:.08em;color:#64748b}}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{round(dur,2)}" data-width="1920" data-height="1080">
  <div id="bg"></div>
  <video id="avatar" class="clip" src="assets/avatar.mp4" data-start="0" data-duration="{round(dur,2)}" data-track-index="1" data-has-audio="true" playsinline></video>
  <div id="fade"></div>
  <div id="label">Made with AI</div>
  <div id="brand">AiRE ESTATE ACADEMY &middot; BUILD YOUR AI ASSISTANT</div>
  {chr(10).join(hosts)}
</div>
<script>window.__timelines = window.__timelines || {{}}; window.__timelines["main"] = gsap.timeline({{ paused: true }});</script>
</body></html>
"""
(out / "index.html").write_text(index)
json.dump({"duration": dur, "beats": [{"n": i + 1, "start": s, "len": l} for i, (s, l) in enumerate(zip(starts, lens))]},
          open(out / "beats.json", "w"), indent=1)
print(f"built {out} — {len(BEATS)} beats over {dur:.1f}s")
