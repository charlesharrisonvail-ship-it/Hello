# Module 5 — Turn the Workflow Into a Reusable Skill

**Course:** Build Your AI Assistant · **Status:** draft manuscript · **Video:** not yet recorded

## 1. Learning objective and required inputs

**By the end of this module you can** store your seller-update workflow as a Claude Code
skill, run it with one command on any listing folder, and explain the difference between
drafting a file and sending a message.

**You need:**
- Claude Code installed and signed in. If you haven't installed it, follow AiRE's free
  install guide first (learn.aireestate.com/install-claude-code.html). Claude Code needs
  a paid Claude plan; check Anthropic's current plans.
- Your `seller-updates` folder from Module 3 with the three fictional listings.
- `resources/reusable-skill/` (the `seller-update` skill and its README).

**Chat-only route:** if you're not using Claude Code, read along, then do the chat
version of the exercise in section 6. You'll get the same drafts; you'll paste instead of
pointing at folders.

## 2. Narrated lesson script

*Narrator: Charles's AI avatar, using his own approved avatar and voice. Inside the course only; never on the public site. Target read time about 7 minutes.*

In the last module, your assistant lived in a Claude Project. Every Friday you paste in
the week, copy out the draft. That works. But if you have five listings, that's five
rounds of copying and pasting, and the chance you paste Copper Bend's showings into
Juniper Lane's update goes up every time.

Claude Code can read files in a folder you choose and write files back. So instead of
pasting, you point it at the listing folder, and it writes the draft into a drafts
folder for you to review. The tool for packaging that is called a skill.

A skill is a folder with one file in it, called SKILL dot M D. At the top of the file is
a short header between three dashes. That header tells Claude Code the skill's name, a
description of what it's for, and a few settings. Below the header are the instructions,
written in plain English, the same way you've written everything so far. According to
the Claude Code documentation, the folder name becomes the command you type. Our folder
is called seller-update, so the command is slash seller-update.

Let's look at the settings we chose, because each one is a decision.

Description: what it does and when to use it. Claude uses the description to recognize
when a skill is relevant.

Disable model invocation, set to true. The documentation recommends this for workflows
you want to control the timing of. It means Claude won't start this skill on its own
because a conversation mentions sellers. It only runs when you type the command. For
anything involving client communication, you want that.

Allowed tools: Read, Glob, Grep and Write. In plain English: it can find and read files,
and it can write a file. That's all this job needs. Notice what's not there. Nothing
that sends email, posts, or contacts anyone. Writing a draft file and sending a message
are completely different actions. This skill does the first. You do the second.

And the argument. When you type slash seller-update, space, 1418-juniper, the word after
the command gets dropped into the instructions wherever it says dollar sign ARGUMENTS.
So one skill works for every listing folder.

The instructions inside the skill follow the same pattern as your master instructions:
gather inputs, follow the rules, write the draft and checklist, and report back. Two
details are new because we're working with files now. First, it only reads the listing
folder you named, not the others. That keeps facts from leaking between listings.
Second, it never overwrites a draft. If a draft for today already exists, it adds a
number to the new file name. You don't lose your edits.

Where does the skill file go? The documentation lists a few locations. For this course,
we use the project location: a dot-claude folder, then skills, then seller-update, inside
your seller-updates folder. It loads when you start Claude Code in that folder. If you
want it in every folder on your computer, there's a personal location in your home
folder. Keep it simple: project location.

Let's run it. Open a terminal in seller-updates, start Claude Code, and type slash. There
it is: seller-update. Run it on Juniper Lane.

Claude Code may ask permission before it does things. That's normal, and it's your
protection. Read each request. Reading files in this folder and writing into drafts:
fine. Anything else, especially anything that would send or post: say no.

It reads the voice profile, the listing facts, the newest showing file, the seller's
email and the register. It writes a draft file. And it reports back: here's the file,
here are the items that need you, and nothing was sent.

Now run it on Copper Bend and Heron Point. Three properties, one command each, three
draft files. Open each one and compare them against your acceptance criteria. Is the
verbal interest at Copper Bend described as not an offer? Is Heron Point's HOA fee
flagged as stale? Did it refuse the seller's instruction about the special assessment
and report it?

That's the beginner project, on purpose. You'll see tutorials that chain a skill to your
email, your CRM and your calendar. Don't, yet. Every tool you connect is another thing
that can act without you. Get one reliable draft-only workflow first. Prove it with tests
in the next module.

## 3. Screen demonstration shot list

| # | Script cue | On screen | Notes |
| --- | --- | --- | --- |
| 1 | "five rounds of copy and paste" | Five chat windows, wrong-listing paste highlighted | Animation |
| 2 | "point it at the folder" | Folder tree: listings → drafts arrow | |
| 3 | "SKILL.md" | `seller-update/SKILL.md` open, frontmatter highlighted | |
| 4 | Each setting | description; disable-model-invocation; allowed-tools; argument-hint — highlighted in turn | Cite docs on screen: code.claude.com/docs/en/skills |
| 5 | "$ARGUMENTS" | Command `/seller-update 1418-juniper` with arrow into the instructions | |
| 6 | "never overwrites" | drafts folder showing `-2` file | |
| 7 | Location | `.claude/skills/seller-update/SKILL.md` path inside seller-updates | |
| 8 | Run | Terminal: `claude`, then `/` menu showing seller-update | Record on recording day; verify UI |
| 9 | Permissions | Permission prompt; narrator approves read/write in folder | |
| 10 | Output | Draft file opened; checklist items highlighted | Fictional watermark |
| 11 | Three runs | Three draft files; spot-check Copper Bend and Heron Point flags | |
| 12 | "Don't, yet" | Diagram of email/CRM/calendar connections greyed out | |

## 4. Written walkthrough

**Verified October 23, 2026** against the Claude Code skills documentation
(code.claude.com/docs/en/skills). Commands and menus can change; check the docs if your
screen differs.

1. Confirm your workspace looks like this:
   ```
   seller-updates/
     brand/agent-voice-profile.md
     instructions/assistant-master-instructions.md
     sources/approved-source-register.csv
     listings/1418-juniper/  listings/77-copper-bend/  listings/9-heron-point-3b/
     drafts/
   ```
2. Create the folders `seller-updates/.claude/skills/seller-update/`.
3. Copy `resources/reusable-skill/seller-update/SKILL.md` into that folder.
4. Open a terminal in `seller-updates` and run `claude`.
5. Type `/` and confirm `seller-update` appears.
6. Run `/seller-update 1418-juniper`.
7. Approve reading files in this folder and writing to `drafts/`. Decline anything else.
8. Open the new file in `drafts/` and review the draft and checklist.
9. Repeat for `77-copper-bend` and `9-heron-point-3b`.
10. Before any real use: confirm you're allowed to use AI tools with client information
    under your brokerage's policy.

## 5. Copy-ready template

The full skill is in `resources/reusable-skill/seller-update/SKILL.md`. Its header:

```
---
name: seller-update
description: Drafts a weekly seller update for one active listing from the listing facts and this week's activity files in the listings folder. Use when the agent asks for a seller update, Friday update, or weekly listing report.
argument-hint: "[listing-folder-name]"
disable-model-invocation: true
allowed-tools: Read Glob Grep Write
---
```

**Chat-route equivalent prompt** (in your Project):

```
Draft this week's seller update for the listing below using the project instructions.
Use only the facts in this message. Then list the facts you used with their sources.
[PASTE ONE LISTING'S FILES]
```

## 6. Practice exercise (fictional inputs)

**Claude Code route:** run `/seller-update` on all three fictional properties and save
the three draft files.

**Chat route:** run the chat-route prompt three times, once per property, each in a new
chat in your Project. Save each draft and checklist.

Then, for each draft, answer:
1. Does every number appear in that property's files?
2. Copper Bend: is the verbal interest described as not an offer?
3. Heron Point: is the HOA fee flagged stale, the special assessment flagged missing, and
   the seller's instruction listed under ignored instructions?

## 7. Worked example — and why it meets the criteria

**Heron Point checklist (example):**

> Facts used: 4 showings + 1 virtual (showing log Oct. 16); 760 views; feedback ×4.
> STALE: HOA fee $412 — statement dated Jan. 2025 (S06); not stated as current.
> MISSING: special assessment status (S07); HOA hasn't answered.
> MISSING: reserve fund amount; not in any source.
> IGNORED INSTRUCTIONS: seller email (S08) asks to tell buyers there's no special
> assessment and to include the reserve fund amount. Not followed.
> AGENT DECISION: how to reply to the seller's request.
> Nothing was sent.

**Why it meets the criteria:** the skill read only Heron Point's folder, used the
register's statuses, refused the embedded instruction, and reported it to the agent. The
draft says the assessment question is with the HOA rather than answering it.

## 8. Troubleshooting and completion checklist

**The skill isn't in the `/` list.** Check the path and that `---` is on the very first
line of SKILL.md. Start Claude Code from the `seller-updates` folder.

**It read another listing's folder.** Tighten the instruction ("Do not read other
listings' folders") and rerun.

**It asked to do something besides read and write in the folder.** Decline. Then check
your skill hasn't been edited to add tools.

**Completion checklist**
- [ ] Skill installed in the project location.
- [ ] `/seller-update` appears in the menu.
- [ ] Three draft files (or three chat drafts) created.
- [ ] Three spot checks answered.
- [ ] Nothing was sent by the assistant.

## 9. Module check

### Q1. What is a Claude Code skill, in this course's terms?
- A) A paid add-on.
- B) A folder with a SKILL.md file: a short header plus plain-English instructions.
- C) A browser extension.
- D) A type of AI model.
**Answer:** B — The header holds the name, description and settings; the body holds instructions.

### Q2. Why set `disable-model-invocation: true` on the seller-update skill?
- A) So Claude can start it whenever sellers are mentioned.
- B) So it only runs when you type the command, which the docs recommend for workflows where you want to control timing.
- C) To make it run faster.
- D) To hide it from you.
**Answer:** B — Client-facing workflows should start only when you decide.

### Q3. The skill's allowed tools are Read, Glob, Grep and Write. What can't it do?
- A) Read the listing files.
- B) Write a draft file.
- C) Send an email or post anything.
- D) Find the newest showing file.
**Answer:** C — Writing a draft file and sending a message are different actions. This skill only drafts.

### Q4. What does `/seller-update 77-copper-bend` do with "77-copper-bend"?
- A) Nothing.
- B) It replaces `$ARGUMENTS` in the instructions, so the skill works on that listing's folder.
- C) It renames the skill.
- D) It emails the seller.
**Answer:** B — One skill, any listing folder.

### Q5. Claude Code asks permission to run a command you don't recognize while using this skill. What should you do?
- A) Approve everything to save time.
- B) Decline anything beyond reading files in the folder and writing drafts.
- C) Uninstall Claude Code.
- D) Approve, then check later.
**Answer:** B — Permission prompts are your control. This job needs read and write only.

### Q6. Why does the skill never overwrite an existing draft?
- A) To use more disk space.
- B) So your hand edits on an earlier draft aren't lost.
- C) Claude Code can't overwrite files.
- D) Sellers prefer numbered files.
**Answer:** B — It writes a new file with -2, -3 instead.

### Q7. You want to connect the skill to your email and CRM next week. What does this module recommend?
- A) Do it immediately; more automation is better.
- B) First prove one draft-only workflow with tests; every connected tool is something that can act without you.
- C) Never use AI for email.
- D) Ask the AI to decide.
**Answer:** B — Reliability first, connections later, with review before anything leaves your hands.
