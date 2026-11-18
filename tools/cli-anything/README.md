# CLI-Anything

HKUDS/CLI-Anything (Apache-2.0), checked at commit `34f5195` (2026-09-22).
It makes desktop and web software usable by an AI agent through a command line.
Free and open source. Some CLIs in its hub wrap paid services (Veo, Magnific and
others) — skip those; Charles pays for no AI tools. Source is not vendored here.

## Two parts

**1. CLI-Hub** — a package manager for ready-made CLIs (GIMP, Blender, ComfyUI,
LibreOffice, Obsidian, OBS and about 100 more).

    pip install cli-anything-hub
    cli-hub list
    cli-hub search image
    cli-hub install gimp
    cli-hub launch gimp

A CLI that wraps a desktop app needs that app installed too.

**2. The Claude Code plugin** — builds a new CLI for software that has none.
Already enabled for this repo in `.claude/settings.json` (`cli-anything@cli-anything`),
so sessions here load it. To add it elsewhere:

    /plugin marketplace add HKUDS/CLI-Anything
    /plugin install cli-anything

Then: `/cli-anything <path-or-repo>`; also `/cli-anything:refine`, `:test`,
`:validate`, `:list`.

## On Windows

Install Python 3.10+ and Git for Windows (Claude Code needs its `bash` and
`cygpath`). Then run the `pip install` line above in PowerShell.

## Notes

- `pip install .` from a source clone fails on Debian-based Python
  (`AttributeError: install_layout`); the PyPI package works. Verified 2026-11-18:
  `cli-hub 0.4.1`.
