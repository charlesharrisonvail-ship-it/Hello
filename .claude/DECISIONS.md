# Settled decisions

Each line is a call already made, with the reason. Do not re-propose these.
If one needs reopening, Charles reopens it.

## Two separate things

**EpiVail and AiRE Estate are separate businesses - never blend them.** EpiVail is
his Epique Realty work: agent recruiting, listings, Lofty, LinkedIn. AiRE Estate is
the course business he teaches for, published from `docs/` at `learn.aireestate.com`.
Every rule in the EpiVail section below - naming, signature, voice, positioning, the
banned phrase - applies to EpiVail work only. AiRE Estate's rules are in `ROLE.md`.
Stated by Charles 2026-10-02, after the two had been conflated. (2026-10-02)

## EpiVail: brand, voice and sending

**Brand is EpiVail; region is Epique Realty Colorado Mountain Region** - fixed
strings, not descriptions to paraphrase. (CLAUDE.md)

**"Epique Mountain Collective" is banned outright** - not in messages,
signatures, posts, or materials. The `epivail-brand-system` skill still
recommends it; `CLAUDE.md` bans it. **CLAUDE.md wins.** This exact mismatch has
already cost two correcting commits (PR #9, PR #15). (2026-09-25)

**One signature for all EpiVail work: `Charles Harrison, Epique Area/Growth Leader`** -
email, DM, SMS, call scripts and LinkedIn bylines alike, never with a regional
descriptor appended. Not set for AiRE Estate. Settled by Charles; it resolved a contradiction
where `CLAUDE.md` said `Charles Harrison | EpiVail | Epique Realty` and the agent
files said this form. The pipe-separated form is retired - if you meet it, it is
stale. See `recall.py signature`. (2026-09)

**Check the do-not-contact list before sending anything to anyone** - it lives in
`CLAUDE.md` under "Do not contact", is deliberately NOT copied here so it cannot
drift, and is absolute: never email, text, call, or enroll those people in any
sequence, even when Lofty flags them as past due or needing attention. A Lofty
"past due" flag alone is never a reason to send; confirm the lead is still
active. When in doubt, draft and show Charles instead of sending. (CLAUDE.md,
`lofty-crm.md`)

**Voice is courteous and warm, with Southern manners** - and in outreach:
confident, direct, generous, never hypey. (CLAUDE.md, `recruitment-outreach.md`)

**One audience per post, never both** - agent attraction and Luxury
Resimercial(TM) blended in one piece serve neither. (`linkedin-content.md`)

## Working method

**Enrich before you write** - personalization requires knowing something true
about the recipient, so outreach to an un-enriched lead is backwards. Chain is
enrich -> load into Lofty -> write the message the Lofty task calls for.
(`recruitment-outreach.md`, `lofty-crm.md`)

**Creation follows measurement** - when `linkedin-optimizer` analytics are in the
conversation, the data picks topic and format, not taste.
(`linkedin-content.md`)

**Depth over breadth on leads** - one fully-enriched lead beats five
half-enriched ones. (`lead-enrichment.md`)

**A lead without a dated next step is a lead being lost** - every Lofty record
carries one. (`lofty-crm.md`)

**Never ask for the Lofty password; never put an API key in chat, commits, or
files** - absolute, no exceptions. (`lofty-crm.md`)

**Feature branch, merged through a pull request** - never straight to `main`.
(CLAUDE.md)

## This repo's machinery

The reasons behind the Continuity install are in memory: `recall.py continuity`.
Two rules bind every edit to this repo:

**Never overwrite `.claude/settings.json`** - it holds Superpowers AND the
continuity hooks, and a wholesale rewrite silently disables whichever half it
drops. Merge into it.

**Never trim a rule to fit the budget** - add a hook entry instead; the limit is
per entry, not per session. (2026-09-24)
