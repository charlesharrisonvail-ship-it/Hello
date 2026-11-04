#!/usr/bin/env python3
"""Rebuild docs/feed.xml (RSS of the AiRE guides) from the guide pages' Article JSON-LD.

Run after adding or changing a guide:  python3 marketing/social/build_feed.py
New guide pages also need the feed <link rel="alternate"> tag before their canonical link.
"""
import glob, html, json, re
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2] / "docs"
items = []
for f in glob.glob(str(DOCS / "guides" / "*.html")):
    if f.endswith("index.html"):
        continue
    m = re.search(r'<script type="application/ld\+json">(\{"@context".*?"Article".*?)</script>', open(f, encoding="utf-8").read(), re.S)
    ld = json.loads(m.group(1))
    d = datetime.fromisoformat(ld["datePublished"]).replace(hour=12, tzinfo=timezone.utc)
    items.append((d, ld["headline"], ld["url"], ld["description"]))
items.sort(reverse=True)
e = html.escape
body = "".join(f"""  <item>
    <title>{e(t)}</title>
    <link>{u}</link>
    <guid isPermaLink="true">{u}</guid>
    <pubDate>{format_datetime(d)}</pubDate>
    <description>{e(desc)}</description>
  </item>
""" for d, t, u, desc in items)
(DOCS / "feed.xml").write_text(f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>AiRE Estate Academy Guides</title>
  <link>https://learn.aireestate.com/guides/</link>
  <atom:link href="https://learn.aireestate.com/feed.xml" rel="self" type="application/rss+xml"/>
  <description>Plain-English guides for real estate agents using AI.</description>
  <language>en-us</language>
  <lastBuildDate>{format_datetime(items[0][0])}</lastBuildDate>
{body}</channel>
</rss>
""", encoding="utf-8")
print(f"feed.xml: {len(items)} guides")
