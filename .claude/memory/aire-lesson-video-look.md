---
name: aire-lesson-video-look
description: How AiRE course lesson videos must look (Charles, 2026-10-25) - AI "eye candy" on every slide: Ian Xiaohei hand-drawn sketches for how-it-works beats, cinematic Higgsfield photos elsewhere, UI mockups; never plain text slides
---

2026-10-25, after seeing plain text-on-dark slides in Build Your AI Assistant Modules 2-3:
"the visual slide look bland and generic AGAIN. No visualizations of anything... NO ONE will
want to listen to me unless there is some A.i Eye Candy." Then: use the
ian-xiaohei-illustrations skill (github.com/helloianneo/ian-xiaohei-illustrations, MIT, by Ian;
English labels) "to explain in any areas how this project works in hand-drawn illustration...
Other areas use UI/UX or Remotion, Higgsfield, HeyGen... AWESOME....but still professional!"

What that became (production/video/images.py + build_lesson.py --visuals):
- Explainer beats: Xiaohei sketch on a white card that draws in, plus a one-line caption.
  Higgsfield gpt_image_2_5, 16:9, quality high, 2k = 2.75 credits each. Tell the model
  "never write the character's name" or it labels Xiaohei.
- Other beats: cinematic mountain-modern photo, slow push-in, crossfade, glass text cards.
  gpt_image_2_5, 4:3, quality medium, 2k = 1 credit each (low is 0.25 but soft).
- Message beats: phone / chat-window mockups built in HTML.
- Higgsfield rate limit: about 4 image jobs at a time; extras fail with 429 (no charge).
Still "Made with AI" label, no fireworks, no dot/particle drawings.

Progress 2026-10-26 (review copies in production/video/review/, nothing live yet):
- Build Your AI Assistant M1-M3 re-cut (Charles: "1000% better").
- Listing Media Without the Invoice (original course) M1-M5 re-cut. M1 re-voiced in his Starfish
  voice (old narration was not his voice). M2-M5 keep AiRE's narration, use --full layout and
  word captions; M4 keeps the live-class footage as '@source' beats.
- Original videos live in Higgsfield's CDN (links in docs/course.html and
  docs/lead-to-keys-course.html before commit eafa3ee), not GitHub. Map in course.html: M2=course-1,
  M4=course-2, M6=course-3, M5=course-4, M3=course-5, Prompt Playbook bonus=course-6 (also Lead to
  Keys bonus), M7=course-7, M1=course-8 (download order of unique URLs).
- 2026-10-27: Listing Media M6, M7 and the Prompt Playbook bonus re-cut (bonus footer says
  "THE PROMPT PLAYBOOK" since Lead to Keys shares it). ~84 credits incl. redos. M7's narration
  reads a phone number; the slide shows only the email (flagged to Charles).
- Sketch QA catches: labels on the wrong object, day names muddling "over time", and a ChatGPT
  logo drawn in chat windows - say "plain, unbranded chat window (no logos or icons)".
- Next: Lead to Keys lessons (lead-to-keys-course-2..9 = page keys "3".."10"). Swapping the live
  course videos needs Charles's go and the access code.
