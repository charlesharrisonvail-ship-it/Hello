# New Courses — Launch Checklist

For **Build Your AI Assistant** (Charles's avatar) and **Your AI Video Spokesperson** (Eva).
Both $97, sold separately, no bundles or sales. Nothing goes live until Charles says so.
Stripe is last.

Who does each step: **C** = Charles, **Claude** = done in a Claude session.

**Updated 2026-11-02.** HeyGen renewed Nov 1: 970 credits, next reset Dec 1. Measured cost of
your avatar: **about 19 credits per minute** (Listing Media Module 2, 5.9 min = 113 credits).
857 left after that. Build Your AI Assistant's remaining modules need about 30 min = ~580.
Re-cutting the two original courses with your avatar needs about 50 more min = ~960.
**Both don't fit in November** — see the decision in section 0.

## 0. Decision for C now

- [x] **C** — Which goes first with November's credits? **(a), Build Your AI Assistant first** (Nov 2)
      (a) Build Your AI Assistant Modules 4–7 + Capstone (~580), then original-course re-cuts
      with what's left (~14 min), the rest after Dec 1; or
      (b) original-course re-cuts first, Build Your AI Assistant after Dec 1.

## 1. Build Your AI Assistant — finish the videos

- [x] Module 1 produced (5:07)
- [x] Module 2 produced (5:31)
- [x] Module 3 produced (5:13)
- [x] **C** — Watch Modules 2 and 3 and say "good" or what to change ("good", Nov 2) (you called the new look
      "1000% better" on Oct 26; this is the final sign-off)
- [x] **Nov 1** — HeyGen renewed; measured ~19 credits per minute (~130–150 per module)
- [x] **C** — Approve the spend for the next modules (section 0)
- [ ] **Claude** — For each module: make the Starfish narration, **C** listens to a short
      sample and confirms it's your voice, then lip-sync, add the slides and render
  - [x] Module 4 — Build the Working Assistant (5:16)
  - [x] Module 5 — Turn the Workflow into a Reusable Skill (4:42)
  - [x] Module 6 — Test, Correct and Protect (4:55)
  - [x] Module 7 — Make It Part of Your Week (4:14)
  - [x] Capstone (1:51) — all five voiced in Starfish and lip-synced Nov 2; 37 min total
- [ ] **Dec 1** — Second credit reset; finish whatever didn't fit in November
- [ ] **C** — Watch each new module and approve it
- [ ] **C** — Recording day: a test Claude account (no real client data) for the screen
      recordings in Modules 4–6. **Claude** re-checks the Claude Projects and Claude Code
      screens that day.

## 2. Your AI Video Spokesperson — Eva's videos

**Nov 2: all 8 lessons made (29 min).** Eva in a black skirt suit, her approved Higgsfield voice;
HeyGen lip-syncs her openings and closings, slides carry the middle. Locked with its own code
(given in chat only). Still to do: Stripe product + link for this course (C), then release.


- [ ] **C** — Confirm which Eva look and voice to use, and where they live (Higgsfield)
- [ ] **Claude** — Check the Higgsfield balance and daily limit; give a cost estimate
- [ ] **C** — Approve the spend
- [ ] **Claude** — Short Eva voice sample for **C** to approve by ear before any full render
- [ ] **Claude** — Produce Modules 1–7 and the Capstone (~45–65 min total)
- [ ] **C** — Licensed music for the examples, or "no music"
- [ ] **C** — Watch and approve each module
- [x] Bonus: *100 Visual Prompts* PDF added to this course's downloads (Charles, 2026-10-25)
- [ ] **C** — Corrected PDF: page 1 "your supplied" and page 3 "user-supplied … catalog" wording removed
      (optional: "Academy" in the logo, "Made with AI" on the cover's AI image)
- [ ] **C** — Decide whether the sales page mentions the bonus (it doesn't yet)

## 2b. Original courses re-cut with your avatar (Listing Media, Lead to Keys)

Your avatar in your Starfish voice, new visuals around you. The AiRE-narration cuts are rejected.

- [x] Listing Media Module 1 (your welcome) — done earlier
- [x] Listing Media Module 2 — voiced, you approved the voice, avatar rendered (113 credits)
- [ ] **C** — How you say "AiRE" (Starfish spells it "A-I-R-E" in Module 2's folder line)
- [ ] **Claude** — Listing Media Modules 3–7 and the Prompt Playbook bonus
- [ ] **Claude** — Lead to Keys Modules 8–14 and the Capstone
- [ ] **C** — Watch and approve each
- [ ] **C** — Go-ahead and the access codes (chat only) to swap them into the live courses
- [x] Phone number removed from Listing Media Module 7

## 3. Course pages and lessons (after the videos are approved)

- [x] Build Your AI Assistant access code chosen by Claude at Charles's word ("u choose it"), given in chat only (Nov 2). Eva's course: later
- [x] **Claude** — Build Your AI Assistant locked: `python3 courses/build.py --release build-your-ai-assistant <dir>` (lessons, quiz answers, downloads) and `lock.mjs media` for each video
- [x] **Claude** — Videos in the Build Your AI Assistant reader; real runtimes on its pages (`runtimes.json`)
- [ ] **C** — Give the certificate access codes (chat only) so the certificate pages can
      be checked and the new courses added to them
- [ ] **C** — Approve the support scope and certificate/capstone policy
- [ ] **Claude** — Phone and desktop check of every page; send **C** screenshots
- [ ] **C** — Approve the preview pages

## 4. Stripe and release (last)

- [x] **C** — Build Your AI Assistant: Stripe product and payment link made (Nov 2)
- [ ] **C** — Your AI Video Spokesperson: Stripe product and payment link
- [ ] **C** — Write or approve the purchase confirmation message (where the access code goes)
- [ ] **C** — Pick the release date
- [ ] **Claude** — On release day: add the catalog cards to the home page, add the pages
      and the sitemap, connect the payment links, update the site chatbot's course facts
- [ ] **Claude** — Test a purchase path end to end (link → Stripe → confirmation → code
      opens the course)
- [ ] **C** — Final "go"

## 5. After launch

- [ ] Announcement posts on the AiRE Facebook page (**C** approves each card first)
- [ ] Facebook ad — still on hold until **C** says otherwise
- [ ] Check sales and questions weekly
