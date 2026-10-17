# Deploying the AiRE bot (Cloudflare free plan)

Status: reviewed and tested, not deployed. Built by ChatGPT, reviewed by Claude
(2026-10-12); answer matching loosened 2026-10-17 so small-model replies like
"prices." still map to the approved answer. `node --test test.mjs` (12 pass) and
`python3 -I test-cap.py` pass.

Needs from Charles, once: a free Cloudflare account and a Cloudflare API token
(template "Edit Cloudflare Workers", plus D1 Edit and Workers AI Read) saved in
the cloud environment's settings as CLOUDFLARE_API_TOKEN, with his account ID as
CLOUDFLARE_ACCOUNT_ID. Never in chat, a file, or a commit. No paid plan, no AI credits.

Then, in this folder:
1. `npx wrangler d1 create aire-assistant` and put the database ID in wrangler.toml
2. `npx wrangler d1 execute aire-assistant --remote --file=schema.sql`
3. `npx wrangler deploy`, then put the Worker URL in WORKER_URL in aire-bot.html
4. Test from learn.aireestate.com; then copy aire-bot.html into docs/ and remove its noindex tag
5. Email capture stays OFF until the privacy.html addition is approved and published
