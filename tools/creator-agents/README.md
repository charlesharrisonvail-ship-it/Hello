# Creator agents: YouTube and Instagram skill packs

From Ben Kimball's reel "Top 5 Claude Repos for Content Creators" (2026-11-21).

| # in reel | Repo | Licence | Here? |
|---|---|---|---|
| 5 | YouTube Agent: [Jakeschincariol/youtube-agent-skill](https://github.com/Jakeschincariol/youtube-agent-skill) @ `a2feb21` | MIT | **Yes**: 11 `yt-*` skills in `.claude/skills/` |
| 4 | Browser Harness: [browser-use/browser-harness](https://github.com/browser-use/browser-harness) | MIT | **Notes only**: `tools/browser-harness/`. It drives a real Chrome, so it belongs on Charles's laptop |
| 3 | Remotion Skills: [remotion-dev/skills](https://github.com/remotion-dev/skills) | Remotion licence | **Already had it**: the `remotion` plugin carries the same skills |
| 2 | Instagram Agent: [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) @ `d03c56b` | MIT | **Yes**: 13 `ig-*` skills in `.claude/skills/` |
| 1 | Locked ("?????") in the reel | n/a | **No**: name not shown |

The repo matches for #5, #4 and #2 come from the names on screen. The reel shows
no links.

## The skills

- **YouTube:** `yt-script`, `yt-package` (title + thumbnail), `yt-seo`, `yt-chapters`,
  `yt-edit`, `yt-shorts`, `yt-retention`, `yt-audit`, `yt-plan`, `yt-comment`, `yt-viral`
- **Instagram:** `ig-reel`, `ig-caption`, `ig-carousel`, `ig-story`, `ig-plan`,
  `ig-profile`, `ig-audit`, `ig-viral`, `ig-repurpose`, `ig-comment`, `ig-reply`,
  `ig-dm`, `ig-human` (strips AI tells from any draft)

Each folder has its upstream `LICENSE`. Some skills ship small Python helpers that use only
the standard library (no packages, no network calls, no API keys). The skills are free.

## Voice profile

Every skill reads a voice file if it exists:

- `~/.claude/youtube/voice.md`: template in `youtube-voice.md`
- `~/.claude/instagram/voice.md`: template in `instagram-voice.md`

Fill one in **per brand** before relying on the output. EpiVail, AiRE Estate and
Harrison Development each sound different. Never mix them in one file.

## House rules still apply

These packs are brand-neutral. `CLAUDE.md` governs anything they produce:

- `ig-dm`, `ig-comment`, `ig-reply` and `yt-comment` **draft only**. Charles sends.
  Check the Do-not-contact list first.
- EpiVail sign-off is `Charles Harrison, Epique Area/Growth Leader`. AiRE Estate
  never fronts his name.
- Never "Epique Mountain Collective".
