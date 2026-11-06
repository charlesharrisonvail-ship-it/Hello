#!/usr/bin/env python3
"""Publish the next due AiRE Estate post to the AiRE Estate Facebook page.

    post.py --check     show access and what is due, change nothing
    post.py             publish the oldest post that is due and not yet posted
    post.py --only 4    publish post 4 now, whatever its date

Posts live in queue.json; what has gone out is recorded in posted.json.

Access comes from the cloud environment, never from this repo: either an API
credential for graph.facebook.com (the proxy adds the Authorization header), or
the environment variable AIRE_FB_TOKEN. The token needs pages_show_list,
pages_read_engagement and pages_manage_posts on the AiRE Estate page.
"""
import argparse, json, mimetypes, os, ssl, sys, urllib.error, urllib.parse, urllib.request, uuid
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
GRAPH = "https://graph.facebook.com/v21.0"
TOKEN = os.environ.get("AIRE_FB_TOKEN", "")


def ctx():
    b = "/root/.ccr/ca-bundle.crt"
    return ssl.create_default_context(cafile=b if os.path.exists(b) else None)


def call(url, data=None, headers=None, token=None):
    h = dict(headers or {})
    if token:
        h["Authorization"] = "Bearer " + token
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=h), context=ctx(), timeout=600) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        try:
            msg = json.loads(body)["error"]["message"]
        except Exception:
            msg = body[:500]
        raise RuntimeError(f"Meta returned HTTP {e.code}: {msg}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"could not reach Facebook: {e.reason}")


def multipart(fields, path):
    bd = uuid.uuid4().hex
    out = bytearray()
    for k, v in fields.items():
        out += f'--{bd}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    ct = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    out += f'--{bd}\r\nContent-Disposition: form-data; name="source"; filename="{path.name}"\r\nContent-Type: {ct}\r\n\r\n'.encode()
    out += path.read_bytes() + f"\r\n--{bd}--\r\n".encode()
    return bytes(out), {"Content-Type": f"multipart/form-data; boundary={bd}"}


def page_token(q):
    """Find the AiRE Estate page among the pages this access can post to."""
    pid, want = q["page_id"], q["page_name"].lower()
    # The proxy overwrites the Authorization header on graph.facebook.com with the
    # environment's own credential, so AIRE_FB_TOKEN must travel as a query parameter.
    auth = "&access_token=" + urllib.parse.quote(TOKEN) if TOKEN else ""
    data = call(f"{GRAPH}/me/accounts?fields=id,name,access_token&limit=100{auth}").get("data", [])
    for p in data:
        if p["id"] == pid:
            if want not in p["name"].lower():
                raise RuntimeError(f"page {p['id']} is named {p['name']!r}, not {q['page_name']!r}; refusing to post")
            return p["id"], p["access_token"]
    names = ", ".join(p["name"] for p in data) or "none"
    raise RuntimeError(f"this access cannot post to the {q['page_name']} page (pages it can reach: {names})")


def snippet(text):
    """First line of a caption, whitespace-normalized, for matching against the page."""
    return " ".join((text or "").split("\n")[0].split())[:80].lower()


def live_snippets(pid, ptok):
    """Openings of the page's recent posts and videos. The posting record can fail to
    reach the repo (a run that cannot push), so the page itself is the last word on
    what has already gone out."""
    seen = set()
    for edge, field in (("posts", "message"), ("videos", "description")):
        q = urllib.parse.urlencode({"fields": field, "limit": 50, "access_token": ptok})
        for item in call(f"{GRAPH}/{pid}/{edge}?{q}").get("data", []):
            if item.get(field):
                seen.add(snippet(item[field]))
    return seen


def set_cover(vid, cover, ptok):
    """Upload a designed cover so the reel does not show its dark first frame."""
    if not vid or not cover.exists():
        print(f"  cover not set ({cover.name} missing or no video id)")
        return
    body, h = multipart({"is_preferred": "true", "access_token": ptok}, cover)
    try:
        call(f"{GRAPH}/{vid}/thumbnails", body, h)
        print(f"  cover set: {cover.name}")
    except RuntimeError as e:
        print(f"  cover not set: {e}")


def publish(post, pid, ptok):
    cap, media = post["caption"], post.get("media")
    if not media:
        raise RuntimeError("no media file set")
    path = HERE / "media" / media
    if not path.exists():
        raise RuntimeError(f"media file missing: {path.name}")
    if path.suffix.lower() in (".mp4", ".mov"):
        body, h = multipart({"description": cap, "title": post["title"]}, path)
        r = call(f"https://graph-video.facebook.com/v21.0/{pid}/videos", body, h, ptok)
        if post.get("cover"):
            set_cover(r.get("id"), HERE / "covers" / post["cover"], ptok)
    else:
        # The proxy replaces the Authorization header on graph.facebook.com with the
        # user-level credential, so the Page token must travel in the form body.
        body, h = multipart({"caption": cap, "access_token": ptok}, path)
        r = call(f"{GRAPH}/{pid}/photos", body, h)
    return r.get("post_id") or r.get("id")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--only", type=int)
    a = ap.parse_args()
    q = json.loads((HERE / "queue.json").read_text())
    done = json.loads((HERE / "posted.json").read_text())
    sent = {d["n"] for d in done}
    by = {p["n"]: p for p in q["posts"]}
    today = datetime.now(ZoneInfo(q["tz"])).date().isoformat()
    due = [by[a.only]] if a.only else [p for p in q["posts"] if p["date"] <= today and p["n"] not in sent]
    # One post per scheduled run: "priority" posts first, then oldest, so a missed
    # week never floods the page. The cut to one happens after the live check below.
    if not a.only:
        due = sorted(due, key=lambda p: (-p.get("priority", 0), p["date"], p["n"]))
    print(f"Today {today}. Due, in order: {', '.join(str(p['n']) for p in due) or 'nothing'}.")
    try:
        pid, ptok = page_token(q)
        print(f"ACCESS OK: can post to {q['page_name']} ({pid}).")
    except RuntimeError as e:
        print(f"ACCESS FAILED: {e}")
        return 2
    if a.check:
        return 0
    live = set() if a.only else live_snippets(pid, ptok)
    rc = 0
    for p in due:
        src = p
        if not p.get("media") and p.get("fallback"):
            src = dict(by[p["fallback"]], n=p["n"])
        if not src.get("media") or not src.get("caption"):
            print(f"SKIPPED post {p['n']} ({p['title']}): {p.get('needs', 'no media')}")
            rc = 1
            continue
        if src is p and snippet(src["caption"]) in live:
            # Already on the page (an earlier run published it but its record never
            # reached the repo). Record it and move on; never post it twice.
            done.append({"n": p["n"], "date": today, "id": "already-live", "title": src["title"]})
            (HERE / "posted.json").write_text(json.dumps(done, indent=1))
            print(f"ALREADY LIVE post {p['n']} ({src['title']}): recorded, not reposted")
            continue
        try:
            fid = publish(src, pid, ptok)
        except RuntimeError as e:
            print(f"FAILED post {p['n']} ({p['title']}): {e}")
            rc = 1
            continue
        done.append({"n": p["n"], "date": today, "id": fid, "title": src["title"]})
        (HERE / "posted.json").write_text(json.dumps(done, indent=1))
        print(f"PUBLISHED post {p['n']} ({src['title']}): https://www.facebook.com/{fid}")
        if not a.only:
            break  # one new post per run
    return rc


if __name__ == "__main__":
    sys.exit(main())
