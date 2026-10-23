# Reusable skill: /seller-update

Structure checked against the Claude Code skills documentation
(https://code.claude.com/docs/en/skills) on **October 23, 2026**.

## What's here

```
seller-update/
  SKILL.md        the skill: frontmatter + instructions
```

## Workspace it expects

Make one folder for your assistant (for example `seller-updates/`) and lay it out like
this. The practice files for the three fictional Willow Fork listings fit this shape.

```
seller-updates/
  .claude/skills/seller-update/SKILL.md   ← copy the skill here
  brand/agent-voice-profile.md
  brand/brokerage-disclosures.md          (optional)
  instructions/assistant-master-instructions.md
  sources/approved-source-register.csv
  listings/1418-juniper/listing-facts.md
  listings/1418-juniper/showings-2026-10-16.md
  listings/1418-juniper/seller-2026-10-15.md
  drafts/                                 ← the skill writes here
```

## Install

1. Copy the `seller-update` folder into `seller-updates/.claude/skills/`.
   (Project location: it loads when you start Claude Code in that folder.)
2. Open a terminal in `seller-updates/` and start Claude Code with `claude`.
3. Type `/` and look for `seller-update` in the list.
4. Run `/seller-update 1418-juniper`.

## Why these settings

- `disable-model-invocation: true` — the docs recommend this for workflows you want to
  run only when you choose. Claude won't start it on its own.
- `allowed-tools: Read Glob Grep Write` — it can read your files and write a draft file.
  Claude Code may still ask permission for other actions; say no to anything that sends.
- `$ARGUMENTS` — whatever you type after the command (the listing folder name).

## What it doesn't do

It doesn't send email, post, text or update your CRM, and it doesn't remember last
week unless last week's draft is in the folder and you ask it to compare.
