---
name: token-saving
description: how Charles keeps Claude usage low - model choice, disabled plugins, prompt template, session habits
---

Charles wants tokens saved wherever possible (2026-10-20).

Set up in the repo:
- The four EpiVail agents run on `model: sonnet`, not the session's Opus.
- ECC (71 agents, 311 skills) is disabled in `settings.json` (`"ecc@ecc": false`);
  flip it back to `true` to restore. Superpowers and Ponytail stay on.
- `Read(./docs/media/**)` is denied: about 14MB of video, never worth reading.
- Memory is one fact per file, searched on demand; do not grow CLAUDE.md or the
  orientation files to hold rules that can live here.

For Claude: answer short, fix only the broken section, batch tool calls, read
only the files the task needs, use Sonnet/Haiku subagents for light work.

Reusable prompt (fill the brackets, one message, batch related asks):

    Task: [what]   Business: [EpiVail | AiRE Estate]
    Files: [only the ones needed]
    Output: [format, length]   Constraints: [rules, do not touch X]
    Ask me questions first if anything is unclear.

Habits on his side: new topic = new session; edit the first message instead of
stacking corrections; recurring work goes in a scheduled task; spread heavy use
across the day.
