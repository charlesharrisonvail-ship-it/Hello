# AiRE campaign kit — November 2026

Drafts only. Nothing here has been sent or posted. AiRE Estate rules apply: sign
emails **AiRE Estate Academy**, label AI as AI, keep Epique/EpiVail out, and keep
every number sourced. Check the "Do not contact" list in `CLAUDE.md` before any send.

Built from ChatGPT's marketing review (Nov 3, 2026), with its competitor numbers
re-checked against each provider's page the same day. Two corrections from that
check: RRC's $250 price is for **CRS Designees**, not RRC members; eCornell's $449
workshops are **general AI**, not real-estate-specific.

---

## 1. Brokerage meetings (start here)

**Offer:** a 15-minute "Bring One Listing Photo" demo at an existing sales meeting.
Close with the team offer already on the site: **$599 for up to 10 agents**, with a
private 90-minute workshop and a brokerage brand file ($59.90 per agent at ten seats).

**First test:** five personal invitations, two demos. After each demo, write down
the first objection raised: software cost, setup difficulty, accuracy, or "will
agents actually use it?" The most common one becomes the next reel.

### Invitation email (draft)

> **Subject:** 15 minutes at your next sales meeting: one listing photo, one finished video
>
> Hi [Name],
>
> Could I have 15 minutes at an upcoming sales meeting? Have one agent bring a
> listing photo they own. In front of the room, I'll turn it into a short
> AI-generated clip, labeled as AI. I'll also show the frame we'd throw out
> because it changed a detail of the house. That check is the part agents need
> to learn.
>
> No pitch during the demo. Afterward, if your agents want the course, there's a
> team option: up to ten agents for $599, with a private 90-minute workshop and a
> brand file built for your brokerage.
>
> Would [two dates] work?
>
> AiRE Estate Academy
> hello@aireestate.com

(If you send it from your own address to brokers you know personally, change the
sign-off as you see fit. The public site still never names you.)

---

## 2. LinkedIn and YouTube: two short demonstrations

Each video links to its own course page with its own tracking link (section 4).

### Demo A — "One listing photo" (60–90 s) → Listing Media, $67
1. **Hook (0–3 s):** "Before you spend hundreds on an AI course, watch what you can make with one listing photo."
2. Show the original photo.
3. Show the AI clip, labeled **Made with AI**.
4. Show the rejected frame: "This one added a window. It doesn't go out."
5. Show the corrected clip.
6. Show the same listing as a room-by-room showcase and a month of draft posts.
7. **Close:** "Listing Media Without the Invoice. $67 once. Claude Pro and video credits are separate."

*Needs from Charles:* a listing photo you have the rights to (and permission to
show), so the demo uses a real property instead of the Paris practice photo.

### Demo B — "What happened with my house this week?" (60 s) → Build Your AI Assistant, $97
1. **Hook:** A seller's text on screen: "What happened with my house this week?"
2. Friday's notes: showings, open house sign-ins, views, agent feedback.
3. The assistant's draft appears in the agent's voice.
4. It flags what it won't answer: the price question, an unsourced school claim, a missing HOA fee.
5. The agent types the one line it leaves blank, then sends.
6. **Close:** "Build Your AI Assistant. $97. It drafts; you decide and send. Works on a free Claude account."

Use the course's fictional Juniper Lane practice data and say on screen that it's fictional.

---

## 3. Campaign copy

**Listing media (new prospects):**
> **Before you spend hundreds on an AI course, watch what you can make with one listing photo.**
>
> See the original photo, the AI-generated clip, and the detail we caught before
> it went public. Then see the same listing become a room-by-room showcase and a
> month of draft social posts.
>
> **Listing Media Without the Invoice. $67 once.** Claude Pro and video credits are separate.

**For agents who already took an AI class:**
> **Already took an AI class? Bring one listing photo. Let's put what you learned to work.**

**Seller updates:**
> **Build the assistant that drafts your Friday seller update.** In your voice,
> from your notes. It drafts; you decide and send. $97, and it works on a free Claude account.

---

## 4. Tracking links

One link per channel and course. The UTM tags show up in any analytics you add
later. The reliable count is the checkout question in section 5.

| Use | Link |
|---|---|
| LinkedIn, Demo A | https://learn.aireestate.com/?utm_source=linkedin&utm_medium=video&utm_campaign=one-photo#courses |
| YouTube, Demo A | https://learn.aireestate.com/?utm_source=youtube&utm_medium=video&utm_campaign=one-photo#courses |
| LinkedIn, Demo B | https://learn.aireestate.com/build-your-ai-assistant.html?utm_source=linkedin&utm_medium=video&utm_campaign=friday-update |
| YouTube, Demo B | https://learn.aireestate.com/build-your-ai-assistant.html?utm_source=youtube&utm_medium=video&utm_campaign=friday-update |
| Brokerage follow-up email | https://learn.aireestate.com/?utm_source=brokerage&utm_medium=email&utm_campaign=bring-one-photo#pricing |
| Comparison guide | https://learn.aireestate.com/guides/ai-courses-for-real-estate-agents-compared.html |
| Cost guide | https://learn.aireestate.com/guides/what-does-an-ai-listing-video-cost.html |

---

## 5. "How did you find us?" at checkout (Charles, in Stripe)

For each of the four Payment Links: Stripe → **Payment Links** → the link →
**Edit** → **Add custom field** → **Dropdown**, labeled "How did you find us?"

Options: Brokerage meeting · LinkedIn · YouTube · Search / Google ·
ChatGPT or another AI assistant · Facebook · A friend or colleague · Other.

Save. Answers then appear on each payment in Stripe.

---

## What to measure

| Channel | Measure |
|---|---|
| Brokerage meetings | Invitations sent, demos held, team packages sold |
| LinkedIn / YouTube | Course-page visits and purchases per demo |
| Search and AI assistants | Checkout answers "Search" and "ChatGPT or another AI assistant" |
