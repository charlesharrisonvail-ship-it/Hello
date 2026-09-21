# SPDX-License-Identifier: MIT
"""Agent #1 — the SRE incident investigator.

A port of Anthropic's "Ship your first Managed Agent" workshop
(Isabella He, Code with Claude 2026 London) onto the current SDK.

Seven functions. Each one is a single Managed Agents API call, except
handle_tool(), which is the one that runs on YOUR machine.

    Agent   -> what it is       (created once, versioned)
    Env     -> where it runs    (created once)
    File    -> what it reads    (uploaded once)
    Session -> one conversation (created per run)
    Stream  -> the event loop   (the part that actually matters)
"""

import json
import os
from pathlib import Path

import anthropic
from anthropic.lib import files_from_dir

HERE = Path(__file__).parent
DATA = HERE / "data" / "incident"

# An org-level API key must name a workspace on every request; a
# workspace-scoped key already carries one. Setting ANTHROPIC_WORKSPACE_ID
# covers the first case for every call, rather than threading a workspace_id
# argument through each one.
_WORKSPACE = os.environ.get("ANTHROPIC_WORKSPACE_ID")
client = anthropic.Anthropic(
    default_headers={"anthropic-workspace-id": _WORKSPACE} if _WORKSPACE else None,
)

# The file the agent mounts and greps inside its own sandbox.
CORPUS = DATA / "app.log"
MOUNT_PATH = "app.log"          # lands at /mnt/session/uploads/app.log

SKILL_DIR = HERE / "skills" / "incident-triage-runbook"
SKILL_TITLE = "Incident Triage Runbook"

OPENER = "What caused the checkout latency spike?"

SYSTEM = """\
You are the SRE Agent — an SRE/data-analyst agent embedded in an incident
dashboard for a fictional e-commerce stack.

The application log is mounted at /mnt/session/uploads/app.log. It is ~70,000
lines of JSON, one object per line. It is far too large to read whole — use
bash (grep, wc, awk) or write Python to analyse it.

You also have local tools that query the same data the on-call dashboard
shows. Those run on the engineer's machine, not in your sandbox.

Follow the incident triage runbook. Correlate evidence across sources before
you conclude anything, and state findings plainly and concisely.
"""

# Two kinds of tools in one list:
#   agent_toolset_20260401 — bash/file/code-exec, run by Anthropic in the container
#   type: "custom"         — run by YOU, handled in handle_tool() below
TOOLS = [
    {"type": "agent_toolset_20260401", "default_config": {"enabled": True}},
    {
        "type": "custom",
        "name": "get_metrics",
        "description": "Timeseries for a service+metric over the incident window. "
                       "Metrics: p99_latency_ms, error_rate, db_pool_utilization. "
                       "Services: checkout, cart, auth, inventory.",
        "input_schema": {
            "type": "object",
            "properties": {
                "service": {"type": "string", "description": "Service name"},
                "metric": {"type": "string", "description": "Metric name"},
            },
            "required": ["service", "metric"],
        },
    },
    {
        "type": "custom",
        "name": "get_recent_deploys",
        "description": "Every deploy in the last 6 hours, newest first.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "type": "custom",
        "name": "get_diff",
        "description": "Unified diff for a commit SHA.",
        "input_schema": {
            "type": "object",
            "properties": {"commit": {"type": "string", "description": "Commit SHA"}},
            "required": ["commit"],
        },
    },
]

_metrics = json.loads((DATA / "metrics.json").read_text())
_deploys = (DATA / "deploys.json").read_text()
_diff = (DATA / "diff.txt").read_text()


# ── 1. Agent — WHAT it is. Created once, versioned forever. ───────────────
def setup_agent() -> str:
    """Upload the runbook as a Skill, then create the agent that uses it."""
    skill = client.beta.skills.create(
        display_name=SKILL_TITLE,
        files=files_from_dir(str(SKILL_DIR)),
    )
    agent = client.beta.agents.create(
        name="SRE Agent",
        model="claude-opus-5",
        system=SYSTEM,
        tools=TOOLS,
        skills=[{"type": "custom", "skill_id": skill.id, "version": "latest"}],
    )
    return agent.id


# ── 2. Environment — WHERE it runs. A container template. ─────────────────
def setup_environment() -> str:
    env = client.beta.environments.create(
        name="sre-agent-env",
        config={"type": "cloud", "networking": {"type": "unrestricted"}},
    )
    return env.id


# ── 3. File — WHAT it reads. Uploaded once, mounted per session. ──────────
def upload_corpus() -> str:
    with CORPUS.open("rb") as f:
        return client.beta.files.upload(file=f).id


# ── 4. Session — ONE conversation. Created per run. ───────────────────────
def start_session(agent_id: str, env_id: str, file_id: str) -> str:
    session = client.beta.sessions.create(
        agent=agent_id,                     # pointer only — no model/system/tools here
        environment_id=env_id,
        title="Incident 2277 — checkout latency",
        resources=[{"type": "file", "file_id": file_id, "mount_path": MOUNT_PATH}],
    )
    return session.id


# ── 5. Stream — the event loop. This is the whole program. ────────────────
def stream_reply(session_id: str, user_text: str):
    """Open the stream FIRST, then send. The stream has no replay."""
    with client.beta.sessions.events.stream(session_id) as stream:
        client.beta.sessions.events.send(
            session_id,
            events=[{"type": "user.message",
                     "content": [{"type": "text", "text": user_text}]}],
        )
        for ev in stream:
            if ev.type == "agent.custom_tool_use":
                # The agent, running in Anthropic's cloud, just asked YOUR
                # machine to do something. Answer it or the session deadlocks.
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


# ── 6. Local tools — the only code here that is NOT an API call. ──────────
def handle_tool(name: str, args: dict) -> str:
    """Swap these bodies for a Datadog / GitHub client and it's production."""
    if name == "get_metrics":
        series = _metrics.get(args["service"], {}).get(args["metric"])
        return json.dumps(series or {"error": "no such service/metric"})
    if name == "get_recent_deploys":
        return _deploys
    if name == "get_diff":
        commit = args.get("commit", "")
        return _diff if commit[:7] and commit[:7] in _diff else "no diff for that commit"
    return f"unknown tool {name}"


# ── 7. Cleanup ────────────────────────────────────────────────────────────
def delete_session(session_id: str) -> None:
    client.beta.sessions.delete(session_id)
