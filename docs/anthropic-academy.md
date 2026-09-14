# Anthropic Academy — Course Reference

**Catalog:** <https://anthropic.skilljar.com/>
**Also linked from:** <https://anthropic.com/learn>

A reference for the free Anthropic Academy (Skilljar) catalog, mapped to the
agents and skills already living in this repository.

> **Sourcing note.** `anthropic.skilljar.com` and `anthropic.com` are both
> blocked by this workspace's network egress policy, so this catalog was
> compiled from public write-ups (see [Sources](#sources)) on **2026-09-03**
> rather than read off the live site. Anthropic has been adding courses
> steadily — 13 at the March 2026 launch, ~17 by April, ~22 by late August —
> so treat the list below as a map, not a manifest, and confirm titles against
> the live catalog before relying on them.

## Access

- Free to enroll and free to complete.
- No Anthropic account required — sign up on Skilljar with an email address.
- Signing in with a Claude account saves progress, grades quizzes, and earns a
  completion badge; the older Skilljar path issues a completion certificate
  that can be added to a LinkedIn profile.
- Each course is self-paced: video lessons, quizzes, and a final assessment.

## Tracks and courses

### Start Here
| Course | What it covers |
|---|---|
| Claude 101 | Orientation to Claude — what it does, how to talk to it. |
| AI Fluency: Framework & Foundations | The vocabulary and mental model for working with AI. |
| AI Capabilities & Limitations | Where the tool is strong, where it is not, and how to tell. |

### Claude Code & Agents
| Course | What it covers |
|---|---|
| Claude Code 101 | Getting started with the CLI. |
| Claude Code in Action | Practical workflows and real project work. |
| Introduction to Agent Skills | Authoring `SKILL.md` files — the format this repo already uses. |
| Introduction to Subagents | Specialized agents and when to hand work off to one. |

### Cowork
| Course | What it covers |
|---|---|
| Introduction to Claude Cowork | The Cowork surface and how it differs from the CLI. |

### Build on the Platform
| Course | What it covers |
|---|---|
| Claude Platform 101 | The developer platform, end to end. |
| Building with the Claude API | Direct API work — messages, tools, streaming. |
| Introduction to MCP | Model Context Protocol fundamentals. |
| MCP: Advanced Topics | Deeper MCP server and integration patterns. |
| Claude with Amazon Bedrock | Running Claude on Bedrock (Vertex AI covered elsewhere in the cloud track). |

### AI Fluency for your role
Role-tailored versions of the fluency material for **Educators**, **Students**,
**Nonprofits**, **Small Businesses**, and **Builders**.

Beyond the courses, the Academy also hosts tutorials, documented use cases, and
recorded webinars.

## How this maps to what's already in this repo

| Course | Applies to |
|---|---|
| Introduction to Agent Skills | `.claude/skills/linkedin-optimizer/SKILL.md` — the 9-step export → analyze → act → re-measure loop is exactly the shape this course teaches. Also the `epivail-brand-system`, `epique-agent-recruitment`, and `lofty-crm-workflows` skills. |
| Introduction to Subagents | `.claude/agents/lead-enrichment.md`, `.claude/agents/recruitment-outreach.md`, `.claude/agents/linkedin-content.md` — three subagents that already hand off to one another (enrich → write → measure). |
| Claude Code in Action | Day-to-day operation of this repo and the `lofty-tools` Python toolkit. |
| Introduction to MCP / MCP: Advanced Topics | The Apollo.io, Gmail, and Lofty integrations behind lead enrichment and outreach sequencing. |
| Building with the Claude API | Any webhook endpoint receiving leads from the EpiVail agent attraction page. |
| AI Fluency for Small Businesses | Closest role track to a brokerage growth operation. |

## Suggested order

1. **Claude Code 101** → **Claude Code in Action** — the tool the rest of this repo runs on.
2. **Introduction to Agent Skills** — then revisit `linkedin-optimizer` with what it teaches.
3. **Introduction to Subagents** — then revisit the three agents in `.claude/agents/`.
4. **Introduction to MCP** — before extending the Apollo or Lofty integrations.
5. **Building with the Claude API** → **MCP: Advanced Topics** — when custom endpoints are on the table.

Steps 1–3 cover everything already committed here. Steps 4–5 are the on-ramp to
what isn't built yet.

## Sources

- [Anthropic Courses (Skilljar catalog)](https://anthropic.skilljar.com/)
- [Anthropic Academy](https://anthropic.com/learn)
- [Anthropic Academy: 13 Free Courses on Claude Code, API, MCP and Agent Skills](https://pasqualepillitteri.it/en/news/371/anthropic-academy-free-courses-claude)
- [Claude Academy: All 22 Free Courses Ranked (2026)](https://spectrumailab.com/blog/anthropic-academy-13-free-courses-ranked-2026)
- [Anthropic opens Claude Academy with free AI courses and workplace rollout guides](https://www.edtechinnovationhub.com/news/anthropic-opens-claude-academy-with-free-ai-courses-and-workplace-rollout-guides)
- [Top 7 Free Anthropic AI Academy Courses with Certificates](https://www.analyticsvidhya.com/blog/2026/03/free-anthropic-ai-courses-with-certificates/)
- [Your Complete Guide to Anthropic's Free AI Courses (Skilljar Edition)](https://medium.com/data-and-beyond/your-complete-guide-to-anthropics-viral-free-ai-courses-skilljar-edition-7ebc69a5d2e7)
