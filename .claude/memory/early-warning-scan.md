---
name: early-warning-scan
description: the weekly EpiVail early-warning scan for new residential projects at the approval stage - schedule, delivery, and how to update its known-projects list
---

Scheduled task "EpiVail early-warning scan" (trig_01HBiUxDbfbgWvh46Q6mUfLn),
created 2026-11-02 at Charles's request. It runs Fridays at 3:37 p.m. Mountain
in a fresh session, scans town and county planning agendas plus local news,
and ranks finds as PITCH NOW, WATCH or BUYER-SIDE ONLY. It is read-only. The
digest is its final message, pushed to Charles's phone. This account cannot
attach Gmail to scheduled tasks, so it sends no email.

Why it exists: pitches land when a project is caught at approval, before a
sales team is chosen (Dowd Junction, Red Mountain Ranch). The luxury projects
checked later (Evergreen, The Apogean) already had their sales handled.

The prompt and its "already known" list are in `projects/early-warning/`. When
a project is pitched or ruled out, update both the file and the scheduled task
(update_trigger), so it isn't reported again.
