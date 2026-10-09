# Jarvis

Setup for [Jarvis](https://github.com/isair/jarvis) by Baris Sencan — a
private, local-first voice assistant that runs on your own hardware. Speech
recognition, the language model, and speech synthesis all run locally; your
conversation memory stays on the machine.

Targets **Windows** (ThinkPad). This directory holds **setup only** — Jarvis's
source is not vendored here. See [Why it isn't vendored](#why-it-isnt-vendored).

## Read this first: licensing

Jarvis ships under a **custom non-commercial licence**. Personal, educational,
and research use is free. Commercial use — which the licence defines to include
use "in a commercial product or service", "to provide paid services", and "in
any revenue-generating activity" — requires a separate commercial licence from
the author.

Real estate work for EpiVail / Epique Realty is revenue-generating activity.
Running Jarvis as a personal assistant on your own time is fine; using it to
draft client messages, handle lead follow-up, or otherwise support the
brokerage would need that separate licence. The author's contact for commercial
licensing is in the repository's `LICENSE` file.

## Start here: download the app

**This is the right path for almost everyone, and it needs no Python.** Jarvis
publishes a prebuilt Windows build on
[GitHub Releases](https://github.com/isair/jarvis/releases):

1. Download `Jarvis-Windows-x64.zip`.
2. **Extract the full zip** before running anything — launching `Jarvis.exe`
   from inside the compressed folder is the most common failure.
3. Run `Jarvis.exe`. Windows Defender may flag it on first launch; allow it.
4. The setup wizard walks through model selection, so there is no config file
   to hand-edit. It offers an optional CUDA download for NVIDIA GPUs.

Then allow microphone access, let the first model downloads finish, and when
Jarvis reports it is listening, say "Jarvis" anywhere in a sentence.

## The source path

Only worth it if you want to read or change the code, or want Chatterbox TTS
(source installs only).

```powershell
powershell -ExecutionPolicy Bypass -File tools\jarvis\install-jarvis.ps1
```

The script clones upstream to `%USERPROFILE%\src\jarvis` (override with
`-InstallDir`), installs Micromamba if missing, then hands off to Jarvis's own
`scripts\run_windows.ps1`. Re-running it pulls the latest upstream commits
instead of re-cloning.

### Prerequisites

- **Git.** `winget install --id Git.Git`
- **Micromamba.** The script installs it for you. This matters: upstream's
  fallback path is venv + pip, which compiles `webrtcvad` and `av` from source
  and therefore needs the Visual C++ Build Tools — a multi-GB install that
  frequently fails. Micromamba pulls prebuilt binaries instead and creates a
  Python 3.12 environment, which also sidesteps the `numpy<2.0.0` pin that
  rules out Python 3.13+.
- **A local model server.** [Ollama](https://ollama.com/download)
  (`winget install --id Ollama.Ollama`) is simplest. LM Studio and llama.cpp
  work too — anything OpenAI-compatible.
- **A microphone**, and the patience to grant Windows mic permission.

### A note on ThinkPad hardware

If your ThinkPad has Intel integrated graphics rather than a discrete NVIDIA
GPU — most do — then **skip CUDA entirely**; speech recognition will run on the
CPU. It works, but transcription is slower. Two things help: pick a smaller chat
model (`qwen3.5:0.8b` rather than the `gemma4:e2b` default) and turn on **Low
Power Mode** in Settings. The install script checks your GPU and tells you which
situation you are in.

Budget memory for Whisper on top of the chat model. Unlike Apple's unified
memory, a discrete GPU uses its own VRAM, so the two budgets are separate.

### Known rough edges

Upstream flags these, and they are worth knowing before you install:

- **Jarvis is developed primarily on macOS**, and upstream says plainly that
  "Windows and Linux behaviour may differ." Expect rougher edges than the
  screenshots suggest.
- Windows dictation hotkey is **Ctrl + Win**.
- A spoken "stop" can be mistaken for echo while Jarvis is talking
  ([#24](https://github.com/isair/jarvis/issues/24)).
- No mobile app ([#17](https://github.com/isair/jarvis/issues/17)).
- First-run model downloads are large. Watch the Logs window rather than
  assuming startup has hung.
- Location awareness needs a GeoLite2 database; semantic memory search needs
  working embeddings, else it falls back to keyword search.

## Why it isn't vendored

Committing Jarvis's ~13 MB source tree into this repository would be the wrong
trade three times over: this is a configuration repository with no build step,
a vendored copy goes stale the moment upstream moves, and the licence extends
its non-commercial terms to derivative works — which is an awkward thing to
graft onto a repository that carries brokerage material. A clone script keeps
Jarvis's code under Jarvis's licence, where it belongs, and keeps this
repository's history about configuration.
