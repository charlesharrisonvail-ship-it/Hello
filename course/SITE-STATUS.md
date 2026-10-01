# AiRE Estate site status — verified 2026-10-01

Every line below was checked against the live site and the live HeyGen account,
not inferred.

## Where the live site actually comes from

`learn.aireestate.com` → GitHub Pages → branch **`claude/stan-store-access-k4hjdu`**,
folder `docs/`. Evidence: served page is 84,836 bytes and that branch's
`docs/index.html` is 84,836 bytes; repo push time 21:18:12Z matches the page's
`last-modified` 21:18:51Z; `server: GitHub.com` in the response headers.

Neither `main` (no `docs/` folder at all) nor `claude/workflows-skilljar-link-zcvg47`
serves anything.

## The enrolment pause is NOT in effect

| Checked on the live page | Result |
|---|---|
| `LAUNCHED` switch present | no — 0 occurrences |
| "Opening soon" disabled buttons | no |
| Lead to Keys sold as a purchase | **yes**, $97, live Stripe link |
| Module 4 method given away verbatim | **yes** — "Upload both pictures" still present |
| `noindex` meta | no — the page is indexable |
| "updates for life" | gone (correctly) |

The pause was committed to `claude/workflows-skilljar-link-zcvg47`, which the
site does not serve, so it never took effect.

## Stripe links — both verified live

| Link | Product | HTTP |
|---|---|---|
| `buy.stripe.com/cNi14m4SA5kN46PcSo2kw00` | Course, $67 | 200 |
| `buy.stripe.com/6oU00ifxecNffPxcSo2kw01` | Lead to Keys, $97 | 200 |

Both resolve and both can take payment. Neither was changed. Per the owner's
instruction, Stripe is not to be touched.

## Course video hosting — one already broken

Part One (`course.html`), 8 slots incl. prologue: all return 206. Hosted on
`d2ol7oe51mr4n9.cloudfront.net` (HeyGen's CDN), unsigned URLs.

Lead to Keys (`lead-to-keys-course.html`), 10 slots: modules 2–10 return 206.
**Module 1 returns 403 — already dead.**

Module 1 points at
`files2.heygen.ai/aws_pacific/avatar_tmp/.../f023d37ad55f4a319a9cfb0e8cc46bb9.mp4`
with the signature stripped. The source video is fine — HeyGen video id
`f023d37ad55f4a319a9cfb0e8cc46bb9`, "Lead to Keys | Welcome", completed,
34.8 seconds. But its only URL is a **signed** one that expires
1791489996 (~7 days out), so pasting the signed version back in buys about a
week before it dies again.

Two further notes on that slot: 34.8 seconds is a welcome clip, not a module;
and there are four videos in the account titled "Lead to Keys | Welcome".

**Durable fix:** download the MP4s and host them somewhere under AiRE Estate's
own control, then put those URLs in `VIDEOS`. A HeyGen URL in a course player
is a dead link with a timer on it.

## Still outstanding (unchanged, needs the owner)

- Modules 4–7 of Part One re-rendered — narration is ready in
  `course/narration-scripts.html`; the videos still carry the old wording.
- Module 1 of Part One: filmed or avatar — undecided.
- Legal review of the AB 723 / NAR disclosure beat in Module 4.
- The $1,500 tier promises ten certifications with no seat management built.
- Module 5 still shows the tool author's referral links, not AiRE Estate's.
