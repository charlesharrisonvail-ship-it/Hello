---
name: jarvis
description: Router and daily-routine control for the JARVIS personal OS — a Claude Code brain, an Obsidian-style markdown vault for memory, local voice I/O, and a terminal HUD. Use when the user says "jarvis", asks for their morning brief, wants to plan the day, close the day, run the daily routine, check what the vault knows, or asks how the personal OS is wired.
---

# JARVIS — Personal OS Router

Four parts, one system:

| Part | Role |
|------|------|
| Claude Code | The engine — routes every request to the right skill |
| The vault | The memory — everything saved as linked markdown |
| Local voice | The ears + mouth — speech in, speech out, fully private |
| The HUD | The face — one screen for vitals, schedule, and commands |

## Vault location

Every skill in this family reads and writes one vault. Resolve it in this order:

1. `$JARVIS_VAULT`
2. `~/Vault`

If neither exists, run `jarvis/install.sh` (in this repo) before doing anything else — it creates the tree.

```
Vault/
  raw/       # everything captured, unedited
  wiki/      # distilled knowledge, one topic per note
  outputs/   # everything JARVIS produces (briefs, plans, reports)
  system/    # queue.jsonl, metrics.json, schedule.md, state
```

**The rule: if it's not in the vault, it didn't happen.** Never answer from
conversation memory alone when a vault note exists — read the note. Never
produce a report without writing it to `outputs/`.

## Routing

| The user says | Load |
|---|---|
| numbers, subs, views, followers, "metrics pull" | `jarvis-metrics` |
| inbox, morning brief, what came in | `jarvis-inbox` |
| what's moving, trending, AI news | `jarvis-trends` |
| plan today, top 3, close the day, tomorrow | `jarvis-plan` |
| remember this, what do you know about X, save that | `jarvis-vault` |

Small, single-purpose skills beat one giant prompt. When a request spans two,
load both and write one combined note.

## The daily routine

| Time | What happens | Skill |
|------|--------------|-------|
| 07:00 | Morning brief — inbox, calendar, AI news read aloud | `jarvis-inbox` + `jarvis-trends` |
| 09:00 | Plan today — top 3 priorities saved in the vault | `jarvis-plan` |
| 14:00 | Metrics pull — subs, views, followers tracked | `jarvis-metrics` |
| 19:00 | Close the day — reflection logged, tomorrow queued | `jarvis-plan` |
| Anytime | Ask anything — the vault remembers everything | `jarvis-vault` |

To run a slot manually, just say the name ("morning brief", "plan today",
"metrics pull", "close the day"). To schedule them, see `jarvis/README.md`.

## Writing notes

Every note JARVIS writes gets this frontmatter, so the graph links up:

```markdown
---
date: 2026-08-24
type: brief | plan | report | capture | wiki
tags: [metrics, youtube]
links: ["[[2026-08-23]]", "[[Channel Growth]]"]
---
```

Filenames: `outputs/<type>/YYYY-MM-DD-<slug>.md`, `raw/YYYY-MM-DD-<slug>.md`,
`wiki/<Topic Name>.md`. Date-stamp everything; never overwrite a dated note —
append a `## Update HH:MM` section instead.

## Speaking

When the user is in a voice session (`jarvis/voice/ptt.py`), keep spoken
replies under ~60 words and lead with the answer. Write the long version to
the vault and say "full note is in outputs/…".
