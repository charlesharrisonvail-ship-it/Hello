# Super Chiefs: one AI team per business

Drafted 2026-11-23 at Charles's request ("I need recruits, leads, and traffic...
keep them separate, each pumping and learning and evolving as super chiefs of
staff"). Built from the "Build a Full Team of AI Agents" prompt, with the intake
answered from memory instead of asking Charles again.

**This repo is public.** Nothing here names a lead, a client or a private pitch.
Scoreboards hold counts and patterns only.

---

## 1. The shape

Three teams that never share a writer, a voice or a signature. Each team has
**one chief**, the only agent Charles talks to for that business. The chief
hands work to its own specialists, checks it, and brings back drafts for his
"go".

| Business | Chief | Specialists | Pumps |
|---|---|---|---|
| **EpiVail** (Epique Realty Colorado Mountain Region) | `epivail-chief` | `lead-enrichment`, `lofty-crm`, `recruitment-outreach`, `linkedin-content` (all existing) | **Recruits** first, LinkedIn traffic second |
| **AiRE Estate** (learn.aireestate.com) | `aire-chief` | `aire-content` (new) | **Traffic** to the site, then course **leads/sales** |
| **Harrison Development** (harrisondev.org) | `hd-chief` | `hd-prospector` (new) | Developer/landowner **leads**, then site **traffic** |

The existing `/gm` Chief of Staff stays the morning briefing across Charles's
day. The three chiefs do the business work. `/gm` can point at them; it never
writes for them.

### The brand wall (what keeps them apart)

| | EpiVail | AiRE Estate | Harrison Development |
|---|---|---|---|
| Sign-off | `Charles Harrison, Epique Area/Growth Leader` | `AiRE Estate Academy` | Owner, Harrison Development / Area Leader, Epique Realty Colorado block |
| Charles's name | Front and center | **Never fronted** ("Made for agents, by agents") | Front and center |
| Voice | Courteous, warm, Southern manners | Plain, numbers first, no hype, label AI as AI | Strength, never desperate; lead with what he brings |
| Audience | Real estate agents (recruits) | Agents who want to use AI | Developers, builders, landowners |
| Never | "Epique Mountain Collective" | Mention Epique or EpiVail | Link to Epique/EpiVail (except the three footer links) |

Each chief refuses work for the other two and names the right chief instead.
If a request could belong to more than one, the chief asks "which business?"
before writing a word.

---

## 2. First job for each (what saves the most this month)

**EpiVail: fill the recruit pipeline from zero.** Charles has no recruits yet (2026-11-23), so `recruit-scout` builds the list from his FlexMLS closed sales (933 residential closings in Eagle County alone in 12 months, every one naming the agents). Then: The 4:40 AM follow-up task already
exists but has drafted nothing since October: Lofty has no `agent-recruit` tag,
so it finds no recruits. One tagging session turns on a machine that is
already built. LinkedIn content can wait a week; it already has an agent.

**AiRE Estate: post to measure, not just post.** The Mon/Wed/Fri Facebook queue
runs, but nobody reads the results. The first job is a weekly read of the
page's post insights and a "make more of what worked" note. Support replies
can wait; volume is low.

**Harrison Development: keep the pitch pipeline full.** Three pitches are out
and one closed. The first job is a standing list of Colorado mountain projects
in planning (county agendas) and a dated follow-up for every pitch. Site
traffic waits until the pipeline has more names.

---

## 3. Who does what

### EpiVail team
| Agent | One job | Never does | Input → Output | Hands to |
|---|---|---|---|---|
| `epivail-chief` | Run the recruit + LinkedIn engine, report the scoreboard | Sends, posts, writes to Lofty unasked, touches AiRE/HD | Charles's ask / weekly review → plan, drafts, scoreboard | specialists, then Charles |
| `lead-enrichment` | Full contact card on one agent | Mass-enrich without a credit estimate | name/URL → card | `lofty-crm` |
| `lofty-crm` | Tag, tier, stage, dated next step | Delete contacts, contact Do-not-contact names | card → Lofty record + task | `recruitment-outreach` |
| `recruitment-outreach` | The message the task calls for | Send | record + task → draft | chief |
| `linkedin-content` | Posts and comment plans that reach agents | Post | scoreboard + topic → drafts | chief |

### AiRE Estate team
| Agent | One job | Never does | Input → Output | Hands to |
|---|---|---|---|---|
| `aire-chief` | Run traffic + sales, check every piece, report the scoreboard | Front Charles's name, change prices/legal, post without "go", touch EpiVail/HD | ask / insights → plan, checked drafts | `aire-content`, then Charles |
| `aire-content` | Posts, captions, image briefs, support reply drafts | Publish, give away the method, skip "(referral link)" | brief → drafts | chief (checker) |

### Harrison Development team
| Agent | One job | Never does | Input → Output | Hands to |
|---|---|---|---|---|
| `hd-chief` | Run the developer pipeline and site, report the scoreboard | Send, deploy, commit private pitches, contact closed/no-contact names | ask / review → plan, drafts | `hd-prospector`, then Charles |
| `hd-prospector` | Find and research projects in planning; draft first touch and follow-ups | Send, invent facts about a project | county/town sources → project brief + draft | chief |

---

## 4. Workflow (request to result)

1. Charles asks a chief (or the weekly review fires).
2. Chief names the business and the goal it serves (recruits / leads / traffic).
3. Chief reads its playbook (`.claude/teams/<team>/playbook.md`) for what has worked.
4. Specialist does the one job and returns a draft.
5. **Review point:** chief checks the draft against its brand-wall checklist.
   Fail → back to the specialist with the exact fix (max two loops, then show
   Charles both versions).
6. Chief assembles: one short summary, the drafts, and anything that needs his
   "go" listed at the top.
7. Charles approves; he sends or posts (or says "go" for the chief to post where
   a tool exists, e.g. AiRE's `post.py`).
8. Chief logs the result as a count on the scoreboard.

## 5. How each team learns (the "evolving" part)

Every Friday each chief runs a **weekly review**, about 10 minutes of Charles's
reading:

1. **Pull the numbers** (see scoreboard sources below) and write them in the playbook.
2. **Compare** to last week.
3. **Keep / kill / try:** one thing that worked (do more), one that didn't (stop),
   one small experiment for next week.
4. **Write one line to the playbook's "What we've learned"** with the evidence.
5. Propose next week's plan; Charles says go or changes it.

Lessons are patterns, never names ("first-touch DMs that mention a listing
got replies; generic ones didn't"). A lesson that holds for three weeks moves
up into the agent's own instructions, so the team gets better on its own.

| Team | North-star metric | Where the number comes from |
|---|---|---|
| EpiVail | Recruit conversations booked per week | Lofty (recruit stage + tasks); LinkedIn analytics export via `linkedin-optimizer` |
| AiRE Estate | Site visits from posts, and paid enrollments per week | Facebook page insights (Graph API, already connected); sales count from Charles (Stripe is not connected) |
| HD | Developer/landowner conversations opened per month | Pitches sent/replied (Gmail), inquiries at harrisondev.org/inbox (Charles reads), Cloudflare visit counts |

## 6. Tool stack (all free or already paid for)

- **Claude (this plan)**: the chiefs and specialists. Already paid.
- **Docs**: this repo (agents, playbooks). Free, versioned.
- **Spreadsheet**: the playbook scoreboards are Markdown tables. Move to Google Sheets only if Charles wants to edit them by hand.
- **Task manager**: Lofty tasks for EpiVail; `my-tasks.yaml` for AiRE and HD.
- **Chat channel**: this Claude app. Drafts come here; Gmail drafts for email.
- **Light automation**: cloud scheduled tasks (the 4:40 AM EpiVail run exists;
  add one Friday review per team). No new subscriptions. Apollo, Higgsfield and
  HeyGen spend credits: never without Charles's "go" and an estimate.

## 7. QA plan

**Review checkpoints:** every draft passes the chief's checklist before Charles sees it.

**Likely failure points:**
- Brand bleed: an EpiVail signature on AiRE, Charles's name on an AiRE card,
  the banned "Collective" phrase. *Guard:* the checklist in each chief.
- Contacting someone off-limits: Do-not-contact (`CLAUDE.md`), closed pitches
  and the skipped builder (HD memory). *Guard:* chief checks before any draft.
- Empty pipelines: the overnight task finding nothing (today's problem).
  *Guard:* the weekly review flags "0 drafts" as a red line, not a quiet week.
- Private data in this public repo. *Guard:* playbooks hold counts only.
- Gmail link rewriting on HD drafts. *Guard:* `harrisondev<span>.</span>org`, check raw.

**Manual tests before switching each team on:**
1. Ask the chief for a piece that belongs to another business. It must refuse
   and name the right chief.
2. Ask for one real draft. Check signature, voice, name rule and links by hand.
3. Ask it to "just send it". It must stop and ask.
4. Run the weekly review once with real numbers.

## 8. Rules (all teams)

Real, narrow scope. Evidence before big decisions. Charles approves before
anything is published, sent, deleted, deployed, enrolled or paid for. Never ask
for a password, key or secret. `CLAUDE.md` outranks every agent here.

## 9. Seven-day launch (one task a day)

| Day | Task |
|---|---|
| 1 | **EpiVail setup:** `recruit-scout` ranks Eagle County agents from MLS closed sales; Charles picks his top 10; they are enriched and tagged `agent-recruit` in Lofty with his OK. The 4:40 AM task starts drafting the next morning. |
| 2 | **EpiVail test:** read the first overnight drafts; fix the voice in the playbook. Run manual tests 1-3 on `epivail-chief`. |
| 3 | **AiRE setup + test:** `aire-chief` pulls the last 30 days of page insights, fills the first scoreboard, and drafts next week's three posts. Run manual tests 1-3. |
| 4 | **HD setup + test:** `hd-prospector` builds the first list of 5 projects in planning; `hd-chief` drafts the follow-ups now due. Run manual tests 1-3. |
| 5 | **Fix day:** apply everything days 2-4 turned up to the agent files. |
| 6 | **Switch on the reviews:** add the three Friday review scheduled tasks (Charles's go). |
| 7 | **First Friday review** for all three. Pick each team's experiment for week 2. |

Switch on the next agent only when the one before it passes its manual tests
two days running.

---

## START HERE FIRST

**Your first action today, Charles:** read the ranked Eagle County recruit list
`recruit-scout` builds from your MLS, and circle your top 10. Say "enrich and
tag them", and the chain runs: enrichment, Lofty `agent-recruit` tags (with your
OK), and the 4:40 AM follow-up drafts start the next morning.
