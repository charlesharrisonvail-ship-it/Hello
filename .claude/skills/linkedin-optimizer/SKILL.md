---
name: linkedin-optimizer
description: >
  Data-driven LinkedIn optimization workflow for Charles Harrison (EpiVail —
  International Attraction AI). Use this skill whenever Charles mentions
  LinkedIn analytics, LinkedIn growth, profile optimization, post performance,
  content strategy for LinkedIn, exporting LinkedIn data, or improving reach
  and engagement. Also
  activate when Charles uploads a LinkedIn analytics CSV or screenshot, asks
  which posts or days perform best, or wants headline/profile rewrites.
  Works alongside epivail-brand-system (voice and tone) and
  epique-agent-recruitment (audience: agents nationally and
  internationally).
---

# LinkedIn Optimizer — EpiVail Edition

A 9-step, repeatable loop: export analytics → analyze in Claude → act on the
findings → re-measure. Adapted from the "How to Optimize Your LinkedIn with
Claude" workflow and tailored to Charles's brand and audience.

## Audience & Goal Context (always apply)

- Primary audience: real estate agents Charles is attracting to Epique Realty
  (US, France, Germany, Mexico) — see `epique-agent-recruitment`.
- Secondary audience: buyers/sellers/investors in Charles's home market.
- All content must follow `epivail-brand-system` voice and tokens. Where that
  skill's positioning conflicts with the International Attraction AI identity,
  this file wins — the brand skill has not yet been updated.
- Byline is always exactly: **Charles Harrison, Epique Area/Growth Leader** —
  never append a regional descriptor.

## The 9-Step Loop

### Step 1 — Access Analytics
LinkedIn profile → "Show all analytics." Note the last-30-days baseline:
profile views, post impressions, engagements, new followers.

### Step 2 — Export Profile Data
Export/download the full analytics dataset as CSV (full range, not a snippet,
for better trend detection).

### Step 3 — Organize the Data
Open in Google Sheets (never Excel — Charles does not use Microsoft Office).
Keep: date, impressions, engagement rate, profile views, new followers, post
topic, post format. Drop everything else.

### Step 4 — Upload to Claude
Charles pastes or uploads the CSV. Claude reviews and states what stands out
before being asked — lead with the headline insight.

### Step 5 — Analyze Trends
Identify: best-performing days, topics that drive engagement, posts that
generate the strongest follower growth, and format performance (text, carousel,
video/Reel crosspost). Segment agent-attraction posts vs. property/market posts
— they have different audiences and should be scored separately.

### Step 6 — Visualize Insights
Present findings as a compact table or chart (use chart tools when available):
Top Day, Avg Engagement Rate, Top Topic, Best Format — plus a 4-6 week trend
line when the data supports it.

### Step 7 — Optimize Strategy
Convert analysis into actions: double down on top topics, schedule for top
days, lean into the best formats. Output a concrete 2-week posting calendar
(day, topic, format, hook) rather than generic advice.

### Step 8 — Experiment & Refine
Apply recommendations ~2-4 weeks, then rerun the loop on fresh data. Track
whether the changes moved the baseline metrics from Step 1.

### Step 9 — Reusable Prompt Library
Maintain and reuse these prompts (adapt to current data):

1. **Profile audit** — "Audit my LinkedIn profile against my goal of attracting
   agents to Epique. Score headline, About, Featured, and Experience for
   clarity and conversion. Rewrite the weakest section."
2. **Headline rewrite** — "Rewrite my headline for clarity and impact. Keep the
   exact byline 'Charles Harrison, Epique Area/Growth Leader' and the
   International Attraction AI positioning."
3. **Post performance analysis** — "Here's my last 30/90 days of post data.
   Which topics, days, and formats win? What should I stop doing?"
4. **Content strategy** — "Based on this analysis, build a 2-week content
   calendar targeting agent attraction first, market authority second."
5. **Repurpose winners** — "Take my top 3 posts and adapt them into TikTok
   (@epivail) scripts and Facebook (@CharlesHarrisonVail) versions."

## Integration Notes

- Cross-post winners through the existing TikTok/Facebook creator channels;
  Remotion components (`remotion-epivail-video`) can turn top posts into video.
- Leads or agent replies generated from LinkedIn route per
  `lofty-crm-workflows`.
- Never mix New Beginnings Mental Health content into this pipeline — strict
  silo.
- Deliverables as Google Docs/Sheets, HTML, or PDF only — never .docx/.pptx.
