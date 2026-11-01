---
name: aire-posting-routine
description: how the AiRE Estate Facebook posting routine works, why it double-posted in Oct 2026, and the safeguards now in post.py
---

The "AiRE Estate Facebook posts" scheduled task (Mon/Wed/Fri 8:52 Denver, AiRE
Estate cloud environment) clones this repo, checks out branch
`ccr-754bcf55-qiikmr`, runs `marketing/social/post.py`, and pushes
`posted.json`. Queue changes must go on THAT branch, not a working branch.

From Oct 23 to 30, 2026 its pushes were refused (403: the Hello repo was not in
the routine's sources). The record never saved, so each run reposted the oldest
due post (post 3, "I'm a working agent"). Fixed 2026-11-01 (commit 7aff296):
- post 3 recorded
- post.py now reads the page's recent posts and videos and skips (records as
  "already-live") anything already published
- an optional `"priority"` field jumps the queue
- one new post per run

Still Charles's to do: add charlesharrisonvail-ship-it/Hello to the routine's
or AiRE Estate environment's repositories so records save.
