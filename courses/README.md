# AiRE Estate — Two New Courses (Draft)

Built October 23, 2026 from "AiRE Estate — Two New Courses: Claude Build Brief" (Oct. 22).

**Status: Complete as drafts. Not release-ready.** Both curricula are fully written, the
resources exist, every module quiz has answers and explanations, and the draft pages
render. Nothing has been published, priced, connected to checkout, or recorded.

This folder is **outside `docs/`**, so GitHub Pages does not serve it. The live site,
its navigation and its sitemap are unchanged.

## Preview it

```
python3 courses/build.py                 # validates manuscripts, rebuilds previews and quiz.json
cd courses/preview && python3 -m http.server 8000
```
Open `http://localhost:8000/build-your-ai-assistant.html`,
`…/your-ai-video-spokesperson.html`, the two `-course.html` readers, and
`catalog-cards.html`.

## File map

```
courses/
  README.md                 this file: status, file map, launch inputs
  verification.md           dated official sources for every platform walkthrough
  build.py                  validator + preview builder (no dependencies)
  build-your-ai-assistant/
    modules/01–07, 08-capstone     each module: objective & inputs, narrated script,
                                   shot list, verified walkthrough, copy-ready prompt,
                                   fictional exercise, worked example, troubleshooting
                                   & checklist, 7-question check (answers + explanations)
    quiz.json                      49 questions, generated from the modules
    resources/                     assistant-job-card.md, agent-voice-profile.md,
                                   approved-source-register.csv, assistant-master-instructions.md,
                                   seller-update-practice-data.md (3 fictional properties),
                                   reusable-skill/ (seller-update/SKILL.md + README),
                                   assistant-test-log.csv (10 scenarios, expected behavior only),
                                   weekly-maintenance-checklist.md, troubleshooting.md, capstone-rubric.md
    production/asset-list.md       recordings needed and missing assets
  your-ai-video-spokesperson/
    modules/01–07, 08-capstone     same nine-part structure
    quiz.json                      49 questions
    resources/                     spokesperson-brief.md, likeness-and-voice-rights-checklist.md,
                                   visual-style-sheet.md, pronunciation-sheet.md,
                                   short-script-templates.md (3 worked fictional examples),
                                   shot-and-edit-plan.csv, pre-render-checklist.md,
                                   captions-and-audio-checklist.md, video-content-calendar.csv
                                   (10 topics), troubleshooting.md, capstone-rubric.md
    production/asset-list.md
  preview/                         generated draft pages (landing, course reader, catalog cards)
```

## What the drafts do (checked Oct. 23, 2026, desktop 1280 px and phone 390 px)

- Landing pages: outcome, audience, prerequisites, seven-module curriculum, deliverables,
  software-cost disclosure, certificate description, support scope. "Price pending";
  checkout button disabled. `noindex`. Draft banner on every page.
- Course readers: every module's full text, copyable prompts, downloads (22 resource
  files; all links return 200), and module checks: pass 5 of 7, explanations shown,
  retry. The certificate panel unlocks only when **all seven checks pass and** the
  self-assessed capstone is recorded. Nothing is passed by default.
- No horizontal scrolling on phone; no script errors.

## Things to know before release (honest list)

1. **Lesson content and quiz answers are plain text in the draft readers.** The live
   courses encrypt lesson text with the access code (AES-GCM, PBKDF2) inside the page.
   The tool that produced those encrypted payloads is not in this repository, so release
   needs that tool (or a replacement) and a new access code per course.
2. **Certificate pages weren't inspected.** `docs/certification.html` and
   `docs/lead-to-keys-certification.html` are encrypted; their behavior couldn't be
   checked without the access codes, so the new courses aren't wired into them. The draft
   uses its own pass/capstone logic instead.
3. **Runtimes are targets, not measurements.** Pages say "runtime after recording."
4. **HeyGen editor steps** (aspect ratio, captions, export, templates) are not verified;
   the lessons tell students to confirm in their account. Re-verify on recording day.
5. **Practice time (3–5 hours)** is the brief's estimate, pending pilot testing.
6. The site chatbot's approved course facts were **not** updated (per the brief, only on release).

## Launch inputs the owner must supply or approve

- [ ] Price for each course (pages say "Price pending").
- [ ] Final narrator and authorized voice/avatar; decision on Eva Vail demonstrations.
- [ ] Demonstration spokesperson for Course 2 and its rights.
- [ ] HeyGen access and a generation budget (nothing has been spent).
- [ ] Stripe products/payment links, access codes, confirmation messages, release date.
- [ ] Support scope and certificate/capstone policy (drafts: email support for course
      content only; private certificate after seven checks + self-assessed capstone).
- [ ] Recorded lesson videos (none exist).
- [ ] Release approval. Then: encrypt lessons, add catalog cards to `docs/index.html`,
      add pages to `docs/` and the sitemap, update the chatbot facts.
