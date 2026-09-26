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

## Publishing — delivered to Charles, by necessity

The daily Routine builds the post, tries to publish, and if publishing is not
available hands Charles the JPEG and caption instead. Either way he gets a
finished post every morning; no day is ever lost to setup.

Automatic publishing is one saved credential away and is documented in
`SETUP-FACEBOOK.md`. **Raise it with him every day until it works** — he asked
for automation and said plainly that going quiet about a broken pipeline is
worse than being nagged. One or two lines naming the one step, at the top of the
morning message.

`published` is claimed only when `publish-facebook.py` returns a post id.
Otherwise the row reads `delivered`.

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
