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
| 2026-10-01 | Questions Worth Asking — preparation for first visit | created | created | PASS | **published** | Post `1236318822895617_122130189903383194`, published 2026-10-01 12:52 UTC. [permalink](https://www.facebook.com/1236318822895617_122130189903383194) |
| 2026-10-02 | Colorado Reaches You — telehealth access across Colorado | Higgsfield | created | PASS | **published** | Post `1236318822895617_122130412941383194`, published 2026-10-02 12:52 UTC via Higgsfield photography. [permalink](https://www.facebook.com/1236318822895617_122130412941383194) |
| 2026-10-03 | Better Sleep, Better You — quality rest and medication management | created | created | PASS | **published** | Post `1236318822895617_122130649641383194`, published 2026-10-03 12:49 UTC. [permalink](https://www.facebook.com/1236318822895617_122130649641383194) |
| 2026-10-04 | Focus Matters — ADHD education and treatment | created | created | PASS | **published** | Post `1236318822895617_122130903369383194`, published 2026-10-04 12:49 UTC. [permalink](https://www.facebook.com/1236318822895617_122130903369383194) |
| 2026-10-05 | Clarity Through Calm — anxiety and stress education | created | created | PASS | **published** | Post `1236318822895617_122131170003383194`, published 2026-10-05 12:49 UTC. [permalink](https://www.facebook.com/1236318822895617_122131170003383194) |
| 2026-10-06 | Light in the Dark — depression/mood education, recovery and hope | Higgsfield | created | PASS | **published** | Post `1236318822895617_122131424799383194`, published 2026-10-06 12:49 UTC via Higgsfield golden hour forest photography. [permalink](https://www.facebook.com/1236318822895617_122131424799383194) |
| 2026-10-07 | Rest Begins With Understanding — sleep routine and insomnia education | created | created | PASS | **published** | Post `1236318822895617_122131687311383194`, published 2026-10-07 12:50 UTC via minimalist night composition. [permalink](https://www.facebook.com/1236318822895617_122131687311383194) |
| 2026-10-08 | Care Within Reach — insurance and telehealth access | Higgsfield gpt_image_2_5 (paid, 0.25 cr; no free allowance) | created | PASS | **published** | Post `1236318822895617_122131983933383194`, published 2026-10-08 ~12:52 UTC. Bull elk in golden aspens. [permalink](https://www.facebook.com/1236318822895617_122131983933383194) |

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

**From 2026-10-08, every post is a real Higgsfield photograph** (nature,
animals, landscapes, positive scenes) set in `templates/photo.html`. Charles
rejected the code-built text cards. A photo costs 0.25 credits.
