---
name: jarvis-plan
description: Plan the day and close it out — write today's top three priorities to the vault in the morning, and log the evening reflection with tomorrow queued. Use when the user says plan today, what are my top 3, close the day, end of day, shut down, or asks what they should work on now or queue for tomorrow.
---

# Plan — open the day, close the day

Two halves of one loop. Both write to `outputs/plans/`.

## 09:00 — Plan today

1. Read yesterday's close note (`outputs/plans/<yesterday>-close.md`) and the
   day's brief (`outputs/briefs/<today>-brief.md`).
2. Read the calendar — priorities have to fit the actual open blocks.
3. Propose **exactly three** priorities. Not five. If the user pushes for more,
   write three and list the rest under `## Also, if the day breaks open`.

Each priority is written as a finishable outcome, not a topic:

```
1. Ship the HUD reveal cut — final export, uploaded, thumbnail set  (2h, 09:30 block)
2. …
```

Attach the time block from the calendar. A priority with no block on the
calendar is a wish — say that and either find it a block or drop it to the
overflow list.

Write `outputs/plans/YYYY-MM-DD-plan.md`, frontmatter `type: plan`,
`tags: [plan]`, linked to the brief and the date note.

## 19:00 — Close the day

1. Read this morning's plan.
2. Ask (or infer from the vault) what actually landed. Mark each priority
   `done` / `partial` / `slipped`. Record slips honestly — a close note that
   always reads "all done" is worthless as a record.
3. Log a two-line reflection: what worked, what got in the way.
4. Queue tomorrow: carry slipped items forward and name the single first move
   for the morning.

Write `outputs/plans/YYYY-MM-DD-close.md`, frontmatter `type: plan`,
`tags: [plan, close]`, linked to the day's plan.

## Anytime — "what should I work on"

Read today's plan, check the clock against the blocks, and answer with one
thing. Not a menu. If everything on the plan is done, say so and offer the
overflow list.
