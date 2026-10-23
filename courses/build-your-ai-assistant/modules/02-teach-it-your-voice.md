# Module 2 — Teach It Your Voice

**Course:** Build Your AI Assistant · **Status:** draft manuscript · **Video:** not yet recorded

## 1. Learning objective and required inputs

**By the end of this module you can** write a Brand and Voice Profile that makes drafts
sound like you, and explain why voice never overrides factual accuracy.

**You need:**
- Your Assistant Job Card from Module 1.
- The Agent Voice Profile template (`resources/agent-voice-profile.md`).
- If you took Listing Media Without the Invoice: your Agent Brand File.
- Three short messages you wrote to clients, with names, addresses, phone numbers and
  prices removed or replaced.
- A Claude chat (free or paid account).

## 2. Narrated lesson script

*Narrator: Charles's AI avatar, using his own approved avatar and voice. Inside the course only; never on the public site. Target read time about 6–7 minutes.*

Here's a test you can run right now. Ask any AI to write a seller update, and read the
first line. I'll bet it says something like, "I hope this message finds you well!" and
the second line says, "I wanted to take a moment to provide you with an update." Your
sellers have read that sentence a thousand times. It doesn't sound like you. It sounds
like everyone.

AI writes in an average voice because, without instructions, average is the safest
guess. This module replaces the guess with a profile.

If you took our first course, you already built an Agent Brand File. We're not
replacing it; we're extending it. The Brand File told the AI who you are and who you
serve. The Voice Profile adds how you actually write: sentence length, the greeting you
really use, the sign-off you really use, the phrases you say all the time, and the
phrases you'd never be caught dead using.

Let's walk through the profile.

Start with your reader. For seller updates, that might be "busy sellers, mostly forty to
seventy, reading on a phone between other things." That one line changes a lot. It
tells the AI to lead with what happened, keep paragraphs short, and skip the throat
clearing.

Next, three words for your tone. Calm, direct, warm. Or crisp, upbeat, practical.
Three words aren't enough on their own, though. "Friendly" means something different to
everyone. That's why the next sections matter more.

Sentence style. Do you write short sentences? Do you use contractions? Bullets or
paragraphs? What's the greeting you actually type? "Hi Dana and Luis," or "Good
afternoon, Dana"? What's your real sign-off? Write the real ones, not the ones you think
sound professional.

Then the two lists. Phrases you use, and phrases you never use. The "never" list is
where you protect yourself. Put the hype words there: "hot market," "won't last,"
"act now." Put the promises there: "guaranteed," "will sell," anything about timing or
price you can't control. An assistant that sounds exactly like you but promises a
sale by Thanksgiving is worse than a generic one.

Which brings us to the most important section of the whole profile. It's called "rules
that beat voice." Here they are. Facts come only from the supplied sources; voice never
adds a fact. Missing facts stay missing. No language about protected classes, school
quality claims or what kind of people live in a neighborhood. No promises about price,
timing or results. If your voice and these rules ever disagree, the rules win. Every
time.

Why spell that out? Because voice instructions can quietly push a model toward
invention. Tell an AI to be "warm and reassuring" and give it a worried seller, and it
will reach for reassurance. If the facts don't contain any, it may manufacture some:
"Buyers are really responding to your home!" Nobody said that. The voice made it up.
So the profile says, in writing, that reassurance comes from real numbers and real next
steps, not from adjectives.

Last, your samples. Three short messages you wrote yourself, sanitized: no names,
addresses, phone numbers or prices. Replace them with placeholders like [SELLER] and
[ADDRESS]. Samples teach rhythm better than any description. But notice they're labeled
as style samples. If a sample says "four showings," that number is not a fact about
this week's listing. The profile says so.

Now let me show you the difference. Here's the same update twice, using Property B from
the practice data, 77 Copper Bend Road. Margaret, the seller, is anxious: week three
felt quiet, and her sister says she should switch agents.

The generic version opens with "I hope this message finds you well," calls the week
"productive," and closes with "rest assured we are doing everything we can." Nice
words. Not one of them is information.

The profiled version opens with "Hi Margaret," then says: three showings this week,
online views were four hundred and ten, down from six hundred and fifty-five the week
before, and two agents gave feedback: buyers liked the updates and some were concerned
about road noise. One buyer's agent mentioned they may write something, and there's no
written offer yet. Then it says what happens next, and offers a call. It's calm because
it's specific. That's the voice working with the facts, not instead of them.

Your exercise: fill in the profile, add your three sanitized samples, then ask Claude to
draft a short voice guide from your samples using the prompt in this lesson. Edit what
it gives you. The AI's summary of your voice is a first draft; you're the authority on
how you sound. Finally, run the before-and-after test on Property B and see if a
colleague could tell which one you wrote.

Next module: giving your assistant reliable reference material, and teaching it what to
do when a fact isn't there.

## 3. Screen demonstration shot list

| # | Script cue | On screen | Notes |
| --- | --- | --- | --- |
| 1 | "I hope this message finds you well" | Generic AI draft, first line highlighted | Fresh chat |
| 2 | "extending the Brand File" | Brand File and Voice Profile side by side | Only show the template, not a real agent's file |
| 3 | Walkthrough of sections | Voice Profile template, sections 1–5 | Zoom each heading |
| 4 | "rules that beat voice" | Section 6, highlighted in a box | Hold 3 s |
| 5 | "warm and reassuring" | Draft containing "Buyers are really responding!" with red underline | Label "not in the inputs" |
| 6 | Samples | Sanitized sample with [SELLER], [ADDRESS] placeholders | |
| 7 | Before/after | Split screen: generic vs. profiled update for 77 Copper Bend | Fictional data watermark |
| 8 | Numbers | Highlight each number in the profiled draft, link line to the showing log | |
| 9 | Exercise | The voice-guide prompt pasted into Claude | |

## 4. Written walkthrough

Checked October 23, 2026. Any Claude plan works for this module.

1. Copy `agent-voice-profile.md` and fill in sections 1–5 from your own habits. Use real
   greetings and sign-offs.
2. Keep section 6, "Rules that beat voice," as written. Add rules, don't remove them.
3. Choose three messages you wrote. Remove or replace names, addresses, phone numbers,
   emails, prices and anything about a client's personal situation. Paste them into
   section 7.
4. Open a new chat at claude.ai. Paste the prompt below, followed by your three samples.
5. Read the voice guide Claude returns. Delete anything that isn't true about you. Add
   what it missed. Copy the result into your profile under sections 3–5.
6. Run the before-and-after test (exercise below) and save both drafts in your notes.

## 5. Copy-ready prompt

```
I'm a real estate agent. Below are three short messages I wrote, with personal details
removed. Treat them as style samples only: they are not facts about any current listing.

Describe my writing voice in under 150 words, covering:
- typical sentence length and structure
- greeting and sign-off patterns
- words or phrases I repeat
- what I never seem to do (e.g., exclamation marks, jargon)

Then list five specific instructions an assistant could follow to write like me.
Do not include any instruction that would add facts, claims or promises.

Sample 1:
[PASTE]

Sample 2:
[PASTE]

Sample 3:
[PASTE]
```

## 6. Practice exercise (fictional inputs)

Using Property B (77 Copper Bend Road):

1. In a new chat, paste only the listing facts and this week's activity, and ask for "a
   weekly update to the seller." Save the result as the **before** draft.
2. In another new chat, paste your Voice Profile, then the same facts and activity, plus
   Margaret's text, and ask for the update. Save it as the **after** draft.
3. Mark every number in both drafts. Does each one appear in the practice data?
4. Mark every sentence of reassurance. Is it backed by a fact or a next step?

## 7. Worked example — and why it meets the criteria

**After draft (example, fictional agent "Sam Reyes"):**

> Hi Margaret,
>
> Here's your week at 77 Copper Bend (Oct. 10–16).
>
> Three showings were completed. Online views were 410, down from 655 the week before.
> Two agents sent feedback: buyers liked the kitchen and window updates, and some
> mentioned road noise. One buyer's agent said their clients may write something. There's
> no written offer yet, and I'll let you know the moment that changes.
>
> I know week three can feel quiet. I'd like to walk you through what I'm seeing and our
> options for the next two weeks. Do you have 15 minutes Monday or Tuesday?
>
> Talk soon,
> Sam

**Review checklist (excerpt):** Facts used: 3 showings, 410 views, 655 prior week,
feedback ×2, verbal interest (showing log Oct. 16). AGENT DECISION: seller asked "is
anything happening" and mentioned switching agents; call recommended. MISSING: reason
for the drop in views (not in inputs; not stated).

**Why it meets the criteria:** every number traces to the practice data. The verbal
interest is described accurately as not an offer. Reassurance comes from specifics and
an offered call, not from claims. The voice (short sentences, "Hi," "Talk soon") comes
from the profile, and the "rules that beat voice" kept it from guessing why views fell.

## 8. Troubleshooting and completion checklist

**The AI's voice summary flatters me.** Delete adjectives that don't help a stranger
write like you. Keep observable habits.

**My samples contain client details.** Replace them before pasting. If you can't
sanitize a sample, pick a different one.

**The after draft still says "I hope this finds you well."** Add it to your "never"
list explicitly.

**Completion checklist**
- [ ] Profile sections 1–5 filled with your real habits.
- [ ] Section 6 rules kept intact.
- [ ] Three sanitized samples added.
- [ ] AI voice guide reviewed and edited by you.
- [ ] Before/after test run on Property B; every number checked.

## 9. Module check

### Q1. Why does AI default to a generic voice?
- A) It's been told to sound like a bank.
- B) Without instructions, an average voice is its safest guess.
- C) It can't learn from examples.
- D) Real estate language is restricted.
**Answer:** B — Average is the default. Specific instructions and samples replace the guess.

### Q2. What's the relationship between the Voice Profile and the Agent Brand File from the first course?
- A) The Voice Profile replaces it entirely.
- B) The Voice Profile extends it with how you actually write.
- C) They must never be used together.
- D) The Brand File is only for video.
**Answer:** B — Keep the Brand File's who-you-serve material and add sentence style, phrases and samples.

### Q3. Your profile says "warm and reassuring." The seller is anxious and the facts are thin. What should the draft do?
- A) Add "buyers are really responding" to reassure her.
- B) Reassure with real numbers and a concrete next step, such as offering a call.
- C) Skip the facts and focus on feelings.
- D) Promise an offer within two weeks.
**Answer:** B — Reassurance must come from facts and next steps. Invented enthusiasm is a fabricated fact.

### Q4. Which belongs on the "never use" list?
- A) "Here's your week."
- B) "Guaranteed to sell."
- C) "Talk soon."
- D) The seller's first name.
**Answer:** B — Promises about outcomes don't belong in any update.

### Q5. A style sample you pasted says "four showings this week." What should the assistant do with that number?
- A) Use it in this week's update.
- B) Average it with the current showing count.
- C) Ignore it as a fact; samples teach style, not data.
- D) Ask the seller to confirm it.
**Answer:** C — Samples are labeled as style only. Facts come from this week's sources.

### Q6. Which sample is properly sanitized?
- A) "Hi Dana, 1418 Juniper had 5 showings, call me at 555-0142."
- B) "Hi [SELLER], [ADDRESS] had [N] showings this week. Call me anytime."
- C) A screenshot of a real client thread.
- D) A forwarded email with the signature block.
**Answer:** B — Names, addresses, numbers and contact details are replaced with placeholders.

### Q7. If your voice instructions and the "rules that beat voice" conflict, which wins?
- A) Voice, because it's more specific.
- B) Whichever appears later in the instructions.
- C) The rules: facts, missing-fact flags, fair-housing limits and no promises.
- D) Neither; the AI chooses.
**Answer:** C — Voice controls how it sounds. It never overrides what is true or what's allowed.
