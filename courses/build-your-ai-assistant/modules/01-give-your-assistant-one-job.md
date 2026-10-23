# Module 1 — Give Your Assistant One Job

**Course:** Build Your AI Assistant · **Status:** draft manuscript · **Video:** not yet recorded

## 1. Learning objective and required inputs

**By the end of this module you can** choose one recurring task, define its inputs, its
output and its boundaries, and write acceptance criteria that someone else could check.

**You need:**
- About 30 minutes.
- The Assistant Job Card (`resources/assistant-job-card.md`).
- The fictional practice data (`resources/seller-update-practice-data.md`).
- A list of three things you do every week that involve writing.

## 2. Narrated lesson script

*Narrator: Charles's AI avatar, using his own approved avatar and voice. Inside the course only; never on the public site. Target read time about 6 minutes; actual runtime is measured after recording.*

Hi, I'm Charles. Quick note before we start: you're watching an AI avatar of me, made
from my own photo and my own cloned voice. And everything the assistant makes in these
lessons is a draft that a licensed human reviews.

Let's begin with the single most common reason AI assistants disappoint agents. It
isn't the software. It's the job description.

Here's what most people type the first time: "You're my assistant. Help me run my real
estate business." And the AI says, "Absolutely! I can help with marketing, lead
generation, client communication, scheduling..." It sounds wonderful. Then you ask for
something specific, and you get something generic. Because "run my business" isn't a
job. It's forty jobs, and the assistant has to guess which one you mean, what
information to use, and what a good answer looks like. When AI guesses, it fills gaps
with plausible-sounding text. In real estate, plausible-sounding text is how a wrong
square footage ends up in a seller's inbox.

So in this course we give an assistant one job. One job, with clear inputs, a clear
output, and clear edges.

The job we'll build together is the weekly seller update. You know the one. It's Friday,
you have three or four active listings, and every seller wants to hear what happened.
Showings, open house traffic, what buyers said, what's next. It's important, it's
repetitive, and it follows a pattern. That makes it a perfect first assistant.

Let's define it the way you'd define a job for a new hire. Four questions.

First: what goes in? For a seller update, the inputs are your approved listing facts,
this week's showing activity, the feedback you received, and the seller's own questions.
Notice what's *not* on that list: the internet, the AI's general knowledge, or a guess
about the market. If it's not in the inputs, it's not in the update.

Second: what comes out? A draft email to the seller, short enough to read on a phone,
plus a checklist for you showing every fact it used and anything that needs your
decision. Two parts. The second part is the one that keeps you out of trouble.

Third: what does a good one look like? This is where most people stop at "it should
sound good." Let's do better. Write checks a stranger could apply. Every number in the
draft matches the showing log. Nothing about pricing strategy. Missing facts are
flagged, not filled in. Under two hundred and twenty words. If you can check it, you can
trust it. If you can't check it, you're trusting the AI's tone, and tone is the thing
AI is best at faking.

Fourth: where does the job end? This assistant drafts. It does not send. It doesn't
recommend a price drop, interpret the listing agreement, or reassure a seller that the
house will sell by Thanksgiving. When those questions come up, and they will, the
assistant's job is to put them on your desk with a label: agent decision.

Let me show you why that boundary matters, using our first practice property. It's
fictional: 1418 Juniper Lane, in the made-up town of Willow Fork. The sellers, Dana and
Luis, sent an email this week. They ask three things. Should they be worried that a
house down the street went pending in four days? Can you tell people the school is the
best in the district? And should they drop the price?

Now look at what we actually have in the file. We have showing counts, open house
sign-ins, online views and three pieces of feedback. We don't have any data on the
house down the street. We don't have a school ranking, and school-quality claims are a
fair-housing and accuracy problem anyway. And the price question is a professional
judgment that belongs to you and your sellers.

A good assistant organizes what's supplied and flags what isn't. It writes, "Five
showings were completed and fourteen groups came through Sunday's open house," because
that's in the log. It does not write, "The market is moving fast, so a small price
adjustment could help," because that's a market conclusion nobody supplied. That's the
difference this whole course is built on: organizing supplied facts versus inventing a
conclusion. One is an assistant. The other is a liability with good grammar.

So here's your exercise. Pick one task you repeat every week. Seller updates are the
default, and the practice data is built for it. If you choose something else, keep it
the same size: one input set, one output, one reader. Fill in the Job Card. Write the
one-sentence job. List the inputs and where each comes from. Describe the output. Then
write at least three acceptance criteria you could hand to someone else to check.

When you're done, read your one sentence out loud. If it contains the word "and" more
than once, you probably have two jobs. Split them, and build the first one first.

Next module, we teach the assistant to sound like you, without letting your voice
change the facts.

## 3. Screen demonstration shot list

| # | Script cue | On screen | Notes |
| --- | --- | --- | --- |
| 1 | "Hi, I'm Charles" | Charles's AI avatar, master look | "Made with AI" label for the whole video |
| 2 | "run my business" | Claude chat: type the broad prompt, show the generic reply | Use a fresh chat; fictional context only |
| 3 | "forty jobs" | Animated list of tasks splitting out of "run my business" | Motion graphic, 5 s |
| 4 | "weekly seller update" | Calendar graphic: Friday, three listing cards | |
| 5 | "Four questions" | Job Card template, sections 1–6 highlighted in turn | Zoom to each heading |
| 6 | "1418 Juniper Lane" | Practice data page, Property A, scroll slowly | Watermark "Fictional practice data" |
| 7 | "Dana and Luis" | Seller email excerpt, three questions highlighted | |
| 8 | "what we actually have" | Side-by-side: seller questions vs. file contents; gaps marked MISSING | |
| 9 | "organizes vs. invents" | Two sentences on screen; one green check, one red X | |
| 10 | Exercise | Blank Job Card, cursor filling the one-sentence job | |
| 11 | "and more than once" | The sentence with two "and"s highlighted, split into two cards | |

## 4. Written walkthrough

No software settings are needed for this module. You can do it on paper, in a document,
or in a Claude chat.

1. Open `assistant-job-card.md` and save a copy named with your assistant's name.
2. Write the one-sentence job in section 1. Use the pattern "turns ___ into ___ for ___."
3. In section 2, write how often you'll run it and roughly how many items each time.
4. In section 3, list every input. For each, write where it comes from (a file, an
   export, your notes) and whether it's required.
5. In section 4, describe the output: format, reader, length, must-include, must-never-include.
6. In section 5, write three to five acceptance criteria. Test each by asking: could a
   colleague check this without asking me what I meant?
7. In section 6, keep the default boundaries ("does not send," "no pricing advice,"
   "no legal interpretation") and add any of your own.
8. In section 7, list situations that must come back to you.
9. Optional: paste your finished card into a Claude chat with the prompt below and
   ask it to find gaps. Edit the card yourself; don't accept changes blindly.

## 5. Copy-ready prompt

```
Below is a job card for an AI assistant I'm building. Don't rewrite it. Review it
and list, in order of importance:
1. Any input that the output depends on but the card doesn't list.
2. Any acceptance criterion that a stranger couldn't check objectively.
3. Any situation where the assistant might need to make a judgment that should
   belong to me (pricing, legal, strategy) but the card doesn't say so.
4. Whether this is really one job. If it's two, say where to split it.
Keep your answer under 200 words.

[PASTE YOUR JOB CARD]
```

## 6. Practice exercise (fictional inputs)

Using Property A (1418 Juniper Lane) from the practice data:

1. Write the one-sentence job for a weekly seller-update assistant.
2. List the four required inputs and the two optional ones, with sources.
3. Write four acceptance criteria.
4. For each of the sellers' three questions, decide: can the assistant answer it from
   the inputs, or must it be flagged? Write the flag text you'd want to see.

## 7. Worked example — and why it meets the criteria

**One-sentence job:** "This assistant turns my approved listing facts and weekly
showing export into a draft weekly seller update, plus a review checklist, for each
active listing."

**Inputs:** listing facts (listing file; required), this week's showing export (showing
service; required), feedback notes (showing service; required), seller's latest
message (email; optional), my notes for this week (optional).

**Acceptance criteria:**
1. Every number in the draft appears in the showing export or listing facts.
2. Feedback is paraphrased with no buyer or agent names.
3. Questions the inputs can't answer are listed as MISSING or AGENT DECISION.
4. The draft is under 220 words and has a greeting, this week, feedback, next steps.

**Seller questions:**
- Pending house down the street → not answerable from inputs. *Flag: "MISSING: no data
  on the nearby sale. AGENT DECISION: whether to share a market update."*
- School claim → not supported, and school-quality claims raise fair-housing and
  accuracy concerns. *Flag: "AGENT DECISION: seller asked to advertise a school claim;
  no source; recommend declining."*
- Price drop → professional judgment. *Flag: "AGENT DECISION: seller asks about a price
  reduction."*

**Why it meets the criteria:** the job is one sentence with one output. Each criterion
can be checked by someone who has the files. And every question that requires judgment
is routed to the agent rather than answered by the assistant.

## 8. Troubleshooting and completion checklist

**"My task is too small to bother."** Small, repeated tasks are the best first
assistants. You'll check the output faster and see mistakes sooner.

**"My criteria all say 'sounds professional.'"** Replace each with something
observable: a word limit, a required section, a fact that must match a source.

**"I want it to do the whole listing process."** Build the update first. Module 7 shows
how to reuse the pattern for the next job.

**Completion checklist**
- [ ] One-sentence job written, with no more than one "and."
- [ ] Every required input has a named source.
- [ ] At least three checkable acceptance criteria.
- [ ] Boundaries include "does not send" and "no pricing advice."
- [ ] Practice exercise questions answered for Property A.

## 9. Module check

Proposed pass: 5 of 7. Wrong answers show the explanation; you can retry.

### Q1. Why does "help me run my real estate business" usually produce generic results?
- A) The AI doesn't know about real estate.
- B) It's many jobs at once, so the AI has to guess the task, the inputs and what good looks like.
- C) The prompt is too short; longer prompts always work better.
- D) AI assistants can only do one task per account.
**Answer:** B — A broad role forces the model to guess. Length alone doesn't fix it, and the model does know general real estate concepts. The fix is a defined job.

### Q2. Which is the best one-sentence job for a first assistant?
- A) "Handle all my seller communication."
- B) "Be my marketing department."
- C) "Turn my listing facts and weekly showing export into a draft weekly seller update with a review checklist."
- D) "Answer any question a seller asks."
**Answer:** C — It names the inputs, the output and the reader. The others are open-ended roles.

### Q3. A seller asks, "Should we drop the price?" What should the seller-update assistant do?
- A) Recommend a 3% reduction based on typical market behavior.
- B) Say prices are falling everywhere.
- C) Flag it as an agent decision and say the agent will follow up.
- D) Ignore the question.
**Answer:** C — Pricing is a professional judgment for the agent and seller. Ignoring it fails the seller; answering it invents a market conclusion.

### Q4. Which acceptance criterion can someone else actually check?
- A) "The update sounds professional."
- B) "Every number in the draft appears in the showing export or listing facts."
- C) "The seller will feel reassured."
- D) "It's high quality."
**Answer:** B — It's observable against the files. The others depend on taste or on predicting a reaction.

### Q5. The showing log lists five completed showings. The assistant writes "strong buyer interest this week." What's the problem?
- A) Nothing; it's a fair summary.
- B) It's a conclusion not supplied in the inputs; the draft should report the facts (five showings) instead.
- C) It should have said "very strong."
- D) Showing counts should never be shared with sellers.
**Answer:** B — "Strong interest" is an interpretation. Report the supplied numbers and let the agent add judgment.

### Q6. Your one-sentence job reads, "Draft seller updates and buyer comparisons and listing descriptions." What should you do?
- A) Keep it; more jobs means more value.
- B) Split it and build the seller update first.
- C) Remove the inputs section so it's flexible.
- D) Add "and anything else" for completeness.
**Answer:** B — Three outputs means three jobs. Build and test one before adding the next.

### Q7. Which boundary belongs on every Job Card in this course?
- A) "Only works on weekdays."
- B) "Does not send, post or contact anyone; returns a draft."
- C) "Must use at least 300 words."
- D) "Can update the CRM automatically."
**Answer:** B — The assistant drafts; you review and send. That rule runs through the whole course.
