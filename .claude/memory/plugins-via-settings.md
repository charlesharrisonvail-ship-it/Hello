---
name: plugins-via-settings
description: /plugin does not work in cloud sessions; install plugins by merging into .claude/settings.json
---

`/plugin marketplace add` and `/plugin install` are refused in cloud sessions
("isn't available in this environment"). Install a plugin by merging its
marketplace into `extraKnownMarketplaces` and `name@marketplace: true` into
`enabledPlugins` in `.claude/settings.json`. It loads from the next session.
Read the plugin's files first: look for hooks or scripts before enabling it.

Enabled this way: Superpowers (`obra/superpowers-marketplace`) and Karpathy
skills (`forrestchang/andrej-karpathy-skills`, one skill: `karpathy-guidelines`,
no hooks). Added 2026-10-11 at Charles's request.
