---
name: report-style
description: How Charles wants results reported - outcome only, no git/PR plumbing
---

Charles finds git, branch and PR housekeeping detail useless (said 2026-10-09,
after a long PR-merge report). Report the outcome in a line or two: what he can
now do or see, and anything that needs his decision. Leave out commit hashes,
conflict resolution, branch names and check results unless something failed or
he asks. Leave the remaining open PRs (#2, #5, #8, #12) alone unless he raises them.
