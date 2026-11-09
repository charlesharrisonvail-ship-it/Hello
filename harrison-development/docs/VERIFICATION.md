# VERIFICATION.md: Harrison Development

Prepared 2026-11-08. Status key: **verified** (checked against a source) / **user-provided** (Charles said so; not independently checked) / **proposed** (design or wording we chose) / **unresolved** (not yet checked or unknown).

Nothing below is "verified" merely because it appeared in the build brief. As of this date, **no external registry or legal check has been run in this build**, so every legal and registry item is unresolved.

## A. Facts about the business

| Claim / item | Status | Source / evidence | Checked | Impact | Action |
|---|---|---|---|---|---|
| Charles Harrison is a licensed Colorado real estate professional | user-provided | Brief; Charles's email signature | 2026-11-08 | Core to the "licensed sales" offer | Look up the active license on the Colorado Division of Real Estate record (dre.colorado.gov). Record license status and date here. |
| Brokerage affiliation is Epique Realty | user-provided | Brief; signature; existing site charlesharrison.epiquerealty.com | 2026-11-08 | Drives the required attribution and advertising rules | Confirm the brokerage's exact legal name against the license record. Fill `attribution` in `js/config.js` only after confirmation. |
| Credentials: RSPS, MRP, REALTOR®, Ai Pro, AiRE Instructor | user-provided | Brief | 2026-11-08 | Public claims about qualifications | Confirm each is active, spelled correctly, and permitted for use. REALTOR® needs active NAR membership. "AiRE Instructor" is shown plainly in the About section only, with no link or AiRE branding. |
| Phone 970-904-0600 and email charlesharrison@epique.me | user-provided | Charles's own email signature (Oct 23 sent message); use approved by Charles 2026-11-08 | 2026-11-08 | Public contact details | Broker to confirm an Epique address and phone may appear on a separately branded site. |
| Service area: Colorado and the Rocky Mountain region (widened by Charles 2026-11-09; first brief said Vail Valley) | user-provided | Charles, 2026-11-09 | 2026-11-09 | Marketing may be regional, but brokerage representation is lawful only where he is licensed | Confirm which states he holds licenses in. If Colorado only, keep brokerage language Colorado-only and have the broker confirm referral or co-brokerage handling for other states. The site says brokerage is offered only where licensed. |
| Harrison Development is not an LLC / not registered | unresolved | None | 2026-11-08 | Must not claim entity status | No entity language on the site. Check the Colorado SOS business search before and after any registration. |

## B. Name, brand and legal

| Claim / item | Status | Source | Checked | Impact | Action |
|---|---|---|---|---|---|
| "Harrison Development" name availability (Colorado SOS) | unresolved | https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do | not run | Name conflict risk | Run the search; record exact results and the date. Availability is not trademark clearance. |
| Trademark conflicts for "Harrison Development" and the HD mark | unresolved | https://www.uspto.gov/trademarks/search | not run | Infringement / rebrand risk | Run USPTO and common-law searches; consider counsel. Record limitations. |
| HD monogram and palette | proposed | Original SVG built in this repo (`assets/brand/`) | 2026-11-08 | Visual identity | Labeled "proposed, pending brand clearance" in the footer and SVG titles. Compare to existing developer logos before adoption. |
| Colorado advertising rules for licensees and trade names | unresolved | https://dre.colorado.gov/ (current rules; the 2025 manual chapter is reference only) | not run | Required brokerage prominence, team/trade-name rules | Read current rules; get managing-broker review of name, attribution wording and layout. |
| Epique brand/advertising requirements | unresolved | Epique compliance | not run | Brokerage approval of a separate brand | Ask Epique compliance in writing; keep the reply with this file. |
| Attribution wording "Led by Charles Harrison. Real estate brokerage services provided through Epique Realty." | proposed | Brief | 2026-11-08 | Appears in a band under the hero, About, and footer | Not legal clearance. Replace with the broker-approved wording in `config.js` and `index.html`. |
| Equal Housing / fair-housing disclosures and logo | unresolved | Broker guidance | not run | Housing advertising | Add whichever form the broker requires. None is shown yet. |
| Fees vs. brokerage compensation separation | unresolved | None | not run | Disclosure and compensation rules | No prices, rates or terms on the site. Document the marketing scope separately from the brokerage listing agreement. |

## C. Content claims (what the site says)

| Claim | Status | Evidence | Impact | Action |
|---|---|---|---|---|
| No statements that HD owns land, holds approvals, is a contractor, or has completed projects | verified (by review of the site copy and automated text check) | `tests/check.mjs`; manual copy review 2026-11-08 | Misrepresentation risk | Keep it that way. Re-check after every copy edit. |
| No testimonials, awards, statistics, production totals, client logos | verified (none present) | Source review | Unsupported claims | Add only with evidence and written permission. |
| "No guarantee of buyer demand, sales pace or price" footer disclaimer | proposed | Brief guidance | Hook "You build it. I build the demand." is promotional | The hook is **not** used on the site; if used in ads, keep the disclaimer nearby. |
| Hero illustration | proposed | Original SVG, captioned "Conceptual illustration. Not a project, plan or rendering." | Avoids implying a completed project | Replace with licensed local photography when available. Record license. |
| AI usage statement (AI assists; Charles reviews) | user-provided | Brief | Accuracy of process claim | Charles confirms this is how he will actually work. |
| Fair-housing-sensitive wording | proposed | Copy focuses on property, project and market needs, with no demographic targeting | Compliance | Broker review; apply the same standard to any future ad targeting. |

## D. Technical (verified in this build)

| Item | Status | Evidence |
|---|---|---|
| Layout at 360, 390, 768, 1440 px: no overflow, no clipped elements, one H1, text >= 14px | verified | `tests/check.mjs`, 2026-11-08 |
| Keyboard: skip link first, visible focus on 12 consecutive stops, mobile nav opens and closes with keyboard and Escape | verified | same |
| Form: labels, inline errors, error summary with focus, honeypot, no fake success, mailto fallback labeled, 500 shows failure, success only on 200 | verified | same (endpoint mocked) |
| Reduced motion disables reveal animation and smooth scroll | verified | same |
| No third-party requests (no trackers, CDN or web fonts) | verified | same |
| Contrast: charcoal/warm 15.97, secondary text 6.41, dark-copper 5.81, light-copper-on-charcoal 7.08, light gray on charcoal 8.21 | verified (computed WCAG ratios) | Computation 2026-11-08. Raw copper #A96843 is only 3.96 on warm white, so it is used for decoration only. |
| Fonts: Inter and Fraunces, self-hosted | verified (SIL OFL 1.1, license files included in `assets/fonts/`) | `@fontsource` packages |
| Screen-reader testing, real-device testing, Lighthouse | **not done** | Listed in LAUNCH-CHECKLIST.md |

## E. Earlier presentations (see PRESENTATIONS-REVIEW.md)

Presentations made for other developers' projects are **not** shown on this site. They name projects Harrison Development does not represent.
