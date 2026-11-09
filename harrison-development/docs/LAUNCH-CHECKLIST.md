# LAUNCH-CHECKLIST.md: Harrison Development

Technical readiness is separate from factual, brokerage and publication readiness. **Technical readiness: the local preview is built and tested. Publication readiness: not ready.** Nothing has been deployed, registered, purchased, sent or approved.

## 1. Facts and approvals still needed (blockers)

- [ ] Managing-broker review of: the name "Harrison Development", the attribution line, the layout, the credentials, and whether the Epique email/phone may be used. Keep written approval.
- [ ] Active Colorado license confirmed on the Division of Real Estate record; brokerage legal name confirmed.
- [ ] Each credential confirmed active and permitted (RSPS, MRP, REALTOR®, Ai Pro, AiRE Instructor).
- [ ] Colorado business-name search run and recorded; USPTO and common-law trademark search run and recorded. Decide on entity registration (do not claim LLC until it exists).
- [ ] Equal Housing / required disclosures added in the form the broker requires.
- [ ] Marketing scope and fees documented separately from the brokerage listing agreement. No rates are on the site.
- [ ] Operator legal name and mailing address for the privacy notice (`operator` in `js/config.js`). Privacy notice reviewed.
- [ ] **Logo files:** the approved logo is a raster image (PNG). For print, signage and sharp favicons, have it redrawn as a vector (SVG/PDF) by a designer, or ask ChatGPT for a higher-resolution version. The browser-tab icon is still the simple SVG HD, because the approved logo's thin lines are unreadable at 16 to 32 px. Decide whether to keep it or make a favicon from the monogram.
- [ ] Optional: licensed portrait or local photography with recorded rights. Otherwise keep the original illustration.

## 2. Decisions and integrations

- [ ] Hosting target chosen (none selected; do not assume the AiRE branch). The site is static; any static host works.
- [ ] Domain chosen and purchased by Charles. Then add canonical URLs, sitemap.xml, absolute `og:image` URL.
- [ ] Form endpoint or CRM approved (Lofty is already in use; confirm whether Lofty can receive web-form leads). Requirements: HTTPS, server-side validation, rate limiting, duplicate handling, no secrets in the browser, success only after confirmed acceptance. Then set `formEndpoint` in `config.js` and update the privacy notice with the vendor and retention.
- [ ] Decide whether to keep the mailto fallback.
- [ ] Analytics: none installed. If approved later, count consultation clicks and confirmed submissions only, with no personal data in events, and update the privacy notice first.

## 3. Launch-day steps (only after sections 1 and 2, with Charles's explicit authorization)

1. In `js/config.js`: set `previewBanner: false`; put in the broker-approved attribution.
2. Remove `<meta name="robots" content="noindex, nofollow">` from `index.html` and `privacy.html`.
3. Replace `robots.txt` with an allow rule plus the sitemap line.
4. Add canonical link tags, sitemap.xml and absolute Open Graph URLs.
5. Re-run `tests/check.mjs` against the staging URL. Test the live form with a real submission.
6. Update VERIFICATION.md with dates and evidence.

## 4. Not tested yet

- Screen readers (VoiceOver, NVDA); real phones and Safari/Firefox (only Chromium was used).
- Lighthouse / Core Web Vitals on a real host.
- The live form (no endpoint exists).
- Print styles.

## 5. First-month activity targets (proposed, not forecasts, no outreach sent)

1. One excellent **private** sample marketing plan (see PRESENTATIONS-REVIEW.md for the candidate).
2. Identify 15 relevant prospects; check each against the do-not-contact list in `CLAUDE.md` first.
3. Seek five project conversations.
4. Pursue one paid pilot and/or brokerage engagement.
