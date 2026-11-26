#!/usr/bin/env python3
"""are.na + media helpers for screens-to-video. Stdlib + curl + ffmpeg.

  arena.py channel <slug> [dir] [n]   up to n blocks (default 96, newest first), one JSON line each
                                      (n, id, title, media, moving, page); with dir, numbered contact sheets
                                      <dir>/<slug>-NN.png, 24 tiles each, tile number = n
  arena.py get <url> <out>            download; the extension is corrected to the real file type
  arena.py sheet <video> <out> [k]    k-frame contact sheet (default 9) + duration + the time of every frame
  arena.py still <video> <t> <out>    one frame at t seconds, for the a-refs
"""
import concurrent.futures, json, math, os, shutil, subprocess, sys, time

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"

def api(path):
    # api.are.na drops or 429s bursts; plain curl UA (its Cloudflare 403s the browser UA)
    for wait in (0, 2, 5, 10):
        time.sleep(wait)
        r = subprocess.run(["curl", "-s", "-m", "30", "-w", "\n%{http_code}", "https://api.are.na/" + path], capture_output=True, text=True).stdout
        body, _, code = r.rpartition("\n")
        if code == "200":
            return json.loads(body)
    sys.exit(f"are.na {path}: HTTP {code}")

def channel(slug, out_dir=None, n=96):
    rows, page = [], 1
    while len(rows) < n:
        got = api(f"v2/channels/{slug}/contents?per=100&page={page}&direction=desc").get("contents", [])
        if not got:
            break
        for b in got:
            att = b.get("attachment") or {}
            media = att.get("url") or ((b.get("image") or {}).get("original") or {}).get("url")
            if not media:
                continue
            moving = ".gif" in media.split("?")[0] or att.get("extension") in ("mp4", "mov", "webm", "gif")
            rows.append({"n": len(rows) + 1, "id": b["id"], "title": (b.get("title") or "")[:120], "media": media,
                         "moving": moving, "source": (b.get("source") or {}).get("url"), "page": f"https://www.are.na/block/{b['id']}"})
        page += 1
    rows = rows[:n]
    for r in rows:
        print(json.dumps(r))
    if out_dir and rows:
        sheets(rows, out_dir, slug)

def sheets(rows, out_dir, slug, per=24):
    tmp = os.path.join(out_dir, f".{slug}-tiles"); os.makedirs(tmp, exist_ok=True)
    label = f"drawtext=fontfile={FONT}:text=%s:x=6:y=6:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=4,format=rgb24"
    def one(r):
        out, src = os.path.join(tmp, f"{r['n']:04d}.png"), os.path.join(tmp, f"{r['n']:04d}.src")
        vf = "scale=240:240:force_original_aspect_ratio=decrease,pad=240:240:-1:-1:white," + label % r["n"]
        if r["media"].split("?")[0].endswith(".gif"):
            subprocess.run(["curl", "-sf", "-m", "30", "-A", UA, "-r", "0-1500000", "-o", src, r["media"]])
            ff, vf = ["-i", src, "-update", "1"], "select=lte(n\\,12)," + vf
        elif r["moving"]:
            ff = ["-user_agent", UA, "-ss", "1", "-i", r["media"], "-frames:v", "1"]
        else:
            subprocess.run(["curl", "-sf", "-m", "30", "-A", UA, "-o", src, r["media"]])
            ff = ["-i", src, "-frames:v", "1"]
        ok = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", *ff, "-vf", vf, out], capture_output=True).returncode == 0
        if not (ok and os.path.exists(out)):
            subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "lavfi", "-i", "color=c=#dddddd:s=240x240",
                            "-frames:v", "1", "-vf", label % r["n"], out], capture_output=True)
    with concurrent.futures.ThreadPoolExecutor(8) as pool:
        list(pool.map(one, rows))
    for k, start in enumerate(range(1, len(rows) + 1, per), 1):
        count = min(per, len(rows) - start + 1)
        part = os.path.join(tmp, f"sheet{k:02d}"); shutil.rmtree(part, ignore_errors=True); os.makedirs(part)
        for j in range(count):
            shutil.copy(os.path.join(tmp, f"{start + j:04d}.png"), os.path.join(part, f"{j + 1:04d}.png"))
        out = os.path.join(out_dir, f"{slug}-{k:02d}.png")
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", os.path.join(part, "%04d.png"), "-frames:v", "1",
                        "-vf", f"tile=6x{-(-count // 6)}:padding=4:color=white", out], check=True)
        print(json.dumps({"sheet": out, "tiles": f"{start}-{start + count - 1}"}))

MAGIC = [(b"\x89PNG", "png"), (b"\xff\xd8\xff", "jpg"), (b"GIF8", "gif"), (b"\x1a\x45\xdf\xa3", "webm")]

def get(url, out):
    data = subprocess.run(["curl", "-sfL", "-m", "60", "-A", UA, url], capture_output=True, check=True).stdout
    real = "mp4" if data[4:8] == b"ftyp" else next((e for m, e in MAGIC if data.startswith(m)), None)
    base, ext = os.path.splitext(out)
    if real and ext[1:].lower().replace("jpeg", "jpg") != real:
        out = f"{base}.{real}"
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    open(out, "wb").write(data)
    print(json.dumps({"saved": out, "from": url}))

def duration(src):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                                capture_output=True, text=True).stdout.strip() or 0)

def sheet(src, out, frames=9):
    dur = duration(src); cols = math.ceil(math.sqrt(frames))
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", src, "-vf",
                    f"fps={frames / dur if dur else 1:.4f},scale=480:-2,tile={cols}x{-(-frames // cols)}:padding=4:color=white",
                    "-frames:v", "1", out], check=True)
    print(json.dumps({"sheet": out, "duration_s": round(dur, 2), "frames_at_s": [round(i * dur / frames, 2) for i in range(frames)]}))

def still(src, t, out):
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(t), "-i", src, "-frames:v", "1", out], check=True)
    print(json.dumps({"saved": out, "at_s": float(t)}))

if __name__ == "__main__":
    cmd, a = (sys.argv[1:2] or ["help"])[0], sys.argv[2:]
    if cmd == "channel": channel(a[0], a[1] if len(a) > 1 else None, int(a[2]) if len(a) > 2 else 96)
    elif cmd == "get": get(a[0], a[1])
    elif cmd == "sheet": sheet(a[0], a[1], int(a[2]) if len(a) > 2 else 9)
    elif cmd == "still": still(a[0], a[1], a[2])
    else: sys.exit(__doc__)
