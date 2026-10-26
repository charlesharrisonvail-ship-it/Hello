# OpenMontage — free Windows setup

Setup notes for [OpenMontage](https://github.com/calesthio/OpenMontage) by
calesthio. It is an open-source video studio that Claude Code drives. You open
its folder in Claude Code and describe a video. Claude writes the script,
narrates it, finds free footage or makes images, adds captions and music, and
renders an MP4.

Targets **Windows** (ThinkPad). This directory holds **notes only**. The source
is not vendored here because it is 164 MB and AGPL-3.0, and it has its own
`CLAUDE.md` and `.claude/` that must not mix with this repo's. Written against
upstream commit `e01dbf4` (2026-10-23).

## Read this first: what is free and what is not

**Charles does not pay for this.** The route below needs no paid key.

| Part | Free? | Notes |
|---|---|---|
| OpenMontage itself | Yes | AGPL-3.0, free |
| Claude Code (the "brain") | Uses his Claude plan | No extra charge |
| Narration — **Piper TTS** | Yes | Offline, installed by setup |
| Footage — Archive.org, NASA, Wikimedia | Yes | No key needed |
| Footage — Pexels, Pixabay, Unsplash | Yes | Free developer keys (optional sign-up, no card) |
| Animation — Remotion, HyperFrames, FFmpeg | Yes | Run locally |
| AI video/images — fal, Kling, Runway, Higgsfield, HeyGen, ElevenLabs… | **No** | Paid keys. **Leave them blank.** |
| Local AI video (WAN, Hunyuan, LTX) | Yes, but needs an NVIDIA GPU | Skip on the ThinkPad |

With every paid key blank in `.env`, OpenMontage cannot pick a paid provider.
It also asks before any paid step above $0.50 (`config.yaml` →
`budget.single_action_approval_usd`). If it ever asks to spend, say no.

## Install (Windows)

1. Install the three prerequisites (all free). Tick **Add to PATH** where the
   installer offers it:
   - **Python 3.10+**: [python.org/downloads](https://www.python.org/downloads/)
   - **Node.js 22 LTS**: [nodejs.org](https://nodejs.org/). HyperFrames needs
     Node 22 or newer; Remotion alone needs 18.
   - **FFmpeg**: in PowerShell, run `winget install Gyan.FFmpeg`
   - **Git**: `winget install Git.Git` (skip it if `git --version` already works)

   Close and reopen PowerShell after installing so it sees them.

2. Clone and set up. Paste this into PowerShell one line at a time:

   ```powershell
   cd $env:USERPROFILE
   git clone https://github.com/calesthio/OpenMontage.git
   cd OpenMontage
   py -3 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -r requirements.txt
   cd remotion-composer; npm install; cd ..
   python -m pip install piper-tts
   Copy-Item .env.example .env
   ```

   - If `Activate.ps1` is blocked ("running scripts is disabled"), run
     `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then retry.
   - If `npm install` fails with `ERR_INVALID_ARG_TYPE`, use
     `npx --yes npm install` instead.

3. **Check it works with no keys.** This renders the built-in demo videos:

   ```powershell
   python render_demo.py
   ```

## Use it

1. Open the `OpenMontage` folder in Claude Code (desktop app → open folder, or
   `cd $env:USERPROFILE\OpenMontage` then `claude`). Open **that folder**, not
   this `Hello` repo. OpenMontage's own `CLAUDE.md` runs the show there.
2. Ask for a video, and say it must be free. For example:

   > Make a 45-second vertical video about why Vail Valley agents should
   > think about their brokerage split. Free tools only: Piper narration,
   > real footage from Archive.org/Wikimedia, captions, music. No paid
   > providers.

   > Make a 60-second documentary montage of Colorado mountain towns in
   > winter. Real footage only, no narration, warm tone, with music.

3. Finished videos land in `projects\<project-name>\renders\final.mp4`.
4. Optional: watch the run live with `python -m backlot open`.

## Brand rules still apply

OpenMontage doesn't know Charles's brands. Whatever it makes, check it before
posting:

- **EpiVail** pieces: `CLAUDE.md` naming and the one signature,
  `Charles Harrison, Epique Area/Growth Leader`. Never "Epique Mountain
  Collective".
- **AiRE Estate** pieces: Charles's name is never shown. Label AI as AI. See
  `.claude/ROLE.md`.
- **Footage licences:** archive and stock clips are free, but some need
  credit. Keep the credits OpenMontage lists in the project folder.

## Keys

Never paste a key into chat or into this repo. Free stock keys (Pexels and the
like) go only in `OpenMontage\.env` on the laptop.

## Updating

```powershell
cd $env:USERPROFILE\OpenMontage
git pull
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
cd remotion-composer; npm install; cd ..
```
