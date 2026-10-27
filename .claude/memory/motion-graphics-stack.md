---
name: motion-graphics-stack
description: Status of the 28 motion-graphics Claude Code installs from the Prakhar Saxena post (2026-10-27) - what is in place, what is held and why, and what to ask before adding more
---

The 28-item list and each item's status live in `tools/motion-graphics/README.md`.
Summary of the decisions:

- Added to the repo: the three.js skills (`.claude/skills/threejs-*`, MIT) and the
  GSAP plugin (`gsap-skills@gsap-skills` in `.claude/settings.json`, MIT). (2026-10-27)
- Remotion is cleared: Charles works solo, and Remotion's license is free for
  individuals and companies of up to 3 people. Its skill pack is not committed here
  (3.5 MB, no LICENSE file of its own); Charles installs it on his laptop with
  `npx -y skills@latest add remotion-dev/skills -g -y`. Don't wire that installer
  into a hook. (2026-10-27)
- Held under the no-paid-AI-tools rule: ElevenLabs skills (needs an account and key),
  21st.dev Magic MCP (needs a key), After Effects MCP (needs paid Adobe software).
  Ask Charles before setting any of them up. (2026-10-27)
- Free laptop installs Charles can run himself: ffmpeg, whisper, manim. (2026-10-27)
