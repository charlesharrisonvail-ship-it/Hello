# Visual for each lesson beat (1-based beat number -> kind, prompt). All made in Higgsfield (gpt_image_2_5).
#   "photo"  - cinematic photoreal background, 4:3, medium quality; shown behind the beat with a slow push-in.
#   "sketch" - hand-drawn explainer in the Ian Xiaohei Illustrations style (github.com/helloianneo/
#              ian-xiaohei-illustrations, MIT, by Ian), 16:9, high quality; shown on a white card that draws in.
# Sketch beats may carry a short caption shown under the card (CAPTIONS).
# Every image is AI-made; the video carries a "Made with AI" label throughout.
PHOTO = (" Cinematic editorial photograph, mountain-modern Colorado setting, moody teal shadows and warm"
         " amber light, shallow depth of field, 35mm film look, rich detail. No text, no letters, no"
         " numbers, no logos, no readable screens, no recognizable faces.")

SKETCH = """Generate one standalone 16:9 horizontal English article illustration.
Visual DNA: Pure white background. Minimalist black hand-drawn line art. Slightly wobbly pen lines. Lots of empty white space. Sparse red/orange/blue handwritten English annotations. Clean absurd product-sketch feeling. No gradients, no shadows, no paper texture, no complex background, no commercial vector style, no PPT infographic look, no cute mascot poster, no children's illustration, no realistic UI.
Recurring IP character required: Xiaohei, a small solid-black absurd creature with white dot eyes, tiny thin legs, blank serious expression, slightly uneven hand-drawn body shape. Xiaohei must perform the core conceptual action, not decorate the scene. Serious, deadpan, slightly bizarre, not cute.
Color use: Black for main line art and Xiaohei. Orange for main flow/path/arrows. Red only for key warnings/problems/results. Blue only for secondary notes or system state.
Constraints: One image explains only one core structure. Main subject around 40-60% of the canvas, at least 35% blank white space. Only the handwritten English labels listed, spelled exactly; no other words anywhere, and never write the character's name. No title in the top-left corner. Not a formal diagram, course slide, or dense explainer. Clear but not instructional, strange but clean.
"""

M1 = {
 1: ("photo", "A tidy mountain-modern home office at dawn, a single clipboard with one blank sheet on a large wooden desk, snowy peaks through the window."),
 2: ("sketch", "Core idea: assistants disappoint because the job description is vague. Composition: Xiaohei pins a huge, almost empty job posting to a wall; a box-shaped assistant with dot eyes stares at it, surrounded by small question marks. Labels: \"run my business\" (black, on the posting), \"job description\" (black), \"too vague\" (red)."),
 3: ("photo", "An overwhelmed desk with dozens of colorful blank sticky notes covering a laptop and the wall behind it, evening lamp light, chaotic."),
 4: ("sketch", "Core idea: give the assistant one job. Composition: Xiaohei snips a single thread out of a huge tangled ball of yarn with big scissors and hands that one thread to a box-shaped assistant with dot eyes. Labels: \"40 jobs\" (black, on the tangle), \"one job\" (orange, on the thread), \"clear edges\" (blue)."),
 5: ("photo", "Three blank for-sale yard sign posts in front of three different mountain homes on a sunny autumn Friday afternoon, aspen trees, signs blank."),
 6: ("sketch", "Core idea: define the assistant's job like hiring someone. Composition: Xiaohei sits behind a tiny interview desk holding a clipboard, interviewing a box-shaped assistant with dot eyes sitting on a chair. Labels on the clipboard: \"what goes in?\", \"what comes out?\", \"what's good?\", \"where does it end?\"."),
 7: ("sketch", "Core idea: only approved inputs get in. Composition: Xiaohei is a serious doorman at a small door, letting a short line of folders walk in while pushing away a cloud and a speech bubble. Labels: \"listing facts\", \"showings\", \"feedback\" (black, on folders), \"the internet\" (red, on the cloud), \"a guess\" (red, on the bubble)."),
 8: ("sketch", "Core idea: the output has two parts and the second keeps you safe. Composition: a box-shaped assistant with dot eyes pushes out two sheets; Xiaohei inspects the second sheet closely with a big magnifying glass. Labels: \"draft email\" (black), \"checklist\" (orange), \"every source\" (blue), \"your decision\" (red)."),
 9: ("photo", "A brass ruler and precision calipers resting on a printed page on a dark desk, page text blurred and unreadable, crisp side light."),
 10: ("sketch", "Core idea: the assistant drafts, the agent decides. Composition: Xiaohei stands exactly at a painted line on the floor holding a draft; beyond the line sits a desk with a big rubber stamp. Labels: \"drafts\" (orange, by Xiaohei), \"price\", \"promises\", \"sending\" (red, beyond the line), \"agent decision\" (red, on the stamp)."),
 11: ("photo", "A charming craftsman home on a quiet tree-lined lane at golden hour, autumn leaves, porch with two chairs, small mountain town."),
 12: ("photo", "An open manila file folder with a few neatly clipped papers and some empty slots on a wooden desk, warm lamp light, all text blurred and unreadable."),
 13: ("sketch", "Core idea: organize supplied facts, never invent conclusions. Composition: before/after. Left: Xiaohei neatly stacks two labeled blocks. Right: Xiaohei sculpts a new block out of clay. Labels: \"5 showings\", \"14 groups\" (black, on left blocks), \"organize\" (orange, left), \"market moving fast\" (black, on the clay block), \"invent\" (red, right)."),
 14: ("photo", "A single blank index card and a fountain pen on a walnut desk by a mountain-view window in soft morning light."),
 15: ("sketch", "Core idea: if the job sentence has two ands, split it. Composition: Xiaohei cuts a long paper strip with big scissors exactly at a circled word, the two halves falling apart. Labels: \"and\" (red, circled on the strip), \"split it\" (orange), \"job 1\", \"job 2\" (black, on the halves)."),
 16: ("photo", "A vintage studio microphone in a warm home studio with a large window onto mountain peaks at dusk."),
}

M2 = {
 1: ("photo", "A vintage studio microphone and an open leather notebook on a walnut desk in a mountain-modern home office at dusk, floor-to-ceiling window with snowy peaks behind."),
 2: ("photo", "A laptop on an empty glass desk glowing cold blue, dim sterile office at night, lonely mood, screen out of focus."),
 3: ("sketch", "Core idea: with no instructions, AI blends everyone's writing into one average voice. Composition: Xiaohei turns the crank of a big strange blender machine in the center; on the left many different speech bubbles of different shapes pour in; on the right one plain grey identical bubble drips out. Labels: \"everyone's writing\" (black, left), \"no instructions\" (orange, on the arrow), \"the average voice\" (red, right)."),
 4: ("sketch", "Core idea: the Voice Profile sits on top of the Brand File. Composition: Xiaohei, standing on a short ladder, carefully lowers a second block onto a first block; the bottom block is labeled, the top block is labeled. Labels: \"Brand File\" with \"who you are\" (black, bottom block), \"Voice Profile\" with \"how you write\" (blue, top block), \"+\" (orange)."),
 5: ("sketch", "Core idea: a voice profile has six parts. Composition: Xiaohei pushes a little cart carrying six small labeled boxes up an orange ramp into an open box-shaped assistant with dot eyes. Labels on the boxes: \"reader\", \"tone\", \"style\", \"phrases\", \"rules\", \"samples\"."),
 6: ("photo", "A homeowner in their fifties reading a smartphone at a kitchen island in morning light, seen from behind over the shoulder, coffee mug, mountain view window."),
 7: ("photo", "Three smooth river stones balanced in a stack on a rock at the edge of a still alpine lake at sunrise, mist on the water."),
 8: ("photo", "Macro close-up of a fountain pen writing short lines on a cream notecard, ink glistening, shallow focus, letters blurred and unreadable."),
 9: ("photo", "Macro of a red editing pencil striking through lines of printed type on paper, type deliberately blurred and unreadable, dramatic side light."),
 10: ("sketch", "Core idea: when rules and voice conflict, the rules win. Composition: a seesaw; Xiaohei sits on the low heavy side next to a big block; a small feather sits on the high side. Labels: \"rules\" (black, on the block), \"voice\" (blue, by the feather), \"rules win\" (red)."),
 11: ("sketch", "Core idea: a warm voice with thin facts invents claims. Composition: Xiaohei pumps a hand pump; the hose inflates a big speech balloon while a small box beside it is almost empty. Labels: \"warm voice\" (blue, on the pump), \"thin facts\" (black, on the empty box), \"buyers love it!\" (inside the balloon), \"made up\" (red, arrow to the balloon)."),
 12: ("photo", "Three handwritten letters fanned on a wooden desk beside reading glasses, handwriting blurred and unreadable, warm window light."),
 13: ("photo", "A modest mountain craftsman home beside a quiet road at blue hour, porch light on, long-exposure headlight trails on the road, pine trees."),
 14: ("sketch", "Core idea: the same update written generic versus specific. Composition: before/after. Left: Xiaohei hands over a fluffy cloud-shaped letter. Right: Xiaohei hands over a small neat letter with three short tick lines. An orange arrow from left to right. Labels: \"generic\" (black, left), \"nice words, no info\" (red, left), \"profiled\" (black, right), \"specific = calm\" (blue, right)."),
 15: ("photo", "A hand holding a smartphone in a warm mountain cafe, screen softly blurred, steaming coffee, snow outside the window."),
 16: ("photo", "An open workbook with checkboxes, a pencil, a laptop and coffee on a desk facing a big window with mountain peaks at dawn."),
 17: ("photo", "A long orderly archive of wooden file drawers glowing in soft warm light, perspective leading toward a bright window."),
}

M3 = {
 1: ("photo", "A beautifully organized archive room with wooden drawers and brass handles, warm light, mountain view through a tall window."),
 2: ("sketch", "Core idea: mixed old and new sources make the assistant use the wrong number. Composition: Xiaohei shovels a messy pile of papers into the hopper of a strange machine; a single sheet comes out the other side with one number circled. Labels: \"v1\", \"v2\", \"FINAL\" (black, on papers), \"last year's HOA\" (black), \"wrong number\" (red, on the circled output)."),
 3: ("photo", "A single brass key resting on a closed leather folder on a dark walnut desk, dramatic spotlight."),
 4: ("sketch", "Core idea: sort reference material into two piles. Composition: Xiaohei stands between two containers, tossing sheets left and right; left a heavy stone pedestal, right a tray with a small hourglass. Labels: \"permanent guidance\" (black, left), \"changing facts\" (black, right), \"date + source\" (blue, by the hourglass)."),
 5: ("photo", "A massive engraved granite cornerstone at the base of a timber-and-stone mountain lodge, solid and permanent, late afternoon light."),
 6: ("photo", "A vintage flip clock beside a stack of receipts and an hourglass on a desk, sand falling, time passing, all text blurred."),
 7: ("sketch", "Core idea: guidance fails by being ignored, facts fail by going stale. Composition: two small scenes side by side. Left: Xiaohei asleep with a closed thick rulebook as a pillow. Right: Xiaohei holds up a curled old paper at arm's length with wavy smell lines. Labels: \"guidance\" (black, left), \"ignored\" (red, left), \"facts\" (black, right), \"stale\" (red, right)."),
 8: ("sketch", "Core idea: every source gets a register entry. Composition: Xiaohei as a serious clerk stamps a large index card at a small desk; the card has five short handwritten rows. Labels on the card rows: \"what\", \"from\", \"date\", \"OK to use?\", \"status\"; stamp label \"approved\" (orange)."),
 9: ("photo", "A lakeside condominium building at dusk with a grey heron standing in the shallows in the foreground, reflections on the water."),
 10: ("photo", "A scribbled note on a paper napkin next to a smartphone on a cafe table, handwriting blurred and unreadable, uncertain mood."),
 11: ("photo", "A signed document with a fountain pen and an embossed wax seal on a desk, signature and text blurred, formal warm light."),
 12: ("photo", "An empty rural mailbox on a post with its red flag raised, snowy mountain road at twilight, waiting."),
 13: ("sketch", "Core idea: a missing fact stays missing and the draft says so honestly. Composition: Xiaohei holds up a small sign next to an empty dotted slot on a form, while an orange arrow carries a short honest letter out to the right. Labels: \"HOA fee\" (black, by the slot), \"missing\" (red, on the sign), \"seller's guess is not a source\" (blue), \"honest draft\" (orange)."),
 14: ("sketch", "Core idea: without a register, a guess gets dressed up as a fact. Composition: Xiaohei carefully buttons a tiny suit and tie onto a wobbly hand-drawn question mark. Labels: \"guess\" (black, on the question mark), \"$40 a month\" (black, on the tie), \"looks like a fact\" (red)."),
 15: ("photo", "An empty room with bare plywood subfloor under renovation, a single sample hardwood plank leaning against the wall, window light."),
 16: ("sketch", "Core idea: instructions inside a source are data, not commands. Composition: Xiaohei, with tongs, drops a shouting letter into a big glass jar and screws on the lid; the letter has a small megaphone. Labels: \"seller email\" (black, on the letter), \"data only\" (blue, on the jar), \"not instructions\" (red)."),
 17: ("photo", "Three plain folders, a laptop with a softly blurred spreadsheet, and a mug on a desk by a mountain-view window, morning."),
 18: ("photo", "Five smooth stones arranged neatly in a row on slate, scattered loose gravel blurred in the background."),
 19: ("photo", "A house blueprint spread on a drafting table with a pencil, ruler and brass compass, warm workshop light, lines unreadable."),
}


def request(beat, kind, prompt):
    """Higgsfield generate_image params for one beat."""
    if kind == "sketch":
        return {"model": "gpt_image_2_5", "aspect_ratio": "16:9", "quality": "high", "resolution": "2k", "prompt": SKETCH + prompt}
    return {"model": "gpt_image_2_5", "aspect_ratio": "4:3", "quality": "medium", "resolution": "2k", "prompt": prompt + PHOTO}


CAPTIONS = {
 ('M1', 2): "It isn't the software. <em>It's the job description.</em>",
 ('M1', 4): 'One job. <em>Clear inputs, clear output, clear edges.</em>',
 ('M1', 6): 'Four questions, <em>like a new hire.</em>',
 ('M1', 7): 'Not in the inputs? <em>Not in the update.</em>',
 ('M1', 8): 'Draft email <em>+ your checklist.</em>',
 ('M1', 10): 'It drafts. <em>You decide.</em>',
 ('M1', 13): 'Organize what you have. <em>Never invent.</em>',
 ('M1', 15): 'Two "and"s? <em>Split it.</em>',
 ('M2', 3): 'No instructions &rarr; the <em>average</em> voice.',
 ('M2', 4): 'Who you are <em>+</em> how you actually write.',
 ('M2', 5): 'Reader &middot; Tone &middot; Style &middot; Phrases &middot; Rules &middot; Samples',
 ('M2', 10): 'When they conflict, <em>the rules win.</em>',
 ('M2', 11): 'Nobody said that. <em>The voice made it up.</em>',
 ('M2', 14): 'Nice words vs. <em>real information.</em>',
 ('M3', 2): 'Its best will include <em>the wrong number.</em>',
 ('M3', 4): 'Permanent guidance &middot; <em>Changing facts</em>',
 ('M3', 7): 'Guidance gets ignored. <em>Facts go stale.</em>',
 ('M3', 8): 'What &middot; From &middot; Date &middot; Permission &middot; <em>Status</em>',
 ('M3', 13): 'Missing stays missing <em>&mdash; and the draft says so.</em>',
 ('M3', 14): "A guess wearing <em>a fact's clothing.</em>",
 ('M3', 16): 'Data only <em>&mdash; never instructions.</em>',
}
