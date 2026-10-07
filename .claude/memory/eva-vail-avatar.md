---
name: eva-vail-avatar
description: Eva Vail / EvaVail - Charles's AI presenter avatar; where her face lives in Higgsfield, which model and cost, and what NOT to do (never invent a new Eva in HeyGen)
---

**Eva Vail (he also writes "EvaVail") is Charles's recurring AI presenter. She lives
in Higgsfield.** Always use her saved reference; never generate a new woman and call
her Eva. On 2026-10-07 a HeyGen session invented a stand-in and Charles rejected it
outright.

Where she is (Higgsfield, private workspace `6ce1b2b0-1aa8-44d2-ab59-b675a6c87a74`):

- She is **not** a Soul character or a reference Element - `show_characters` and
  `show_reference_elements` will not list her. Look in projects instead.
- Project **"Eva Vail — 20 Real Estate Videos"** (`4b62632f-701d-43ce-a131-6891324ffcdd`).
  Project "Eva Vail — Beaver Creek" exists but was empty on 2026-10-07.
- Her identity reference is uploaded media **`a684ee36-63ac-44db-b1c9-815845e52daf`**
  (the original blue-dress Eva):
  https://d2ol7oe51mr4n9.cloudfront.net/user_3DQPFQB5knVKdCtoFjiflsBSNkk/a684ee36-63ac-44db-b1c9-815845e52daf.png
- Look: adult woman, blue eyes, sun-kissed skin, long jet-black hair, athletic
  hourglass figure. **She wears black cat-eye glasses - always put them in the
  prompt; Charles rejected a render without them.** Voice: warm, sophisticated,
  low-register American female. "EpiVail" is pronounced "Eppy Vail".
- **"Slifer" is pronounced "Sly-fer".** The model ignored a pronunciation note
  in the prompt, so spell it phonetically inside the dialogue itself.

Lessons from the rejected 2026-10-07 fireside render (110 credits, spent):

- **Give each hand one job.** "Hand on the mantel AND holding champagne" produced
  a third arm. Before delivering, pull frames at several timestamps and count
  limbs; one frame is not enough.
- **Pacing:** a long script crammed into 20 seconds ran together with no pauses.
  Keep dialogue short enough to breathe, and write the pauses in with ellipses
  and sentence breaks.

How her videos were made: `generate_video` with model `flux_3_video`, 9:16, 720p,
`generate_audio: true`, the reference passed in `medias` as role `image`, and a
prompt demanding a strict identity match. **A 20-second render cost 110 credits**
(Sept 2026). Check `balance` and quote the cost before rendering.
