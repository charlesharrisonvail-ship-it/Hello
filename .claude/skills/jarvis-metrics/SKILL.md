---
name: jarvis-metrics
description: Pull and track the user's numbers — YouTube subs and views, follower counts, site and CRM stats — then log them to the vault and report deltas against the last pull. Use when the user says metrics pull, check my numbers, how did we do this week, or asks about growth toward a subscriber or follower target.
---

# Metrics — pull the numbers, log the deltas

Runs at 14:00 in the daily routine, or on demand.

## 1. Collect

Pull from whatever is connected. Skip a source that isn't configured — never
invent a number, and never carry forward a stale one as if it were fresh.
Sources, in order of preference:

- Connected MCP analytics tools (Windsor.ai, Apollo, platform connectors)
- A project API script the repo already has
- The user reading numbers aloud in a voice session

Record for each metric: `source`, `value`, `as_of` timestamp.

## 2. Log

Append one JSON line per pull to `$JARVIS_VAULT/system/metrics.json`
(JSONL — one object per line, never rewrite the file):

```json
{"ts":"2026-08-24T14:00:00Z","youtube_subs":135000,"youtube_views_28d":2140000,"followers_li":8400}
```

Then write the human-readable report to
`outputs/reports/YYYY-MM-DD-metrics.md` with frontmatter
`type: report`, `tags: [metrics]`.

## 3. Report the deltas, not the totals

A total alone tells the user nothing they don't know. Every line gets:
current value, change since the last pull, and change over 7 days.

```
YouTube subs      135,000   +412 since yesterday   +2,890 / 7d
Views (28d)     2,140,000   -1.2%                  pace: down
LinkedIn         8,400      +38                    +190 / 7d
```

Close with one line on the primary directive — the standing target — and the
projected date at the current pace:

```
Road to 250K: 115,000 to go · +2,890/wk · at this pace, Jun 2027
```

Compute pace from the last four weeks of `metrics.json`, not from a single
delta. If there are fewer than two pulls on record, say "no baseline yet" and
skip the projection rather than extrapolating from one point.

## 4. Flag, don't editorialize

If a metric moved more than 20% against trend, state it as a flag with the
number attached. No pep talk, no doom — the user decides what it means.
