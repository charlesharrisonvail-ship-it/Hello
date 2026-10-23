# Platform Verification Log

Walkthroughs in both courses were checked against these official sources on
**October 23, 2026**. Re-check before recording and again before release.

## Claude (Anthropic)

| Claim used in the course | Source | Checked |
| --- | --- | --- |
| Projects are available to all users, including free accounts; free users can create up to five projects | support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects; /9517075-what-are-projects | 2026-10-23 |
| Create a project: Projects (claude.ai/projects) → "+ New Project"; name and description are not available to Claude | same | 2026-10-23 |
| "Set project instructions" → "Save instructions"; instructions apply to all chats in the project | same | 2026-10-23 |
| Skill = folder with `SKILL.md` (YAML frontmatter between `---` + Markdown instructions); folder name or `name` becomes the `/command` | code.claude.com/docs/en/skills | 2026-10-23 |
| Project skills at `.claude/skills/<name>/SKILL.md`; personal at `~/.claude/skills/<name>/SKILL.md`; cloud/Cowork sessions don't read the personal folder | same | 2026-10-23 |
| `disable-model-invocation: true` prevents Claude invoking it automatically; recommended for workflows with side effects | same | 2026-10-23 |
| `allowed-tools`, `argument-hint`, `$ARGUMENTS` substitution | same | 2026-10-23 |

**Not verified / deliberately not claimed:** Claude's memory features (the course tells
students not to assume a chat remembers past facts); exact current Claude plan prices
(the course says Claude Code needs a paid plan and points to Anthropic's plans page).

## HeyGen

| Claim used in the course | Source | Checked |
| --- | --- | --- |
| Avatars → New Avatar → "Clone a Real Person"; record live or import footage | help.heygen.com/en/articles/12089286 (Create your first Digital Twin… Avatar IV) | 2026-10-23 |
| Footage: at least 1080p/30 fps; 16:9 or 9:16; bright even light; static background; quiet; eye contact; one continuous recording, no cuts; record at least 2 min, up to 5 recommended | same | 2026-10-23 |
| Footage should include you speaking (lip sync), even if using another voice | same | 2026-10-23 |
| Logos/text on clothing and glasses/accessories may cause artifacts | same | 2026-10-23 |
| Processing about 10–20 minutes for non-4K footage | same | 2026-10-23 |
| Free users get one Digital Twin avatar slot | same | 2026-10-23 |
| Consent video: provider's consent text read exactly, under 30 s, MP4/MOV/WebM, 480p–4K, up to 10 GB; same person as footage; submitted with footage; someone else must record their own | help.heygen.com/en/articles/12092609 (Recording your Consent Video); /9380615 (Digital Twin FAQ) | 2026-10-23 |
| Each avatar includes voice cloning; separate voice can be created from audio | Digital Twin FAQ; Create your first Digital Twin | 2026-10-23 |
| Avatar slot can be recreated once per billing cycle; deleting removes all looks | Digital Twin FAQ; Create your first Digital Twin | 2026-10-23 |
| No support for using someone else's videos without permission or content from third-party AI platforms | Digital Twin FAQ | 2026-10-23 |

**Not verified:** HeyGen editor labels for aspect ratio, captions, templates/duplicates and
export; current prices and plan limits. The course marks these "verify in your account."
