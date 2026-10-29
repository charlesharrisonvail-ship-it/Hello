---
name: openmontage-epivail-video
description: >
  Make EpiVail short videos for free with OpenMontage (calesthio/OpenMontage),
  the open-source video studio installed on Charles's laptop at
  C:\Users\charl\OpenMontage. Use whenever Charles wants an EpiVail Reel,
  TikTok, Short, or LinkedIn video built from real footage: mountain-town
  lifestyle pieces for buyers and sellers, agent-recruiting videos, or market
  montages. Also use when he names OpenMontage or "Open Montage". Writes the
  narration and the exact request he pastes into OpenMontage, with EpiVail
  brand rules built in. Sister skill to remotion-epivail-video (hand-coded
  Remotion components). EpiVail only; AiRE Estate videos follow ROLE.md.
---

# OpenMontage EpiVail Video

OpenMontage runs **only on Charles's Windows laptop**. A cloud session cannot
reach it, render with it, or see what it makes. So this skill writes the
request; Charles pastes it into Claude Code opened in
`C:\Users\charl\OpenMontage`, and the video lands in
`projects\<project-name>\renders\final.mp4`.

Say that once, in one line, with the request. Never say "I'll make the video"
or "I'll show it here". Setup notes: `tools/openmontage/README.md`.

## Free route only

Charles pays for no AI tools (`recall.py paid`). Every request says:
real footage from Archive.org and Wikimedia Commons, Piper narration,
word-by-word captions, royalty-free music, **no paid providers**, stop and ask
before any step that costs money, and list every footage and music credit.

## Pick one audience

Every video speaks to exactly one (`recall.py audiences`):

1. **Agents** (recruiting): one agent talking to another. Mountain markets,
   plain economics, AI built in. Ask is "send me a message".
2. **Buyers and sellers** (Luxury Resimercial(TM)): place and lifestyle,
   "help you find your place". Fair housing: show places, never who
   "should" live there.

## EpiVail rules, built into every request

- End card, last 4 seconds, exactly: **EpiVail** / **Epique Realty Colorado
  Mountain Region** / **Charles Harrison, Epique Area/Growth Leader**.
  Nothing after the signature except an optional short ask ("Let's talk.").
- Never "Epique Mountain Collective", anywhere.
- No statistics, split percentages, agent counts or earnings claims unless
  Charles gives the number and its source.
- Don't write "Epique X" or "EpiqueAI" until Charles settles which; say
  "AI tools".
- Voice: courteous and warm, Southern manners, never hypey.
- Look: navy `#0a1628`, gold `#c9a84c`, cream `#f5f0e8`; Cormorant Garamond
  headlines, DM Sans body, Bebas Neue for small caps labels. Same tokens as
  remotion-epivail-video.
- Sizes: Reels/TikTok/Shorts 1080x1920; LinkedIn 1920x1080. 30-60 seconds.

## Narration length

About 2.3 spoken words per second: 45 seconds is about 100 words. Write it out
in full in the request so OpenMontage reads it exactly.

## Request template

```
Make a [LENGTH]-second [vertical (9:16) | horizontal (16:9)] video of
[SUBJECT]. It speaks only to [AUDIENCE].

Free tools only: real footage from Archive.org and Wikimedia Commons, Piper
narration (warm, unhurried male voice), word-by-word captions, and warm
royalty-free music. No paid providers. If any step would cost money, stop and
ask me. When it's done, list every footage and music credit.

Use this narration exactly:
"[NARRATION]"

On screen: [OPTIONAL TEXT BEATS]. Navy #0a1628 background panels, gold
#c9a84c accents, Cormorant Garamond headlines, DM Sans body.

End card (last 4 seconds): EpiVail, then Epique Realty Colorado Mountain
Region, then Charles Harrison, Epique Area/Growth Leader[, then "Let's talk."].
Use those words exactly, add nothing after them, and never write "Epique
Mountain Collective".

Footage: [SHOT LIST]. Open on the strongest [PLACE] shot. Show places, not
crowds. No statistics or earnings claims.
```

## Proven scripts (2026-10-29)

**Buyers, Vail and mountain towns in winter, 45s:**
"Morning in Vail. Fresh snow on the Gore Range, and the village just waking
up. Up the road, Breckenridge glows on Main Street. Beaver Creek welcomes you
by the fire. Aspen, Telluride, Steamboat — every one of these towns has its
own way of saying, come on in. Winter here isn't a season. It's a way of
living. If the mountains are calling you home, I'd be honored to help you find
your place in them."

**Agents, same footage, 45s.** Text beats: "Mountain markets." / "Plain
economics." / "AI built in." Add "Let's talk." under the signature.
"To every agent who's ever looked at a ski town and thought, I could build
something here — this one's for you. Vail in winter. Breckenridge, Beaver
Creek, Aspen, Telluride, Steamboat. Markets built on relationships, where a
good name travels. At Epique Realty, the economics are laid out plainly before
you ever sign, and the AI tools come built in, so the busywork doesn't eat your
weekends. I'm growing our Colorado Mountain Region one good agent at a time. If
you'd like to talk it over — no pressure, just a conversation — send me a
message. I'd be glad to hear from you."

## Before it posts

Ask Charles for a screenshot of the end card and check the signature letter by
letter. Posting is his call, never ours.
