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

# Lead to Keys (Part 2). Files numbered from 2100 (LK1), 2200 (LK2) and so on.
LK1 = {
 1: ("photo", "A set of house keys on a walnut table in front of a window with a mountain-modern home outside at golden hour, warm and welcoming."),
 2: ("photo", "A row of law books and a brass desk lamp on a dark shelf, warm library light, spines blurred and unreadable."),
 3: ("sketch", "Core idea: never paste sensitive financial documents into an AI tool. Composition: Xiaohei stands firmly in front of a chat window with arms out, blocking a small stack of papers that is trying to walk into it. Labels: \"account numbers\", \"loan documents\", \"social security numbers\" (black, on the papers), \"never paste\" (red)."),
 4: ("photo", "A real estate agent's desk at morning with a phone, a notebook, a closing folder and a calculator, mountain view, all text blurred and unreadable."),
 5: ("sketch", "Core idea: turn the messy pile into a clean fact sheet before writing anything. Composition: on the left a messy pile of papers; Xiaohei pulls pieces from it and files them into a tidy form with neat boxes on the right. Labels: \"seller notes\", \"tax records\", \"your walkthrough\", \"old listing\" (black, on the pile), \"fact sheet\" (orange, on the form)."),
 6: ("photo", "A clean clipboard with a blank form on a kitchen island in an empty staged mountain home, morning light, nothing readable."),
 7: ("photo", "A roof of a mountain home with snow melting off it, seen from below against a blue sky, crisp detail, no people."),
 8: ("sketch", "Core idea: three sources give three different square footages; the fact sheet shows it on day one. Composition: three small figures (a tax record page, an old appraisal folder, and a thought bubble from a seller) each hold up a sign with a different number; Xiaohei stands in the middle with a tape measure, frowning. Labels: \"tax record\", \"old appraisal\", \"seller's memory\" (black), \"3 different numbers\" (red), \"day one\" (orange)."),
 9: ("photo", "A bright living room in a mountain-modern home staged for sale, large windows, peaks outside, golden light, no people."),
 10: ("photo", "A quiet suburban street in a mountain town with a school building far in the distance and a fenced yard in front, afternoon light, no people, no readable signs."),
 11: ("photo", "A pen and a printed draft beside a laptop on a desk at evening, a reading lamp, careful review mood, text blurred."),
 12: ("sketch", "Core idea: every claim in the description must trace back to the fact sheet. Composition: Xiaohei draws orange lines from each sentence of a description page back to lines on a fact sheet page (every sentence drawn as plain squiggly lines, no readable words); one sentence has no matching line and Xiaohei is cutting it out with big scissors. Labels: \"description\" (black), \"fact sheet\" (black), \"new roof?\" (red, on the cut sentence), \"comes out\" (red)."),
 13: ("photo", "Two people shaking hands at the front door of a mountain home, seen from a distance, faces not visible, warm evening light."),
}

LK2 = {
 1: ("photo", "A handwritten note card and an envelope on a walnut desk beside a phone, morning light in a mountain home office, writing blurred and unreadable."),
 2: ("sketch", "Core idea: the model reads one page about the client before it writes anything. Composition: Xiaohei hands a single page to a box-shaped assistant with dot eyes; only after reading it does the assistant start writing a letter. Labels: \"one page per client\" (black, on the page), \"read first\" (orange), \"then write\" (blue)."),
 3: ("photo", "A tidy client folder on a desk with tabbed pages and a pen, warm lamp light, mountain window behind, all text blurred and unreadable."),
 4: ("photo", "A phone on a cafe table showing a blurred text conversation, a coffee beside it, warm light, screen unreadable."),
 5: ("photo", "A closed leather folder with a small brass lock on a dark desk, serious, warm light, no text."),
 6: ("sketch", "Core idea: something protected in a profile can quietly steer what the model suggests. Composition: a box-shaped assistant with dot eyes reads a profile page with a small hidden red note tucked in it; from the note a red arrow quietly bends a road on a small town map toward only one neighborhood; Xiaohei notices with alarm. Labels: \"reads the whole profile\" (blue), \"hidden note\" (red), \"steering\" (red)."),
 7: ("photo", "A beautiful mountain-modern home exterior at golden hour, the property alone in frame, no people, calm and factual."),
 8: ("photo", "A shredder beside a small stack of documents and a laptop with a lock icon shape on a desk, cool light, all text unreadable."),
 9: ("photo", "An empty chair across a desk from a notepad and a pen in a bright office with mountain views, waiting for a conversation."),
 10: ("photo", "A clipboard with a short printed checklist of four lines on a desk, a pen beside it, morning light, text blurred and unreadable."),
 11: ("sketch", "Core idea: sort leads only on their answers, never on a name, a zip code or how they write. Composition: Xiaohei sorts answer cards into three trays; on the floor a name tag, a zip code tag and a handwriting sample are crossed out and pushed aside. Labels: \"now\", \"soon\", \"later\" (orange, on the trays), \"answers only\" (blue), \"name\", \"zip code\", \"the way they write\" (red, crossed out)."),
 12: ("photo", "A calculator, a printed spreadsheet and a cup of coffee on a walnut desk at evening, mountain window, numbers blurred and unreadable."),
}

LK3 = {
 1: ("photo", "A laptop showing a softly blurred spreadsheet and a printed comp grid beside a calculator on a walnut desk, mountain window at dusk, all numbers unreadable."),
 2: ("sketch", "Core idea: a language model is not a database; ask it for a sale price and it may invent one. Composition: Xiaohei asks a box-shaped assistant with dot eyes a question; the assistant confidently pulls a price tag out of a top hat like a magic trick. Labels: \"what did it sell for?\" (black), \"made up\" (red, on the price tag), \"not a database\" (blue)."),
 3: ("photo", "A stack of printed MLS reports and a pen beside an open laptop, warm desk lamp, mountain office, all text blurred and unreadable."),
 4: ("photo", "A row of mountain homes of similar size on one street at golden hour, seen from across the road, no people, no readable signs."),
 5: ("sketch", "Core idea: you check every adjustment because you know what the tool doesn't. Composition: Xiaohei with a red pen stands over a comp grid on the ground; next to it two tiny houses: one sits right beside a highway with cars, the other has a cutaway showing an old dated kitchen; Xiaohei crosses out one number in the grid. Labels: \"backs onto the highway\" (red), \"1987 kitchen\" (red), \"your judgment\" (orange)."),
 6: ("photo", "A small rental duplex in a mountain town with a pencil and a notepad on a porch railing in the foreground, afternoon light, nothing readable."),
 7: ("photo", "An insurance quote and a property tax bill lying on a desk beside a calculator, warm light, all text blurred and unreadable."),
 8: ("photo", "A single printed one-page market report with a simple line chart, on a coffee table in a mountain living room, text blurred and unreadable."),
 9: ("photo", "A rule book with a ribbon bookmark on a desk beside a laptop, cool evening light, text unreadable."),
 10: ("sketch", "Core idea: the report is a comparative market analysis, never an appraisal, and your judgment sits between the model's range and the list price. Composition: Xiaohei stamps a big red stamp on a report; beside it Xiaohei's arm holds back an arrow labeled with a range from reaching a sign. Labels: \"comparative market analysis\" (black, title on the report), \"not an appraisal\" (red, the stamp), \"the model's range\" (blue, on the arrow), \"list price\" (black, on the sign), \"your judgment\" (orange)."),
 11: ("photo", "A rubber stamp and an ink pad beside a bound report on a desk, warm light, text unreadable."),
 12: ("photo", "A polished bound printed report with a mountain home photo on its cover lying on a walnut table, premium and professional, text unreadable."),
 13: ("photo", "An agent's leather portfolio and a printed report on a kitchen island in a bright mountain home, coffee cups, ready for a meeting, no people."),
}

LK4 = {
 1: ("photo", "A mountain-modern home with a small tasteful for-sale sign post at the edge of the lawn at golden hour, sign blank, no people."),
 2: ("sketch", "Core idea: sellers don't want forty slides about the agent; they want three answers. Composition: Xiaohei holds a towering stack of slides, each showing a tiny self-portrait of an agent; across from it a small seller figure yawns and holds up three question marks. Labels: \"40 slides about the agent\" (red), \"worth?\", \"how?\", \"cost?\" (orange, by the question marks)."),
 3: ("photo", "A printed presentation booklet and a tablet on a dining table in a bright mountain home, coffee cups, ready for a meeting, screen and text unreadable."),
 4: ("photo", "A smartphone held up to photograph a mountain home from the street at golden hour, seen from behind the hand, screen blurred."),
 5: ("sketch", "Core idea: show the seller their own house already marketed, before they sign. Composition: at a kitchen table Xiaohei turns a tablet toward a small seller figure; the tablet plays a drone video of the seller's own house; the seller's eyes go wide. Labels: \"their own house\" (orange), \"AI-generated\" (red, a small tag on the video), \"before they sign\" (blue)."),
 6: ("photo", "A small conference table in a mountain office with a laptop open to a slide and two chairs, morning light, screen blurred."),
 7: ("photo", "A laptop on a dark desk with a terminal window glowing softly, a coffee mug, evening mountain cabin light, screen blurred and unreadable."),
 8: ("sketch", "Core idea: sellers are lost to silence, not price. Composition: a small seller figure sits beside a phone that never rings, a dark storm cloud growing over their head; far away Xiaohei is busy and unaware. Labels: \"no news\" (black, by the silent phone), \"= bad news\" (red, by the cloud)."),
 9: ("photo", "A phone on a kitchen counter lighting up with a message, morning coffee beside it, a seller's mountain home kitchen, screen blurred."),
 10: ("photo", "A notepad with handwritten quotation marks and a pen on a desk, warm light, writing blurred and unreadable."),
 11: ("photo", "A phone held to an ear by a hand at a window overlooking mountains, serious mood, face out of frame, evening light."),
 12: ("photo", "A front porch of a mountain home at dusk with two chairs facing each other, warm porch light, inviting, no people."),
}

LK5 = {
 1: ("photo", "A couple walking up a stone path to an open-house front door of a mountain-modern home, seen from behind, faces not visible, golden hour."),
 2: ("sketch", "Core idea: buyers are drowning in listings; be the one message worth reading. Composition: a small buyer figure is swimming in a sea of tiny listing cards; Xiaohei on the shore throws a single short note tied to a life ring. Labels: \"40 homes a day\" (red), \"one message worth reading\" (orange, on the note)."),
 3: ("photo", "A smartphone on a cafe table showing a short message preview beside a cup of coffee, warm light, mountain town window, screen blurred."),
 4: ("photo", "Two printed listing sheets with house photos laid side by side on a table with a pen between them, warm light, text blurred and unreadable."),
 5: ("sketch", "Core idea: compare the homes, never the neighborhood's people. Composition: Xiaohei measures two little houses with a tape measure; neat black check labels sit on the houses, while crossed-out red labels float off to the side. Labels: \"quieter street\", \"larger lot\", \"newer roof\" (black, with small checks), \"better area\", \"safer\", \"your kind of neighborhood\" (red, crossed out)."),
 6: ("photo", "A laptop showing a blurred official government website next to a notepad, calm office light, screen unreadable."),
 7: ("photo", "Two chairs at a coffee table in a mountain living room set for a conversation, two cups of tea, warm afternoon light, no people."),
 8: ("sketch", "Core idea: an objection often hides the real concern. Composition: Xiaohei gently lifts a flat mask off a small buyer figure; the mask has a frown and the face underneath looks worried. Labels: \"it's overpriced\" (black, on the mask), \"scared of overpaying\" (red, by the face), \"the real concern\" (orange)."),
 9: ("photo", "A comp grid printout and a lender's rate sheet side by side on a desk, warm lamp light, all numbers blurred and unreadable."),
 10: ("photo", "A handshake on a front porch of a mountain home at sunset, faces out of frame, warm and trusting."),
 11: ("photo", "A laptop showing a softly blurred calendar of scheduled messages on a desk in a mountain office at morning, coffee cup, screen unreadable."),
}

# Listing Media Without the Invoice (original AiRE course). Image files numbered from BASE.
BASE = {"LM1": 1100, "LM2": 1200, "LM3": 1300, "LM4": 1400, "LM5": 1500, "LM6": 1600, "LM7": 1700, "LMB": 1800, "LK1": 2100, "LK2": 2200, "LK3": 2300, "LK4": 2400, "LK5": 2500}
LM1 = {
 1: ("photo", "A wide mountain valley with a small ski town at golden hour, aspens turning gold, a winding river, peaks with first snow."),
 2: ("photo", "A mountain resort town main street at dusk in autumn, warm shop windows, pines and peaks behind, no signs readable."),
 3: ("sketch", "Core idea: listing platforms charge again for every listing. Composition: a tired Xiaohei drops a big coin into the slot of a tall, odd machine; behind Xiaohei a short line of tiny houses waits, each needing its own coin. Labels: \"$400-$950\" (red, on the coin), \"listing 1\", \"listing 2\", \"listing 3\" (black, on the houses), \"pay again\" (red)."),
 4: ("sketch", "Core idea: one photograph becomes three kinds of listing media. Composition: Xiaohei holds up a single small photo; three orange arrows fan out to a tiny drone, a film strip and a phone. Labels: \"one photo\" (black), \"drone shot\", \"walkthrough video\", \"social posts\" (black), \"pennies\" (blue)."),
 5: ("photo", "An aerial view of a mountain-modern home on a forested ridge at sunset, seen from above as if from a drone, long shadows."),
 6: ("photo", "A leather-bound brand book open on a walnut desk beside color swatches and a fountain pen, warm light, all text blurred and unreadable."),
 7: ("photo", "Three coffee mugs and an open laptop on a living-room coffee table by a stone fireplace, evening, cozy, screen blurred."),
 8: ("photo", "Two hands in a firm handshake over a rustic wooden table, faces out of frame, warm window light, mountain view blurred behind."),
 9: ("sketch", "Core idea: the walkthrough is a cinematic video, not a 3D tour. Composition: Xiaohei proudly holds up a big film reel; next to it a small wireframe 3D house cube is crossed out. Labels: \"cinematic video\" (orange), \"3D tour\" (black, on the cube), \"not this\" (red)."),
 10: ("photo", "A few coins stacked beside a smartphone on a slate countertop, soft morning light, minimal and calm."),
 11: ("photo", "A row of thick law books on a dark wooden shelf with a brass desk lamp, spines blurred and unreadable, warm library light."),
 12: ("sketch", "Core idea: from here an AI instructor takes over teaching. Composition: Xiaohei hands a microphone to a box-shaped assistant with dot eyes that has small signal lines around it. Labels: \"AiRE\" (blue, on the assistant), \"AI instructor\" (blue), \"your turn\" (orange)."),
 13: ("photo", "A new timber-frame house foundation and ground floor deck under construction on a mountain lot at sunrise, clean and orderly."),
}

LMB = {  # the Prompt Playbook bonus
 1: ("photo", "A leather notebook open on a walnut desk beside a laptop and a fountain pen, a mountain view through the window at dawn, pages and screen blurred and unreadable."),
 2: ("sketch", "Core idea: ask the chat app to write the prompt, then run it in the tool that does the work. Composition: Xiaohei asks a plain, unbranded chat window (no logos or icons anywhere), which hands back a long note; Xiaohei carries the note over to a sturdy workshop machine that is building a small house. Labels: \"write me the prompt\" (black, Xiaohei's request), \"the chat writes\" (orange), \"the tool makes\" (orange), \"Claude Code\" (blue, on the machine)."),
 3: ("photo", "Two screens side by side on a mountain cabin desk at morning, one a chat window and one a dark terminal window, both softly blurred and unreadable, a coffee cup."),
 4: ("photo", "Four smooth river stones balanced in a careful stack on a wooden desk beside a window with mountains, calm and deliberate."),
 5: ("sketch", "Core idea: a prompt needs all four parts or it falls over. Composition: Xiaohei sits on a four-legged stool whose legs are labeled; one leg is missing and the stool is tipping. Labels: \"goal\", \"facts\", \"rules\", \"shape\" (black, one on each leg, \"facts\" on the missing leg drawn dashed), \"makes things up\" (red)."),
 6: ("sketch", "Core idea: give the model files, not just words, so it guesses less. Composition: Xiaohei feeds three things into a plain, unbranded chat window (no logos or icons anywhere): a house photo, the same photo with a red line drawn across it, and a single page. Labels: \"photo\" (black), \"marked-up photo\" (red), \"brand file\" (orange), \"less guessing\" (blue)."),
 7: ("photo", "A friendly conversation setting: two coffee cups on a kitchen island in a mountain home, morning light, a notepad with blurred questions, no people visible."),
 8: ("photo", "An editor's red pencil resting on a printed draft with a few marks, laptop behind, warm desk lamp, text blurred and unreadable."),
 9: ("sketch", "Core idea: save prompts that work and reuse them. Composition: Xiaohei files neat index cards into a small wooden card drawer; one card is pulled out and only needs blanks filled in; a big clock shrinks to a small clock beside it. Labels: \"prompt library\" (orange, on the drawer), \"listing description\", \"seller update\", \"market report\" (black, on cards), \"an hour\" (black), \"five minutes\" (blue)."),
 10: ("photo", "Reading glasses resting on a printed listing description with blurred text, a magnifying glass beside it, careful review mood, warm light."),
 11: ("photo", "A neatly organized desk in a mountain home office at golden hour, a closed notebook and a pen squared up, peaceful, ready to work."),
}

LM7 = {
 1: ("photo", "A winding mountain road at dawn leading toward a small town in a valley, mist lifting, long view, patient and hopeful."),
 2: ("sketch", "Core idea: search takes months but compounds. Composition: Xiaohei patiently waters a small sapling; beside it three panels show the same tree growing taller over time while a coin pile under it grows; off to the side a crossed-out sign is held by a hurried figure. Labels: \"months\" (black), \"compounds\" (orange), \"same-week SEO\" (red, on the crossed-out sign)."),
 3: ("photo", "A storefront-style view of a small mountain town main street at golden hour, a smartphone in the foreground showing a blurred map, screen unreadable."),
 4: ("sketch", "Core idea: a steady trickle of reviews beats a pile posted in one week. Composition: Xiaohei stands under a small tap that drips one star at a time into a jar beside a long row of blank calendar pages for many months (no words or day names on them); on the other side a big heap of stars dumped all at once looks suspicious, with a raised eyebrow drawn above it. Labels: \"steady trickle\" (orange), \"all in one week\" (red), \"real clients\" (blue)."),
 5: ("photo", "A quiet mountain neighborhood street in February snow at morning, a school bus far in the distance, warm windows, no people, no readable signs."),
 6: ("sketch", "Core idea: Claude drafts the page, you rewrite it with what only you know. Composition: a box-shaped assistant with dot eyes hands Xiaohei a plain draft page; Xiaohei writes new lines into it from a small notebook full of local sketches (a mountain, a coffee cup, a snowy road). Labels: \"Claude drafts\" (blue), \"what only you know\" (orange), \"can't be copied\" (black)."),
 7: ("photo", "A trail map board at the edge of a park with aspens, mountain peaks behind, golden light, the map blurred and unreadable, no people."),
 8: ("sketch", "Core idea: many thin AI pages fail; a few real pages win. Composition: on the left a tall stack of flimsy see-through pages blows away in the wind; on the right Xiaohei stands beside five thick, solid pages that stay put. Labels: \"50 hollow pages\" (red, above the blowing stack on the left), \"can hurt you\" (red, also on the left beside the blowing stack), \"5 real pages\" (orange, beside the solid pages on the right)."),
 9: ("photo", "A person in a mountain kitchen at evening holding a phone up to ask a question, seen from behind, face not visible, warm light, screen blurred."),
 10: ("sketch", "Core idea: write so an AI can quote you accurately. Composition: Xiaohei hands a neat index card to a box-shaped assistant with dot eyes, which reads it aloud through a small megaphone to a tiny listening figure. Labels: \"answer first\" (orange), \"real numbers\" (black), \"name the source\" (black), \"quoted\" (blue)."),
 11: ("photo", "A wide open alpine meadow at sunrise with a single trail leading forward toward the peaks, fresh and uncrowded."),
 12: ("photo", "A tidy desk at dusk with a laptop, a printed photo of a mountain home, a small camera drone and a phone, all screens blurred, satisfied mood."),
 13: ("photo", "A set of house keys on a wooden table beside a closed folder, warm late-afternoon light, mountain window behind, no readable text."),
 14: ("photo", "An open laptop beside a handwritten thank-you note and a cup of coffee, morning light in a mountain cabin, all text blurred and unreadable."),
 15: ("photo", "A creator's camera on a tripod on a mountain overlook at golden hour, ready to shoot, sweeping peaks behind, inviting."),
}

LM6 = {
 1: ("photo", "A smartphone lying on a walnut desk beside a coffee cup in a mountain home office at morning, its screen glowing softly with a blurred photo feed, unreadable."),
 2: ("sketch", "Core idea: posting constantly with no system; the casual video of the dog did best. Composition: Xiaohei, surrounded by a messy scattered pile of posts, films a happy dog with a phone; small hearts float up from the dog video while a stack of listing posts and market update posts beside it gets none. Labels: \"posted constantly\" (black), \"no system\" (red), \"the dog\" (orange), \"listings\", \"market updates\" (black, on the ignored stack)."),
 3: ("sketch", "Core idea: typing one generic request gets the same post everyone else gets. Composition: Xiaohei drops a coin into a tall vending machine; out of the bottom slot tumble many identical post cards. Labels: \"write me a post about the market\" (black, on a note Xiaohei holds), \"same as everyone\" (red, on the identical cards), \"vending machine\" (blue)."),
 4: ("photo", "A calm, organized creative workspace at golden hour with a planner open, a camera and a laptop, mountain view through the window, screens and pages blurred."),
 5: ("sketch", "Core idea: shared tools make everyone's work look the same; a brand file makes it yours. Composition: on the left, three identical neat houses come out of the same machine; on the right, Xiaohei slides a single page into the machine and one house comes out with its own distinct shape. Labels: \"same tools\" (black), \"same handsome work\" (red), \"brand file\" (orange, on the page), \"yours\" (orange)."),
 6: ("photo", "A single printed page on a walnut desk surrounded by color swatches, a font specimen card and a fountain pen, warm light, all text blurred and unreadable."),
 7: ("photo", "An hourglass on a desk beside a blank form on a clipboard and a pen, soft window light, mountain view, focused and calm, no readable text."),
 8: ("sketch", "Core idea: when the output is wrong, fix the file, not just the piece. Composition: Xiaohei ignores a crumpled wrong draft on the floor and instead writes one new line at the bottom of a long page; a small calendar shows a month passing and a target with an arrow dead center. Labels: \"sounds wrong\" (red, on the draft), \"add a line\" (orange), \"stops missing\" (blue, by the target)."),
 9: ("sketch", "Core idea: every post falls into one of four buckets. Composition: Xiaohei stands before four buckets in a row, dropping a post card into the one that is nearly empty. Labels: \"market update\" (black), \"listings\" (black), \"education\" (black), \"lifestyle\" (orange), \"which one am I short on?\" (blue)."),
 10: ("sketch", "Core idea: posts with a person in them got a response; hashtag-only posts went nowhere. Composition: two post cards side by side; on the left a card showing a dog and a bicycle with many hearts floating up and Xiaohei pointing at it; on the right a card full of only hashtag symbols with a tumbleweed rolling past. Labels: \"a person in it\" (orange), \"lifestyle\" (orange), \"only hashtags\" (red), \"nowhere\" (red)."),
 11: ("photo", "A person at a cafe table holding a phone, scrolling, seen over the shoulder, face not visible, warm mountain town light, screen blurred."),
 12: ("photo", "A wall calendar of a whole month with neat colored sticky notes in every square, beside a desk with a laptop, morning light, no readable text."),
 13: ("sketch", "Core idea: one idea becomes three shapes for three audiences. Composition: Xiaohei feeds one small light bulb into a funnel; three orange arrows come out to a vertical phone video, a short caption card and a long article page. Labels: \"one market insight\" (black), \"TikTok script\", \"Reel caption\", \"LinkedIn post\" (black), \"three shapes\" (orange)."),
 14: ("photo", "Three neat objects in a row on a walnut desk: a single printed page, four small stacked trays, and a desk calendar, warm light, minimal, no readable text."),
 15: ("photo", "A red pen resting on a printed page with blurred text on a desk, a magnifying glass beside it, careful proofreading mood, warm light."),
 16: ("photo", "A wooden gavel and a small model house on a desk beside a law book, serious, warm light, text unreadable."),
 17: ("photo", "A sunny family-friendly street of mountain homes with aspen trees, empty sidewalks, no people, warm afternoon light, inviting."),
 18: ("photo", "A checklist on a clipboard with a pen beside a laptop on a desk, evening lamp light, careful and calm, all text blurred and unreadable."),
 19: ("photo", "A mountain-modern home at dusk seen from above in a sweeping wide shot, one road leading to it through the trees, warm windows glowing."),
}

LM5 = {
 1: ("photo", "A luxurious mountain-modern great room at golden hour seen through a cinema camera viewfinder frame, warm light, floor-to-ceiling windows, peaks."),
 2: ("photo", "A film director's chair and a small camera rig in an empty bright modern home interior, ready to shoot, warm afternoon light."),
 3: ("sketch", "Core idea: the showcase is a cinematic walkthrough, not a clickable 3D tour. Composition: Xiaohei sews small room pictures together into one long film strip with a big needle and thread; nearby a wireframe 3D house cube is crossed out. Labels: \"room by room\" (black), \"one camera move each\" (orange), \"3D tour\" (black, on the cube), \"not this\" (red)."),
 4: ("photo", "A tidy desk with an open laptop and a small terminal-style window glow, a coffee and a notepad, evening mountain cabin light, screen blurred."),
 5: ("photo", "A newly sprouted seedling in a small pot on a windowsill with mountains behind, early and promising, morning light."),
 6: ("photo", "A neat flat-lay of a laptop, a small external drive and a camera on a wooden desk, warm light, screens blurred."),
 7: ("sketch", "Core idea: the tool picks the best photo of each room and discards the rest. Composition: Xiaohei sorts a pile of listing photos, holding up one per room and tossing floor plans and duplicate photos into a bin. Labels: \"best shot per room\" (orange), \"floor plans\" (black, on the bin pile), \"duplicates\" (red)."),
 8: ("photo", "Reuses image 1306 (camera on a slider rail in a mountain living room)."),  # the sketch version was blocked twice by the image filter
 9: ("photo", "An open file folder on a desk holding several printed video stills of rooms in a modern home, warm light, everything blurred and unreadable."),
 10: ("sketch", "Core idea: listing photos belong to their photographer; ask before using someone else's. Composition: Xiaohei politely holds out a request note to a photographer figure holding a camera and a stack of photos marked with a small copyright symbol; on the other side a crossed-out grabbing hand reaches for a stranger's listing. Labels: \"photographer's photos\" (black), \"ask first\" (orange), \"don't scrape\" (red)."),
 11: ("photo", "A couple walking up to the front door of a mountain home at golden hour, seen from behind, faces not visible, hopeful mood."),
 12: ("photo", "A beautiful mountain-modern home at blue hour with every window glowing warmly, reflections in a pond, premium and calm."),
}

LM4 = {  # beats 6, 8 and 10 keep the original footage (no image)
 1: ("photo", "A professional camera drone hovering over a mountain home at golden hour, pine forest, peaks behind, cinematic."),
 2: ("sketch", "Core idea: hiring a drone operator costs more than money. Composition: Xiaohei stands in the rain under a small cloud, holding an umbrella and a wall calendar, waiting; a tiny drone sits grounded in a box. Labels: \"their calendar\" (black), \"the weather\" (blue), \"do it again\" (red)."),
 3: ("photo", "A single printed photograph of a mountain home lying on a desk next to a stopwatch, warm light, simple and calm."),
 4: ("sketch", "Core idea: the tool amplifies the photo you give it. Composition: Xiaohei holds up two photos of a house: on the left a crisp photo taken from a slight angle with a check mark; on the right a flat, straight-on, blurry photo with an X. Labels: \"slight angle, sharp\" (black, left), \"flat and blurry\" (red, right), \"amplifies, doesn't rescue\" (blue)."),
 5: ("photo", "A hand drawing a red arrow path on a printed photo of a house with a marker, desk lamp light, shallow focus, playful planning mood."),
 7: ("sketch", "Core idea: give the chat app both pictures and let it write the prompt. Composition: Xiaohei feeds two photos into a chat window, the plain photo and the same photo with a red line drawn on it; a long note comes out the other side. Labels: \"original\" (black), \"marked-up copy\" (red), \"chat app\" (blue), \"expert prompt\" (orange)."),
 9: ("photo", "A laptop on a mountain cabin desk at dusk with a glowing screen, a printed house photo beside it, screen blurred, focused work mood."),
 11: ("photo", "Three tablets side by side on a wooden table showing soft blurred aerial images, morning light, comparison mood, screens unreadable."),
 12: ("photo", "A dreamy, obviously artistic illustration-style river city scene printed on paper, pinned to a studio wall, soft light, text unreadable."),
 13: ("sketch", "Core idea: AI video models invent details, so check every clip. Composition: Xiaohei inspects a small house with a big magnifying glass and finds an extra window that was drawn in; Xiaohei tosses a film strip into a bin. Labels: \"invented window\" (red), \"watch every clip\" (orange), \"throw it out\" (red)."),
 14: ("photo", "A wooden gavel and a set of house keys on a desk beside a printed listing sheet with blurred text, serious, warm light."),
 15: ("photo", "A wall calendar turned to January beside a law book on a desk, crisp winter light through a mountain window, text unreadable."),
 16: ("photo", "A smartphone showing a vertical home video with a small blurred caption bar, held in a hand at a cafe, screen unreadable."),
 17: ("photo", "Two thick binders side by side on a desk, one with a state seal shape and one with a house shape embossed, warm light, no readable text."),
 18: ("photo", "A sweeping aerial view of a mountain home and its land at sunrise, mist in the valley, cinematic and hopeful."),
}

LM3 = {
 1: ("photo", "A craftsman's workbench at dawn with five different tools laid out in a neat row, mountain workshop window, calm and orderly."),
 2: ("photo", "A laptop on a wooden desk showing a dark window with a blinking cursor, screen softly blurred, morning light, mountain view."),
 3: ("sketch", "Core idea: five tools, three jobs. Composition: Xiaohei stands behind a table with five small objects in a row: a film camera, a calculator, and three items that make work look professional (a ruler, a magnifying glass, a film reel). Labels: \"makes the video\" (black, by the camera), \"runs the numbers\" (black, by the calculator), \"looks like a firm made it\" (orange, over the last three)."),
 4: ("sketch", "Core idea: taste fixes what you can feel but can't name. Composition: Xiaohei carefully nudges the parts of a simple flyer into better alignment with a big ruler; a small before-version beside it looks crooked. Labels: \"spacing\", \"typography\", \"layout\" (black), \"and why\" (blue)."),
 5: ("photo", "A large magnifying glass resting on printed design proofs on a desk, warm light, all text blurred and unreadable, careful inspection mood."),
 6: ("photo", "A camera on a smooth slider rail drifting across a modern mountain living room at golden hour, cinematic motion, shallow focus."),
 7: ("sketch", "Core idea: build a video template once, reuse it forever. Composition: Xiaohei swaps a small address tag on a strange machine that keeps printing film strips; a stack of finished film strips piles up on the other side. Labels: \"build once\" (black, on the machine), \"new address, new price\" (blue, on the tag), \"new video\" (orange, on the film strips)."),
 8: ("photo", "A printed real estate analysis report with charts on a desk beside a calculator and a coffee, text and numbers blurred and unreadable, warm light."),
 9: ("photo", "A wooden desk with a closed appraisal folder and reading glasses, a serious, professional mood, soft window light, all text unreadable."),
 10: ("sketch", "Core idea: comps are lined up from the sales you supply, then you check every number. Composition: Xiaohei lines up five small house cards in a row, then holds a big magnifying glass over a one-page report. Labels: \"5 recent sales\" (black), \"one-page report\" (orange), \"check against your MLS\" (red)."),
 11: ("photo", "A browser sign-in moment: a laptop on a cabin desk at dusk with a softly glowing screen and a hand on the trackpad, screen blurred."),
 12: ("photo", "A set of well-used tools being updated: a workbench with a new tool beside an older version of the same tool, warm light, mountain cabin."),
 13: ("photo", "An aerial drone view of a mountain home at golden hour, seen from high above with long shadows across pine forest."),
}

LM2 = {
 1: ("photo", "A freshly poured concrete foundation of a mountain home at dawn, rebar and clean forms, snowy peaks behind, calm and solid."),
 2: ("photo", "A laptop and a credit card resting on a wooden desk by a window with mountain views, morning light, screen softly blurred."),
 3: ("sketch", "Core idea: Claude comes in two forms. Composition: Xiaohei stands between two boxes; the left box has a speech bubble coming out of it, the right box holds a small hammer and is building a tiny house. Labels: \"the chat\" (black, left), \"talks back\" (blue, left), \"Claude Code\" (black, right), \"builds things\" (orange, right)."),
 4: ("photo", "A dark, calm home office at night with a single monitor glowing softly on a wooden desk, keyboard, screen out of focus, mountain window."),
 5: ("photo", "Close-up of hands on a keyboard in warm lamp light, shallow depth of field, screen glow blurred in the background."),
 6: ("photo", "Two identical windows side by side on a dark wall at dusk, warm light in one and cool light in the other, minimal and architectural."),
 7: ("sketch", "Core idea: the terminal takes short commands, Claude Code takes English. Composition: two small windows; Xiaohei slides a short card into the left window, and a long scroll into the right window; a long scroll stuck in the left window has a red X. Labels: \"terminal\" and \"commands\" (black, left), \"Claude Code\" and \"English\" (black, right), \"wrong window\" (red)."),
 8: ("sketch", "Core idea: have a chat app write the prompt, then paste it where the work happens. Composition: Xiaohei holds out a notepad to a small chat window that writes on it; an orange arrow carries the written note to a second window with a hammer. Labels: \"chat app\" (blue), \"writes the prompt\" (orange), \"Claude Code\" (black)."),
 9: ("photo", "A tidy toolbox open on a workbench with a few clean tools laid out in a row, warm workshop light, mountain cabin."),
 10: ("photo", "A hand closing a laptop lid halfway at a desk, then a second laptop open beside it, evening light, screens blurred."),
 11: ("sketch", "Core idea: a skill is a checklist someone wrote; know who wrote it. Composition: Xiaohei hands a clipboard checklist to a box-shaped assistant with dot eyes; a tiny name tag is clipped to the checklist. Labels: \"skill\" (black, on the checklist), \"author\" (blue, on the name tag), \"know who wrote it\" (red)."),
 12: ("photo", "An open front door of a mountain home at golden hour, warm light spilling out, a hand on the door handle, welcoming but deliberate."),
 13: ("sketch", "Core idea: guard your API key like a house key. Composition: Xiaohei hides a big house key behind its back while a video camera on a tripod points at it. Labels: \"API key\" (black, on the key), \"never on camera\" (red), \"sign in with browser\" (blue)."),
 14: ("photo", "A single brass house key on a dark slate surface under a narrow beam of light, minimal and serious."),
 15: ("photo", "A finished timber-frame ground floor of a mountain home at sunrise, solid deck and posts, clean and ready for the next level."),
}

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
 ('LK5', 2): 'Forty homes a day. <em>Be the one worth reading.</em>',
 ('LK5', 5): 'Compare the homes. <em>Never the people.</em>',
 ('LK5', 8): 'Find the real concern. <em>Answer it honestly.</em>',
 ('LK4', 2): 'Worth, how, and cost. <em>Not forty slides about you.</em>',
 ('LK4', 5): 'Their own house, already marketed. <em>Before they sign.</em>',
 ('LK4', 8): 'Sellers aren\'t lost on price. <em>They\'re lost on silence.</em>',
 ('LK3', 2): 'A language model <em>is not a database.</em>',
 ('LK3', 5): 'The tool doesn\'t know the street. <em>You do.</em>',
 ('LK3', 10): 'A comparative market analysis. <em>Never an appraisal.</em>',
 ('LK2', 2): 'The model reads the profile <em>before it writes a word.</em>',
 ('LK2', 6): 'It reads the whole profile. <em>That\'s how steering happens.</em>',
 ('LK2', 11): 'Sort on the answers. <em>Never a name or a zip code.</em>',
 ('LK1', 3): 'One rule for all of Part 2: <em>never paste these into any AI tool.</em>',
 ('LK1', 5): 'Every listing starts as a pile. <em>Most mistakes start there too.</em>',
 ('LK1', 8): 'Three sources, three numbers. <em>Find out on day one.</em>',
 ('LK1', 12): 'No line on the fact sheet? <em>The words come out.</em>',
 ('LMB', 2): 'The chat writes the prompt. <em>The tool makes the thing.</em>',
 ('LMB', 5): 'Miss the facts and it makes things up. <em>Miss the rules, it wanders.</em>',
 ('LMB', 6): 'The more it can see, <em>the less it has to guess.</em>',
 ('LMB', 9): 'Next time you\'re not writing a prompt. <em>You\'re filling in blanks.</em>',
 ('LM7', 2): 'Search takes months. <em>But it compounds.</em>',
 ('LM7', 4): 'A steady trickle of reviews <em>beats a pile in one week.</em>',
 ('LM7', 6): 'Claude drafts. <em>You rewrite it with what only you know.</em>',
 ('LM7', 8): 'Five real pages <em>beat fifty hollow ones.</em>',
 ('LM7', 10): 'Answer first. Real numbers. <em>Name your sources.</em>',
 ('LM6', 2): 'Posted constantly. No system. <em>The dog did best.</em>',
 ('LM6', 3): 'That isn\'t a social media manager. <em>It\'s a vending machine.</em>',
 ('LM6', 5): 'The tools have taste. <em>They just don\'t have yours.</em>',
 ('LM6', 8): 'Sounds wrong? <em>Add a line to the file.</em>',
 ('LM6', 9): 'Never a blank screen. <em>Which bucket are you short on?</em>',
 ('LM6', 10): 'Lifestyle isn\'t the throwaway pillar. <em>It did the work.</em>',
 ('LM6', 13): 'Same thought. <em>Three shapes, three audiences.</em>',
 ('LM5', 3): 'A cinematic walkthrough &mdash; <em>not a 3D tour.</em>',
 ('LM5', 7): 'The best shot of each room. <em>The rest gets thrown out.</em>',
 ('LM5', 10): 'Your listings. <em>Photos you\'re licensed to use.</em>',
 ('LM4', 2): 'It isn\'t only the money. <em>It\'s the waiting.</em>',
 ('LM4', 4): 'The tool amplifies what you give it. <em>It does not rescue it.</em>',
 ('LM4', 7): 'Two pictures in. <em>One expert prompt out.</em>',
 ('LM4', 13): 'These models invent detail. <em>Watch every clip before you post.</em>',
 ('LM3', 3): 'One makes the video. One runs the numbers. <em>Three make it look like a firm made it.</em>',
 ('LM3', 4): 'Taste fixes what you can feel <em>but can\'t name.</em>',
 ('LM3', 7): 'Build it once. <em>Reuse it forever.</em>',
 ('LM3', 10): 'If it isn\'t in what you gave it, <em>it doesn\'t go in front of a client.</em>',
 ('LM2', 3): 'Everything we build happens in <em>Claude Code.</em>',
 ('LM2', 7): 'Wrong language, wrong window. <em>Nothing is broken.</em>',
 ('LM2', 8): 'Have the chat write the prompt. <em>Paste it where the work happens.</em>',
 ('LM2', 11): 'Know who wrote <em>what you install.</em>',
 ('LM2', 13): 'Treat it like <em>the key to your house.</em>',
 ('LM1', 3): '$400&ndash;$950 to make <em>one</em> listing look premium. <em>Then again.</em>',
 ('LM1', 4): 'Built from what you already have. <em>For pennies.</em>',
 ('LM1', 9): 'A cinematic video &mdash; <em>not a 3D tour.</em>',
 ('LM1', 12): 'From here: <em>AiRE</em>, your AI instructor.',
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
