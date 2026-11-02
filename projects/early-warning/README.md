# EpiVail early-warning scan

A weekly scheduled task, set up 2026-11-02 at Charles's request. It finds new
residential projects in the Colorado Mountain Region at the **approval stage,
before a sales team is chosen**. That is when EpiVail's pitches have landed
(Dowd Junction, Red Mountain Ranch); the luxury projects researched later
(Evergreen, The Apogean) already had their sales handled.

- **When:** Fridays at 3:37 p.m. Mountain, after most town packets for the
  following week are posted.
- **Output:** the digest is the run's final message. It is pushed to Charles's
  phone, and the full text is in the Claude app. It sends no email: this account
  cannot attach Gmail to scheduled tasks. It writes nothing anywhere.
- **Memory between runs:** the "Already known" list below is built into its
  instructions. Update the list (here and in the scheduled task) as projects
  are pitched or ruled out.

## What it scans

- Town and county planning agendas and packets: Avon, Eagle, Vail, Minturn,
  Gypsum, and Eagle County (Edwards and unincorporated areas). Summit County
  towns are a second tier.
- News: Vail Daily, RealVail, BusinessDen, Summit Daily.

## What counts

Residential projects of about 8+ homes, or any community-housing or
deed-restricted project, at a stage such as sketch plan, PUD, annexation,
rezoning, PEC/planning commission, DRB, or a development agreement. Also any
town request for proposals (RFP/RFQ) for a housing developer.

For each find, the scan looks for signs that sales are already handled: MLS or
"pre-sale" listings, a project website with a sales showroom, or a developer
with an in-house brokerage. It ranks:

- **Pitch now:** approval stage, no sales team found.
- **Watch:** promising but early, or ownership in flux.
- **Buyer-side only:** already listed.

## Already known (not reported again unless status changes)

Dowd Junction (Avon) and Red Mountain Ranch Parcel 1 (Eagle): pitched,
awaiting replies. The Evergreen (Vail): on hold. The Apogean / Concert Hall
Plaza (Vail): already listed. Also: Sun Road (Avon; watch for the developer
RFP), Avondale Apartments (375 Yoder Ave, Avon), The Summit / Lot B (Avon),
Bosk at the Village (Avon), West End (Edwards), Southface Vail, Timber Ridge
Village (Vail), Battle Mountain (Minturn; watch for a land buyer), Eagle River
Station (Eagle), and Summit County's Runway, Wayside, and Frisco projects.

The exact instructions the scheduled task follows are in `prompt.md`.
