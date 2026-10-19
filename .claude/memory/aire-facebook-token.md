---
name: aire-facebook-token
description: How the AiRE Estate Facebook poster authenticates - the environment's graph.facebook.com network secret holds the Aire Poster token (fixed 2026-10-19 after it had been replaced by NBMH's)
---

The Default Cloud Environment's `graph.facebook.com` network secret (Bearer,
no path prefix) holds the **Aire Poster** system-user token from the Aire Estate
business portfolio. Verified read-only 2026-10-19: /me = "Aire Poster"
(122099425281507068); /me/accounts = only "AIRE Estate" page 1345476315318631
with CREATE_CONTENT. Never paste or echo the token.

What broke it: the secret had been replaced with the NBMH token ("NBMH Posting"),
and the setup script had placeholder `export AIRE_FB_TOKEN="your-..."` lines.
Placeholders in AIRE_FB_TOKEN make Meta return "An active access token must be
used". Setup script should be only `#!/bin/bash` + `npm install`. NBMH needs its
own environment with its own graph.facebook.com secret; NBMH never posts to AiRE.
Before any post, check /me says Aire Poster.
