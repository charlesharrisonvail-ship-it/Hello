---
name: mistakes-log
description: Running log of mistakes that cost Charles credits, tokens or time - read before starting AiRE course production work so they are not repeated
---

- 2026-10-26: Re-cut Listing Media Module 1 over a narration that was not his voice.
- 2026-10-27/28: Re-cut Listing Media 2-7, the bonus and all of Lead to Keys over AiRE's old
  narration with no avatar, without asking. ~240 Higgsfield credits on visuals for the wrong
  format. Rule now: lesson videos are his avatar + Starfish voice.
- 2026-11-02: Told him Build Your AI Assistant would take "about a week" - it was hours of work
  (renders run in parallel, ~15-20 min each). Padded estimates cost his trust and launch time.
  Give real, short estimates.
- 2026-11-02: Asked him for decisions and items he had already given (checklist questions,
  per-module voice samples after the Starfish voice was settled). Re-asking wastes his time
  and tokens. Check memory and the repo first; only ask what is truly open.

## 2026-11-02 — render queue waited on itself (again)
Queued BYA Modules 5–8 renders behind `while pgrep -f "m4a-lesson"`. pgrep matched the
waiting shell's own command line, so the queue never started and ~15 minutes of render
time were lost while Module 4 finished. Same mistake as the earlier self-matching wait loop.
Rule: never wait with `pgrep -f` on a pattern that appears in the waiting command. Run
queued renders in one sequential command (`for n in 5 6 7 8; do render; done`) instead.

- **2026-11-03 — cut too much from the homepage hero.** Removing the Paris "peek" block by
  counting `</div>` tags also removed the software note, the "built for you" link and a
  closing tag, which pushed the ticker over the course cards. Caught in the browser check
  before publishing. Fix: cut by the block's own closing tag, assert the neighbours
  (`.need`, `.hbuilt`) still exist, and measure layout before pushing.
