# NBMH posting log

One row per post. **Status is a chain of facts, and each link is claimed only
with evidence.** Never mark a post `published` or `verified` without seeing it
on the live New Beginnings Mental Health Facebook page or in Meta's
published/scheduled content.

Status values: `drafted` · `delivered` (handed to Charles to post) ·
`published` (the API returned a post id) · `verified` (seen on the live page) ·
`failed`

| Date | Concept | Graphic | Caption | Compliance | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-26 | Low Sun — seasonal light, sleep/energy/focus | created | created | PASS | **verified** | Post `1236318822895617_122129287905383194`, published 2026-09-28 03:34 UTC, `is_published: true` confirmed on the page. [permalink](https://www.facebook.com/122129288043383194/posts/122129287905383194) |

## Publishing — live

Automatic publishing works as of 2026-09-28. `scripts/publish-facebook.py` posts
straight to the page through Meta's Graph API and the first post is verified on
the live page.

Authentication is a **system user token**, expiration Never, stored as the
environment's `NBMH_FB_USER_TOKEN` API credential for `graph.facebook.com`. The
proxy attaches it, so the token never reaches the code. It does not expire, so
this needs no maintenance.

What it took, recorded so it is never re-derived: the Meta app had to be claimed
into the business portfolio before a system user could be given a role on it;
all three of `pages_show_list`, `pages_read_engagement` and `pages_manage_posts`
are required, and `pages_read_engagement` is the one that looks optional and is
not; and Graph API Explorer tokens expire within the hour, so they can never
drive a scheduled job.

Status is `verified` only after reading the post back from the page with
`is_published: true`. `published` means the API returned an id and nothing more.

## Daily automation

Routine `trig_01HfQzfm8TRNfcofTq8kJmfb` — "NBMH daily Facebook post", 6:49 a.m.
America/Denver, persistent session (fires into this session). It drafts the day's
graphic and caption, runs the compliance gate, logs the result, and pushes to
`claude/newbeginnings-social-media-manager-4s9d6n`.

**Higgsfield is now available:** starting 2026-10-01, the routine uses Higgsfield
to generate graphics on Tuesday and Friday, building code-based layouts for other
days. This improves visual quality on the two highest-traffic days each week while
keeping the routine on budget. All other days still use bold typographic and
editorial layouts built in code.
