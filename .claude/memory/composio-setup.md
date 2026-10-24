---
name: composio-setup
description: Where Composio is installed and why it cannot run in cloud sessions
---

- **Composio CLI lives in WSL Ubuntu on Charles's Windows PC** (machine
  `EpiVail`, Ubuntu user `charles`), installed 2026-10-24 with
  `curl -fsSL https://composio.dev/install | sh` (needed `sudo apt install unzip`
  first). Logged in as charlesharrisonvail@gmail.com, org
  `charlesharrisonvail_workspace`. Login installed the `composio-cli` skill for
  Claude Code inside Ubuntu.
- **Claude Code on that PC runs in Windows PowerShell** (`C:\Users\charl\Hello`,
  binary in `%USERPROFILE%\.local\bin`). Windows-side Claude Code cannot see the
  Ubuntu Composio CLI; run `claude` from Ubuntu to use it, or use the claude.ai
  Composio connector.
- **Cloud sessions cannot install the CLI**: the installer downloads from
  ComposioHQ's GitHub releases, which the container's GitHub scoping blocks (403).
  The claude.ai Composio connector is the cloud route; on 2026-10-24 it failed to
  connect (404) and needed reconnecting at claude.ai/customize/connectors.
- The Composio installer does not support native Windows - WSL only.
