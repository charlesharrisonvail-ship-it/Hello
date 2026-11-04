# AiRE Estate: final list before paid ads (week of 2026-11-02)

Charles said on 2026-11-01 the site is ready to advertise next week, which lifts the
"Facebook ad on hold" line in `courses/LAUNCH-CHECKLIST.md` for the two live courses.
The two new courses in that checklist are separate and still unreleased.

**C** = Charles. **Claude** = a Claude session.

## Reels

- [x] **Claude**: render the ad-safe "AiRE vs. the top AI programs" cut
      (`AireVsBootcampsAd`, 38 s, 1080x1920). Checked: "Made with AI" on every frame,
      no school names or scores, $67 / $97, ends on learn.aireestate.com. The MP4 is
      not committed (`out/` is ignored); re-render with
      `npx remotion render src/index.ts AireVsBootcampsAd out/aire-ad-vertical.mp4`.
- [x] **C**: watched and approved (2026-11-04).
- [x] ~~Meta boost~~ **Cancelled 2026-11-04: Charles will not pay for Meta ads ("way too
      expensive"). Never propose Meta ads or boosts again.** The video itself is approved.
- [ ] **C**: say where the approved video runs instead.
- [ ] **C**: build-reveal reel. On the laptop, make the two images and the Wan2GP
      clip (`marketing/build-reveal/README.md` on branch `ccr-38b48463-0kjql6`), send
      them in; **Claude** composes it with `compose.py` and checks every frame. Free.
- [ ] **C**: winter video, AiRE version. Render it in OpenMontage on the laptop and
      send the file; **Claude** checks it (no name, AI labeled, narrator "AiRE",
      never "$0").
- [ ] **C**: pick which existing reels to boost after the first one. Candidates:
      `paris-flight`, `02-drone-cost`, `04-module-4-lesson`, `12-free-first-step`.
      Check `03-working-agent` shows no face or name before it is used in an ad.
- [ ] **C**: Vail 3D reel (branch `claude/admiring-noether-00ppwa`): ad, organic
      post only, or skip. It sells no course, so organic only is the suggestion.

## Site, before paid traffic

- [x] **Claude**: both Stripe checkout links open (2026-11-01).
- [ ] **C**: home page FAQ "What's your refund policy?" never states the policy,
      though the pricing block says "All sales final". Approve wording to match.
- [ ] **C**: keep or remove the home page "Play Vail 3D" section for paid visitors.
- [ ] **C**: one real test purchase of each course (link -> Stripe -> confirmation ->
      access code opens the course), or approve a Claude walkthrough up to payment.
- [ ] **C**: request indexing for the three guides added 2026-10-28, if not done.

## Ad rules (settled)

- Label every ad "Made with AI". No name or face of Charles in any ad.
- Not a housing ad: it sells a course to agents.
- No Meta pixel: the privacy page promises no advertising trackers. Judge by link
  clicks, cost per click and Stripe sales.

## Why Claude cannot place AiRE ads (checked 2026-11-04)

The environment's graph.facebook.com credential signs in as **"NBMH Posting"**
(NBMH's business, never to be used for AiRE) and holds only Page posting
permissions, no `ads_management`. Windsor.ai's Facebook ad account is EpiVail's
("EpiVail Collective - Agent Attraction"). So Charles runs AiRE ads himself in Ads
Manager, on an AiRE Estate ad account.
