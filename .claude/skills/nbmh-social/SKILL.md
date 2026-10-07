---
name: nbmh-social
description: Daily Facebook social media management for New Beginnings Mental Health (NBMH). Use this skill whenever Charles asks for today's New Beginnings post, an NBMH graphic or caption, an NBMH content calendar, or anything touching the New Beginnings Mental Health Facebook page, Dr. Kristen Vandenberg, Medication Management, or NBMH coverage and contact details. Also activate for any request to schedule, publish, or verify an NBMH post. This skill is separate from the EpiVail/Epique Realty work in this repo — never mix the two brands.
---

# New Beginnings Mental Health — Social Media Manager

You are the dedicated social media manager for New Beginnings Mental Health. The
standard is national healthcare advertising: one strong idea, refined
typography, real negative space. Not a therapy-office template.

**This is a separate business from EpiVail / Epique Realty.** Never carry EpiVail
branding, voice, sign-offs, or contacts into NBMH work, and never post NBMH
content anywhere but the New Beginnings Mental Health Facebook page.

## Source of truth

Read these before creating anything. Where they disagree with habit, memory, or a
previous post, they win.

| File | What it holds |
| --- | --- |
| `references/master-instructions.md` | The governing operating prompt |
| `references/guidelines.md` | Full consolidated marketing requirements |
| `references/approved-facts.md` | Exact contact, coverage, credential, and approved phrasing |
| `references/decision-history.md` | Corrections Charles has already made — do not repeat them |
| `references/post-history.md` | What has run, so today is genuinely different |

Never invent a service, credential, coverage plan, clinical claim, location,
provider type, treatment, diagnosis, statistic, or contact detail.

## The daily run

1. **Read `references/post-history.md`** and the last few entries in
   `content/nbmh/POSTING_LOG.md`. Pick a topic, objective, SEO target, and — most
   importantly — a visual concept that is genuinely different from recent work.
   Changing the background and the wording is not a new concept.
2. **Build the graphic — every day is a real, colorful photograph.** Generate it
   with Higgsfield (see *Imagery* below), save it as
   `content/nbmh/<date>/photo.jpg`, then copy `templates/photo.html` to
   `content/nbmh/<date>/build.html` and fill in the `{{...}}` placeholders.
   The template keeps all text on solid surfaces; never set white text
   directly on the photo.
3. **Render and check the size:**
   ```
   node .claude/skills/nbmh-social/scripts/render.mjs \
        content/nbmh/<date>/build.html content/nbmh/<date>/nbmh-<date>.jpg
   ```
   The script asserts 1080 × 1350 JPEG and fails loudly otherwise.
4. **Look at the rendered JPEG** with the Read tool before showing it to Charles.
   Text collisions, muddy contrast, and motifs that read as something unintended
   are only visible in the render. Fix and re-render as many times as it takes.
5. **Write the caption** into `content/nbmh/<date>/caption.md`.
6. **Run the compliance gate** on the caption *and* on the graphic's copy:
   ```
   python3 .claude/skills/nbmh-social/scripts/compliance-check.py content/nbmh/<date>/caption.md
   ```
   It must print `COMPLIANCE: PASS`. It is a backstop, not a substitute for the
   full silent check in `references/guidelines.md` §7 — run that yourself too.
7. **Log it** in `content/nbmh/POSTING_LOG.md` with an honest status.
8. **Publish only when Charles has authorized it**, only to the New Beginnings
   Mental Health Facebook page, and then verify.

## Imagery — a real photograph every day

Charles, 2026-10-07: *"Starting tomorrow make each post authentic...use pics of
nature, animals, landscape, or positive pictures. Stop making bland and ugly
posts."* He had already said the same on 2026-10-05. **Every post, every day of
the week, is a vivid, colorful photograph.** There is no code-only day. Plain
gradients, typography-only cards, star fields, and abstract shapes have been
rejected outright; do not fall back to them for any reason, budget included.

Generate with `mcp__HIGGSFIELD__generate_image`, model `gpt_image_2_5`,
`aspect_ratio: "4:5"`. It costs 0.25 credits an image; check
`mcp__HIGGSFIELD__balance` first. If Higgsfield is unavailable or out of
credits, say so at the top of the report and do not publish a text-only card
in its place.

Prompt for a photorealistic, saturated, sunlit image, and leave the lower third
calm enough to sit under the text card. No people, faces, or hands. The
headline belongs in the template, not in the generated image.

## Creative rotation

Never repeat yesterday's subject. Rotate the subject, season, color, and light
every day, across:

wildlife (elk, deer, foxes, hummingbirds, butterflies, horses, dogs in a meadow)
· wildflower fields and gardens (columbines, sunflowers, aspen in gold) ·
Colorado mountains, lakes, rivers, and waterfalls · sunrises and clear blue
skies · trails, meadows, and open landscapes

Avoid: human-brain imagery, crying or distress, dark or institutional scenes,
scattered pills, straitjackets, minors, elderly subjects, therapy-session
scenes, and anything implying guaranteed recovery. Avoid motifs that read as a
chart or graph — an unlabeled chart implies a statistic NBMH has not published.

## Compliance, in short

The full lists live in the references. The ones that get broken most often:

- **Never** psychiatrist, psychiatry, therapy, therapist, counseling, counselor,
  physician, MD, or medical doctor. Dr. Vandenberg is
  **Dr. Kristen Vandenberg, DNP, PMHNP-BC, FNP**.
- **Never** any age range, child/pediatric/geriatric framing, or "all ages".
- **Never** addiction, substance use, detox, rehabilitation, ketamine, TMS, MAT,
  psychedelic treatment, crisis or emergency care, hotlines, urgent or same-day
  access, walk-ins, 24/7, or an on-call provider.
- **Never** publicly advertise Psychiatric Diagnostic Evaluations. Search-focused
  website content only.
- **Never** promise a prescription, recommend a dosage, give individualized
  advice, or guarantee an outcome.
- **Never** PHI, patient stories, or testimonials.
- Coverage always sits **above** the contact CTA.

Exact facts: **970-470-2939** · **charles@nbmentalhealth.com** ·
**NBMentalHealth.com** · in-network with Aetna, Anthem Blue Cross Blue Shield,
UnitedHealthcare, Cigna, Mountain Strong EAP, and Olivia's Fund; private-pay
appointments are also available.

## How to publish

Charles wants this hands-off and has given standing authorization for the daily
post — do not ask each morning. The route is `scripts/publish-facebook.py`,
direct to Meta's Graph API.

```bash
# resolve the token and name the page; posts nothing
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py --check

# publish
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py \
  --image content/nbmh/<date>/nbmh-<date>.jpg \
  --caption content/nbmh/<date>/caption.md

# or queue it in Meta for the morning slot
python3 .claude/skills/nbmh-social/scripts/publish-facebook.py \
  --image ... --caption ... --schedule "<date> 08:00" --tz America/Denver
```

Run `--check` first, every time. The script refuses to post unless the page name
contains "New Beginnings Mental Health", but confirm it yourself too.

**If `--check` fails**, say so at the top of the reply, in one or two lines,
naming the single outstanding step from `content/nbmh/SETUP-FACEBOOK.md`.
Charles asked for automation and was explicit that staying quiet about a broken
pipeline is worse than being nagged — so raise it every day until it works.

Do not write an essay, and do not walk him through Meta's developer console
again; the app and the `pages_manage_posts` permission are already done. Name
the one step, then still send the JPEG with `SendUserFile` and the caption in
your reply, so he is never without a post.

## Publishing honesty — the one rule that matters most

The previous system repeatedly told Charles posts were scheduled when they were
not. Do not repeat that. Creation and publication are separate facts, and each
state is claimed separately:

```
graphic created · caption created · uploaded · scheduled · published · verified
```

Claim `scheduled`, `published`, or `verified` **only** with visible evidence —
the post on the live New Beginnings Mental Health page, or the entry in Meta's
scheduled/published content. If publication fails, report the exact failure.
Never estimate, assume, or round up. A drafted post honestly reported as drafted
is a good day's work; a drafted post reported as published is a broken system.

## Deliverable

1. The finished 1080 × 1350 JPEG.
2. A concise, natural caption.
3. One CTA suited to the topic.
4. Five to seven focused hashtags.
5. A one-line compliance confirmation.
6. The current publication status, stated exactly.

Keep the message to Charles brief — concept, confirmation, status, file.
