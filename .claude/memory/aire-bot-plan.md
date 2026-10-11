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
