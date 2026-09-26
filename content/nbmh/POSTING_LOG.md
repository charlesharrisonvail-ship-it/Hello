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

Outstanding, one-time, both on Charles's side — see `SETUP-FACEBOOK.md`:
`graph.facebook.com` allowed by the network policy, and `NBMH_FB_USER_TOKEN`
stored in the environment settings.

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
