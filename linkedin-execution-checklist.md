# Daily Execution Checklist + Tracker

The plan only works if the loop runs. ~45 min/day total.

## Scheduled / in flight

| What | When | How |
|---|---|---|
| Vail market carousel (PDF) | **Wed Aug 19, 7–9am MT** | Manual — LinkedIn's native scheduler. Claude sends a reminder at 7am MT with the file path and copy. |
| Equity vs Commission (video, 15s) | **Fri Aug 21, 8am MT** | Manual — upload `assets/equity-vs-commission-15s.mp4` natively. Claude sends a reminder at 8am MT. |

Document (PDF/carousel) posts cannot be scheduled by any connected tool —
OpusClip's LinkedIn integration handles video only. Carousels go through
LinkedIn's own scheduler.

**Do not route video through OpusClip.** It auto-applies the default brand
template, which appends intro/outro media (`CharlesInternational.mp4`,
`logoexplode.mp4`) and burns karaoke captions over the typography — the test
render came back 68s instead of the length built. Native upload only, unless
that template is turned off in OpusClip first.

## Daily (Mon–Fri)
- [ ] Post the day's calendar item, 7–9am MT (Mon/Tue posts are the priority — 43% of your reach lives there)
- [ ] 15 comments: 10 US real-estate voices, 5 France/Australia/Mexico agents (see target list in `linkedin-content-queue.md`)
- [ ] Reply to every comment on your posts within 2 hours
- [ ] Any agent who engaged twice → short human DM (no pitch); log them in Lofty

## Weekly (Friday, 15 min)
- [ ] Note the week's numbers in `linkedin-tracker.csv` (below)
- [ ] Pick next week's two news-jack candidates
- [ ] Queue the TikTok/Facebook cross-posts of the week's best performer

## Monthly (next: ~Aug 20, 2026)
- [ ] Export fresh analytics XLSX (full range) and upload to Claude
- [ ] Success bar for month 1: >3,000 impressions (vs. 473 in Jul), >100 new followers (vs. 5)
- [ ] Refresh Featured section pins
- [ ] Refreshed 2-week calendar from the new data

## Tracker
`linkedin-tracker.csv` — one row per week. Import into Google Sheets
(File → Import) and log Fridays. Columns: week start, posts published,
comments made, avg reply time, impressions, engagements, new followers,
agent DM conversations started, notes.
