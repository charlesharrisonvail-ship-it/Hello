# Do not deploy this folder

**This `docs/` folder is a stale staging copy. It is NOT the live site.**

`learn.aireestate.com` is served by GitHub Pages from the `docs/` folder of a
different branch: **`claude/stan-store-access-k4hjdu`**. Verified 2026-10-01 by
matching the served page byte-for-byte (84,836 bytes) and the repo push time
(21:18Z) against that branch's `docs/index.html`.

That branch holds 14 files — `index.html`, `course.html`, `lead-to-keys.html`,
`lead-to-keys-course.html`, both certification pages, `install-claude-code.html`,
`terms.html`, `privacy.html`, `media/` — and is a newer, fuller lineage than
this folder.

## Why merging this branch would break the live site

| This folder | Effect if merged over the live branch |
|---|---|
| `index.html` (68,800 bytes, older) | Replaces the live sales page with an earlier draft |
| `robots.txt` (`Disallow: /`) | De-indexes the entire live site from search engines |
| `CNAME` | Conflicts with the live branch's own CNAME |
| *(absent)* `course.html`, `lead-to-keys*.html`, `terms.html`, `privacy.html`, `media/` | Not deleted by a merge, but this folder does not carry them — do not sync this folder *onto* the live one |

**Make site changes on `claude/stan-store-access-k4hjdu`, not here.**

## What this folder was for

A paused preview of the sales page, built before it was known that the live
site came from elsewhere. `index.html` here contains three corrections the live
page still lacks, kept for reference only:

1. A `LAUNCHED` switch that disables every buy button while false.
2. Lead to Keys shown as a waitlist rather than a purchase.
3. The Module 4 method removed from the public demo section.

Lift those into the live branch deliberately if they are still wanted — do not
merge this folder wholesale.
