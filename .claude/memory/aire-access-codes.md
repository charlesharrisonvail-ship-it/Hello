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

**Stripe checkout setup, confirmed by Charles 2026-10-07:** both payment links
show a custom confirmation message with the course link and that course's
access code (no redirect). Both require accepting the terms of service
(terms.html set in Stripe Public details, plus privacy.html and support URL
`https://learn.aireestate.com/#start`). Product descriptions now read "Seven
modules and a Capstone" and name the Claude requirements; new product
pictures are in `assets/stripe/` for Charles to upload.

**Stripe confirmation messages, saved by Charles 2026-10-11:** both now carry
"Your access code is below. It is not the 6-digit Link code Stripe may text
you." (first buyer mistook Stripe Link's SMS code for the access code). The
messages are short; the box is small, so no blank lines. When Charles asks for
text he will paste into Stripe, give it ready to paste with the real code in
it, never a placeholder; he was frustrated twice by "YOUR-CODE". Still keep
codes out of files and commits.

**hello@aireestate.com forwarding verified 2026-10-12:** ImprovMX (MX and SPF
correct) forwards to charlesharrisonvail@gmail.com. A test from outside
(nbmentalhealth.com) arrived, first in spam. Tests from Charles's own Gmail or
epique.me (same mailbox) are dropped by Gmail's loop rule, so never test that
way. His @epivail TikTok is tied to that Gmail; the AiRE TikTok needs its own
email (hello@aireestate.com, or a +aire alias).

**Gift codes (2026-10-15):** free Part One goes through Stripe, not the site:
one 100%-off coupon per person ("AiRE Estate Guest Pass", Part One only, coupon
and code each limited to 1 use; a coupon's limit covers all its codes, so each
gift needs a new coupon). "Allow promotion codes" is on for the $67 link
(cNi14m...kw00). Issued: AIRE-GUEST-67 (Adriana Azar), AIRE-GUEST-67B (Steve
Bichel); emails drafted in Gmail, Charles sends. Chelsea Boone on hold.
