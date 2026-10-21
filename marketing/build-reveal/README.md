# AiRE Estate "build reveal" Reel

AiRE Estate's version of the viral "empty lot assembles into the finished building"
Reel (seen on tezz.ai, 2026-10-21). Their layout puts the prompt on screen. Ours
doesn't: **AiRE shows the result, not the recipe**, so the left column shows the
finished photo and "+ AiRE Estate method" where theirs shows the prompt.

Everything in this folder is internal. Never post the prompt below.

## What gets made

A 1080×1920 Reel, about 12 seconds:

- **Left:** the finished-home photo, labeled "THE PHOTO", then "+ AiRE Estate method"
  and "Not a real listing."
- **Right:** the clip. The lot starts empty and the home assembles piece by piece
  until it matches the photo exactly.
- **Top:** "MADE WITH AI · DEMONSTRATION" and the headline "One photo in."
- **Bottom:** "Part One · $67 once" and `learn.aireestate.com`, with no text in the
  top or bottom 250 px.

## Steps

1. **The photo (end frame).** Use an AI-generated mountain-modern home, not a real
   listing. Use daylight with no people, no signs and no house numbers.
2. **The empty lot (start frame).** Edit the same photo so the house is gone and
   the site is graded dirt. Sky, trees, road, poles and power lines stay
   pixel-for-pixel. (The prompt is below.)
3. **The clip.** Generate it from the empty-lot start frame to the photo end frame
   with a first/last-frame video model. (The prompt is below.)
4. **Assemble the Reel** (free; this needs only `ffmpeg`):

       python3 marketing/build-reveal/compose.py home.jpg clip.mp4 build-reveal.mp4

   `--headline` and `--offer` change the two big lines, and `--seconds` sets the
   length. If Archivo, Manrope or IBM Plex Mono `.ttf` files are put in
   `marketing/build-reveal/fonts/`, the script uses them. Without them, it falls
   back to DejaVu or Arial.
5. **Check every frame** before it goes in the queue. Look for the "Made with AI"
   label, the $67 price, no name or face, no warped house, and an end frame that
   matches the photo.

## Free vs. paid

| Step | Free route | Paid route (needs Charles's go) |
|---|---|---|
| End photo | ChatGPT (free tier), or the Open Generative AI Image Studio on the laptop | n/a |
| Empty-lot frame | ChatGPT image edit | n/a |
| Clip | Wan2GP (Wan first/last-frame) through Open Generative AI, **only with an NVIDIA/AMD GPU** (see `tools/open-generative-ai/README.md`) | Higgsfield/HeyGen credits from this session. I quote the cost first and spend nothing without a "go". |
| Assembly | `compose.py` + ffmpeg | n/a |

The clip is the only step with no free route unless the laptop has a GPU.

## Prompts (internal, do not post)

**End photo:**
> Photorealistic eye-level photo of a new two-story mountain-modern home, dark
> standing-seam metal roof, cedar and black-steel siding, large glass walls lit warm
> from inside, stone base, concrete front steps with steel railings, at dusk under a
> soft overcast sky. Aspen and pine trees, a paved road in front, utility poles and
> power lines. No people, no cars, no signs, no house numbers. Vertical 9:16, 35mm.

**Empty-lot start frame (edit the end photo):**
> Keep the camera angle, perspective, focal length, framing, lighting, sky, road,
> trees, utility poles and power lines exactly the same. Remove the house, steps and
> railings completely and replace them with a graded, empty dirt building site with
> a few survey stakes. Nothing else changes.

**Clip (first frame = empty lot, last frame = finished photo):**
> The camera angle, perspective, focal length, framing, lighting, sky, road, trees,
> utility poles, power lines and environment stay perfectly locked for the entire
> shot. No camera movement except an extremely subtle handheld vibration. The empty
> lot gradually becomes the finished home through a cinematic structural assembly:
> the foundation pours, steel and timber framing rises in sequence, the roof panels
> slide into place, glass walls lock in, siding and stone clad the exterior, the
> steps and railings settle, and the interior lights come on at the end. Smooth,
> fast, precise, satisfying motion. No people, no text, no morphing of the
> surroundings. The final frame matches the reference photo exactly.

## Caption draft

> One photo of a finished home. An AI clip that builds it from an empty lot.
>
> This is a demonstration, not a real listing. Made with AI.
>
> Part One teaches agents to turn one listing photo into a cinematic,
> drone-style video. $67, once. learn.aireestate.com

## Open question

Part One teaches the drone-style flight, not this build-reveal effect. Before
posting, Charles decides whether the offer line stays "Part One · $67 once" or
becomes something neutral, such as `--offer "AiRE Estate"`.
