# Browser Harness: setup notes (Windows)

[browser-use/browser-harness](https://github.com/browser-use/browser-harness) (MIT,
v0.1.14 at commit `5bd1128`) lets Claude Code drive **your own running Chrome**,
logged in as you, over the DevTools protocol. That's useful for sites with no API,
like Lofty screens, the Instagram web app or MLS pages.

It runs on Charles's laptop. It isn't installed in this repo, because cloud sessions
have no Chrome of his to drive. Source is not vendored. From Ben Kimball's
"Top 5 Claude Repos for Content Creators" reel (#4).

## Free vs paid

The tool is free. **Browser Use Cloud**, which the README advertises for parallel
browsers, is paid. Skip it, since Charles pays for no AI tools.

## Install

The upstream docs show macOS/Linux commands. The code has Windows paths, but
the authors don't document Windows. Treat it as untested there.

1. Install **uv** in PowerShell:
   `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`
2. `uv tool install --python 3.12 --upgrade --force browser-harness`
3. Register it with Claude Code:
   `mkdir $HOME\.claude\skills\browser-harness -Force`
   then `browser-harness skill > $HOME\.claude\skills\browser-harness\SKILL.md`
4. In Chrome 144+, open `chrome://inspect/#remote-debugging`, tick
   **Allow remote debugging for this browser instance**, and click **Allow** when asked.
5. Test it: `browser-harness -c "print(page_info())"`

## Two settings to choose on purpose

- **Telemetry** goes to PostHog (EU) by default. To turn it off, set a user
  environment variable: `setx BH_TELEMETRY false`
- **Recordings**: `browser-harness recordings disable`. The default should stay no,
  because recordings save screenshots of whatever pages it visits, logins included.

## Cautions

- It acts **as Charles**, in his logged-in Chrome. Anything that sends, posts,
  buys or writes to Lofty still needs his go-ahead first (`ROLE.md`).
- With remote debugging allowed, any local program can drive that Chrome. Untick
  the box when you aren't using it.
