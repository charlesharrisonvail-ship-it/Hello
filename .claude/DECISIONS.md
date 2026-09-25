# Settled decisions

Each line is a call already made, with the reason. Do not re-propose these.
If one needs reopening, Charles reopens it.

## Brand and voice

**Brand is EpiVail; region is Epique Realty Colorado Mountain Region** - fixed
strings, not descriptions to paraphrase. (CLAUDE.md)

**"Epique Mountain Collective" is banned outright** - not in messages,
signatures, posts, or materials. The `epivail-brand-system` skill still
recommends it; `CLAUDE.md` bans it. **CLAUDE.md wins.** This exact mismatch has
already cost two correcting commits (PR #9, PR #15). (2026-09-25)

**Messages to people get the CLAUDE.md sign-off; posts get the byline** -
`Charles Harrison | EpiVail | Epique Realty` on email, DM and SMS;
`Charles Harrison, Epique Area/Growth Leader` as a post byline, never with a
regional descriptor. `recruitment-outreach.md` currently mandates the byline form
for lead messages, which contradicts `CLAUDE.md`; CLAUDE.md governs until Charles
reconciles the two files. See `recall.py signature`. (2026-09-25)

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

**Continuity installed standalone, not as a plugin** - `/plugin` does not work in
Claude Code on the web, where much of this work happens. Copying the kit into
`.claude/continuity/` makes it version-controlled and dependent on nothing.
Upstream: github.com/ArkodaAI/continuity, MIT. (2026-09-24)

**`.claude/settings.json` holds both Superpowers and the continuity hooks** -
disjoint top-level keys, so the file is a union, not a choice. An edit that
rewrites it wholesale silently disables whichever half it drops. Merge into it;
never overwrite it. (2026-09-24)

**Identity gets its own SessionStart hook entry** - the ~10KB door is per hook
entry, not per session, so `ROLE.md` costs the project orientation nothing, and
it loads first because identity frames what is read after it. (2026-09-24)

**Hook commands try `python3` then fall back to `python`** - which one exists
varies by machine, and a wrong name fails silently: session starts, agent sounds
confident, orientation never arrives. (2026-09-24)

**The banked working thread is capped at 3 blocks** - unbounded growth would blow
the character budget and silently truncate the whole payload, which is the exact
failure the kit exists to prevent. (2026-09-24)

**Memory frontmatter is the index** - no separate index file, because one
maintained by hand drifts, and a drifted index hides memories that exist. Put
the words you would actually search into `description:`. (2026-09-24)
