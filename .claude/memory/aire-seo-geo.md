---
name: aire-seo-geo
description: AiRE Estate SEO and AI-search (GEO) setup - llms.txt, FAQ and HowTo schema on learn.aireestate.com, and the free/paid status of Search Console, OpenSEO and GEO Optimizer
---

**On-site AI-search work is done** (2026-10-28, branch `ccr-a3a2fdb3-b1w5t1`, cut
from the live branch `claude/stan-store-access-k4hjdu`):

- `docs/llms.txt` summarizes the courses for AI engines. Every line is copied from
  the live pages; when prices, module counts or the Team tier change, change it too.
- `index.html` and `lead-to-keys.html` carry `FAQPage` JSON-LD built word for word
  from their visible FAQ. **Edit a FAQ answer and you must edit the schema** or
  Google treats the mismatch as spam.
- `install-claude-code.html` has OG tags and `HowTo` JSON-LD; its steps have ids
  `step-1`..`step-7`.
- `robots.txt` already allows every crawler (AI bots included). Do not add
  per-bot groups: a named group overrides `*` and would drop the
  `/media/l2k-m1.bin` block.

**The three tools from the "SEO expert" graphic, as checked:**

1. Search Console: Google verification file is in `docs/`. **Not through Windsor.ai**:
   its free trial allows one account and the Facebook ad account holds it
   (2026-10-28); more needs a paid plan. Free route: in Search Console,
   Performance -> Export -> Google Sheets, and read the sheet with the Google
   Sheets connector.
2. OpenSEO (every-app/open-seo): open source, but its data is DataForSEO,
   pay-as-you-go. That is a spend, so Charles decides (`recall.py paid`).
3. GEO Optimizer (Auriti-Labs/geo-optimizer-skill): free, open source, scores a
   site 0-100 for AI citation. Free audit at geoready.dev.

**Search Console baseline** (export 2026-10-28, Oct 9-26, web): 20 impressions,
0 clicks. One query, "aireai" (pos 4). Pages shown: home (10, pos 2.4), terms
(10), ask-aire (3), lead-to-keys (2), privacy (2). The three guides and the
install lesson had **zero impressions**, likely not indexed yet. PR #43 merged
and live 2026-10-28; Charles requested indexing for the guides, install lesson
and Lead to Keys the same day (Lead to Keys was already indexed). Next:
re-export about mid-November and compare to this baseline; the near-top fix
list needs that later data.

**Guides added 2026-10-28 (PR #44):** fair housing in AI listing copy, AI virtual
staging disclosure, TCPA texting consent. HUD's 2024 AI advertising guidance was
**withdrawn** effective 2025-09-17 (91 FR 17291); never cite it as current.
Mid-November re-export reminder is scheduled for 2026-11-16.

**Merging:** Charles's browser is often not signed in to GitHub, so he sees no
merge button. When he says "merge it", merge the PR for him.

**Paid ads (2026-11-01):** Charles says the site advertises the week of 2026-11-02.
The open items are in `marketing/ads/ad-launch-list.md`; read it before asking him
anything about reels or ads.

**No Meta ads, ever** (Charles, 2026-11-04: "I am NOT using META....way to expensive").
No Facebook/Instagram paid ads or boosts for AiRE. The approved ad video
(`AireVsBootcampsAd`) still stands; ask where it runs.
Checked 2026-11-04: **Zeely** = Meta ads underneath ($29.95-79.95/mo plan + ad
spend + up to 12% fee), so it is ruled out with Meta. **ChatGPT ads** (ads.openai.com,
self-serve since 2026-05-05): $25/day minimum per campaign, CPM about $25-60, CPC
bids $3-5 (secondary sources). Recommended instead: free organic posting plus the
free ChatGPT-citation route (llms.txt, FAQ schema, guides). Offered a capped 3-day
$75 ChatGPT test only if Charles wants paid.
Non-Meta options checked 2026-11-04 (secondary sources): Reddit $5/day min, CPC about
$0.50-2.50, can target r/realtors (recommended: 7-day $35 test with the approved
video); YouTube Shorts via Google Ads, no min; Microsoft Ads $1/day; Quora $5/day;
LinkedIn $10/day (skip: pricey, and AiRE can't front his name); TikTok ~$50/day
(skip). Awaiting his pick.

**Reddit (2026-11-04):** Charles made the community **r/AiREEstate** ("AiRE Estate"),
moderated from his Reddit account (display name "AiRE Estate Academy", auto username
u/WhileNo5269; he was told it can be changed once within 30 days, before posting).
The site lists it next to Facebook on the home and Lead to Keys pages, in the
Organization `sameAs` and in `llms.txt`.
First five r/AiREEstate posts drafted 2026-11-04 in `marketing/social/reddit/first-five-posts.md`
(one a day from Nov 5, pin post 1). Charles posts them by hand; Claude has no Reddit access.
**Claude cannot post to Reddit** (checked 2026-11-04): no Reddit credential in the
environment, oauth.reddit.com returns 403, and OpusClip has no Reddit support.
OpusClip's connected accounts include an **AiRE Estate LinkedIn company page**
(urn:li:organization:143976723) and the AIRE Estate Facebook page; the YouTube,
TikTok and Instagram accounts there are EpiVail's, never AiRE's.
