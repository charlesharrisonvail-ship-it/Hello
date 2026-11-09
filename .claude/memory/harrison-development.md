---
name: harrison-development
description: Harrison Development, Charles's third brand (development marketing and sales); where it lives and the rules decided 2026-11-08
---

**Harrison Development (HD)** is a third brand, separate from EpiVail and AiRE Estate.
Built 2026-11-08 in `harrison-development/` (static preview, not deployed).

- Offer: development marketing + licensed sales for developers, builders, landowners. Area widened 2026-11-09 from the Vail Valley to Colorado and the Rocky Mountain region (brokerage only where licensed; confirm his states). Not construction, fundraising or ownership.
- Positioning (2026-11-09): "Knows the market. Teaches the AI. Carries the sale." He is an AI instructor (not "practitioner"). Landscape architecture BACKGROUND appears in the About section only (he removed it once, then asked for it back; no school, degree level or year; never "architect"). About also calls him an "AI real estate industry leader" (his wording; needs evidence). HD title is exactly "Owner, CEO" with nothing else attached (no LLC claim). Never claim "the only one".
- Charles approved using his signature phone and email (user-provided, pending broker review) and showing "AiRE Instructor" discreetly, plain text in About only.
- Earlier project presentations (Dowd Junction, Red Mountain Ranch, Apogean) name other developers' projects, so they stay **private pitches**, never public on the HD site.
- Unverified until checked: license, credentials, name/trademark, broker-approved attribution. See `harrison-development/docs/VERIFICATION.md`.
- Does not use the EpiVail signature. Never publish, buy a domain or send outreach without Charles's say.
- Logo: Charles approved a ChatGPT-made HD monogram over mountains (2026-11-09), saved in `harrison-development/assets/brand/`. Use it as the HD identity; do not redraw or replace it. Still needs trademark clearance and a vector version.
- Color: Charles hates brown/copper AND the cream/off-white background (2026-11-09). The whole HD site is dark (charcoal #14181C, raised #1A2026, deep #0E1114, cool-white text #EEF1F3) with neon yellow #DFFF1A at full strength; pink is one setting away (`accent` in config). Never reintroduce cream, off-white or brown.
- Licensed statewide in Colorado (his word, 2026-11-09): site says "Colorado statewide, with a focus on the mountain markets"; no other-state claims.
- Concept studies (Dowd Junction, Red Mountain Ranch) are on the HD site at his request, as labeled independent studies: no developer/architect names or third-party images; `showConcepts` toggle in config. Red Mountain pitch was sent 2026-11-01, so timing of going public is his call.
- Booking needs a real link in `bookingUrl` (none exists yet). Site has full motion built to prefers-reduced-motion; tests are in `harrison-development/tests/`.
- Production check (2026-11-09): FlexMLS "my listings" shows 3 listings (1 closed $719K) and Lofty 1 pre-listing transaction; too thin to publish and buyer-side is missing. Do not put production numbers on the HD site without a full brokerage report.
- Portrait: no photo yet; his Epique image host blocks downloads. Site has a portrait slot (`portrait.src` in config). Never generate his likeness. Bio copy is in `harrison-development/docs/BIO.md`.
- Higgsfield: balance was 200.8 credits on 2026-11-09; an 8-second 16:9 abstract clip (seedance_2_5) quotes 56 credits. Never spend without his "go" (see `no-paid-ai-tools`).
- Charles REJECTED the HeyGen-frame headshot (2026-11-09): never put a headshot on the site unless he picks or sends the photo. Portrait slot stays empty. His HeyGen groups: "Charles2" (digital twin look eac477f9... is real footage; the other looks are AI-staged scenes) and "CHAiRLES".
- He prefers free generation routes ("freehiggsfield"): the Higgsfield video cost 12 credits (balance was 200.8); ask before any spend. Brand film is built but awaiting his approval.
- Portrait (2026-11-09): Charles supplied and chose an image of himself in a cream blazer in front of a modern house; it is cropped and live in About. It may be AI-generated: open question whether to label it. Do not swap it for any other headshot.
- Decisions (2026-11-09): keep the brand film; the portrait stays unlabeled. Charles said labeling the portrait is "none of your business"; do not raise it again.
- Booking (2026-11-09): `bookingUrl` is temporarily his Epique schedule ("Schedule a 20 minute Epique breakdown"), at his direction. His Epique page's two links and the one he sent are all the same schedule. Swap for a Harrison Development appointment schedule when he makes one.
- Examples (2026-11-09): Charles said EpiVail and Harrison Development are "the same" and wants his real examples shown under the EpiVail name. The homepage Concept studies section now shows the real Dowd Junction concept page and the Red Mountain Ranch reel and mobile page inline. He does NOT want tabs or extra pages: keep everything on the homepage.
- Look (2026-11-09): Charles wants FULL motion graphics, photos and video ("look dope"). The homepage now has the brand film looping behind the hero, a giant word ticker, a "ground we know" gallery mixing CC BY photos (Jeffrey Beall) with the two river motion clips, and parallax photo backdrops. Keep it cinematic; keep credits; keep the Pause motion button and reduced-motion fallbacks. Media lives in `harrison-development/assets/media/`.
- LIVE (2026-11-09): https://harrison-development.charlesharrisonvail.workers.dev (Cloudflare Workers + KV, free). Redeploy after every change with `bash harrison-development/deploy/deploy.sh` (Pages direct upload fails through the session proxy; the Workers route works). Search indexing is off until his own domain is connected. Contact form opens the visitor's email app (no form backend yet).
