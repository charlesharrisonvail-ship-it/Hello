---
name: incident-triage-runbook
description: The SRE team's runbook for triaging production latency and error-rate incidents. Use this whenever investigating an incident, a latency spike, elevated error rates, or when asked "what caused X" about a production service.
---

# Incident triage

## Order of operations

1. Pull deploys for the last 6h. **Don't open the log first** — it is 70k
   lines and grepping it before you have a hypothesis is fishing.
2. Line the deploy timestamps up against `p99_latency_ms` / `error_rate` for
   the paged service. State the gap explicitly ("deploy 14:31, p99 moves 14:35").
3. If a deploy lines up: pull the diff and read it. Check it against the
   known failure modes below.
4. **Then** grep the log to confirm the mechanism — you are looking for
   evidence of the specific thing the diff would cause, not for anything odd.
5. If no deploy lines up: check `db_pool_utilization` across
   checkout / cart / auth / inventory, then upstream dependencies.

## Things that have burned us

In rough order of how often:

- per-row query where there used to be a batch (N+1)
- cache decorator removed "temporarily"
- new query, no index
- blocking call in an async handler
- retry loop with no backoff

## Write-up

Evidence first, kept short. Then one line at the bottom:

> **Root cause:** `<sha>` — one sentence on the mechanism.

If it wasn't a deploy, put the component or upstream dependency where the
sha goes (`db-primary`, `stripe-api`). Still one sentence. The long version
goes in the postmortem doc, not here.
