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
