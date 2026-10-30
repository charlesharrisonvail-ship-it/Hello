# Null Motion — free local setup

Setup notes for [Null Motion](https://github.com/blixvip/NullMotion) by blixvip
(MIT): it plays a finished motion-graphics ad on top and the plain
black-and-white HyperFrames drafts it grew from underneath, in sync, and exports
the whole breakdown as one MP4. Useful for studying how a polished ad is built.

Targets **Windows**. This directory holds **notes only** — the source is not
vendored here. Written against upstream commit `4acf0f0` (2026-10-28, v1.0.1).

## What is free and what is not

**Charles does not pay for this.** The local app needs no account, no API key,
and no `npm install` — it has zero dependencies.

| Part | Free? | Notes |
|---|---|---|
| This repo (local preview + MP4 export) | Yes | Runs on your own machine |
| **Null Studio** at nullmotion.com | Separate hosted product | Pause cuts, captions, YouTube/Twitch/Kick clips. Not in this code — skip it |
| "Generation" buttons in the editor | Not connected | The server answers `501 NOT_CONNECTED` on purpose |

## Install (Windows)

1. Install **Node.js 22 or newer** (LTS) from <https://nodejs.org>. Check in
   PowerShell: `node --version` should print `v22…` or higher.
2. Install **Git** from <https://git-scm.com> if `git --version` fails.
3. In PowerShell:

   ```powershell
   cd $env:USERPROFILE
   git clone https://github.com/blixvip/NullMotion.git
   cd NullMotion
   npm start
   ```

4. Open **<http://127.0.0.1:4343>** in **Chrome or Edge**. Three sample ads ship
   with it, so it works on the first run.
5. To export: pick a reference, then **Download → Whole preview**. It renders at
   half speed, so a 30-second ad takes a minute or more — keep the tab in front.

Stop the server with `Ctrl+C`. To update later: `cd $env:USERPROFILE\NullMotion`,
then `git pull`.

## Optional extras

- **FFmpeg** — only for importing your own videos (and their audio). Install with
  `winget install Gyan.FFmpeg`, then reopen PowerShell.
- **Python 3** — only for `scripts/import-motionclone.py`.
- Port 4343 busy? `$env:PORT=5000; npm start`.

## Verified

Cloned and run in a cloud session on 2026-10-30: `npm test` 9/9 pass,
`npm run check` clean, the page loads with the Infinite reference and its 7
drafts. The code makes no outbound network calls; it only spawns FFmpeg locally
to extract audio.

## Brand note

The three sample ads are other creators' work. Anything made for EpiVail or
AiRE Estate with this tool still follows the rules in `CLAUDE.md` and
`.claude/ROLE.md`.
