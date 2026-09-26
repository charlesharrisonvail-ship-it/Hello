#!/usr/bin/env python3
"""Publish an NBMH post to the New Beginnings Mental Health Facebook page.

Goes straight to Meta's Graph API — no third-party scheduler in the middle, so
there is no seat or quota to run out of. The image is uploaded as multipart
form data, so the graphic never needs to be hosted at a public URL first.

Needs two environment variables, set in the cloud environment's settings:

    NBMH_FB_PAGE_ID        the New Beginnings Mental Health page id
    NBMH_FB_PAGE_TOKEN     a long-lived Page access token with
                           pages_manage_posts and pages_read_engagement

Usage:
    # what would happen, without touching Meta
    publish-facebook.py --check

    # publish now
    publish-facebook.py --image <jpg> --caption <md>

    # queue it in Meta for a later time (10 minutes to 6 months out)
    publish-facebook.py --image <jpg> --caption <md> \
                        --schedule "2026-09-27 08:00" --tz America/Denver

Prints the post id and permalink on success. On failure it prints Meta's own
error and exits non-zero — it never reports a post as published on a guess.
"""
import argparse
import json
import mimetypes
import os
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

GRAPH = "https://graph.facebook.com/v21.0"
EXPECTED_PAGE = "new beginnings mental health"


def _ctx():
    # Honour the session's proxy CA bundle when one is present.
    bundle = "/root/.ccr/ca-bundle.crt"
    return ssl.create_default_context(cafile=bundle if os.path.exists(bundle) else None)


def _call(url, data=None, headers=None, method=None):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, context=_ctx(), timeout=120) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        try:
            msg = json.loads(body)["error"]["message"]
        except Exception:
            msg = body[:600]
        sys.exit(f"FAILED — Meta returned HTTP {e.code}: {msg}")
    except urllib.error.URLError as e:
        sys.exit(f"FAILED — could not reach {GRAPH}: {e.reason}\n"
                 "If this is a proxy 403, graph.facebook.com is not yet allowed "
                 "by the environment's network policy.")


def _multipart(fields, filename, filebytes, content_type):
    boundary = uuid.uuid4().hex
    out = bytearray()
    for k, v in fields.items():
        out += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n"
                f"{v}\r\n").encode()
    out += (f"--{boundary}\r\n"
            f"Content-Disposition: form-data; name=\"source\"; filename=\"{filename}\"\r\n"
            f"Content-Type: {content_type}\r\n\r\n").encode()
    out += filebytes + b"\r\n"
    out += f"--{boundary}--\r\n".encode()
    return bytes(out), f"multipart/form-data; boundary={boundary}"


def verify_page(page_id, token):
    """Confirm the token really points at NBMH before anything is posted."""
    q = urllib.parse.urlencode({"fields": "id,name", "access_token": token})
    page = _call(f"{GRAPH}/{page_id}?{q}")
    name = page.get("name", "")
    if EXPECTED_PAGE not in name.lower():
        sys.exit(f"REFUSED — token points at {name!r}, not the New Beginnings "
                 "Mental Health page. Nothing was posted.")
    return page


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image")
    ap.add_argument("--caption")
    ap.add_argument("--schedule", help='local time, "YYYY-MM-DD HH:MM"')
    ap.add_argument("--tz", default="America/Denver")
    ap.add_argument("--check", action="store_true",
                    help="verify credentials and the page identity, post nothing")
    args = ap.parse_args()

    page_id = os.environ.get("NBMH_FB_PAGE_ID")
    token = os.environ.get("NBMH_FB_PAGE_TOKEN")
    missing = [n for n, v in (("NBMH_FB_PAGE_ID", page_id),
                              ("NBMH_FB_PAGE_TOKEN", token)) if not v]
    if missing:
        sys.exit("NOT CONFIGURED — missing " + ", ".join(missing) +
                 ".\nSet them in the cloud environment's settings, then start a "
                 "new session.")

    page = verify_page(page_id, token)
    if args.check:
        print(f"OK — credentials resolve to {page['name']} (id {page['id']}). "
              "Nothing was posted.")
        return

    if not args.image or not args.caption:
        sys.exit("--image and --caption are required unless --check is given")

    caption = open(args.caption).read().strip()
    blob = open(args.image, "rb").read()
    ctype = mimetypes.guess_type(args.image)[0] or "image/jpeg"

    fields = {"caption": caption, "access_token": token}
    when = None
    if args.schedule:
        local = datetime.strptime(args.schedule, "%Y-%m-%d %H:%M").replace(
            tzinfo=ZoneInfo(args.tz))
        if local < datetime.now(ZoneInfo(args.tz)) + timedelta(minutes=10):
            sys.exit("REFUSED — Meta requires a scheduled time at least 10 "
                     "minutes out. Nothing was posted.")
        when = local
        fields["published"] = "false"
        fields["scheduled_publish_time"] = str(int(local.timestamp()))

    body, ctype_hdr = _multipart(fields, os.path.basename(args.image), blob, ctype)
    res = _call(f"{GRAPH}/{page_id}/photos", data=body,
                headers={"Content-Type": ctype_hdr})

    post_id = res.get("post_id") or res.get("id")
    if when:
        print(f"SCHEDULED in Meta for {when:%Y-%m-%d %H:%M %Z} — id {post_id}")
        print("Confirm it under Planner in Meta Business Suite before calling "
              "it scheduled anywhere else.")
    else:
        print(f"PUBLISHED — id {post_id}")
        print(f"https://www.facebook.com/{post_id}")
    print("Record the result in content/nbmh/POSTING_LOG.md.")


if __name__ == "__main__":
    main()
