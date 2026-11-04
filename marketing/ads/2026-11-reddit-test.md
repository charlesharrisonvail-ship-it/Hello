# Reddit test: AiRE vs. the top AI programs (Charles approved 2026-11-04)

Video: `aire-ad-reddit-4x5.mp4`, 1080x1350, 38 s, rendered from the
`AireVsBootcampsAdReddit` composition in `marketing/remotion/aire-vs-bootcamps/`
(the approved ad-safe cut, reframed to 4:5 because Reddit video ads take 1:1 or 4:5,
not 9:16). "Made with AI" is on every frame.

Re-render: `npx remotion render src/index.ts AireVsBootcampsAdReddit out/aire-ad-reddit-4x5.mp4`

## Budget

$5 a day (Reddit's minimum), Mon 2026-11-09 to Sun 2026-11-15: **$35 total, capped.**

## Setup at ads.reddit.com (Charles does this; Claude has no Reddit access)

1. Sign in at **ads.reddit.com** and create an ad account named **AiRE Estate**.
2. **New campaign.** Objective: **Traffic**. Name: `AiRE vs AI programs - Nov`.
3. **Ad group**
   - Location: **United States**
   - Communities: **r/realtors**
   - Keywords: `real estate agent`, `realtor`, `listing photos`, `listing video`
   - Leave any audience expansion **off**
   - Daily budget **$5**; schedule **Mon Nov 9 - Sun Nov 15**; bidding automatic
4. **Ad**
   - Format: **Video**. Upload `aire-ad-reddit-4x5.mp4`.
   - Headline (paste):
     `Real estate agents: an hour of AI lessons for $67. Claude plan not included.`
   - Destination URL: `https://learn.aireestate.com`
   - Call to action: **Learn More**
   - Allow comments: **off**, if offered (nobody has to moderate)
5. **No Reddit Pixel or Conversions API.** The privacy page promises no
   advertising trackers.
6. Submit. Reddit reviews ads before they run.

## Judge it by

Clicks, cost per click and Stripe sales during the week. One $67 sale covers the
$35. Charles sends a screenshot of the results; Claude reads it and says keep,
adjust or stop.
