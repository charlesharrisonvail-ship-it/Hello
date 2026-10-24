---
name: overnight-recruit-followups
description: The weekday 4:40 AM scheduled task that drafts recruit follow-ups while Charles sleeps
---

- Scheduled task **"EpiVail overnight recruit follow-ups"** (`trig_01RneK4qkkPQXbwSooifayhq`),
  created 2026-10-24 at Charles's request. Runs Mon-Fri 4:40 AM America/Denver in a
  fresh cloud session; push + email notification when done.
- Scope Charles chose: **follow-ups only.** Read Lofty for agent recruits due or
  overdue, write up to 10 Gmail **drafts**, finish with a morning summary. Never
  sends, never writes to Lofty, spends no credits, honors the do-not-contact list.
  New-lead finding (Apollo) stays off until Charles sets a nightly credit cap.
- Composio is not needed for it: the cloud task uses the Lofty and Gmail
  connectors directly. The Ubuntu Composio CLI only runs while his PC is on.
- **Gap at creation:** it was created with no connectors and no repo attached
  (the creating session could not pass them). Charles must add the Lofty MCP and
  Gmail connectors and the Hello repo to it in the claude.ai scheduled-tasks
  page, or each run will just report the missing tools.
