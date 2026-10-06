---
name: aire-access-codes
description: AiRE Estate course access codes - how unlocking works today, what is locked, and the planned monthly-code change Charles approved but deferred until after sales start
---

**Today (2026-10-06):** each course has one shared access code. Stripe's
after-payment redirect lands buyers on the course page with `?k=CODE`. The
lesson text, the lesson video links, and Lead to Keys Module 1's video
(`docs/media/l2k-m1.bin`) are encrypted with that code. Never write the codes
into any file, commit, or chat; they live in Charles's Stripe settings.

**Still exposed:** the old lesson video links were public in page source and in
this public repo's history before 2026-10-06. Closing that needs the videos
re-uploaded to new links (Charles's video host login).

**Approved, deferred:** a new access code for each month's buyers. Old codes
keep working (lifetime access promise); a leaked code is retired alone and
that month's buyers, listed in Stripe, get a fresh one. Needs: course pages
that accept several codes, plus a monthly task that adds the new code and
updates the Stripe payment link redirect (either with a limited Stripe key
stored as an environment secret, or by reminding Charles). Charles said on
2026-10-06: start selling first, build this later. Do not build it unprompted;
offer it once sales have started.

**Charles will not pay for more services** (declined Stan Store, $29/mo, and any
new monthly cost). Keep fixes free.
