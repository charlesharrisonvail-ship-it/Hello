# SPDX-License-Identifier: MIT
"""Agent #2 — the EpiVail agent-recruiting desk.

Deliberately the SAME seven functions as incident_agent.py, in the same
order, with the same names. Only the strings change:

    app.log (70k lines)      ->  roster.csv (40k rows)
    get_metrics              ->  get_production
    get_recent_deploys       ->  get_market_events
    get_diff                 ->  get_agent_detail
    incident-triage-runbook  ->  agent-recruiting-runbook
    "what caused the spike?" ->  "who should I call today?"

The shape of the problem is identical: a trigger event, a timeline to
correlate it against, a corpus too big to read, and a specific answer
you have to earn.
"""

import json
from pathlib import Path

import anthropic
from anthropic.lib import files_from_dir

HERE = Path(__file__).parent
DATA = HERE / "data" / "recruiting"

client = anthropic.Anthropic()

CORPUS = DATA / "roster.csv"
MOUNT_PATH = "roster.csv"       # lands at /mnt/session/uploads/roster.csv

SKILL_DIR = HERE / "skills" / "agent-recruiting-runbook"
SKILL_TITLE = "EpiVail Agent Recruiting Runbook"

OPENER = "Who should I call today, and why?"

SYSTEM = """\
You are the EpiVail Recruiting Desk — a research agent for Charles Harrison,
Area/Growth Leader at Epique Realty, Colorado Mountain Region.

The licensed-agent roster is mounted at /mnt/session/uploads/roster.csv:
~40,000 rows, national. It is far too large to read whole — use bash
(grep, awk, csvcut) or write Python to filter and rank it.

You also have local tools that query brokerage production data, recent market
events, and individual agent records. Those run on Charles's machine, not in
your sandbox.

Follow the agent recruiting runbook. Your output is a short call list, not a
report: two or three names, each with the specific thing that changed for
them. Never invent production figures, splits, or earnings claims — if a
number matters and you don't have it, write [VERIFY: what] and move on.
"""

TOOLS = [
    {"type": "agent_toolset_20260401", "default_config": {"enabled": True}},
    {
        "type": "custom",
        "name": "get_production",
        "description": "Timeseries for a brokerage+metric over the last 6 months. "
                       "Metrics: avg_monthly_volume_usd, active_listings, agent_headcount.",
        "input_schema": {
            "type": "object",
            "properties": {
                "brokerage": {"type": "string", "description": "Brokerage name"},
                "metric": {"type": "string", "description": "Metric name"},
            },
            "required": ["brokerage", "metric"],
        },
    },
    {
        "type": "custom",
        "name": "get_market_events",
        "description": "Brokerage-level market events (split changes, fee changes, "
                       "leadership changes) and agent departures in the last 90 days.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "type": "custom",
        "name": "get_agent_detail",
        "description": "Full record for one agent by licence ID: production, team "
                       "size, segment, languages, listing history, notes.",
        "input_schema": {
            "type": "object",
            "properties": {
                "license_id": {"type": "string", "description": "e.g. CO-1142663"},
            },
            "required": ["license_id"],
        },
    },
]

_production = json.loads((DATA / "production.json").read_text())
_moves = (DATA / "moves.json").read_text()
_details = json.loads((DATA / "agent_details.json").read_text())


# ── 1. Agent — WHAT it is. Created once, versioned forever. ───────────────
def setup_agent() -> str:
    skill = client.beta.skills.create(
        display_name=SKILL_TITLE,
        files=files_from_dir(str(SKILL_DIR)),
    )
    agent = client.beta.agents.create(
        name="EpiVail Recruiting Desk",
        model="claude-opus-5",
        system=SYSTEM,
        tools=TOOLS,
        skills=[{"type": "custom", "skill_id": skill.id, "version": "latest"}],
    )
    return agent.id


# ── 2. Environment — WHERE it runs. ───────────────────────────────────────
def setup_environment() -> str:
    env = client.beta.environments.create(
        name="epivail-recruiting-env",
        config={"type": "cloud", "networking": {"type": "unrestricted"}},
    )
    return env.id


# ── 3. File — WHAT it reads. ──────────────────────────────────────────────
def upload_corpus() -> str:
    with CORPUS.open("rb") as f:
        return client.beta.files.upload(file=f).id


# ── 4. Session — ONE conversation. ────────────────────────────────────────
def start_session(agent_id: str, env_id: str, file_id: str) -> str:
    session = client.beta.sessions.create(
        agent=agent_id,
        environment_id=env_id,
        title="Recruiting desk — Colorado Mountain Region",
        resources=[{"type": "file", "file_id": file_id, "mount_path": MOUNT_PATH}],
    )
    return session.id


# ── 5. Stream — the event loop. Identical to agent #1. ────────────────────
def stream_reply(session_id: str, user_text: str):
    with client.beta.sessions.events.stream(session_id) as stream:
        client.beta.sessions.events.send(
            session_id,
            events=[{"type": "user.message",
                     "content": [{"type": "text", "text": user_text}]}],
        )
        for ev in stream:
            if ev.type == "agent.custom_tool_use":
                result = handle_tool(ev.name, ev.input)
                client.beta.sessions.events.send(
                    session_id,
                    events=[{
                        "type": "user.custom_tool_result",
                        "custom_tool_use_id": ev.id,
                        "content": [{"type": "text", "text": result}],
                    }],
                )
            yield ev


# ── 6. Local tools — swap for Lofty / Apollo / MLS and it's production. ───
def handle_tool(name: str, args: dict) -> str:
    if name == "get_production":
        series = _production.get(args["brokerage"], {}).get(args["metric"])
        return json.dumps(series or {"error": "no such brokerage/metric"})
    if name == "get_market_events":
        return _moves
    if name == "get_agent_detail":
        rec = _details.get(args.get("license_id", "").strip().upper())
        return json.dumps(rec or {"error": "no detail record for that licence"})
    return f"unknown tool {name}"


# ── 7. Cleanup ────────────────────────────────────────────────────────────
def delete_session(session_id: str) -> None:
    client.beta.sessions.delete(session_id)
