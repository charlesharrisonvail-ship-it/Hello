#!/usr/bin/env python3
"""Publish an NBMH post to the New Beginnings Mental Health Facebook page.

Goes straight to Meta's Graph API — no third-party scheduler in the middle, so
there is no seat or quota to run out of. The image is uploaded as multipart
form data, so the graphic never needs to be hosted at a public URL first.

Credentials come from the cloud environment's settings, either way:

  * An **API credential** (preferred). Allowed website `graph.facebook.com`,
    with the default `Authorization: Bearer <token>` header. The proxy attaches
    it to every Graph call, so nothing here ever sees the token — which is why
    no access_token parameter is sent below.

  * Or an environment variable, `NBMH_FB_USER_TOKEN` (a User token, from which
    the page and its page-token are resolved via /me/accounts) or
    `NBMH_FB_PAGE_TOKEN`.

Either way the token needs pages_show_list and pages_manage_posts.

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

# Empty when an API credential is supplying the Authorization header instead.
TOKEN = os.environ.get("NBMH_FB_USER_TOKEN", "")


def _ctx():
    # Honour the session's proxy CA bundle when one is present.
    bundle = "/root/.ccr/ca-bundle.crt"
    return ssl.create_default_context(cafile=bundle if os.path.exists(bundle) else None)


def _auth(params):
    """Attach the token, unless the proxy is injecting it for us."""
    if TOKEN:
        params = dict(params, access_token=TOKEN)
    return urllib.parse.urlencode(params)


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


def resolve(page_id, page_token, user_token):
    """Work out which page and which token to use, and prove it is NBMH.

    A user token is the easy path: /me/accounts returns every page the person
    administers, each with its own page-token, so neither the page id nor a
    separate page-token has to be found by hand.
    """
    if not page_token:
        q = _auth({"fields": "id,name,access_token"})
        pages = _call(f"{GRAPH}/me/accounts?{q}").get("data", [])
        if not pages:
            sys.exit("FAILED — that token administers no pages. Check it was "
                     "granted pages_show_list.")
        # A page token comes back per page, so publishing needs no further
        # lookup — but it inherits the user token's scopes, so pages_manage_posts
        # must have been granted when the token was generated.
        match = [p for p in pages if EXPECTED_PAGE in p.get("name", "").lower()]
        if not match:
            listed = ", ".join(repr(p.get("name", "?")) for p in pages)
            sys.exit("REFUSED — no New Beginnings Mental Health page on that "
                     f"token. It administers: {listed}. Nothing was posted.")
        if len(match) > 1:
            listed = ", ".join(f"{p['name']} ({p['id']})" for p in match)
            sys.exit(f"REFUSED — more than one match: {listed}. Set "
                     "NBMH_FB_PAGE_ID to pick one. Nothing was posted.")
        page = match[0]
        return page["id"], page.get("access_token"), page["name"]

    # A page token was supplied. Confirm what it actually points at.
    target = page_id or "me"
    q = urllib.parse.urlencode({"fields": "id,name", "access_token": page_token})
    page = _call(f"{GRAPH}/{target}?{q}")
    name = page.get("name", "")
    if EXPECTED_PAGE not in name.lower():
        sys.exit(f"REFUSED — token points at {name!r}, not the New Beginnings "
                 "Mental Health page. Nothing was posted.")
    return page["id"], page_token, name


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
    page_token = os.environ.get("NBMH_FB_PAGE_TOKEN")
    # No env token is not an error: an API credential injects the Authorization
    # header at the proxy, so the call is made without one and Meta answers.
    page_id, token, page_name = resolve(page_id, page_token, TOKEN)
    if args.check:
        print(f"OK — resolves to {page_name} (id {page_id}). Nothing was posted.")
        return

    if not args.image or not args.caption:
        sys.exit("--image and --caption are required unless --check is given")

    caption = open(args.caption).read().strip()
    blob = open(args.image, "rb").read()
    ctype = mimetypes.guess_type(args.image)[0] or "image/jpeg"

    fields = {"caption": caption}
    if token:
        fields["access_token"] = token
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
