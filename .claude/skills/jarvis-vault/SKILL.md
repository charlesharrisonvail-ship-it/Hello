---
name: jarvis-vault
description: Read and write the JARVIS markdown vault — capture a thought, save a note, search what JARVIS already knows, distill raw captures into wiki notes, and keep the note graph linked. Use when the user says remember this, save that, what do you know about X, look it up in the vault, or asks to clean up / distill the vault.
---

# Vault — read and write memory

The vault is plain markdown on disk. No database. Resolve its path as
`$JARVIS_VAULT`, else `~/Vault`.

```
raw/       everything captured, verbatim
wiki/      distilled knowledge, one topic per note
outputs/   everything JARVIS produces
system/    queue.jsonl, metrics.json, schedule.md
```

## Capture (`raw/`)

When the user says "remember this" / "save that" / dictates a thought, write it
verbatim — do not summarize a capture:

```bash
VAULT="${JARVIS_VAULT:-$HOME/Vault}"
cat > "$VAULT/raw/$(date +%F)-<slug>.md" <<'NOTE'
---
date: 2026-08-24
type: capture
tags: [<topic>]
links: []
---

<the user's words, verbatim>
NOTE
```

If a capture file for that slug and date already exists, append a
`## Update HH:MM` section rather than overwriting.

## Recall (search before answering)

Always search the vault before answering a "what do I know about X" question —
the vault outranks your own recollection.

```bash
VAULT="${JARVIS_VAULT:-$HOME/Vault}"
grep -ril "<term>" "$VAULT" --include='*.md' | head -20
grep -rin "<term>" "$VAULT/wiki" --include='*.md' | head -40
```

Read the top hits in full before summarizing. Cite the notes you used by path,
so the user can open them: "from `wiki/Channel Growth.md`".

If nothing matches, say so plainly — "nothing in the vault on that" — and offer
to capture it now. Never fill the gap with a guess presented as memory.

## Distill (`raw/` → `wiki/`)

When asked to clean up the vault, or when three or more raw notes share a topic:

1. Read the raw notes on that topic.
2. Write or update `wiki/<Topic Name>.md` — the distilled, current truth.
3. Link back: add the raw notes to the wiki note's `links:` list, and add
   `[[Topic Name]]` to each raw note's `links:`.
4. Never delete a raw note. Raw is the audit trail.

A good wiki note is what you'd want to read cold in six months: what it is,
what's true now, what changed, and links to the evidence.

## Linking

Use `[[Wiki Style]]` links inside note bodies as well as in frontmatter —
that's what builds the graph Obsidian renders. Every output note should link to
at least the day's date note and one wiki topic.
