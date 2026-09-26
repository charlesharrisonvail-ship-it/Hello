# Jarvis

Setup for [Jarvis](https://github.com/isair/jarvis) by Baris Sencan — a
private, local-first voice assistant that runs on your own hardware. Speech
recognition, the language model, and speech synthesis all run locally; your
conversation memory stays on the machine.

This directory holds **setup only**. Jarvis's source is not vendored into this
repository — see [Why it isn't vendored](#why-it-isnt-vendored) below.

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

## The easy path: download the app

Most people should skip the source install entirely. Jarvis publishes signed
desktop builds on [GitHub Releases](https://github.com/isair/jarvis/releases):

| Platform | Package | How to open |
| :--- | :--- | :--- |
| macOS · Apple Silicon | `Jarvis-macOS-arm64.zip` | Extract, move to Applications, right-click → Open |
| macOS · Intel | `Jarvis-macOS-x64.zip` | Extract, move to Applications, right-click → Open |
| Windows · x64 | `Jarvis-Windows-x64.zip` | Extract, run `Jarvis.exe` |
| Linux · x64 | `Jarvis-Linux-x64.tar.gz` | Extract, run `./Jarvis/Jarvis` |

The bundled setup wizard walks through model selection, so there is no config
file to hand-edit. A source install is only worth it if you want to read or
change the code, or want Chatterbox TTS (source installs only).

## The source path

```bash
bash tools/jarvis/install-jarvis.sh
```

The script clones upstream to `~/src/jarvis` (override with
`JARVIS_INSTALL_DIR`), then hands off to Jarvis's own `scripts/run_macos.sh`,
which creates a `.venv`, installs `requirements.txt`, and starts the daemon.
Re-running it pulls the latest upstream commits instead of re-cloning.

### Prerequisites

- **macOS.** The script is macOS-only, and upstream is developed primarily on
  macOS. For other platforms run `scripts/run_linux.sh` or
  `scripts/run_windows.ps1` from the clone.
- **Python 3.12.** Jarvis pins `numpy<2.0.0`, which has no wheels for Python
  3.13+. Install with `brew install python@3.12`; override the interpreter with
  `JARVIS_PYTHON` if needed.
- **Xcode command line tools**, for `git` and the Swift capture helper:
  `xcode-select --install`
- **A local model server.** [Ollama](https://ollama.com/download)
  (`brew install --cask ollama`) is the simplest. LM Studio, oMLX, and
  llama.cpp work too — anything OpenAI-compatible.
- **A microphone**, and the patience to grant macOS mic permission on first run.

### What to expect on first run

First launch downloads Whisper and your chosen language model. These are large;
watch the Logs window rather than assuming startup has hung. Once Jarvis
reports that it is listening, say "Jarvis" anywhere in a sentence and carry on
naturally. Prefer typing? Open **Chat** from the tray menu — text replies stay
silent.

Model sizing, per upstream's guidance: `qwen3.5:0.8b` on smaller hardware,
`gemma4:e2b` as the default, `gemma4:e4b` for more capability. Budget memory
for Whisper on top of the chat model.

### Known rough edges

Upstream flags these, and they are worth knowing before you install:

- macOS 26+ global dictation hotkey is broken (a `pynput` incompatibility,
  upstream issue #172).
- A spoken "stop" can be mistaken for echo while Jarvis is talking (#24).
- No mobile app (#17).
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
