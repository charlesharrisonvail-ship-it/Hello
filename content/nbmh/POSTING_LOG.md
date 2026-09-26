# NBMH posting log

One row per post. **Status is a chain of facts, and each link is claimed only
with evidence.** Never mark a post `published` or `verified` without seeing it
on the live New Beginnings Mental Health Facebook page or in Meta's
published/scheduled content.

Status values: `drafted` · `uploaded` · `scheduled` · `published` · `verified` ·
`failed`

| Date | Concept | Graphic | Caption | Compliance | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-26 | Low Sun — seasonal light, sleep/energy/focus | created | created | PASS | **drafted** | Awaiting a Facebook page connection; nothing has been sent to Meta. |

## Publishing — connected? Not yet. The path is known.

Checked 2026-09-26. Posting to a Facebook page **is** possible from here:

- **Windsor.ai `facebook_organic`** exposes `create_photo_post`, which publishes
  an image plus caption to a connected Facebook page. This is the route to use.
- Ruled out: OpusClip posts to Facebook but only video from an OpusClip project,
  and NBMH is graphics-only. Higgsfield publishes to TikTok only. Windsor's
  `facebook` connector is Meta **Ads**, not page posts.

**Two things are still needed before anything can be published:**

1. **Connect the New Beginnings Mental Health page.** `facebook_organic` has no
   connected account today. The only Meta account connected is
   `EpiVail Collective - Agent Attraction`, under the Ads connector — the wrong
   brand and the wrong surface. Charles authorizes the page here:
   <https://onboard.windsor.ai/connect?connector=facebook_organic&next=/facebook_organic/authorize>
   Afterwards, confirm with `get_connectors` and check that the account listed
   is **New Beginnings Mental Health** before posting anything.
2. **A public URL for the graphic.** `create_photo_post` takes an `image_url`,
   not a file upload, so each day's JPEG must be hosted at a reachable URL first
   (publishing it as an Artifact asset works).

`create_photo_post` publishes immediately — it has no scheduled-time parameter.
Posts that must land at 8:00 a.m. America/Denver either go out at that hour or
get scheduled by hand in Meta Business Suite.

Until step 1 is done, every post here stops at `drafted`, and the daily
deliverable is the finished JPEG plus caption for Charles to post. That is the
honest state, and it gets reported as such every single day.
