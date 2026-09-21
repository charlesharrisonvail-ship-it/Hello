---
name: agent-recruiting-runbook
description: EpiVail's runbook for deciding which licensed real estate agents to contact and in what order. Use whenever asked who to call, who to prioritise, which agents are recruitable, or "who should I reach out to" about a brokerage or market.
---

# Agent recruiting triage

The job is never "list good agents." It is "name the two or three worth a
call today, and say what changed for them."

## Order of operations

1. Pull recent market events and departures first. **Don't open the roster
   first** — it is 40k rows and sorting it by volume with no trigger just
   returns the same famous names every time.
2. Line each market event up against that brokerage's `avg_monthly_volume_usd`,
   `active_listings`, and `agent_headcount`. State the gap explicitly
   ("split change 08-14, headcount drops 08→09"). A brokerage with a trigger
   event and falling headcount is a live opportunity.
3. Pull the detail record for anyone already departed — they just moved and
   are **cold** for this cycle. Do not recommend them.
4. **Then** filter the roster to agents still at that brokerage, and rank by
   production. You are confirming a hypothesis, not browsing.
5. Pull detail records on the top few. Check them against the fit signals below.

## Fit signals

In rough order of how much they matter:

- **Trigger event in the last 90 days** — split change, fee introduction,
  leadership change, office closure. No trigger, no urgency, no call.
- **Production high enough that fees actually hurt** — a 15-point split cut
  costs a $40M producer real money and a $4M producer very little.
- **Team size** — a team lead brings the team; that is one conversation for
  several licences, but a longer decision cycle.
- **International or luxury-resort focus** — fits the Vail–Beaver Creek
  corridor and EpiVail's positioning.
- **Recently moved** — disqualifying. They are not moving twice in a season.

## Write-up

Two or three names, no more. For each: one line of evidence, then the angle.

> **Call first:** `<name>` (`<licence>`) — one sentence on what changed for
> them and why Epique answers it.

Never invent production numbers, splits, or earnings claims. If a figure
matters and you don't have it, write `[VERIFY: <what>]` and move on.
