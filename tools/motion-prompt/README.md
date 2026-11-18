# Motion Prompt — free setup notes

Setup notes for [Motion Prompt](https://github.com/showheyohtaki/motion-prompt)
by Shohei Ohtaki (MIT). It is a numbered library of **240 names** for things you
ask an AI to make, each with a moving sample, timings and a ready-made prompt:

| Pack | IDs | What |
|---|---|---|
| `motion`, `motion2` | #001–024, #121–144 | Motion-graphics moves |
| `camera`, `camera2` | #025–048, #169–192 | Camera moves and transitions |
| `ui` | #049–072 | UI component names |
| `lp`, `lp2` | #073–096, #145–168 | Landing-page and web effects |
| `photo` | #097–120 | Photo looks and lighting |
| `artstyle` | #193–216 | Art styles for image generation |
| `diagram` | #217–240 | Diagrams and charts for slides |

Gallery (everything moves): <https://showheyohtaki.github.io/motion-prompt/>

Useful for writing video prompts (Higgsfield, Open Generative AI, Null Motion,
Remotion): "dolly in, not zoom" gets you the shot you meant. Brand-neutral —
EpiVail, AiRE Estate and HD rules still govern what you make with it.

This directory holds **notes only**; the source is not vendored here. Written
against upstream commit `683ecca` (2026-11-16).

## What is free

All of it. No account, no API key. The skill reads the catalog from GitHub,
caches it in `~/.cache/motion-prompt`, and runs a tiny local server on
`127.0.0.1` only while you pick in the gallery.

## Install (Windows)

You need **Node.js 22+** (<https://nodejs.org>) and **Git**.

**Option A — as a Claude Code skill (recommended).** In a **regular**
PowerShell (not "Run as administrator"):

```powershell
cd $env:USERPROFILE
npx skills add showheyohtaki/motion-prompt -g -a claude-code -y
```

`-g` installs it once for every project; `-a claude-code` skips the other
agents. Run from `C:\Windows\System32` (where an admin PowerShell opens) it
fails with `EPERM: operation not permitted, mkdir 'C:\Windows\System32\.agents'`
— that is the folder, not the skill. Seen 2026-11-18.

Then ask Claude Code: *"open the motion-prompt library"*. The gallery opens in
your browser; tick what you like, press **Send to AI**, and tell Claude what to
do with it. Or by number: *"use motion-prompt #027 dolly in for the opening
shot"*.

**Option B — as a plugin.** Inside Claude Code:

```text
/plugin marketplace add showheyohtaki/motion-prompt
/plugin install motion-prompt@motion-prompt
```

**Option C — no install.** Open the gallery, find the move, put its name in your
prompt, or press **Copy picks** and paste into any chat.

## Commands (what the skill runs)

```powershell
git clone https://github.com/showheyohtaki/motion-prompt.git
node motion-prompt\skills\motion-prompt\scripts\motion-prompt.mjs list
node motion-prompt\skills\motion-prompt\scripts\motion-prompt.mjs search dolly in
node motion-prompt\skills\motion-prompt\scripts\motion-prompt.mjs prompt 27
node motion-prompt\skills\motion-prompt\scripts\motion-prompt.mjs pick
```

## Verified

Cloned in a cloud session on 2026-11-18, Node 22.23: licence read (MIT);
script read (it fetches only `raw.githubusercontent.com`, writes only its cache,
opens your browser for `pick`); `info`, `list`, `search`, `prompt` all ran and
loaded 240 elements across 10 packs. Not tested: `pick` in a real browser, or
Windows itself.
