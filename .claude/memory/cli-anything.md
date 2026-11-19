---
name: cli-anything
description: CLI-Anything (HKUDS) is enabled as a Claude Code plugin in settings.json and its cli-hub is installed from PyPI; setup notes in tools/cli-anything
---
CLI-Anything (HKUDS/CLI-Anything, Apache-2.0) was added 2026-11-18 at Charles's request.
- Plugin `cli-anything@cli-anything` is merged into `.claude/settings.json` (marketplace `HKUDS/CLI-Anything`); commands `/cli-anything`, `:refine`, `:test`, `:validate`, `:list`.
- CLI-Hub: `pip install cli-anything-hub` (0.4.1). Installing from a source clone fails on Debian Python; use PyPI.
- Skip hub CLIs that wrap paid services; Charles pays for no AI tools.
- Notes: `tools/cli-anything/README.md`. Source not vendored.
- Charles installed CLI-Hub 0.4.1 on his Windows PC on 2026-11-19 (PowerShell, Python 3.14, pip 26.2.1). Clean install, no errors.
- 2026-11-19: Charles ran `cli-hub list` (103 CLIs) and installed the `comfyui` CLI (`cli-anything-comfyui` 1.0.0). It needs ComfyUI running at http://localhost:8188; not yet confirmed that ComfyUI itself is running on his laptop.
- 2026-11-19: `system info` failed (ComfyUI not running). Pointed him to ComfyUI Desktop (comfy.org/download), free, which ships AMD ROCm 7.1.1 support for Windows and Ryzen AI since v0.7.0 (Comfy blog and AMD blog, 2026-01-05). Not yet confirmed working on his Ryzen AI Pro 7.
- 2026-11-19: no ComfyUI on 8188 or 8000. Only listener was python on 8765, which matches the Harrison Development preview server (`python -m http.server 8765`), not ComfyUI. Conclusion: ComfyUI not yet installed/running; next step ComfyUI Desktop.
- 2026-11-19: ComfyUI Desktop installer opened; it offered Cloud ("Recommended for your hardware", paid after trial) vs Local. Told him to pick Local. The Cloud recommendation may mean the installer doubts his AMD graphics.
- 2026-11-19: ComfyUI Desktop opened on **Comfy Cloud** (top-centre switcher), not Local. Told him to use that switcher to start a local instance; Cloud is paid after trial and the CLI cannot reach it.
- 2026-11-19: Local setup screen: Public Builds, Stable, ComfyUI v0.46.0, Python 3.13.12, **AMD marked Recommended and selected** (5.27 GB download, ~11.6 GB needed; 268 GB free). Install path C:\Users\charl\AppData\Local\Comfy-Desktop\ComfyUI-Installs. Next: confirm the port and run `system info`.
- 2026-11-19: Now on **Comfy Desktop** (local). Starter-workflow screen offered video models of 41-53 GB plus Seedance 2.5 (requires credits = paid). Advised **Skip & Install**; add a small free image model afterwards.
