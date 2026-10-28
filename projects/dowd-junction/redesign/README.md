# Dowd Junction · EpiVail concept site (redesign)

A private, developer-facing pitch for marketing the proposed community housing at
Dowd Junction, near Avon, Colorado. It replaces `../original-site/index.html`, which
the owner rejected as basic and ugly. That file is left unchanged as the baseline.

It has not been deployed, and nobody has been contacted. The package in `..`
does not authorize either.

## Run it

Needs Node 18 or newer. No accounts, keys or paid services.

    cd projects/dowd-junction/redesign
    npm install
    npm run dev        # http://localhost:5173 while editing
    npm run build      # static site in dist/
    npm run preview    # serves dist/ at http://localhost:4173

`dist/` is plain static files with relative paths, so it can be dropped onto any
static host or opened from a sub-folder. The fonts are bundled, so nothing loads
from a third-party font service.

## What is on the page

1. **Hero**: full-bleed Eagle River photograph, the headline, and one line
   giving the concept status.
2. **The place**: the corridor in words, with the Gore Range photograph.
3. **The opportunity**: a public-domain USGS aerial of EagleVail to Dowd
   Junction. Phase tabs (~100 / ~200 / ~300) light the approximate area on
   the aerial and show the need, the site and the source. Below that is a
   dated timeline of the public record.
4. **The EpiVail approach**: five proposed services, plainly marked as a proposal.
5. **Public record**: a viewer for four source documents. Each shows the date
   and page, what it establishes, what it does not, and a working link. Below
   it are the questions for a first conversation.
6. **Conversation**: Charles Harrison, Epique Area/Growth Leader, with a link to
   https://charlesharrison.epiquerealty.com/. There is no form and no data collection.
7. **Footer**: a short status note and photo credits.

## Asset manifest

| File | Shows | Source | Creator | License | Downloaded |
|---|---|---|---|---|---|
| `public/img/eagle-river-minturn-*.webp` | Eagle River at Minturn (39.5695, -106.4061), upstream of Dowd Junction, 2020-10-19 | https://commons.wikimedia.org/wiki/File:Eagle_River_at_Minturn%E2%80%932.JPG | Jeffrey Beall | CC BY 4.0 | 2026-10-28 |
| `public/img/eagle-river-detail-*.webp` | Eagle River at Minturn (39.5698, -106.4064), 2020-10-19 | https://commons.wikimedia.org/wiki/File:Eagle_River_at_Minturn.JPG | Jeffrey Beall | CC BY 4.0 | 2026-10-28 |
| `public/img/gore-range-vail-*.webp` | Gore Range from Vail, 2009-05-12 | https://commons.wikimedia.org/wiki/File:Gore_Range_from_Vail,_Colorado.jpg | David Herrera | CC BY 2.0 | 2026-10-28 |
| `public/img/aerial-dowd-*.webp` | Orthoimagery, bbox -106.500,39.598 to -106.440,39.630 | USGS The National Map, USGSImageryOnly MapServer export | USDA, USGS | Public domain (U.S. government work) | 2026-10-28 |

All were resized to WebP; nothing else was altered. No photo shows the
development site itself, and every caption names its real location. The aerial
predates the site clearing. The two shaded areas on it are approximate
orientation from the July 2026 packet's wording, not boundaries, and are labeled
as such.

## Verification record (2026-10-28)

Tested with headless Chromium (Playwright) against the production build:

- **Widths 1440, 768 and 390:** no horizontal page overflow, no console or page
  errors. Full-page captures are in `screenshots/`.
- **Phase tabs:** Left/Right arrows wrap, Home/End work, and the selection moves
  focus, changes the panel and lights the aerial. Tab moves into the panel.
- **Document tabs:** Up/Down arrows wrap and swap the panel.
- **Navigation:** every in-page anchor has a target. The skip link is the first
  Tab stop. The mobile menu opens, closes on link click, and closes on Escape
  (returning focus to the button).
- **Outbound links (curl):** both avon.org packet pages (200), the Three-Mile
  Plan PDF (200), the Vail Home Partners PDF (200), and the Commons file pages
  (200) responded. charlesharrison.epiquerealty.com answered with an unusual
  HTTP 218 but served its page.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, the hero drift,
  reveals and transitions are disabled and the page renders complete.
- **Contrast (WCAG formula):** body text 7.1:1. Bronze labels 5.2:1 on ivory and
  4.7:1 on sand. Captions on pine 6.0:1. Gold on pine and pine on gold 7.7:1.

Not tested: real phones, Safari or Firefox, screen readers, or Lighthouse.

## Still needed before any public launch

- Charles's say-so to publish, and where.
- An authentic photo of the cleared site with river context, ideally his own
  drone or ground shot. It would replace the hero.
- The official EpiVail logo (and the Epique Realty mark, if wanted). The
  wordmark here is temporary text.
- A professional headshot of Charles, if he wants one on the card.
- The official parcel exhibit from the July 2026 packet, with permission, to
  replace the approximate shading.
- Fresh confirmation of: closing on the land purchase, annexation status, the
  developer (Corum's role is unconfirmed), for-sale or rental tenure, how
  brokerage will be selected, final unit counts, and any approved project name,
  renderings, floor plans, pricing and eligibility. None of these are on the page.
- Re-check every planning figure against the source on the day of launch.
