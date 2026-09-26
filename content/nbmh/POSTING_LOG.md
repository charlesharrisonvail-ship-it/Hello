# NBMH posting log

One row per post. **Status is a chain of facts, and each link is claimed only
with evidence.** Never mark a post `published` or `verified` without seeing it
on the live New Beginnings Mental Health Facebook page or in Meta's
published/scheduled content.

Status values: `drafted` · `delivered` (handed to Charles to post) · `failed`.
`published` and `verified` are reserved for visible evidence and are not in use
while posting is manual.

| Date | Concept | Graphic | Caption | Compliance | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-26 | Low Sun — seasonal light, sleep/energy/focus | created | created | PASS | **delivered** | JPEG and caption handed to Charles to post. |

## Publishing — manual, by decision

Charles posts these by hand. Automatic publishing was attempted on 2026-09-26
and **shelved**: Windsor.ai's seat is maxed out, and Meta's own API setup turned
into a five-screen maze of developer accounts, apps, use-case pickers, and token
flows that was not worth his time for one graphic a day. See `SETUP-FACEBOOK.md`
for what exists if it is ever revisited.

So the daily deliverable is the finished JPEG plus the caption, handed to Charles
each morning. Status is `delivered`. **Never `published` or `verified`** — Claude
cannot see the page, and says so rather than guessing.

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
