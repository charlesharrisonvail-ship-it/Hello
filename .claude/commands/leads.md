# /leads — Today's seller call list

## Description
Find sellers Charles can win this week: listings in the Vail Valley that just expired,
were cancelled or were withdrawn, with the owner looked up in Lofty.

## Arguments
- (none) — last 7 days
- `30` (or any number) — look back that many days
- `drafts` — also write a first-touch email draft for each lead with an email on file

## Instructions
Run the `seller-lead-desk` agent with the look-back given, and show its list as is.
With `drafts`, create one Gmail draft per lead that has an email in Lofty, following
`.claude/agents/recruitment-outreach.md` for tone only (these are sellers, not recruits).
Never send. Check the `CLAUDE.md` "Do not contact" list first.
