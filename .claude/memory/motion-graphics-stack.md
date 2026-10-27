---
name: motion-graphics-stack
description: Status of the 28 motion-graphics Claude Code installs from the Prakhar Saxena post (2026-10-27) - what is in place, what is held and why, and what to ask before adding more
---

The 28-item list and each item's status live in `tools/motion-graphics/README.md`.
Summary of the decisions:

- Added to the repo: the three.js skills (`.claude/skills/threejs-*`, MIT) and the
  GSAP plugin (`gsap-skills@gsap-skills` in `.claude/settings.json`, MIT). (2026-10-27)
- Remotion's official skill pack was not copied in: it has no LICENSE file, and the
  post says Remotion charges teams of 4 or more. Ask Charles before adding it. (2026-10-27)
- Held under the no-paid-AI-tools rule: ElevenLabs skills (needs an account and key),
  21st.dev Magic MCP (needs a key), After Effects MCP (needs paid Adobe software).
  Ask Charles before setting any of them up. (2026-10-27)
- Free laptop installs Charles can run himself: ffmpeg, whisper, manim. (2026-10-27)
