# AiRE — review package

Nothing has been deployed. No existing website page was edited.

Open `aire-bot.html` to review the responsive interface. The three sample buttons work offline; typed AI answers and email saving require the Worker. The page clearly labels review mode. No email is saved in this preview.

## Architecture and safeguards

- Static standalone HTML front end; Cloudflare Worker + Workers AI + D1 backend.
- AI classifies a question into an approved answer ID. Only the exact answer in `answers.mjs` is returned. Raw model text never reaches visitors. Classification can still select an imperfect answer; the source link lets visitors check it.
- No API key is needed: the Worker uses Cloudflare’s server-side AI binding. Deployment credentials stay with Wrangler/Cloudflare, never in HTML or Git.
- Only public, manually curated sales information is used. There is no crawler, course-content ingestion, browser-storage reading, purchase-code lookup, or tool execution.
- Part One is $67 and Lead to Keys is $97. No discounts or outcome promises. Instructor identity is limited to “a licensed, practicing agent.”
- Access-code questions receive purchase-confirmation guidance, including the Stripe Link distinction. Actual codes and hints are absent from every file and the model context.
- Methods and prompts are not in the answer catalog. Even an instruction attack can only select one of the approved answers.
- Global caps: at most 100 valid chat requests and 25 valid lead submissions per UTC day. Conditional SQLite upserts reserve a slot atomically before processing; failures consume their slot. Raising the env value cannot exceed these ceilings without editing code. Both caps redirect to hello@aireestate.com. Provider/database outages fail closed with the same contact fallback.
- Visitor question limit: 600 characters; JSON request limit: 4 KiB. Origin allowlist, plain-text rendering, bounded model output, no app request logging, no transcript storage. Origin restrictions are not authentication: bots can spoof them. The small global cap limits model usage but a determined bot could exhaust availability. No claim of complete bot protection.
- Email is stored only in private D1, with explicit consent, course interest and timestamp. No public lead-export endpoint. No email notification service, automatic follow-up or marketing enrollment is included. Check D1 manually and respond through your existing email account.
- Lead collection defaults OFF in both front end and backend. Publish the approved privacy addition before enabling it. The separate privacy addition reconciles this with your instruction not to edit existing pages during review.

## Free-only deployment handoff for Claude Code

1. Use a Cloudflare **Workers Free** account. Do not upgrade it, add prepaid AI credits, configure a paid fallback, or connect a paid AI API. This package uses the free-eligible `@cf/meta/llama-3.2-1b-instruct` model. Cloudflare’s Free plan rejects excess use rather than billing overages. Other projects on the same account share free quotas; availability is not guaranteed.
2. In this package directory, install/use the current Cloudflare Wrangler CLI through `npx wrangler` and authenticate with `npx wrangler login`. Keep authentication out of source control.
3. Run `npx wrangler d1 create aire-assistant`. Copy the returned database ID into `wrangler.toml`. The database ID is an identifier, not a secret.
4. Initialize D1: `npx wrangler d1 execute aire-assistant --remote --file=schema.sql`.
5. Review all approved answers and the proposed privacy addition. Do not ingest the original website HTML or paid lessons into AI context.
6. Deploy only the Worker when authorized: `npx wrangler deploy`. Copy its HTTPS URL into `WORKER_URL` in `aire-bot.html`. No key goes there.
7. For a private local backend preview, temporarily add `http://localhost:8000` to the Worker allowlist, deploy the Worker, and serve these files with `python3 -m http.server 8000`. Remove that extra origin before production. Merely opening the HTML as a file sends a null origin and must not be allowed on the production backend.
8. After approval, add `aire-bot.html` as a new standalone GitHub Pages file. Existing pages do not need to change to serve it at `/aire-bot.html`. Linking or embedding it in existing pages is a separate later change.
9. Before collecting email, add the reviewed text from `PRIVACY-ADDITION-REVIEW.html` to `privacy.html`, reconcile the existing “How we use it” and service-provider text, and update the effective date. Set `LEAD_CAPTURE_ENABLED=true` in Wrangler and `LEAD_CAPTURE_ENABLED = true` in the new HTML, then redeploy both. The form note and checkbox must stay visible.
10. Test from the actual allowed domain: free-text prices, protected content, access recovery, unknown question, wrong origin, provider failure, lead consent, and daily caps. Temporarily lower the limits on a separate staging Worker/database to verify exhaustion. Do not burn production quota just to test.

## Reading and removing leads

Use the private Cloudflare dashboard → D1 → aire-assistant → Console:

```sql
SELECT id, email, interest, consent_version, created_at
FROM leads ORDER BY created_at DESC LIMIT 100;
```

For deletion requests, identify and delete only matching records through the dashboard. Never expose database credentials or add a public listing endpoint. The scheduled cleanup runs daily at 00:15 UTC and deletes leads older than 90 days and usage rows older than seven days. Monitor the scheduled execution in Cloudflare. Do not enable chat request/payload logging.

## Content review sources

Read directly on October 12, 2026 UTC:
- https://learn.aireestate.com/index.html — public course positioning, pricing, tools and instructor wording.
- https://learn.aireestate.com/lead-to-keys.html — prerequisites, time expectations, course topics.
- https://learn.aireestate.com/install-claude-code.html — free setup guide and support boundary.
- https://learn.aireestate.com/terms.html — prices, refunds, updates, certificates, no-results guarantee.
- https://learn.aireestate.com/privacy.html — existing collection and service-provider disclosures.
- https://learn.aireestate.com/guides/ — public guides index; article bodies are not ingested.

The Stripe Link wording is an explicit owner requirement. Existing pages have some inconsistent promotional wording about runtime, lifetime access and included modules; the catalog uses narrow statements and the formal terms for updates. It does not repeat performance claims. Other publicly advertised services/team prices are deliberately excluded pending separate approval.

Cloudflare documentation checked:
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/models/llama-3.2-1b-instruct/
- https://developers.cloudflare.com/d1/platform/pricing/

## Verification

Run `node --test test.mjs` and `python3 test-cap.py`. These cover Worker routing with mocked bindings, adversarial model output, access-code response, form consent, free-only caps, fail-closed handling, and the actual SQLite conditional-upsert cap under concurrent calls. A real Cloudflare inference/deployment and real D1 lead write have not been run; account credentials and production authorization were not requested because this delivery is review-only.

Validation performed: all 11 Node tests passed; concurrent SQLite cap test passed; front-end JavaScript syntax passed. Browser interaction testing could not run because the browser executable is not installed in this environment.
