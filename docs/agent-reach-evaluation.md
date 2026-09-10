# Agent Reach — Evaluation & Setup Notes

**Repo:** https://github.com/Panniantong/Agent-Reach
**Evaluated:** 2026-09-10 · **Version installed:** v1.5.0 · **Verdict:** Good fit, with caveats

## What it is

A Python CLI that gives an AI agent read/search access to platforms that
normally require paid APIs or scrapers: web pages, YouTube transcripts,
RSS/Atom, GitHub, Twitter/X, Reddit, LinkedIn, Instagram, Facebook, V2EX,
plus several China-market platforms (Bilibili, XiaoHongShu, Xueqiu,
Xiaoyuzhou). It routes each request through whichever backend currently
works (yt-dlp, feedparser, Jina Reader, gh CLI, Exa MCP) and swaps
backends when a platform changes its defenses.

## Credibility signals

| Signal | Value |
|---|---|
| Stars / forks | 79.2k / 6.8k |
| License | MIT |
| Language | Python 3.10+ |
| Created / last push | 2026-02-24 / 2026-09-01 |
| Open issues | 130 |
| Dependencies | requests, feedparser, python-dotenv, loguru, pyyaml, rich, yt-dlp |

Dependency list is small and mainstream — no obfuscated installers, no
`curl \| bash`, no unpinned private indexes. Credentials are stored locally
in `~/.agent-reach/config.yaml` at mode 600 and are not transmitted
anywhere. Default install makes no system changes; `--system` is opt-in.

## Why it fits our work

- **Content research** — pull YouTube transcripts and RSS at zero cost to
  feed post drafting and market commentary.
- **Social listening** — read real-estate and relocation discussion on
  Reddit and X without paying for API tiers.
- **Public-page reading** — LinkedIn and company pages via Jina Reader,
  useful as a supplement to Apollo enrichment rather than a replacement.
- **Zero recurring API fees**, which is the main draw versus stacking
  another paid data subscription.

## Caveats — read before enabling extra channels

1. **Account-ban risk.** Cookie-authenticated channels (Twitter/X,
   Reddit, XiaoHongShu, Instagram, Facebook) can get the account
   suspended. The project itself recommends dedicated throwaway accounts.
   Do **not** attach a primary business account.
2. **Terms of service.** Scraping-adjacent reads may violate individual
   platform ToS. Keep usage to research volumes, not bulk harvesting.
3. **Server IPs get rate-limited.** Several channels expect a residential
   IP or a proxy. Best value is on a local machine, not a cloud box.
4. **Bilibili via yt-dlp is broken** as of June 2026 per the project docs.
5. **Docs are largely Chinese-language**, including CLI status output.

## Install performed (this container — ephemeral)

Isolated virtualenv, safe mode, no sudo, no cookies, no credentials:

```bash
git clone --depth 1 https://github.com/Panniantong/Agent-Reach.git ~/agent-reach
python3 -m venv ~/.agent-reach-venv
~/.agent-reach-venv/bin/pip install ~/agent-reach
export PATH="$HOME/.agent-reach-venv/bin:$PATH"
agent-reach install --env=auto     # safe mode: checks only
agent-reach doctor                 # channel status
```

Enable the YouTube backend:

```bash
mkdir -p ~/.config/yt-dlp && echo '--js-runtimes node' >> ~/.config/yt-dlp/config
```

### Result: 3 of 15 channels live

| Channel | Status |
|---|---|
| RSS / Atom feeds | working |
| YouTube video + transcripts | working after yt-dlp js-runtime config |
| Any web page (Jina Reader) | reported available |
| GitHub | needs `gh` CLI |
| Full-web semantic search (Exa) | needs `npm i -g mcporter` + Exa MCP |
| V2EX | blocked from this network (proxy 403) |
| 9 optional channels | need cookies — deliberately not configured |

Note: a direct `curl https://r.jina.ai/...` returned empty through this
container's egress proxy, so live web reads should be re-verified on the
machine where it will actually run.

## Recommendation

Worth adopting — install it locally on the workstation where Claude Code
runs, not on a remote container, since several channels depend on a
residential IP. Start with the no-credential channels (RSS, YouTube,
GitHub, Exa search). Add `gh` and `mcporter` to unlock the two highest-value
remaining free channels. Only add cookie-based channels behind dedicated
secondary accounts, and treat that as an accepted risk rather than a
default.
