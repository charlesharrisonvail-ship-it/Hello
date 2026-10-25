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
