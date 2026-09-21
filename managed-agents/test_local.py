# SPDX-License-Identifier: MIT
"""Tests for the half of the system that runs on your machine.

No API key and no network needed — these exercise the custom-tool handlers,
the tool schemas, and the fixtures. Run them before you spend tokens.

    python test_local.py
"""

import json
import sys

import incident_agent as inc
import recruiting_agent as rec

failures: list[str] = []


def check(label: str, cond: bool, detail: str = "") -> None:
    print(f"  {'PASS' if cond else 'FAIL'}  {label}")
    if not cond:
        failures.append(f"{label}{' — ' + detail if detail else ''}")


def check_schemas(mod, name: str) -> None:
    print(f"\n{name}: tool schemas")
    builtin = [t for t in mod.TOOLS if t["type"] == "agent_toolset_20260401"]
    custom = [t for t in mod.TOOLS if t["type"] == "custom"]
    check("declares the built-in agent toolset", len(builtin) == 1)
    check("declares 3 custom tools", len(custom) == 3, f"got {len(custom)}")
    for t in custom:
        ok = (
            isinstance(t.get("name"), str)
            and isinstance(t.get("description"), str)
            and t.get("input_schema", {}).get("type") == "object"
            and isinstance(t["input_schema"].get("properties"), dict)
        )
        check(f"{t['name']} schema is well-formed", ok, json.dumps(t)[:120])
        for req in t["input_schema"].get("required", []):
            check(f"{t['name']}.{req} is declared in properties",
                  req in t["input_schema"]["properties"])


def check_handlers(mod, name: str, cases: list[tuple[str, dict, str]]) -> None:
    print(f"\n{name}: custom tool handlers")
    declared = {t["name"] for t in mod.TOOLS if t["type"] == "custom"}
    covered = {c[0] for c in cases}
    check("every declared custom tool is tested", declared == covered,
          f"declared={sorted(declared)} tested={sorted(covered)}")
    for tool, args, must_contain in cases:
        out = mod.handle_tool(tool, args)
        check(f"{tool}({', '.join(args) or ''}) returns a str", isinstance(out, str))
        check(f"{tool} output contains {must_contain!r}", must_contain in out,
              out[:160])
    # An unknown tool must degrade, not raise — the agent can invent a name.
    check("unknown tool degrades gracefully",
          "unknown" in mod.handle_tool("nope", {}).lower())


def check_corpus(mod, name: str, min_lines: int) -> None:
    print(f"\n{name}: corpus")
    if not mod.CORPUS.exists():
        check(f"{mod.CORPUS.name} exists", False, "run: python make_fixtures.py")
        return
    lines = sum(1 for _ in mod.CORPUS.open())
    check(f"{mod.CORPUS.name} has >= {min_lines:,} lines", lines >= min_lines,
          f"got {lines:,}")
    check("corpus is too big to paste into a prompt (>1 MB)",
          mod.CORPUS.stat().st_size > 1_000_000)


print("=" * 62)
check_schemas(inc, "incident")
check_handlers(inc, "incident", [
    ("get_metrics", {"service": "checkout", "metric": "p99_latency_ms"}, "3610"),
    ("get_recent_deploys", {}, "a3f9c21"),
    ("get_diff", {"commit": "a3f9c21"}, "order_lines"),
])
check_corpus(inc, "incident", 70_000)

# The handler must not hand back a diff for a commit that isn't the culprit.
print("\nincident: negative cases")
check("get_diff rejects an unknown commit",
      "no diff" in inc.handle_tool("get_diff", {"commit": "deadbee"}))
check("get_metrics rejects an unknown service",
      "error" in inc.handle_tool("get_metrics",
                                 {"service": "nope", "metric": "error_rate"}))

check_schemas(rec, "recruiting")
check_handlers(rec, "recruiting", [
    ("get_production", {"brokerage": "Summit Peak Realty",
                        "metric": "agent_headcount"}, "49"),
    ("get_market_events", {}, "split_change"),
    ("get_agent_detail", {"license_id": "CO-1142663"}, "Rowan Delacroix"),
])
check_corpus(rec, "recruiting", 40_000)

print("\nrecruiting: negative cases")
check("get_agent_detail rejects an unknown licence",
      "error" in rec.handle_tool("get_agent_detail", {"license_id": "CO-000"}))
check("get_agent_detail is case/whitespace tolerant",
      "Rowan" in rec.handle_tool("get_agent_detail", {"license_id": " co-1142663 "}))

# The two agents must stay structurally identical — that parity is the lesson.
print("\nparity between the two agents")
seven = ["setup_agent", "setup_environment", "upload_corpus", "start_session",
         "stream_reply", "handle_tool", "delete_session"]
for fn in seven:
    check(f"both modules define {fn}()",
          callable(getattr(inc, fn, None)) and callable(getattr(rec, fn, None)))
check("both use claude-opus-5 in setup_agent",
      all("claude-opus-5" in open(f"{m}.py").read()
          for m in ("incident_agent", "recruiting_agent")))

print("=" * 62)
if failures:
    print(f"\n{len(failures)} FAILED:")
    for f in failures:
        print(f"  - {f}")
    sys.exit(1)
print("\nall local checks passed")
