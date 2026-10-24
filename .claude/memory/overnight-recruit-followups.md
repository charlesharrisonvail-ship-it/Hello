---
name: overnight-recruit-followups
description: The weekday 4:40 AM scheduled task that drafts recruit follow-ups while Charles sleeps
---

- Scheduled task **"EpiVail overnight recruit follow-ups"** (`trig_01UVSWm3CgJDKV5HMwZso2mX`),
  created 2026-10-24 at Charles's request. Runs Mon-Fri 4:40 AM America/Denver into
  cloud session `session_015fxsrbsZ8PG6QsdiSqwASE`, which holds the Lofty and
  Gmail connectors.
- Scope Charles chose: **follow-ups only.** Read Lofty for agent recruits due or
  overdue, write up to 10 Gmail **drafts**, finish with a morning summary. Never
  sends, never writes to Lofty, spends no credits, honors the do-not-contact list.
  New-lead finding (Apollo) stays off until Charles sets a nightly credit cap.
- Composio is not needed for it: the cloud task uses the Lofty and Gmail
  connectors directly. The Ubuntu Composio CLI only runs while his PC is on.
- A first fresh-session version had no connectors and did not show in Charles's
  scheduled list; it was deleted. Do not recreate it that way.
