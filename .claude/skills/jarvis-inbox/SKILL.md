---
name: jarvis-inbox
description: Build the morning brief — triage inbox, summarize the day's calendar, and surface what actually needs a reply — then save it to the vault and read it aloud. Use when the user says morning brief, what's in my inbox, what's on my calendar today, catch me up, or start of day.
---

# Inbox — the morning brief

Runs at 07:00 in the daily routine, or on demand.

## Gather

1. **Mail** — via the Gmail / Microsoft 365 tools if connected. Fetch unread
   and today's threads only. Don't page through the archive.
2. **Calendar** — via Google Calendar / Outlook tools. Today's events plus
   anything tomorrow before 10:00.
3. **Yesterday's close** — read `outputs/plans/<yesterday>-close.md` if it
   exists. Whatever the user queued last night leads today's brief.

Any source that isn't connected is simply omitted from the brief — say which
one, once, at the end.

## Triage into three buckets

- **Needs you** — a direct question, a decision, a deadline today. Name the
  person and the ask in one line each. Cap at five; if more qualify, say so.
- **FYI** — worth knowing, no action. One line total, not one line each.
- **Noise** — count only ("plus 34 newsletters").

Never draft or send a reply from the brief unless the user asks. The brief
reports; it doesn't act.

## Calendar

Render as a timeline with gaps marked, so the user can see where the work fits:

```
09:00  Content planning
11:00  — open (2h) —
14:00  Metrics pull
16:30  Call: partner intro
```

Flag conflicts and anything with no prep note in the vault.

## Save and speak

Write to `outputs/briefs/YYYY-MM-DD-brief.md`, frontmatter `type: brief`,
`tags: [brief, inbox]`, linked to the date note.

Spoken version: lead with the count that matters ("three need you, first is
X"), then the first calendar item, then stop. Under 60 words. The full brief
lives in the vault.
