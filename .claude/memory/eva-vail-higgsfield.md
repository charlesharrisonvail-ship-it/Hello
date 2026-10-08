---
name: eva-vail-higgsfield
description: Eva Vail, the EpiVail AI spokeswoman - where her Higgsfield reference lives, how to keep her on-model, and Charles's standing look notes (eva, evavail, higgsfield, spokesperson, video)
---

**EpiVail only.** "Use the EvaVail Higgsfield skill" means this. There is no
installed skill by that name, so don't go looking.

Eva Vail is EpiVail's AI spokeswoman for short vertical Higgsfield videos.
She is AI; label her as AI wherever the platform or the post calls for it.

- **Look:** long black hair, ice-blue eyes, black cat-eye glasses. Signature
  color is electric blue.
- **Body:** Charles wants her **fuller, about 20 lb heavier than the original
  reference.** He said the original was too skinny (2026-10-08). Keep the fuller
  figure in every new piece.
- **Original reference** (electric-blue midi dress, chalet terrace): Higgsfield
  media `d55f8666-345f-4881-97da-f159bb0efb17`. This still has the thin figure.
  Use it only for her face.
- **Approved fuller-figure frame** (golf, 2026-10-08): image job
  `af08dacd-baa5-4d77-a6bd-a223a6f4d5a3`. Prefer this frame for her body.
- **Saved as Higgsfield Element `eva-vail`**: `426cbaed-602c-4bf0-9b7e-0c5987c4a0f5`
  (from the fuller-figure frame, 2026-10-08). Put `<<<426cbaed-602c-4bf0-9b7e-0c5987c4a0f5>>>`
  in the prompt for Element-aware models (Nano Banana, GPT Image 2, Seedance 2.0,
  Cinema Studio). `wan3_0` ignores Elements, so pass the frame as `image_references` there.

**Recipe that works:**
1. Make a start frame with `gpt_image_2_5` (high, 2k, 9:16) from her reference
   plus Charles's location photo.
2. Animate it with `wan3_0` (9:16, 1080p, `generate_audio: true`).
3. In the prompt, quote her exact lines and add "Pronounce EpiVail as Eppy Vail."

A 15-second clip costs about 52.5 credits and a 20-second one 70; the start frame cost about 3.
Decline Higgsfield's preset suggestions unless they fit the piece.

Her videos so far:
- Fall mortgage-rates spokesperson (2026-09-30)
- "Come play a round" golf invitation (2026-10-08), video job
  `8dd5ee35-468c-4aa4-b7d5-0188a0fdd8ab`; 20-second version `2768fd3e-9234-41f4-8abd-57ae5462e09b`
- "Ride Vail before the snow falls" mountain-biking invitation (2026-10-08),
  start frame `cf3d1e4d-1a39-412b-9604-4b9dc04f2a99`, video job
  `7c3548a2-f3b3-48a7-be9d-a96bb7c60335`

Charles wants a social post drafted for each video (Luxury Resimercial
audience, AI label, EpiVail byline). He posts them himself.
