# Freefield — Windows setup notes

Setup notes for [Freefield](https://github.com/neuregex/freefield)
(neuregex/freefield, MIT) — "open-source Higgsfield on ComfyUI": a web studio
(Image, Video, VFX, Audio) where every app is one folder and every model is an
open-weights file. 120 apps, including Cinema Studio (image and video).

This directory holds **notes only** — the source is not vendored. Written
against upstream commit `f3d32ce` (cloned 2026-11-07). These notes follow the
upstream README; **nothing here has been run on Windows or on a GPU yet**, so
fix them with whatever you hit.

## Read this first: what is free and what is not

**Charles does not pay for AI tools.** Freefield itself is free and has no
account, key or credits. The cost is *where the GPU lives*:

| Route | Cost | What it needs |
|---|---|---|
| **A. Your own GPU** (`tools/local_backend.py`) | Free | An NVIDIA card with enough VRAM. Most apps want **24 GB**; a few are small (see the table below). A ThinkPad without a separate NVIDIA card will not run the video apps. |
| **B. Modal** (cloud GPU) | **Paid, per second of GPU time** | A Modal account and a card. Upstream's own estimate is about $0.007 for a Soul ID run on an L40S, but several video apps need an H100 or 48 GB card. Check Modal's current pricing and any free credit yourself before signing up. |

If the laptop has no suitable NVIDIA GPU, Route A is not available and Route B
costs money. Say so rather than signing up. The free fallback is
[Open Generative AI](../open-generative-ai/README.md)'s local Image Studio.

## What fits on a card

From upstream's app table ("On a 24 GB card"). Largest phase of each app:

| App | VRAM |
|---|---|
| `remove-bg` | 0.4 GB |
| `upscale`, `upscale-video` | 4.0 GB |
| `cinema-studio` (stills with camera, lens, lighting wording) | 11.0 GB |
| `edit`, `inpaint`, `character` (Soul ID without training), `product-shot` | 11.0 GB |
| `z-image` (fast drafts) | 12.2 GB |
| `create-image` (FLUX 3 Image Klein) | 17.8 GB |
| `video`, `speak`, `talking` | 21.5 GB, tight on 24 GB |
| `cinema-video`, `h3-video`, `dub`, `reshoot` | Needs Modal-class memory (27 to 44 GB) |

So an NVIDIA card with 12 to 16 GB runs the image apps; the video apps want
24 GB or more.

## Install (Windows, Route A — your own NVIDIA GPU)

Needs Node 22.6+, Python 3.10+ and Git.

1. In PowerShell, from a folder you keep projects in:

   ```powershell
   git clone https://github.com/neuregex/freefield
   cd freefield
   ```

   The repo is about 211 MB (example images and videos live in `docs/media`).
2. Make a Python virtualenv and install the **PyTorch build for your GPU**
   from [pytorch.org](https://pytorch.org) first — upstream requires this
   before the next step.
3. Check what is missing: `python tools/doctor.py`. It reports Node, Modal
   login, Hugging Face licence access per model, and `.env`.
4. Set up ComfyUI and its pinned custom nodes (once):

   ```powershell
   python tools/local_backend.py setup $HOME\freefield-comfy
   ```

5. See what a pack would download, then download it. Start with the small
   image pack, not everything. `packs/index.json` lists each pack and its size
   (for example `audio` is 29 GB, `image` is 12 GB):

   ```powershell
   python tools/local_backend.py download $HOME\freefield-comfy image-flux3 --dry-run
   python tools/local_backend.py download $HOME\freefield-comfy image-flux3
   ```

   Some model repos are **gated** on Hugging Face: make a free account, accept
   each model's licence on its page, then supply a token with `hf auth login`
   or the `HF_TOKEN` environment variable. **Never paste the token into chat,
   a commit, or a file in this repo.**
6. Create the gateway token and start the backend:

   ```powershell
   python tools/setup_token.py --env-only
   python tools/local_backend.py serve $HOME\freefield-comfy   # add: -- --lowvram on a small card
   ```

7. In a second PowerShell window, in the `freefield` folder, put
   `COMFY_BASE_URL=http://127.0.0.1:8000` in `.env`, then:

   ```powershell
   npm install
   npm run serve
   ```

   Open <http://127.0.0.1:3000>.

Upstream's own end-to-end check was done on a CPU-only machine with the
model-free `smoke` app. That app is the quickest way to confirm the wiring
before downloading any models.

## Try it for real estate

- **`cinema-studio`** — stills with a chosen camera body, lens, focal length,
  aperture and lighting. Good for twilight and luxury listing mood shots.
- **`edit`** — change a photo by describing the change; no mask.
- **`inpaint`** — paint the area to redraw (for example remove clutter).
- **`upscale`** — enlarge a photo.
- **`remove-bg`** — cut out a subject.

Label AI-edited listing photos as AI-edited. Do not use `edit` or `inpaint` to
change what a property actually is (structure, view, condition); that is a
disclosure problem, not a style choice.

## Check the code here first (cloud session)

The repo has its own checks: `npm install`, `npm run validate`, `npm test`.
They run upstream's TypeScript on the machine you run them on, so run them
only where you are comfortable running third-party code. As of this note they
have **not** been run by Claude; the cloud session's permission check blocked
them.

## Where things are

| What | Where |
|---|---|
| Upstream README, run guide and app table | https://github.com/neuregex/freefield |
| What each pack downloads, with sizes | `packs/index.json` |
| VRAM per app against 24 and 48 GB | `docs/vram-map.md` |
| Every GPU run the lab made, with time and peak VRAM | `docs/lab-runs.md` |
