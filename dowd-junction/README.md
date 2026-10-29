# Dowd Junction: EpiVail development marketing concept

A private, developer-facing pitch site that opens a conversation about marketing and
representing the planned community housing at Dowd Junction, on the Eagle River near
Avon. It replaces the version built with ChatGPT, which the owner rejected as "basic and ugly".

**Status:** built and tested locally. **Not published**, and nobody has been contacted.
Both are Charles's call.

```
dowd-junction/
  redesign/        the new site (Vite, plain HTML/CSS/JS, no framework)
  original-site/   the rejected ChatGPT version, kept as the baseline
  brief/           ChatGPT's handoff package, unchanged except one rename (below)
  screenshots/     390 / 768 / 1440 px, hero and full page
  PURSUIT.md       who decides, what to ask, and draft outreach (not sent)
```

## Run it

Requires Node 18 or newer.

```
cd dowd-junction/redesign
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in redesign/dist/
npm run preview    # serve the build at http://localhost:4173
```

`dist/` is a plain static folder (about 6 MB, mostly photographs), so it can go on any
static host. The page carries `noindex, nofollow`.

## What changed from the ChatGPT version

| Rejected version | This version |
|---|---|
| Flat SVG mountain art as the hero | Full-bleed photograph of the Eagle River, credited and labeled with where it was taken |
| A schematic made up to look like a site plan | A real USGS aerial of the corridor, marking only "approx." areas the Town's plans describe |
| Georgia and Arial, green on green | Cormorant Garamond and Manrope (bundled, OFL), ivory, pine and bronze |
| Repeated heading blocks | Eight sections, each laid out differently: figures, aerial, phase explorer with timeline, need, services, document viewer, conversation, FAQ |
| "EpiVail Development Collection" | Plain text EpiVail wordmark; the invented sub-brand is gone |
| Two-tab phase toggle | Three keyboard-accessible tabs (early / north / whole picture), each with what it means for marketing |
| A list of links | A document viewer: date, page pointer, what each source establishes and what it does not |

## New facts found and verified (October 29, 2026)

ChatGPT's ledger checked out where I could reach the sources. Reading the full July 13
packet turned up more:

- **Printed page 27 is "Page 27 of 33" of Attachment A, the draft _Avon Community
  Housing Plan 2026_** (viewer page 68 of 80). The 300 / 100 / 200 goal matches, word for word.
- **The plan's project table (p. 8) lists "State Land Board: Parcel 1" as 104
  price-capped rental homes (R-PC) at 100% AMI, with a "Public/Private" developer.** So
  the first phase may be a rental lease-up, not sales, and no developer has been named.
  The same plan prefers ownership across Avon overall (65 to 75%), so tenure is still open.
- Plan p. 4: Eagle County 2026 AMI is $111,000; the affordability gap is $616,863; Avon's
  share of the county's 10-year need is 1,458 homes. Pp. 8 and 12: a goal of 1,000+
  community homes by 2036.
- Resolution 25-20 was adopted August 26, 2025. The State Land Board withdrew its
  October 2023 petition and filed a new one for a smaller portion of the land.
- The August 2026 purchase item in Alpine Bank's eLine is credited to **Vail Daily
  (Aug 13)**, not the Post Independent. It reports the terms require all residential
  development to be deed-restricted.
- The Vail Home Partners packet (Jan 7, 2026, final page) confirms Corum used "off-site
  storage at Dowd Junction" for Southface Vail soil work. It says nothing about a role here.

## Verification record

Tested with Chromium (Playwright) against the production build.

- **Widths 390, 768 and 1440 px:** no horizontal overflow, no console errors.
- **Keyboard:** the skip link comes first and has a visible focus ring. Phase tabs and
  document tabs follow the ARIA tabs pattern: arrow keys, Home/End, wrapping, roving tabindex.
- **Mobile menu:** opens with `aria-expanded`, Escape closes it and returns focus, and a
  link closes it and scrolls to its section.
- **Reduced motion:** reveals and the hero zoom are off, and all content shows.
  **Without JavaScript**, all content still shows.
- **Contrast (WCAG):** smallest text pair is 4.68:1 (bronze on paper); others 5.2 to 8.8:1.
- **Links:** every `#` anchor resolves. All four document links open their sources
  (the two Laserfiche links load in the Town's JavaScript viewer). Tap targets are 24 px or taller.
- **No forms, no inputs, no data collection.**
- **Not tested:** real iOS Safari and Android devices, a screen reader pass (VoiceOver or
  NVDA), and Charles's own site. `charlesharrison.epiquerealty.com` returned 403 to this
  environment's crawler, so it should be clicked by hand once.

## Asset credits and manifest

All photographs: **Jeffrey Beall, CC BY 4.0** (https://creativecommons.org/licenses/by/4.0/),
via Wikimedia Commons, taken October 19, 2020. They were resized and cropped. Credited
on the page under each photo and in the footer.

| File (redesign/public/img) | Source | Actual location | Used as |
|---|---|---|---|
| `river-hero-*` | [Eagle River at Minturn.JPG](https://commons.wikimedia.org/wiki/File:Eagle_River_at_Minturn.JPG) | Eagle River at Minturn, about 4 mi upstream | Hero |
| `river-close-*` | [Eagle River at Minturn–2.JPG](https://commons.wikimedia.org/wiki/File:Eagle_River_at_Minturn%E2%80%932.JPG) | Same | Place section, conversation background |
| `cliffs-*` | [Minturn Formation.JPG](https://commons.wikimedia.org/wiki/File:Minturn_Formation.JPG) | Cliffs above Minturn | Place section |
| `nottingham-*` | [Nottingham Lake in Avon, Colorado.JPG](https://commons.wikimedia.org/wiki/File:Nottingham_Lake_in_Avon,_Colorado.JPG) | Avon | "Who it is for" |
| `route6-*` | [Route 6 in EagleVail.JPG](https://commons.wikimedia.org/wiki/File:Route_6_in_EagleVail.JPG) | US 6, EagleVail | Approach section |
| `aerial15-*` | USGS The National Map, USGSImageryOnly tiles, z15 | Dowd Junction corridor | Place section aerial |
| `aerial16-*` | Same, z16 (not on the page yet) | Close view of the river bend | Spare |

USGS imagery is public domain. The service doesn't give a capture date, so the caption
says it may predate the site clearing. No photograph is presented as the parcel itself.
Fonts: Cormorant Garamond and Manrope via `@fontsource`, SIL Open Font License.

## Needed before any public launch

1. **Authorization.** The page makes clear it is a concept. It must not go public as
   though EpiVail were appointed.
2. **A real photograph of the cleared site**, from Charles's own ground or drone shots,
   to replace the Minturn hero and the dated aerial.
3. **Official EpiVail / Epique logo files.** The wordmark is plain text until real
   files are supplied.
4. **A headshot and direct contact line**, if Charles wants them on it. No email or phone was invented.
5. **Re-verify every figure.** Plan counts are draft; closing and annexation status, tenure,
   developer, design, pricing, eligibility and dates are all unconfirmed.
6. **The PZC-approved or Council-adopted Community Housing Plan**, which may change p. 8
   and p. 27, and the Vail Daily article itself in place of the digest.
7. **Hosting.** Not deployed. If it goes on a host, use a private or unlisted URL first.
   ChatGPT's live version was left untouched, as instructed.

The handoff's `CLAUDE.md` was renamed `brief/HANDOFF-PROJECT-INSTRUCTIONS.md` so Claude
Code doesn't auto-load it as rules for this whole repo; `brief/checksums.json` still
lists the old name.
