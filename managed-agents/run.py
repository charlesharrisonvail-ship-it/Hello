# SPDX-License-Identifier: MIT
"""Drive either agent from the terminal.

    python make_fixtures.py               # once — builds the big files
    python run.py incident                # interactive
    python run.py recruiting --ask "who should I call today?"
    python run.py incident --sessions     # list past sessions
    python run.py incident --resume ses_123
    python run.py incident --reset        # forget cached agent/env/file IDs

Both agent modules expose the same seven functions, so this driver does not
care which one it loaded.
"""

import argparse
import importlib
import json
import sys
from pathlib import Path

import anthropic

try:                                    # optional: only needed if you use a .env file
    from dotenv import load_dotenv
    load_dotenv()
except ModuleNotFoundError:
    pass

HERE = Path(__file__).parent
IDS = HERE / ".ids.json"
AGENTS = {"incident": "incident_agent", "recruiting": "recruiting_agent"}

DIM, BOLD, CYAN, YELLOW, GREEN, RESET = (
    "\033[2m", "\033[1m", "\033[36m", "\033[33m", "\033[32m", "\033[0m"
)


# ── cached IDs ────────────────────────────────────────────────────────────
# An agent is a persisted, versioned object. Creating one per run orphans the
# old one and pays the create latency for nothing. Create once, store the ID.
def load_ids(key: str) -> dict:
    return json.loads(IDS.read_text()).get(key, {}) if IDS.exists() else {}


def save_ids(key: str, ids: dict) -> None:
    all_ids = json.loads(IDS.read_text()) if IDS.exists() else {}
    all_ids[key] = ids
    IDS.write_text(json.dumps(all_ids, indent=2))


def require_credentials(mod) -> None:
    """Fail here with something readable, not 12 frames deep in an API call."""
    c = mod.client
    if not (c.api_key or getattr(c, "auth_token", None)):
        sys.exit(
            "No Anthropic credentials found.\n"
            "  cp .env.example .env   and put your key in it, or\n"
            "  export ANTHROPIC_API_KEY=sk-ant-...\n"
            "  Keys: https://console.anthropic.com/settings/keys"
        )


def provision(mod, key: str) -> dict:
    """Steps 1-3, exactly once per machine. Cached in .ids.json."""
    require_credentials(mod)
    ids = load_ids(key)
    if not ids.get("agent_id"):
        print(f"{DIM}creating agent (once)…{RESET}")
        ids["agent_id"] = mod.setup_agent()
    if not ids.get("env_id"):
        print(f"{DIM}creating environment (once)…{RESET}")
        ids["env_id"] = mod.setup_environment()
    if not ids.get("file_id"):
        if not mod.CORPUS.exists():
            sys.exit(f"missing {mod.CORPUS} — run: python make_fixtures.py")
        size_mb = mod.CORPUS.stat().st_size / 1e6
        print(f"{DIM}uploading {mod.CORPUS.name} ({size_mb:.1f} MB, once)…{RESET}")
        ids["file_id"] = mod.upload_corpus()
    save_ids(key, ids)
    return ids


# ── event printing ────────────────────────────────────────────────────────
def text_of(content) -> str:
    if not content:
        return ""
    return "".join(getattr(b, "text", "") for b in content)


def render(ev) -> bool:
    """Print one event. Returns True when the turn is over."""
    t = ev.type

    if t == "agent.message":
        print(text_of(ev.content), end="", flush=True)

    elif t == "agent.tool_use":
        # Ran in Anthropic's container — bash, file ops, code execution.
        print(f"\n{CYAN}  ├ sandbox · {ev.name}{RESET}", flush=True)

    elif t == "agent.custom_tool_use":
        # Ran on THIS machine, via handle_tool().
        args = ", ".join(f"{k}={v!r}" for k, v in (ev.input or {}).items())
        print(f"\n{YELLOW}  ├ local   · {ev.name}({args}){RESET}", flush=True)

    elif t == "session.error":
        print(f"\n\033[31m  ! {getattr(ev, 'message', ev)}{RESET}", flush=True)

    elif t == "session.status_terminated":
        return True

    elif t == "session.status_idle":
        reason = getattr(getattr(ev, "stop_reason", None), "type", None)
        if reason == "requires_action":
            return False              # waiting on us — stream_reply answers it
        if reason and reason != "end_turn":
            print(f"\n{DIM}[stopped: {reason}]{RESET}", flush=True)
        return True

    return False


def ask(mod, session_id: str, question: str) -> None:
    print(f"\n{BOLD}> {question}{RESET}\n")
    for ev in mod.stream_reply(session_id, question):
        if render(ev):
            break
    print()


# ── commands ──────────────────────────────────────────────────────────────
def list_sessions(mod, agent_id: str) -> None:
    page = mod.client.beta.sessions.list(agent_id=agent_id, limit=15, order="desc")
    if not page.data:
        print("no sessions yet")
        return
    for s in page.data:
        print(f"  {s.id}  {s.created_at:%Y-%m-%d %H:%M}  {s.status:<12} {s.title or ''}")


def replay(mod, session_id: str) -> None:
    """Rebuild the conversation from the server-side event log. No local state."""
    page = mod.client.beta.sessions.events.list(session_id, order="asc", limit=500)
    for ev in page.data:
        if ev.type == "user.message":
            print(f"\n{BOLD}> {text_of(ev.content)}{RESET}\n")
        elif ev.type == "agent.message":
            print(text_of(ev.content), end="")
        elif ev.type == "agent.tool_use":
            print(f"\n{CYAN}  ├ sandbox · {ev.name}{RESET}")
        elif ev.type == "agent.custom_tool_use":
            print(f"\n{YELLOW}  ├ local   · {ev.name}{RESET}")
    print()


def explain_api_error(e: Exception) -> str:
    """Turn an API failure into one actionable sentence, not a stack trace."""
    if isinstance(e, anthropic.AuthenticationError):
        return ("Your API key was rejected. Check it was copied whole "
                "(it starts with sk-ant-) and has not been revoked.")
    if isinstance(e, anthropic.BadRequestError):
        msg = str(e)
        if "workspace" in msg.lower():
            return (
                "Your API key is not scoped to a workspace, so every request "
                "must name one. Two ways to fix it:\n\n"
                "  1. Easiest — make a workspace-scoped key:\n"
                "     console.anthropic.com/settings/keys -> Create Key, and\n"
                "     pick a Workspace (not 'Default'/org-level) when asked.\n\n"
                "  2. Or keep this key and name the workspace:\n"
                "     find the ID in the Console URL when a workspace is open\n"
                "     (it looks like wrkspc_...), then set:\n"
                "       PowerShell  $env:ANTHROPIC_WORKSPACE_ID = \"wrkspc_...\"\n"
                "       bash        export ANTHROPIC_WORKSPACE_ID=wrkspc_..."
            )
        return f"The API rejected the request: {msg}"
    if isinstance(e, anthropic.PermissionDeniedError):
        return ("Your key authenticated but lacks access to Managed Agents. "
                "Check the workspace and that the beta is enabled for your org.")
    if isinstance(e, anthropic.RateLimitError):
        return "Rate limited. Wait a moment and run it again."
    if isinstance(e, anthropic.APIConnectionError):
        return "Could not reach the API. Check your network connection."
    return str(e)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("agent", choices=sorted(AGENTS), help="which agent to run")
    p.add_argument("--ask", metavar="Q", help="ask one question and exit")
    p.add_argument("--resume", metavar="SESSION_ID", help="reattach to a past session")
    p.add_argument("--sessions", action="store_true", help="list past sessions")
    p.add_argument("--reset", action="store_true", help="forget cached IDs")
    args = p.parse_args()

    mod = importlib.import_module(AGENTS[args.agent])

    if args.reset:
        all_ids = json.loads(IDS.read_text()) if IDS.exists() else {}
        all_ids.pop(args.agent, None)
        IDS.write_text(json.dumps(all_ids, indent=2))
        print(f"cleared cached IDs for {args.agent}")
        return

    try:
        ids = provision(mod, args.agent)
    except anthropic.APIError as e:
        sys.exit(f"\n{explain_api_error(e)}\n")

    if args.sessions:
        list_sessions(mod, ids["agent_id"])
        return

    if args.resume:
        session_id = args.resume
        print(f"{DIM}resuming {session_id}{RESET}")
        replay(mod, session_id)
    else:
        session_id = mod.start_session(ids["agent_id"], ids["env_id"], ids["file_id"])
        print(f"{GREEN}session {session_id}{RESET}")
        print(f"{DIM}watch: https://platform.claude.com/workspaces/default/"
              f"sessions/{session_id}{RESET}")

    if args.ask:
        ask(mod, session_id, args.ask)
        return

    print(f"{DIM}Ctrl-D to quit. Enter alone sends the default question.{RESET}")
    default = mod.OPENER
    while True:
        try:
            q = input(f"\n{BOLD}> {RESET}").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        q = q or default
        default = None
        if not q:
            continue
        for ev in mod.stream_reply(session_id, q):
            if render(ev):
                break
        print()


if __name__ == "__main__":
    main()
