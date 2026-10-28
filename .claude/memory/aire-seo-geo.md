---
name: aire-seo-geo
description: AiRE Estate SEO and AI-search (GEO) setup - llms.txt, FAQ and HowTo schema on learn.aireestate.com, and the free/paid status of Search Console, OpenSEO and GEO Optimizer
---

**On-site AI-search work is done** (2026-10-28, branch `ccr-a3a2fdb3-b1w5t1`, cut
from the live branch `claude/stan-store-access-k4hjdu`):

- `docs/llms.txt` summarizes the courses for AI engines. Every line is copied from
  the live pages; when prices, module counts or the Team tier change, change it too.
- `index.html` and `lead-to-keys.html` carry `FAQPage` JSON-LD built word for word
  from their visible FAQ. **Edit a FAQ answer and you must edit the schema** or
  Google treats the mismatch as spam.
- `install-claude-code.html` has OG tags and `HowTo` JSON-LD; its steps have ids
  `step-1`..`step-7`.
- `robots.txt` already allows every crawler (AI bots included). Do not add
  per-bot groups: a named group overrides `*` and would drop the
  `/media/l2k-m1.bin` block.

**The three tools from the "SEO expert" graphic, as checked:**

1. Search Console: Google verification file is in `docs/`. **Not through Windsor.ai**:
   its free trial allows one account and the Facebook ad account holds it
   (2026-10-28); more needs a paid plan. Free route: in Search Console,
   Performance -> Export -> Google Sheets, and read the sheet with the Google
   Sheets connector.
2. OpenSEO (every-app/open-seo): open source, but its data is DataForSEO,
   pay-as-you-go. That is a spend, so Charles decides (`recall.py paid`).
3. GEO Optimizer (Auriti-Labs/geo-optimizer-skill): free, open source, scores a
   site 0-100 for AI citation. Free audit at geoready.dev.
