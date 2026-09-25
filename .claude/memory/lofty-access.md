---
name: lofty-access
description: The three routes into Lofty CRM, in order, and the two credential rules that are absolute
---

Lofty (formerly Chime) comes free with Epique membership and is the system of
record for every buyer, seller, and agent-recruit relationship.

Pick the first route available, and say which one you are using:

1. **Charles's browser** - Claude in Chrome or the built-in browser. Load that
   skill first, then work in his signed-in Lofty tab. Open a NEW tab; do not
   disturb the one he is on.
2. **Lofty API** - if `LOFTY_API_KEY` is set, `Authorization: Bearer
   $LOFTY_API_KEY`. Confirm the current base URL and endpoint shapes from
   Lofty's developer docs before the first write.
3. **Hand-off** - exact click-by-click steps, or a CSV ready for Lofty's
   import, applicable in under two minutes.

**Absolute:** never ask Charles for his Lofty password, and never paste an API
key into chat, commits, or files.

Working rule: a lead without a dated next step is a lead being lost.
