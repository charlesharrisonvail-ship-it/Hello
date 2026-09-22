# SPDX-License-Identifier: MIT
"""Run the recruiting agent on a schedule — Monday mornings, unattended.

A *deployment* is a saved bundle of everything a session needs (agent,
environment, mounted files, kickoff events) plus a cron schedule. Anthropic
fires a fresh session at each interval. No server, no cron job on your laptop,
no requirement that your machine even be switched on.

    python deploy.py create     create the Monday 06:00 deployment
    python deploy.py status     show it, plus the next three fire times
    python deploy.py test       fire one run right now, without waiting
    python deploy.py runs       history of every firing, successes and failures
    python deploy.py pause      stop firing (reversible)
    python deploy.py unpause    resume
    python deploy.py archive    permanent, irreversible — asks first

The eighth function, in other words: everything in run.py, minus you.
"""

import argparse
import json
import sys

import anthropic

import recruiting_agent as rec
from run import IDS, explain_api_error, load_ids, provision, save_ids

BOLD, DIM, GREEN, YELLOW, RESET = "\033[1m", "\033[2m", "\033[32m", "\033[33m", "\033[0m"

KEY = "recruiting"
NAME = "EpiVail — Monday recruiting brief"

# Monday at 06:00, Colorado time. Fields: minute hour day-of-month month day-of-week.
SCHEDULE = {"type": "cron", "expression": "0 6 * * 1", "timezone": "America/Denver"}

# An unattended agent spends money with nobody watching. The cap is copied onto
# each fired session; that session pauses rather than dies when it reaches it.
# Minor units as a string: "500" = $5.00.
BUDGET = {"type": "limit", "max_list_cost": {"amount": "500", "currency": "USD"}}

TASK = (
    "Produce this week's recruiting call list for the Colorado Mountain Region. "
    "Follow the agent recruiting runbook: market events and departures first, "
    "correlate them against brokerage production, then filter the roster and "
    "pull detail on the top candidates."
)

# Starter rubric — a grader scores each criterion independently and sends gaps
# back to the agent until they pass. Tune these; they are the definition of a
# good Monday brief, and vague criteria produce noisy loops.
RUBRIC = """\
# A good Monday recruiting brief

1. Names **two or three** agents to call. Not one, not a ranked list of ten.
2. Every named agent is currently at a brokerage that had a market event
   (split change, fee change, leadership change) in the last 90 days.
3. No agent appearing in the departures list is recommended. Someone who
   changed brokerage recently is not moving again this cycle.
4. Every named agent's licence ID appears in the mounted roster.
5. Each name carries one line of evidence citing a specific figure that came
   from a tool — production, headcount, listing count, or a dated event.
6. Each name carries a one-sentence angle: why Epique answers what changed
   for that person specifically.
7. No invented production figures, splits, or earnings claims. Anything not
   available from the tools is marked `[VERIFY: what]`.
8. Ends with one `**Call first:**` line per recommendation, naming the agent
   and licence ID, per the runbook's write-up format.
"""


def client() -> anthropic.Anthropic:
    return rec.client


def deployment_id() -> str | None:
    return load_ids(KEY).get("deployment_id")


def require_deployment() -> str:
    did = deployment_id()
    if not did:
        sys.exit("No deployment yet. Run: python deploy.py create")
    return did


def show(d) -> None:
    print(f"\n{BOLD}{d.name}{RESET}")
    print(f"  id       {d.id}")
    print(f"  status   {d.status}" + (f" ({d.paused_reason})" if getattr(d, "paused_reason", None) else ""))
    s = getattr(d, "schedule", None)
    if s:
        print(f"  schedule {s.expression}  {s.timezone}")
        print(f"  last run {getattr(s, 'last_run_at', None) or '—'}")
        for t in (getattr(s, "upcoming_runs_at", None) or [])[:3]:
            print(f"  next     {t}")
    b = getattr(d, "budget", None)
    if b:
        cents = int(b.max_list_cost.amount)
        print(f"  budget   ${cents / 100:.2f} per run")
    print(f"\n{DIM}  Scheduled runs are jittered up to 9 minutes to spread load,{RESET}")
    print(f"{DIM}  so treat the times above as 'about then', not to the second.{RESET}\n")


def cmd_create() -> None:
    if deployment_id():
        sys.exit(f"Deployment already exists: {deployment_id()}\n"
                 f"Use 'status' to see it, or 'archive' to retire it first.")
    ids = provision(rec, KEY)          # reuses the agent/env/file run.py made
    d = client().beta.deployments.create(
        name=NAME,
        agent=ids["agent_id"],
        environment_id=ids["env_id"],
        resources=[{"type": "file", "file_id": ids["file_id"],
                    "mount_path": rec.MOUNT_PATH}],
        schedule=SCHEDULE,
        budget=BUDGET,
        # A call list is a deliverable, so the run is graded against the rubric
        # and revised until it passes — not a one-shot answer nobody checks.
        initial_events=[{
            "type": "user.define_outcome",
            "description": TASK,
            "rubric": {"type": "text", "content": RUBRIC},
            "max_iterations": 3,
        }],
    )
    save_ids(KEY, {**ids, "deployment_id": d.id})
    print(f"{GREEN}created{RESET}")
    show(d)
    print("It will now fire on its own. To see a run without waiting for Monday:")
    print(f"  {BOLD}python deploy.py test{RESET}\n")


def cmd_status() -> None:
    show(client().beta.deployments.retrieve(require_deployment()))


def cmd_test() -> None:
    did = require_deployment()
    run = client().beta.deployments.run(did)
    sid = getattr(run, "session_id", None)
    print(f"{GREEN}fired{RESET}  run {run.id}")
    if sid:
        print(f"  session {sid}")
        print(f"  watch   https://platform.claude.com/workspaces/default/sessions/{sid}")
        print(f"\n  or from here:  {BOLD}python run.py recruiting --resume {sid}{RESET}")
        print(f"{DIM}  (give it a couple of minutes first — it runs server-side){RESET}\n")


def cmd_runs() -> None:
    did = require_deployment()
    page = client().beta.deployment_runs.list(deployment_id=did, limit=20)
    rows = list(page.data)
    if not rows:
        print("No runs yet. 'python deploy.py test' fires one now.")
        return
    print(f"\n{BOLD}{'when':<22}{'result':<12}{'session / error'}{RESET}")
    for r in rows:
        err = getattr(r, "error", None)
        if err:
            print(f"{str(r.created_at)[:19]:<22}{YELLOW}{'failed':<12}{RESET}"
                  f"{err.type}: {getattr(err, 'message', '')[:60]}")
        else:
            print(f"{str(r.created_at)[:19]:<22}{GREEN}{'ok':<12}{RESET}{r.session_id}")
    print()


def cmd_pause() -> None:
    d = client().beta.deployments.pause(require_deployment())
    print(f"paused — no further runs until you unpause. status: {d.status}")


def cmd_unpause() -> None:
    d = client().beta.deployments.unpause(require_deployment())
    print(f"resumed. status: {d.status}")
    show(d)


def cmd_archive() -> None:
    did = require_deployment()
    print(f"{YELLOW}Archiving is permanent. There is no unarchive.{RESET}")
    print("If you only want it to stop firing, use 'pause' instead — that is reversible.")
    if input('\nType "archive" to confirm: ').strip() != "archive":
        sys.exit("cancelled — nothing changed")
    client().beta.deployments.archive(did)
    ids = load_ids(KEY)
    ids.pop("deployment_id", None)
    save_ids(KEY, ids)
    print(f"{GREEN}archived{RESET} {did}")


COMMANDS = {
    "create": cmd_create, "status": cmd_status, "test": cmd_test, "runs": cmd_runs,
    "pause": cmd_pause, "unpause": cmd_unpause, "archive": cmd_archive,
}


def main() -> None:
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("command", choices=list(COMMANDS))
    args = p.parse_args()
    try:
        COMMANDS[args.command]()
    except anthropic.APIError as e:
        sys.exit(f"\n{explain_api_error(e)}\n")
    except KeyboardInterrupt:
        sys.exit("\ncancelled")


if __name__ == "__main__":
    main()
