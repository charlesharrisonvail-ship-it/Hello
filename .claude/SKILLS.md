# Skills Inventory — Charles Harrison / EpiVail

Audit date: 2026-09-03. Covers all 27 skills visible to this account:
25 account-synced (claude.ai), 1 repo-local, 1 user-level.

**Where each lives matters for removal:**

| Location | Count | How to remove |
|---|---|---|
| Account-synced (claude.ai Settings → Capabilities → Skills) | 25 | Only from claude.ai — the sync re-creates them anywhere else |
| Repo-local (`.claude/skills/`) | 1 | `git rm` in this repo |
| User-level (`~/.claude/skills/`) | 1 | Delete on the machine |

---

## Recommended for removal (8)

None of these serve real estate recruitment, the Vail luxury market, or
content production. Two actively work against the setup.

| Skill | Why remove |
|---|---|
| `brand-guidelines` | **Conflicts.** Applies *Anthropic's* brand colors/typography. Competes with `epivail-brand-system` for the same trigger ("brand colors", "style guidelines") and can put the wrong brand on EpiVail work. |
| `docx` | **Contradicts stated preference.** `linkedin-optimizer` line 94: deliverables are "Google Docs/Sheets, HTML, or PDF only — never .docx/.pptx." |
| `pptx` | Same. Charles does not use Microsoft Office. |
| `slack-gif-creator` | No Slack anywhere in the stack (connectors are Gmail, M365, Zoom, Google Workspace). |
| `agent-sdk-verifier-py` | Verifies Python Claude Agent SDK apps. Not work Charles does. |
| `agent-sdk-verifier-ts` | Same, TypeScript. |
| `algorithmic-art` | Generative p5.js art. No brand or listing use case. |
| `internal-comms` | Corporate status reports, incident reports, company newsletters. Wrong org shape for a solo growth leader. |

Removing these cuts the always-loaded description budget by ~30% and, more
importantly, removes two live trigger collisions.

---

## Keep — ranked most to least important

### Tier 1 — Foundation (everything else depends on these)

1. **`epivail-brand-system`** — Single source of truth for color, type, voice,
   tone, and Luxury Resimercial™ positioning. Every content skill below reads
   from it. If only one skill survived, this is it.
2. **`epique-agent-recruitment`** — The revenue engine. Agent attraction with
   four market playbooks (US/CO, France, Germany, Mexico). Directly tied to the
   Area/Growth Leader role.
3. **`lofty-crm-workflows`** — Pipeline of record. Every lead the funnel
   produces lands here; lead tiers, zip routing, `lofty-tools`, webhooks.

### Tier 2 — Daily funnel execution

4. **`linkedin-optimizer`** *(repo-local)* — Measurement loop for the primary
   recruiting channel. The only skill that closes feedback on what's working.
5. **`prospect`** — Top of funnel: ICP description → ranked enriched lead list.
6. **`enrich-lead`** — Fastest name-to-dossier path. Feeds both #3 and #7.
7. **`sequence-load`** — Closes the loop: enriched leads → Apollo sequence.

### Tier 3 — Production and craft

8. **`remotion-epivail-video`** — Branded video/animated components for
    attraction pages and Reel/TikTok templates.
9. **`canvas-design`** — Posters, flyers, one-pagers for listings and recruiting.
10. **`web-artifacts-builder`** — Complex multi-component pages (agent
    attraction page work).
11. **`theme-factory`** — Consistent styling across artifacts, slides, docs.
12. **`pdf`** — One of the three approved deliverable formats.

### Tier 4 — Periodic utility

13. **`xlsx`** — Kept for the CSV/TSV path (LinkedIn analytics exports), not
    for Excel. Reconsider if CSV work stays in Google Sheets.
14. **`skill-creator`** — Maintains and evaluates this whole system.
15. **`doc-coauthoring`** — Longer strategy and planning documents.
16. **`morning`** — Daily brief, on explicit request.
17. **`session-start-hook`** *(user-level)* — Repo plumbing for web sessions.
18. **`import-memory`** — Effectively one-time; harmless to keep.
19. **`mcp-builder`** — Borderline. Only justified if `lofty-tools` ever gets
    wrapped as an MCP server. Cut it if that is not on the roadmap.

---

## Companion agents (`.claude/agents/`)

Not skills, but they pair with the above and should stay in sync:

- `lead-enrichment` → pairs with `enrich-lead` / `prospect`
- `recruitment-outreach` → pairs with `epique-agent-recruitment`
- `linkedin-content` → writes what `linkedin-optimizer` measures

---

## Consistency notes

- Fixed in this pass: `linkedin-optimizer` listed the recruiting markets as
  "US, France, Australia, Mexico." Every other source — the recruitment skill,
  the brand system, and the `recruitment-outreach` agent — says **Germany**,
  not Australia. Corrected to Germany.
- `enrich-lead` and the `lead-enrichment` agent overlap by design (skill = quick
  command, agent = deep multi-step research). Intentional, no action needed.
