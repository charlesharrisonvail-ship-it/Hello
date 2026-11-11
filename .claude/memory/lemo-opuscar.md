---
name: lemo-opuscar
description: Lemo-Opuscar (code-made short films) is installed on Charles's Windows machine as a user-scope Claude Code plugin; how to run it
---

Lemo-Opuscar (lemomo-ai/lemo-opuscar, MIT) is a Claude Code skill that directs,
draws, scores and renders short films entirely in code, in one of about 66
styles (Watercolor Brush, Ukiyo-e, Satellite Briefing and so on). It uses no
video model, so it costs nothing and fits `no-paid-ai-tools`.

Charles installed it on Windows on 2026-11-11 with
`claude plugin marketplace add lemomo-ai/lemo-opuscar` and
`claude plugin install lemo-opuscar@lemolab` (user scope), and his first film is
in progress. It needs Node 20+, ffmpeg 7+ and Python 3.11+. Run `claude` in a
films folder (e.g. `$HOME\Films`), not `C:\Windows\system32`, and ask for the
film at Claude's prompt, not at the PowerShell prompt. The style library lives
in `~/lemo-opuscar`.

It is not registered in this repo's `.claude/settings.json`: a cloud session's
safety check refused to add it there, so cloud sessions don't load it.

Any film made for AiRE Estate or EpiVail still follows that brand's rules.
