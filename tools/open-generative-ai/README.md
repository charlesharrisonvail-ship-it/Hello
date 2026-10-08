# Open Generative AI (Cinema Studio) — free desktop setup

Setup notes for [Open Generative AI](https://github.com/Anil-matcha/Open-Generative-AI)
by Anil Matcha — the open-source AI image/video studio whose **Cinema Studio**
lets you pick a camera, lens, focal length and aperture for a shot.

Targets **Windows** (ThinkPad). This directory holds **notes only** — the app's
source is not vendored here. Written against upstream commit `00132ec`
(2026-10-07).

## Read this first: what is free and what is not

**Charles does not pay for this.** So the route below never needs an account,
an API key, or credits.

| Part of the app | Free? | Why |
|---|---|---|
| The app itself | Yes | MIT licence, free download |
| **Cinema Studio tab** | **No** | Every generation calls MuAPI's paid image model and needs a MuAPI key. There is no local option in that tab. |
| Hosted web version (muapi.ai) | No | Always uses the paid cloud models |
| **Image Studio → ⚡ Local** | **Yes** | Runs models on your own laptop with the bundled `sd.cpp` engine — no key |
| Video Studio → ⚡ Local | Yes, but needs a GPU | Needs Wan2GP on an NVIDIA (CUDA) or AMD (ROCm) GPU — see the end of this file |

The good news: Cinema Studio is a **prompt builder**, not a different model. It
takes your description and adds camera wording to it (see
[the cheat sheet](#cinema-studio-cheat-sheet-for-local-use)). Type that same
wording into Image Studio in local mode and you get the Cinema Studio
look for free. The pictures come out less polished, because the free local
models are smaller than the paid one.

If the app ever asks for a MuAPI key, skip it or close the box. Do not sign up
or enter a card.

## Install (Windows)

1. Open the [Releases page](https://github.com/Anil-matcha/Open-Generative-AI/releases)
   and download the newest **Windows `Setup … .exe`** (v1.0.9 at the time of
   writing).
2. Run it. Windows SmartScreen will warn that the installer is not code-signed:
   click **More info**, then **Run anyway**.
3. It installs silently to `%LocalAppData%` and adds a Start Menu shortcut,
   **Open Generative AI**.

No Node.js, Python or Git is needed for this route.

## Turn on free local images

1. Open the app → **Settings → Local Models**.
2. Click to install the **sd.cpp inference engine** (one click; it downloads
   itself).
3. Download **one** model. For real estate, start with:
   - **Realistic Vision v5.1** — 2.1 GB, photorealistic. Best first pick.
   - **Dreamshaper 8** — 2.1 GB, lighter and more general.
   - Skip **SDXL** (6.9 GB) and the **Z-Image** models (5–6 GB plus heavy
     memory) unless the laptop has lots of RAM and a real graphics card.
4. Go to **Image Studio**, click the **⚡ Local** toggle next to the model
   picker, choose the model, and generate.

Expect it to be slow. On a laptop without a separate graphics card, `sd.cpp`
runs on the CPU, so one image can take minutes rather than seconds. Smaller
sizes (512×512) are much faster.

Models are saved to `%APPDATA%\open-generative-ai\local-ai`. To keep the
multi-GB files on another drive, set the environment variable
`OPEN_GENERATIVE_AI_LOCAL_AI_DIR` to a folder there before launching the app.

## Cinema Studio cheat sheet for local use

Cinema Studio builds its prompt in this order. Copy the pattern into Image
Studio:

```
<your description>, shot on a <camera>, using a <lens> at <mm>mm (<perspective>),
aperture <f-stop>, <depth effect>, cinematic lighting, natural color science,
high dynamic range, professional photography, ultra-detailed, 8K resolution
```

**Camera** — pick one:
modular 8K digital cinema camera · full-frame digital cinema camera ·
grand format 70mm film camera · Super 35 studio digital camera ·
classic 16mm film camera · premium large-format digital cinema camera

**Lens** — pick one:
creative tilt lens effect · compact anamorphic lens · extreme macro lens ·
1970s cinema prime lens · classic anamorphic lens · premium modern prime lens ·
warm-toned cinema prime lens · swirl bokeh portrait lens · vintage prime lens ·
halation diffusion filter · ultra-sharp clinical prime lens

**Focal length → perspective**

| mm | Add |
|---|---|
| 8 | ultra-wide perspective |
| 14 | wide-angle perspective |
| 24 | wide-angle dynamic perspective |
| 35 | natural cinematic perspective |
| 50 | standard portrait perspective |
| 85 | classic portrait perspective |

**Aperture → depth effect**

| f-stop | Add |
|---|---|
| f/1.4 | shallow depth of field, creamy bokeh |
| f/4 | balanced depth of field |
| f/11 | deep focus clarity, sharp foreground to background |

Example (mountain-home exterior at dusk):

```
modern mountain home exterior at dusk, snow on the roofline, warm windows,
shot on a full-frame digital cinema camera, using a premium modern prime lens
at 24mm (wide-angle dynamic perspective), aperture f/11, deep focus clarity,
sharp foreground to background, cinematic lighting, natural color science,
high dynamic range, professional photography, ultra-detailed, 8K resolution
```

Small local models handle shorter prompts better. If results come out muddled,
drop the last three or four phrases first.

Wording taken from upstream `packages/studio/src/components/CinemaStudio.jsx`
(MIT). If upstream changes it, this list goes stale.

## Before using it for business

- **Licence.** The app is MIT, so commercial use is allowed. Each downloaded
  model has its own licence (most Stable Diffusion 1.5 models use
  CreativeML OpenRAIL-M). Check the model's page before using its images in
  paid work.
- **No content filter.** Upstream advertises "no content filters". Review
  every image yourself before it goes anywhere public.
- **Never pass an AI image off as a real property.** A generated house is not
  the listing. Use these for mood, concept, and social graphics, not as
  photos of a home for sale. Label AI images as AI.
- **Keep the businesses apart.** Output for EpiVail follows the EpiVail rules
  in `CLAUDE.md`. Output for AiRE Estate follows its own notes in
  `.claude/ROLE.md`.

## Video — only if the laptop has an NVIDIA or AMD GPU

Free local video needs **Wan2GP**, which runs only on CUDA (NVIDIA) or ROCm
(AMD) GPUs. A typical ThinkPad with Intel graphics cannot run it. Don't install
it on that machine.

If you do have such a GPU: install Wan2GP from
[deepbeepmeep/Wan2GP](https://github.com/deepbeepmeep/Wan2GP) (`install.bat`),
then in the app open **Settings → Local Models → Wan2GP**, point it at the
Wan2GP folder, click **Save**, then **Check**. Switch **Video Studio** to
**⚡ Local**. Model weights download on first use and are large.

## Why it isn't vendored

The upstream repo carries several git submodules, a large model list, and
Electron build tooling. Vendoring that into this repo would bloat it and go
stale. These notes point at upstream instead.
