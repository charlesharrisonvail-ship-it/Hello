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
| 2026-09-26 | Low Sun — seasonal light, sleep/energy/focus | created | created | PASS | **delivered** | JPEG and caption handed to Charles to post. |

## Publishing — automatic, via the Meta Graph API

Charles wants this hands-off: the post makes itself and goes up without him.
The route is `scripts/publish-facebook.py`, straight to Meta's Graph API — the
graphic uploads as multipart form data so it needs no public hosting, and Meta's
own scheduling is available for the 8:00 a.m. slot.

Windsor.ai is out; its seat is maxed. Nothing in the connector registry posts
organically to a Facebook page.

Status as of 2026-09-26: app `1404240181119155` created, token valid, and it
resolves the New Beginnings page (`1236318822895617`). Missing only the
`pages_manage_posts` scope, plus `graph.facebook.com` on the network policy and
the token stored as `NBMH_FB_USER_TOKEN`. See `SETUP-FACEBOOK.md`.

Charles has already spent a long evening in Meta's developer console for this.
**Do not raise the remaining step with him unless he brings it up.**

The daily Routine tries to publish and falls back to handing Charles the JPEG
and caption if the token is not ready, so a missing token never costs a day.
`published` is claimed only when the script returns a post id.

## Daily automation

Routine `trig_01USBiEN12gveFCv6VvYNZpL` — "NBMH daily Facebook post", 6:49 a.m.
America/Denver, fresh session each day. It drafts the day's graphic and caption,
runs the compliance gate, logs the result, and pushes to
`claude/newbeginnings-social-media-manager-4s9d6n`.

**Caveat, stated plainly:** the Routine was created without connectors, so its
daily sessions run **without** Windsor.ai and Higgsfield tools. Those sessions
build code-based graphics and captions and hand them over, which is the whole job
now that posting is manual. The Higgsfield tools are connector-based, though, so
the Tuesday/Friday image budget is unavailable to these sessions. To get that
back, Charles recreates the Routine from the Routines UI on claude.ai with
Higgsfield attached, then deletes this one. Not urgent — the code-built graphics
stand on their own.
