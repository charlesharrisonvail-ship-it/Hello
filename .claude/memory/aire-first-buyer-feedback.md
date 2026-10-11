---
name: aire-first-buyer-feedback
description: What AiRE Estate's first buyer (Darrell Chavez, a friend of Charles) reported in October 2026, what was fixed, and his quote waiting on permission for social proof
---

**Who:** Darrell Chavez, friend of Charles, bought Part One (first buyer, Oct 2026).

**What he hit, and the fix:**
- He confused Stripe **Link**'s 6-digit SMS verification code (texted at checkout) with the
  course access code. Fixed 2026-10-11: all four unlock screens now say the access code is
  not the 6-digit Link number. Worth adding the same line to the Stripe confirmation message.
- Closing the browser lost his unlock. Fixed by another session (commit 3d43d2b): the code is
  now kept in localStorage on that device.
- On desktop "the link you first texted" did not work; the emailed link did. Cause not
  confirmed (likely an old or different link). If another buyer reports it, ask for the URL.

**His words (quote only with his permission, first name only unless he agrees):**
"This has a ton of info, I like being able to read the context too, and ability to save it
as PDF for later reference." Slotted for proof post #11 in the 90-day plan.

**Open:** a second agent was also sent the site to review; no feedback yet.
