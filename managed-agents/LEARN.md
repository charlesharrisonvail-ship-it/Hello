# Managed Agents, in seven functions

Notes from **"Ship your first Managed Agent"** — Isabella He, Applied AI at
Anthropic, Code with Claude 2026 London ([video](https://youtu.be/19HDQ9HppOA),
37 min; [workshop repo](https://github.com/anthropics/cwc-workshops)).

This folder contains two working agents built on the pattern from that talk:

| | what it does | you already know this domain |
|---|---|---|
| `incident_agent.py` | The workshop's SRE investigator: *"what caused the checkout latency spike?"* | no — it's the reference |
| `recruiting_agent.py` | An EpiVail recruiting desk: *"who should I call today, and why?"* | yes — it's yours |

They are **the same seven functions in the same order with the same names.**
Only the strings differ. Read one, you've read both — and that's the lesson.

---

## First: this is not the thing in your `.claude/` folder

You already have agents in this repo — `.claude/agents/lead-enrichment.md`,
`recruitment-outreach.md`, `linkedin-content.md`. Those are **Claude Code
subagents**: markdown files that shape how Claude behaves inside your editor
or a web session. They live and die with the session you're in.

**Managed Agents are a different product.** An agent is a row in Anthropic's
database. It has an ID, a version number, and a container. It runs when
nobody is watching. You talk to it over an API.

Four ways to build an agent, and it's worth knowing which is which:

| | who writes the loop | who hosts it |
|---|---|---|
| Claude API + your own `while` loop | you | you |
| Tool Runner (`client.beta.messages.tool_runner`) | Anthropic's SDK | you |
| **Managed Agents** ← *this folder* | Anthropic | **Anthropic** |
| Claude Agent SDK (Claude Code as a library) | Anthropic | you |

Managed Agents is the only one where Anthropic hosts the machine your agent's
tools run on. That's the whole pitch: no server, no scheduler, no state file.

---

## The mental model: four things

```
   Agent  ──────────►  what it is        model + prompt + tools + skills
                       created ONCE, versioned forever

   Environment ─────►  where it runs     container template
                       created ONCE

   Session ─────────►  one conversation  points at an agent + an environment
                       created PER RUN

   Events  ─────────►  how you talk      you send messages in
                       agent streams work out
```

The single most common mistake — the one the docs shout about — is putting
`model`, `system`, or `tools` on the **session**. They don't go there. The
session is a *pointer*:

```python
session = client.beta.sessions.create(
    agent=agent_id,          # ← just an ID. That's it.
    environment_id=env_id,
)
```

Why separate them? **Versioning.** Every time you update an agent it gets a
new immutable version, and sessions pin to the version they started with. You
can change the prompt without breaking a session that's mid-run, roll back a
bad change, and A/B two versions side by side. None of that works if you
create a fresh agent on every request.

So: **create the agent once, store the ID, reuse it.** In this folder that's
what `.ids.json` is for. Creating an agent per run is the equivalent of
`CREATE TABLE` at the top of every web request.

---

## The seven functions

Open `incident_agent.py` next to this. Each heading is a real function in it.

### 1. `setup_agent()` — what it is

```python
skill = client.beta.skills.create(
    display_name="Incident Triage Runbook",
    files=files_from_dir("skills/incident-triage-runbook"),
)
agent = client.beta.agents.create(
    name="SRE Agent",
    model="claude-opus-5",
    system=SYSTEM,
    tools=TOOLS,
    skills=[{"type": "custom", "skill_id": skill.id, "version": "latest"}],
)
return agent.id
```

Two calls. The **skill** is a folder with a `SKILL.md` in it — your team's
runbook, uploaded so every session follows the same procedure instead of
improvising. Look at `skills/incident-triage-runbook/SKILL.md`: it's just
instructions, written the way you'd write them for a new hire.

The `tools` list holds two different species, and the difference is the most
important idea in the whole talk:

```python
{"type": "agent_toolset_20260401", ...}   # bash, files, code — runs in ANTHROPIC'S container
{"type": "custom", "name": "get_metrics"} # runs on YOUR machine
```

### 2. `setup_environment()` — where it runs

```python
env = client.beta.environments.create(
    name="sre-agent-env",
    config={"type": "cloud", "networking": {"type": "unrestricted"}},
)
```

Four lines for a container you never provision, patch, or pay a DevOps person
to babysit. `"cloud"` means Anthropic hosts it. (`"self_hosted"` moves tool
execution into your own VPC, if you ever need that.)

### 3. `upload_corpus()` — what it reads

```python
with CORPUS.open("rb") as f:
    return client.beta.files.upload(file=f).id
```

`app.log` is 70,000 lines and 12 MB. `roster.csv` is 40,000 rows. **Neither
fits in a prompt, and that's deliberate.** You upload the file once and mount
it into the session; the agent greps it inside its own sandbox.

This is the part people miss. You are not pasting data into a model. You are
giving a machine a file and letting it use `grep`.

### 4. `start_session()` — one conversation

```python
session = client.beta.sessions.create(
    agent=agent_id,
    environment_id=env_id,
    resources=[{"type": "file", "file_id": file_id, "mount_path": "app.log"}],
)
```

The file lands at `/mnt/session/uploads/app.log`. `resources` can also mount a
GitHub repo or a persistent memory store.

Print the trace URL while you're developing — watching it work beats parsing
events:

```
https://platform.claude.com/workspaces/default/sessions/{session_id}
```

### 5. `stream_reply()` — the event loop

This is the whole program. Everything above is setup.

```python
with client.beta.sessions.events.stream(session_id) as stream:   # open FIRST
    client.beta.sessions.events.send(session_id, events=[
        {"type": "user.message", "content": [{"type": "text", "text": user_text}]}
    ])
    for ev in stream:
        if ev.type == "agent.custom_tool_use":
            result = handle_tool(ev.name, ev.input)
            client.beta.sessions.events.send(session_id, events=[{
                "type": "user.custom_tool_result",
                "custom_tool_use_id": ev.id,
                "content": [{"type": "text", "text": result}],
            }])
        yield ev
```

Three things to notice:

**Open the stream before you send.** The stream has no replay — it only
delivers what happens after it opens. Send first and you lose the early events.

**`agent.custom_tool_use` is the agent phoning home.** An agent running in
Anthropic's cloud just asked *your laptop* to do something. Answer it or the
session sits idle forever. That round trip is why your API keys never have to
leave your machine.

**Match the result to the call with `custom_tool_use_id = ev.id`.** The agent
can fire several tools at once; the ID is how the server knows which answer
goes with which question.

### 6. `handle_tool()` — the only function here that isn't an API call

```python
if name == "get_metrics":
    return json.dumps(_metrics[args["service"]][args["metric"]])
```

Right now it reads a JSON file. Swap the body for a Datadog client, a Lofty
CRM call, an MLS query — and it's production. Nothing else changes. The agent
never knew the difference and never held a credential.

### 7. `delete_session()`

```python
client.beta.sessions.delete(session_id)
```

Deletes the session, its events, and its container.

> **Archiving is not deleting.** Archive is **permanent and irreversible** on
> every resource — agents, environments, sessions, vaults, memory stores.
> There is no unarchive. Don't reach for it as cleanup.

---

## Running it

> **These go in a terminal, not in Python.** If your prompt is `>>>` you are
> inside the Python interpreter, and `cd`/`pip` will throw `SyntaxError` there.
> Type `exit()` and press Enter to get back to your shell — its prompt ends in
> `>` (Windows) or `$` / `%` (Linux, macOS).

The command names differ by platform. Pick your row and use it throughout:

| | run Python | install | copy a file | activate a venv |
|---|---|---|---|---|
| **Windows** (PowerShell / cmd) | `python` | `pip` | `copy` | `.venv\Scripts\activate` |
| **Linux** | `python3` | `pip3` | `cp` | `source .venv/bin/activate` |
| **macOS** | `python3` | `pip3` | `cp` | `source .venv/bin/activate` |

Not sure which you're in? Run `python --version`. If it prints a version you're
on the Windows row; if it says "command not found", try `python3 --version` and
use the Linux/macOS row.

**Windows:**

```powershell
cd managed-agents
python -m venv .venv
.venv\Scripts\activate          # optional but recommended
pip install -r requirements.txt

copy .env.example .env           # then open .env and paste your key in
python make_fixtures.py          # builds app.log (12 MB) and roster.csv (3.6 MB)
python test_local.py             # 48 checks, no API key needed, no tokens spent
```

**Linux / macOS:**

```bash
cd managed-agents
python3 -m venv .venv
source .venv/bin/activate        # optional but recommended
pip3 install -r requirements.txt

cp .env.example .env             # then open .env and paste your key in
python3 make_fixtures.py         # builds app.log (12 MB) and roster.csv (3.6 MB)
python3 test_local.py            # 48 checks, no API key needed, no tokens spent
```

`test_local.py` should end with `all local checks passed`. It costs nothing
and needs no key — if it passes, the local half works.

> Once a venv is activated, plain `python` and `pip` work on every platform.
> The `3` suffix is only needed outside one.

Then:

```bash
python run.py incident                                  # interactive
python run.py recruiting --ask "who should I call today?"
python run.py incident --sessions                       # list past sessions
python run.py incident --resume ses_...                 # reload one from the server
python run.py incident --reset                          # forget cached IDs
```

The first run creates the agent, environment, and file upload, then caches
those IDs in `.ids.json`. Every run after that goes straight to a session.

In the output, `sandbox ·` is a tool that ran in Anthropic's container and
`local ·` is one that ran on your machine. Watching those interleave is the
clearest picture of what this architecture actually does.

**`--resume` is worth dwelling on.** It reloads a conversation from
`events.list()` — the server's own log. There is no database here and no local
state. Session history is a managed resource.

---

## The two agents, side by side

| | incident | recruiting |
|---|---|---|
| mounted corpus | `app.log`, 70k lines | `roster.csv`, 40k rows |
| the trigger | deploy `a3f9c21` at 14:31:18 | split change at Summit Peak, 2026-08-14 |
| timeseries tool | `get_metrics` | `get_production` |
| event-list tool | `get_recent_deploys` | `get_market_events` |
| detail tool | `get_diff` | `get_agent_detail` |
| runbook skill | incident triage | agent recruiting |
| the question | what caused the spike? | who should I call today? |
| a good answer | names one commit | names two or three people |

Both are the same investigation: **a trigger event, a timeline to line it up
against, a corpus too big to read, and a specific answer you have to earn.**
Once you see that shape, you'll see it everywhere in your own work — which
listings went stale and why, which lead sources actually closed, which agents
in a market are about to move.

A good recruiting run should reach Solveig Brennan, Rowan Delacroix, and
Bastien Moreau — high producers still at Summit Peak after the split change —
and should *rule out* Marisol Avery, who already left on 2026-08-29. Agents
who just moved don't move again. That disqualifier is written into the runbook
skill, not the prompt, which is the point of skills.

---

## Things that will bite you

**Model, prompt, and tools go on the agent, never the session.** Worth saying
twice. The session takes a pointer.

**Don't create an agent per run.** You'll orphan a pile of them and pay the
create latency for nothing.

**Open the stream before sending.** No replay.

**Don't break on `session.status_idle` alone.** The session goes idle
*transiently* — between parallel tools, and whenever it's waiting on you. The
correct gate (it's in `run.py`):

```python
if ev.type == "session.status_terminated":
    break
if ev.type == "session.status_idle":
    if ev.stop_reason.type == "requires_action":
        continue        # waiting on YOU — answer the tool call
    break               # end_turn / retries_exhausted / budget_reached
```

Get this wrong in the obvious direction and your agent quits mid-thought.

**Cap the spend while you're learning.** `budget` is **create-only** — you
can change or remove it later, never add one afterwards:

```python
session = client.beta.sessions.create(
    agent=agent_id, environment_id=env_id,
    budget={"type": "limit", "max_list_cost": {"amount": "500", "currency": "USD"}},
)   # "500" = $5.00 — minor units, as a string
```

At the cap the session **pauses** (idle, `stop_reason: budget_reached`) rather
than dying. Raise or remove the budget to resume.

**Never put a secret in the agent's prompt or sandbox.** Either keep it
host-side in `handle_tool()` — which is what this folder does — or use a
vault credential, which Anthropic substitutes at egress so the value never
enters the container.

---

## What I changed from the video's code

The workshop was written against `anthropic>=0.97`. On the current SDK
(1.7.0, verified against the installed package):

| workshop | here | why |
|---|---|---|
| `skills.create(display_title=...)` | `display_name=...` | parameter was renamed — `display_title` now raises `TypeError` |
| `model="claude-opus-4-8"` | `model="claude-opus-5"` | current generation |
| `@st.cache_resource` | `.ids.json` | Streamlit's cache is per-process; a file survives restarts, which is what "create once" actually requires |
| Streamlit dashboard | terminal `run.py` | two dependencies instead of four, and the seven API calls stay in the foreground |

One more thing the workshop does that's worth copying if you build a UI: it
makes the session dropdown from `sessions.list()` and reloads history from
`events.list()`. No database. `run.py --sessions` and `--resume` are the same
idea, smaller.

---

## Where to go next

Four features in the platform that this folder doesn't use, roughly in the
order they'd pay off for you:

- **Scheduled deployments** — run an agent on a cron. "Every Monday at 6am,
  check which agents in my markets changed brokerage last week." No server.
- **Memory stores** — persistent memory across sessions, so the agent
  remembers who you already called.
- **MCP servers** — connect Lofty, Apollo, or Gmail as first-class tools
  instead of hand-writing `handle_tool()` bodies.
- **Outcomes** — give the agent a rubric and it iterates against a grader
  until the work passes, instead of stopping at a first draft.

Docs: [Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview)
· [quickstart](https://platform.claude.com/docs/en/managed-agents/quickstart)
