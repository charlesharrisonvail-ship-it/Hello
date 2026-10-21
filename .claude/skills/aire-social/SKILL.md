---
name: aire-social
description: >
  Writes and plans AiRE Estate posts for Instagram, TikTok and Facebook:
  captions, hooks, carousels, Stories, reel scripts, a posting plan, repurposing
  one piece into many, and a review of how the accounts are doing. Use whenever
  Charles asks for an AiRE caption, hook, carousel, Story, reel script, content
  calendar, "what should I post", "turn this into posts", Instagram or TikTok bio,
  or wants AiRE's Instagram/TikTok numbers looked at. AiRE Estate only; EpiVail
  LinkedIn work belongs to linkedin-content.
---

# AiRE social

One skill, seven jobs and an audit. Each one follows the rules below; a post that breaks one
is not ready, however good it reads.

## The rules (all from Charles; do not relax them)

- **Brand:** "AiRE Estate" (never Aire or AIRE); "AiRE" alone is the AI
  instructor. Site: `learn.aireestate.com`.
- **No name out front.** Never "Charles Harrison" in a caption, bio, card or
  cover. Say "a licensed, practicing agent (RSPS · MRP · AI PRO)" or "your
  instructor". First person ("I've sold real estate for 25 years") is fine.
  `recall.py fronted`
- **Never Epique or EpiVail.** Separate business.
- **Claude Code (not included).** Any mention of Claude Code or its $20/month
  says "(not included)"; point to claude.com/pricing. "Free" means the lesson,
  never the tool. `recall.py not-included`
- **Numbers match the site, and are sourced.** Part One $67 once; Lead to Keys
  $97; Claude Pro $20/month (Anthropic); drone shoot $250–550 and premium
  packages $400–950 (reported ranges, Sept. 2026). Check `docs/index.html`
  before using any other number, and never invent one.
- **Label AI as AI.** Any AI-made picture or voice: "Made with AI" in the
  caption, and switch on the platform's AI label when posting (Instagram "AI
  info", TikTok "AI-generated content").
- **Show the result, not the method.** No prompts, no step-by-step. The lesson
  is the product.
- **Referral links** (Higgsfield) carry "(referral link)" right after them.
- **Say which course** a "Module N" belongs to; both courses have a Module Three
  and Four.
- **Voice:** plain, numbers first, no hype. Say what it costs and what it will
  not do. Never "game-changer", "revolutionary", "10x", "guaranteed", fake
  urgency, or "comment X and I'll DM you" bait.
- **Sign-off,** when a message is signed at all (DM replies, email): `AiRE Estate
  Academy`. Captions are not signed.

## Platforms

| | Instagram | TikTok | Facebook |
|---|---|---|---|
| Video | Reel, 9:16 | 9:16 | Reel or feed video |
| Caption | first line is the hook; short | one or two lines; the video carries it | can run longer |
| Hashtags | 3–5, specific | 3–5 | 0–3 |
| Link | "link in bio" (caption links don't click) | "link in bio" | full URL works |
| Carousel | 4:5, 1080x1350 | photo mode, 9:16 | 4:5 |

Write one master caption and trim per platform rather than three from scratch.
Facebook posts go through `marketing/social/post.py`; Instagram and TikTok are
posted by Charles from his phone until an API route is set up.

## The seven jobs

**1. Caption**. Give: hook line (under 10
words, a number or a plain claim), two to four short lines, "Made with AI" if
it applies, the call to action ("Free first lesson, link in bio" or the price),
hashtags. Offer two hooks to choose from.

**2. Hooks**. Ten opening lines for a topic, each under 10 words,
each one either a number, a cost comparison, a plain admission ("It's a video,
not a 3D tour"), or a question an agent would ask. Mark the two you would test
first and why. No bait, no fake urgency: AiRE's edge is that it does not hype.

**3. Reel script**. 15–40 seconds: hook (first 2 seconds, said and
on screen), three beats, call to action. Write it as the exact words to say, so
`aire-reel-edit` can caption it from the same text. Note the on-screen title.

**4. Carousel**. 5–8 slides. Slide 1 is the hook; one idea a
slide, under 20 words each; last slide is the call to action. Give each slide's
text and a one-line picture note in the `marketing/chatgpt-brief.md` look, so it
can be made there or in any free tool. Check every finished image for his name,
"(not included)" and the right prices before it is queued.

**5. Story**. Three to five frames: a question sticker or poll, a
behind-the-scenes frame, a link sticker to `learn.aireestate.com`. Stories are
where questions come in; write the poll so the answers tell Charles something.

**6. Plan**. A week or a month: which day, which platform, which
media, which caption. Build from media that exists (`marketing/social/media/`,
`vertical/`, `docs/media/`) before asking for new footage, and say what new
footage a plan needs. Three posts a week is the pace the Facebook queue keeps.
Keep the first month's plan (`marketing/aire-estate-social-month-1.md`) as the
pattern: hook week, lesson week, Lead to Keys week, proof week.

**7. Repurpose**. One piece in (a lesson clip, a page of the
site, a Facebook post, a buyer's comment) and out: a reel script, a carousel, a
Story set, and captions for each platform. A buyer's words need their permission
before they are used (`recall.py first-buyer`).

**Audit**. Charles pastes or screenshots Instagram Insights or
TikTok Analytics (Claude cannot log in to either). Report, numbers first: which
posts got the most reach, watch time and link taps; what they have in common
(hook type, length, topic, day); and the next three posts that data points to.
Say how many posts the conclusion rests on; under ten, call it a hunch.

## Bios (current, from `marketing/social/instagram-tiktok-setup.md`)

Reuse these unless Charles changes them; keep the setup file in step if he does.

- Instagram (150 max): "AI courses for working real estate agents. / Taught by
  a licensed, practicing agent. / What it costs, and what it won't do. / Free
  first lesson ↓"
- TikTok (80 max): "AI courses for real estate agents. No hype. Free first
  lesson ↓"
- Both link to `https://learn.aireestate.com`. Handles: not yet chosen.
