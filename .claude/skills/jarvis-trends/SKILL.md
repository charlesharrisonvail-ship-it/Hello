---
name: jarvis-trends
description: Scan what's moving in the user's world — AI news, trending repos, competitor posts, topic momentum — and distill it into a short ranked brief saved to the vault. Use when the user says trend scan, what's moving, AI news, what's trending, what should I make content about, or asks what happened in the space today.
---

# Trends — scan what's moving

Runs inside the 07:00 brief, or on demand.

## Scan

Use WebSearch / WebFetch plus any connected platform tools. Cover:

- **AI news** — model releases, tooling, anything that changes how the user builds
- **The user's niche** — read `wiki/` for the topics they actually publish on;
  scan for those, not for generic tech headlines
- **Trending repos and posts** — GitHub trending, platform trending in-niche

Timebox it: recency beats completeness. Anything older than 7 days is not a
trend, it's history — leave it out unless it just changed status.

## Rank by relevance to *this* user

Score each item on two axes and lead with the top three:

1. **Proximity** — does it touch what they build, publish, or sell?
2. **Actionability** — is there something to make or decide this week?

An item that scores low on both is noise, however big the headline. Cutting is
the job; a scan that returns fifteen items has done nothing for the user.

## Report

Three items, each in this shape:

```
**<Headline>** — <one line on what actually happened>
Why it matters to you: <one line, specific to their work>
Move: <the concrete thing to do, or "watch only">
```

Then one line: "also moving: X, Y, Z" for the next tier.

Always link the source. If a claim is from a single unverified post, say so —
"one source, unconfirmed" — rather than laundering it into fact.

## Save

Write to `outputs/reports/YYYY-MM-DD-trends.md`, frontmatter `type: report`,
`tags: [trends]`. If an item connects to an existing `wiki/` topic, add the link
in both directions so the graph stays connected.
