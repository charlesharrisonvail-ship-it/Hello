# VERIFICATION.md: Harrison Development

Prepared 2026-11-08. Status key: **verified** (checked against a source) / **user-provided** (Charles said so; not independently checked) / **proposed** (design or wording we chose) / **unresolved** (not yet checked or unknown).

Nothing below is "verified" merely because it appeared in the build brief. As of this date, **no external registry or legal check has been run in this build**, so every legal and registry item is unresolved.

## A. Facts about the business

| Claim / item | Status | Source / evidence | Checked | Impact | Action |
|---|---|---|---|---|---|
| Charles Harrison is a licensed Colorado real estate professional | user-provided | Brief; Charles's email signature | 2026-11-08 | Core to the "licensed sales" offer | Look up the active license on the Colorado Division of Real Estate record (dre.colorado.gov). Record license status and date here. |
| Brokerage affiliation is Epique Realty | user-provided | Brief; signature; existing site charlesharrison.epiquerealty.com | 2026-11-08 | Drives the required attribution and advertising rules | Confirm the brokerage's exact legal name against the license record. Fill `attribution` in `js/config.js` only after confirmation. |
| Credentials: RSPS, MRP, REALTOR®, Ai Pro, AiRE Instructor | user-provided | Brief | 2026-11-08 | Public claims about qualifications | Confirm each is active, spelled correctly, and permitted for use. REALTOR® needs active NAR membership. "AiRE Instructor" is shown plainly in the About section only, with no link or AiRE branding. |
| Title at HD: Owner, CEO (exact wording) | user-provided | Charles, 2026-11-09 | 2026-11-09 | Public title for an unregistered brand | Fine for a sole proprietor, but no entity is registered. Do not add "LLC" or "Inc." until it exists; broker to review how the title and trade name appear. The earlier "Area Leader" mention was removed from HD copy because Charles named Owner, CEO as the HD title and asked for nothing else attached to it. |
| Landscape architecture background | user-provided | Charles, 2026-11-09 (he removed it from the site, then asked on 2026-11-09 for it to appear in the About section only) | 2026-11-09 | Public qualification claim | Shown only in About, as "background." No degree level, school or year is shown. Never say "architect" or "landscape architect" (protected titles unless licensed). Confirm through the diploma or registrar if details are ever added. |
| "AI real estate industry leader" | user-provided | Charles, 2026-11-09 | 2026-11-09 | Superlative-style claim that a competitor or the broker could challenge | Kept beside the factual claim that he teaches AI to real estate professionals. Back it with evidence (courses taught, students, speaking, press) or soften to "AI real estate educator" if the broker asks. |
| Teaches AI to real estate professionals | user-provided | Charles, 2026-11-09; the AiRE Instructor credential | 2026-11-09 | Positioning pillar | Described as instruction only; AiRE is not named or linked on the HD site. |
| Phone 970-904-0600 and email charlesharrison@epique.me | user-provided | Charles's own email signature (Oct 23 sent message); use approved by Charles 2026-11-08 | 2026-11-08 | Public contact details | Broker to confirm an Epique address and phone may appear on a separately branded site. |
| Licensed across the entire state of Colorado; service area shown as "Colorado statewide, with a focus on the mountain markets" | user-provided | Charles, 2026-11-09 (earlier drafts said Vail Valley, then "Rocky Mountain region") | 2026-11-09 | A Colorado license is statewide, but the claim must match his record | Confirm on the Division of Real Estate license record. The site makes no claim about other states and says brokerage services are provided in Colorado. |
| Harrison Development is not an LLC / not registered | unresolved | None | 2026-11-08 | Must not claim entity status | No entity language on the site. Check the Colorado SOS business search before and after any registration. |

## B. Name, brand and legal

| Claim / item | Status | Source | Checked | Impact | Action |
|---|---|---|---|---|---|
| "Harrison Development" name availability (Colorado SOS) | unresolved | https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do | not run | Name conflict risk | Run the search; record exact results and the date. Availability is not trademark clearance. |
| Trademark conflicts for "Harrison Development" and the HD mark | unresolved | https://www.uspto.gov/trademarks/search | not run | Infringement / rebrand risk | Run USPTO and common-law searches; consider counsel. Record limitations. |
| Logo (HD monogram over a mountain range, with the wordmark) | user-provided; approved by Charles 2026-11-09 | Made by ChatGPT, supplied by Charles. Original saved as `assets/brand/hd-logo-approved-original.png`. | 2026-11-09 | Brand identity. AI-generated art may have limited copyright protection, and the design has not been searched for similar marks | Keep the ChatGPT conversation and prompt as a record of creation. Clearance is still required (USPTO and common-law search, compare to other mountain/HD marks). Footer says "owner-approved design, pending brand clearance." Nothing was redrawn; the transparent versions only remove the black background. |
| Palette (charcoal, warm white, neon yellow accent #DFFF1A (full on dark, 50% on light); neon pink available via `accent` in `config.js`) and the earlier SVG HD mark | proposed | Original in this repo; superseded by the approved logo and kept in `assets/brand/alt-svg/` as an editable alternate | 2026-11-09 | Site colors | Palette drives the site (Charles rejected the earlier copper/brown on 2026-11-09). Retire the alternate SVGs if not wanted. |
| Colorado advertising rules for licensees and trade names | unresolved | https://dre.colorado.gov/ (current rules; the 2025 manual chapter is reference only) | not run | Required brokerage prominence, team/trade-name rules | Read current rules; get managing-broker review of name, attribution wording and layout. |
| Epique brand/advertising requirements | unresolved | Epique compliance | not run | Brokerage approval of a separate brand | Ask Epique compliance in writing; keep the reply with this file. |
| Attribution wording "Led by Charles Harrison. Real estate brokerage services provided through Epique Realty." | proposed | Brief | 2026-11-08 | Appears in a band under the hero, About, and footer | Not legal clearance. Replace with the broker-approved wording in `config.js` and `index.html`. |
| Equal Housing / fair-housing disclosures and logo | unresolved | Broker guidance | not run | Housing advertising | Add whichever form the broker requires. None is shown yet. |
| Fees vs. brokerage compensation separation | unresolved | None | not run | Disclosure and compensation rules | No prices, rates or terms on the site. Document the marketing scope separately from the brokerage listing agreement. |

## C0. Added 2026-11-09

| Item | Status | Evidence | Impact | Action |
|---|---|---|---|---|
| Market regions and towns listed (Vail Valley, Summit, Roaring Fork, northern mountains, Gunnison and San Juans, Front Range) | proposed | Charles said he is licensed statewide; the town lists are ours | Implies service in those places | Charles to confirm each region is one he wants to advertise. Remove any he does not. |
| Concept studies: "Dowd Junction, Avon" and "Red Mountain Ranch, Eagle" | user-provided (Charles asked for his example projects to appear); facts from public records | Dowd: Town of Avon planning documents reviewed 2026-10-29 (about 100 first-phase homes; tenure and developer not final in that record). Red Mountain Ranch: town filings (about 66 homes; terms unpublished), per the project note in the repo. Neither was re-verified today | Names real, active projects; Red Mountain Ranch pitch was emailed 2026-11-01 and awaits a reply; Dowd pursuit plan says to show it in person, not cold | Built with a prominent not-client-work disclaimer; no developer, architect or agency names; no third-party photos or renderings (original line art only); no sale or rental offer. `showConcepts` in `config.js` hides the whole section. Broker to review, since Colorado advertising rules cover advertising property you do not list. Re-verify the public facts before launch. |
| "Launch-readiness checklist" PDF | proposed | `assets/downloads/launch-readiness-checklist.html`, rendered by `tests/build-pdf.mjs` | General guidance carries a disclaimer; includes his phone and email | Attorney or broker skim. Regenerate the PDF if contact details change. |
| FAQ answers | proposed | `index.html` | States how marketing and brokerage are separated, the AI review claim, and no guarantees | Charles confirms each answer is how he will operate; broker reviews the brokerage-separation answer. |
| Booking | **temporary, by Charles's choice (2026-11-09)** | `bookingUrl` is his Epique schedule (`calendar.app.google/zejpSpwL6aDy3VAaA`; the same schedule as two other short links on his Epique page), titled "Schedule a 20 minute Epique breakdown" | Visitors see an Epique-titled page, which mixes the two businesses and uses the brokerage's name | Replace with a Harrison Development appointment schedule when he makes one (Google Calendar: Create, Appointment schedule, then Share). Broker to confirm the Epique link may be used. |

## C1. Added 2026-11-09 (production, portrait, bio)

| Item | Status | Evidence | Impact | Action |
|---|---|---|---|---|
| Production numbers | **not used on the site** | FlexMLS "my listings" (listing side, this MLS membership): 3 listings in total, 1 closed ($719,000, Edwards, closed 2026-04-14), 1 active ($1.59M commercial, Gypsum), 1 expired ($3.2M, Vail). Lofty: 1 transaction, pre-listing, $0. Buyer-side closings, earlier years, other MLSs and the brokerage's own records are not in either system | These figures would weaken, not support, the pitch, and are incomplete | Do not publish. Pull a full production report from the brokerage (including buyer-side and prior years) if real numbers exist, and have the broker approve the wording. |
| Portrait | **supplied and chosen by Charles 2026-11-09** (cropped 4:5 from his image at `assets/brand/charles-portrait.jpg`). An earlier HeyGen-frame headshot was rejected. **Decision (Charles, 2026-11-09): the portrait stays as is, with no label.** | His Epique About page labels an image "Charles Harrison, Area Leader," but its host returns 403 to outside downloads | None shown yet; the site omits the portrait until a real photo is configured | None needed. To swap the photo later, save a new file and keep `portrait.src` in `js/config.js`. |
| Bio ("Based in the Vail Valley") | user-provided | His Epique page names Vail Valley, Vail, Edwards, Minturn | Location claim | Confirm. Full copy in `BIO.md`. |
| Colorado license number FA100066670 | user-provided (printed on his Epique homepage) | https://charlesharrison.epiquerealty.com/ | Not shown on the HD site | Verify on the Division of Real Estate license lookup; ask the broker whether the number must appear on HD materials. |
| Google Calendar booking links on his Epique page (two) | unresolved | `calendar.app.google/VWkZBHiYyLYbnJwS9` and `calendar.app.google/oYhEKKCmVCLZYYuN9` | Could serve as `bookingUrl` | Not used. Confirm which one, if either, is meant for development clients rather than agent recruiting. |

## C2. Brand film (2026-11-09)

| Item | Status | Evidence | Impact | Action |
|---|---|---|---|---|
| Abstract brand film | proposed; **Charles decided to keep it (2026-11-09)** | Generated with Higgsfield (cinematic_studio_video_v2, 8 s, silent, 12 credits; the 56-credit seedance model needs a Plus plan). Files in `assets/video/` | Visual only, no people. Labeled "AI-generated concept film. Not a project, plan or rendering." Plays once when seen, with a pause button; no autoplay under reduced motion | Kept. To remove later, delete the `<section class="film">` block in `index.html`. Higgsfield terms for commercial use should be checked before launch. |

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
| Layout at 360, 390, 768, 1440 px: no overflow, no clipped elements, one H1, text >= 14px | verified | `tests/check.mjs` (54 checks pass), 2026-11-09 |
| Motion: scroll-driven reveals, progress bar, header shrink, hero parallax and entrance, word-by-word headline, magnetic buttons, map and drawing animations; all behind prefers-reduced-motion; native scroll-driven animations with a script fallback for browsers without them | verified in Chromium only | `tests/check.mjs`; built to the modern-web-guidance motion guides | Firefox and Safari, where the fallback path runs, were not tested in a real browser |
| Concept tabs, region map, FAQ, booking states, downloadable PDF behave as designed | verified | `tests/check.mjs` | |
| Keyboard: skip link first, visible focus on 12 consecutive stops, mobile nav opens and closes with keyboard and Escape | verified | same |
| Form: labels, inline errors, error summary with focus, honeypot, no fake success, mailto fallback labeled, 500 shows failure, success only on 200 | verified | same (endpoint mocked) |
| Reduced motion disables reveal animation and smooth scroll | verified | same |
| No third-party requests (no trackers, CDN or web fonts) | verified | same |
| Contrast (computed WCAG ratios, 2026-11-09): charcoal on warm white 15.97, secondary text 6.41. Accent is neon yellow #DFFF1A: **full strength on dark surfaces** (15.68 on charcoal, dark text on it 15.68) and **50% opacity on light surfaces** (blends to #EAF883 on cream; dark text on it 15.51). It is never used as text on light backgrounds. Pink option stays solid in both | verified | Computation 2026-11-09. Charles chose this split. |
| Fonts: Inter and Fraunces, self-hosted | verified (SIL OFL 1.1, license files included in `assets/fonts/`) | `@fontsource` packages |
| Screen-reader testing, real-device testing, Lighthouse | **not done** | Listed in LAUNCH-CHECKLIST.md |

## E. Earlier presentations (see PRESENTATIONS-REVIEW.md)

Presentations made for other developers' projects are **not** shown on this site. They name projects Harrison Development does not represent.
