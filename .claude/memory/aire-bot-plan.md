---
name: aire-bot-plan
description: AiRE Estate site chatbot - Charles approved a free Cloudflare bot named AiRE (2026-10-11); Netlify ruled out; not built yet
---

**Decision (Charles, 2026-10-11):** build the site chatbot on Cloudflare's free
plan (Worker holds the key, Workers AI answers). "Forget about Netlify." The site
stays on GitHub Pages; the page's chat box calls the Worker (needs CORS for
learn.aireestate.com).

**Rules:** the bot is labeled "AiRE, an AI assistant". It answers only from the
site (prices $67 / $97, what each course covers, refunds, how to unlock, the
access code is not Stripe's Link text code). It never invents a price or promise
and never reveals access codes. Hard daily cap; when capped it points to
hello@aireestate.com. No cost to Charles ("I am not paying anything else").

**Needs from Charles:** a free Cloudflare account (about 10 minutes). Not built
yet. Page titles and schema already carry "AiRE Estate AI" and "AiRE AI"
(2026-10-11). Best done in a fresh session.

**Update 2026-10-12:** ChatGPT built a review package (Cloudflare Worker + D1,
fixed approved answers, AI only classifies the question, lead capture OFF by
default). Claude reviewed it: facts match the site, its 11 tests and the
concurrency test pass, no codes or banned names in it. Not deployed, not in the
repo. Before going live: Charles creates a free Cloudflare account; privacy.html
needs the bot/email paragraph first; a 1B classifier often answers "unknown", so
loosen ID matching. Keep lead capture off until privacy is published.

**Update 2026-10-17:** package now lives in tools/aire-bot/ (not public; not
deployed), answer matching loosened, 12 tests pass, DEPLOY.md has the steps.
Blocked only on Charles adding CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID
to the cloud environment settings (never in chat). Email capture stays off.

**LIVE 2026-10-17.** Worker `aire-course-assistant` at
https://aire-course-assistant.charlesharrisonvail.workers.dev (account
f2722396b874ae0bdf1f3eaeb5721365, D1 aire-assistant 25b56708-...). Page:
learn.aireestate.com/ask-aire.html, linked in the home footer and sitemap.
Deployed by REST API: the Cloudflare token is a session network secret
(Bearer, api.cloudflare.com/client/v4/), never seen. Redeploy = PUT
/workers/scripts/aire-course-assistant multipart (metadata + worker.mjs +
answers.mjs). Keyword routing (topicGuess) runs before the 1B model. Email form
removed from the page; LEAD_CAPTURE_ENABLED=false. Old "purple-dew-1d3c" Worker
in the account is unrelated. Pending: Charles to approve a privacy.html line about
Cloudflare processing chat questions.

**Privacy updated 2026-10-17:** privacy.html now has an "AiRE, our AI assistant" section (Cloudflare processes questions; no chat stored). Email capture still needs its own privacy wording before turning on.
