---
name: img2threejs-install
description: img2threejs (photo to Three.js 3D model skill) is installed on Charles's Windows PC; how it was installed and the Windows symlink fix
---

When Charles says "Image23js" he means **img2threejs** (github.com/img2threejs/img2threejs,
Apache-2.0, free): a Claude Code skill that rebuilds an object from one reference image as a
procedural Three.js model.

Installed on his Windows PC 2026-10-22, skill v2.0.0, with
`npx --yes img2threejs@latest install`; `npx --yes img2threejs@latest doctor` reports
claude "managed". The skill lives in `C:\Users\charl\.img2threejs\releases\...` and is
linked into `C:\Users\charl\.claude\skills\img2threejs`.

Windows gotcha: the first install failed with `EPERM ... symlink` because Windows only lets
programs create that link with Developer Mode on or from an administrator PowerShell. The
retry succeeded. Updates: `npx --yes img2threejs@latest update`. Needs Node 18+, Git, and
Python 3.10+ (its scripts are standard-library Python only).

It is not installed in cloud sessions (ephemeral container) and not vendored in this repo.
