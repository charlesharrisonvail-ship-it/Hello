# img2threejs — free Windows setup

Setup notes for [img2threejs](https://github.com/img2threejs/img2threejs).
img2threejs is an open-source skill for Claude Code. You give it one photo of an
object, and it rebuilds that object as a 3D model you can spin around in a web
page. The model is written as code (Three.js), not a mesh file.

Targets **Windows** (ThinkPad). This directory holds **notes only**; the skill's
source is not vendored here. Written against skill release `v2.0.0` and upstream
commit `954cd58` (2026-10-21).

**Status on Charles's PC:** installed 2026-10-22. `doctor` reports Claude Code
as `managed`, on 2.0.0. Python 3.14.8, Git 2.55.0.

**What it is good at:** hard objects with clear shapes, such as a chair, a lamp,
a sign, or a piece of equipment. **What it is not:** a 3D scanner. One photo
can't show the back of anything, so it guesses hidden sides and says so. People
and characters come out stylized, not lifelike. The skill's own README calls
"this cannot reach the requested fidelity from this image" a normal result.

## Read this first: what is free and what is not

**Charles does not pay for this.** Nothing below needs a card.

| Part | Free? | Notes |
|---|---|---|
| img2threejs itself | Yes | Apache-2.0 licence |
| Its thinking | Uses your Claude plan | It runs inside Claude Code, on the plan you already sign in with. No API key, no per-use bill. A full rebuild is long, so it uses a fair share of your plan. |
| Its scripts | Yes | Plain Python, nothing extra to install |
| Sponsors on its page (Tripo, Hyper3D, Atlas Cloud) | Skip | Paid services. The skill does not need them. |
| Optional add-ons (hosted reference mesh, local vision models) | Skip | The base skill works without them. See "Optional add-ons" below. |

If anything asks for a card, stop and skip that step.

## Install (Windows)

You need **Node.js 18+**, **Git**, and **Python 3.10+**. Check them in
PowerShell:

```powershell
node --version
git --version
python --version
```

Install any that are missing (skip the ones you have), then close PowerShell
and open it again:

```powershell
winget install --id OpenJS.NodeJS.LTS
winget install --id Git.Git
winget install --id Python.Python.3.13
```

### 1. Turn on Developer Mode (one time)

The installer links the skill into Claude Code's skills folder. Windows only
lets ordinary programs create that link when Developer Mode is on.

**Settings → System → For developers → Developer Mode: On.** On Windows 10 it
is under **Privacy & security → For developers**.

Skip this, and the install fails with:

```
error (1): skill install failed: EPERM: operation not permitted, symlink ...
```

If you'd rather leave Developer Mode off, right-click **Windows PowerShell**,
choose **Run as administrator**, and run step 2 from there instead.

### 2. Install the skill

```powershell
npx --yes img2threejs@latest install
npx --yes img2threejs@latest doctor
```

`doctor` should show:

```
claude     ✓ detected  C:\Users\<you>\.claude\skills  managed → ...\img2threejs (2.0.0)
```

`managed` means it worked. `(no link)` means the install did not finish; go
back to step 1. The other lines (hermes, codex, opencode) are other AI tools.
"not detected" on them is fine.

The `npm notice ... New major version of npm` message is unrelated. Ignore it.

### 3. Restart Claude Code

Skills only load in a new session. Close Claude Code and open it again.

## Use it

In Claude Code, attach a photo (or give its path) and type:

```text
/img2threejs Rebuild the object in ./photo.jpg as a procedural Three.js model.
Keep its proportions, silhouette and colours. Follow the quality gates.
Report the output files, render-review evidence and any inferred regions.
```

What happens next:

- It studies the photo, writes a plan, then builds the model in passes. After
  each pass it renders the model and compares it with your photo.
- **Expect it to take a while.** It is careful by design. If you stop partway,
  it saves progress in a `.img2threejs\` folder and can pick up where it left
  off.
- **The result** is a small TypeScript file plus a JSON spec, saved in the
  folder you are working in. Claude Code can show it in a web page for you.

Tips for a good photo:

- One object, filling most of the frame, on a plain background.
- Even light, no harsh shadows, nothing cut off at the edges.
- A slight three-quarter angle shows more of its shape than a flat front view.

**If a step fails with "python3 not found"** (or Windows opens the Microsoft
Store), tell Claude Code: *"On this PC, use `python` instead of `python3`."*
The skill's instructions say `python3`, and on Windows the Python you installed
is usually called `python`.

## Keep it current

```powershell
npx --yes img2threejs@latest update
npx --yes img2threejs@latest doctor
```

`update` never downgrades. Restart Claude Code afterwards.

## Optional add-ons (skip unless you need them)

The base skill works on its own. The upstream repo also has extras for harder
jobs. None of them are needed, and Charles has not installed any:

- **Plugins** (`img2 add ...`): extra subject types, such as game weapons and
  rigged characters. Some are private. Not needed for objects.
- **Hosted reference mesh** (`integrations/mesh3d`): uses a free Hugging Face
  hosted model to build a rough 3D reference for scoring. Needs a Hugging Face
  login and extra Python packages.
- **Local vision models** (`integrations/vision`): masks, depth and face/pose
  landmarks. Large downloads, and wants Python 3.11 through `uv`.

## Remove it

There is no uninstall command. To remove it, delete these two:

```powershell
Remove-Item "$env:USERPROFILE\.claude\skills\img2threejs"
Remove-Item "$env:USERPROFILE\.img2threejs" -Recurse
```

The first is only a link, so deleting it removes nothing else. Restart Claude
Code afterwards.

## Not in cloud sessions

Claude Code sessions on claude.ai run in a temporary container. The skill is
installed on Charles's PC only, so use it from Claude Code on the ThinkPad.
