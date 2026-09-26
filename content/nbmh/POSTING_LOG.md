# NBMH posting log

One row per post. **Status is a chain of facts, and each link is claimed only
with evidence.** Never mark a post `published` or `verified` without seeing it
on the live New Beginnings Mental Health Facebook page or in Meta's
published/scheduled content.

Status values: `drafted` · `uploaded` · `scheduled` · `published` · `verified` ·
`failed`

| Date | Concept | Graphic | Caption | Compliance | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-26 | Low Sun — seasonal light, sleep/energy/focus | created | created | PASS | **drafted** | Nothing sent to Meta. Publishing blocked on the network policy and page credentials below. |

## Publishing — the route, and what is still outstanding

**Windsor.ai is out.** Charles's seat is maxed out, so `facebook_organic` is no
longer a usable path regardless of whether the page gets connected.

**The route is Meta's Graph API, direct**, via
`.claude/skills/nbmh-social/scripts/publish-facebook.py`. This is better than
Windsor was on every axis: no third-party seat or quota, the graphic uploads as
multipart form data so it never needs public hosting, and Meta's own scheduling
works, so the 8:00 a.m. America/Denver slot can be queued rather than posted by
hand at that hour.

Also ruled out: OpusClip posts to Facebook but only video from an OpusClip
project, and NBMH is graphics-only. Higgsfield publishes to TikTok only. Nothing
in the connector registry posts organically to a Facebook page — Typefully is
the closest scheduler and does not support Facebook.

**Two settings are outstanding, both on Charles's side:**

1. **Allow `graph.facebook.com`.** The environment's network policy currently
   denies it — a CONNECT 403 at the proxy, confirmed 2026-09-26. Cloud
   environment menu in the session title bar → Edit → Network access: either a
   broader access level or `graph.facebook.com` added to the allowed domains.
2. **Store a token.** One environment variable in the same Edit screen:
   `NBMH_FB_USER_TOKEN`, a User access token from the Graph API Explorer with
   `pages_show_list`, `pages_read_engagement`, and `pages_manage_posts`. The
   page and its page-token are resolved from `/me/accounts`, so no page id has
   to be hunted for — Facebook has moved where that is shown. A new session
   picks it up. The token goes in that settings form, never into chat.
   See `SETUP-FACEBOOK.md`.

Verify with `publish-facebook.py --check`, which resolves the credentials, prints
the page name, and posts nothing. The script refuses to publish unless the page
name contains "New Beginnings Mental Health", so an EpiVail token cannot post
NBMH content by accident.

Until both are done, every post stops at `drafted`, and the daily deliverable is
the finished JPEG plus caption for Charles to post by hand. That is the honest
state, and it gets reported as such every single day.

## Daily automation

Routine `trig_01USBiEN12gveFCv6VvYNZpL` — "NBMH daily Facebook post", 6:49 a.m.
America/Denver, fresh session each day. It drafts the day's graphic and caption,
runs the compliance gate, logs the result, and pushes to
`claude/newbeginnings-social-media-manager-4s9d6n`.

**Caveat, stated plainly:** the Routine was created without connectors, so its
daily sessions run **without** Windsor.ai and Higgsfield tools. Those sessions
can still build code-based graphics and captions, and publishing no longer needs
a connector at all — `publish-facebook.py` only needs the network policy and the
two environment variables. The Higgsfield tools, however, are connector-based, so
the Tuesday/Friday image budget is unavailable to these sessions. To get that
back, Charles recreates the Routine from the Routines UI on claude.ai with
Higgsfield attached, then deletes this one.
