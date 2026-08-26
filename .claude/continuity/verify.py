#!/usr/bin/env python3
"""Acceptance test. Proves the kit WORKS, not that its files exist.

WHY THIS FILE IS THE PRODUCT
----------------------------
Anyone can ship a folder of scripts. The thing a buyer cannot do for themselves
is know whether it is actually working on THEIR machine -- and this kit's
failure mode is silent. The orientation payload can truncate, a hook can be
registered for the wrong trigger, a document can go missing, and every one of
those looks exactly like success from the outside: the session starts, the
agent talks confidently, and nothing appears wrong until it re-suggests
something you settled last week.

So every check here executes the real path and inspects the real output.

CHECK 6 IS THE ONE THAT MATTERS. Every other check can pass while the payload
silently drops a section. A test that only confirms success cannot distinguish
"working" from "broken in the safe direction" -- so this one deliberately
BREAKS the install, confirms the breakage is reported, and repairs it.
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CLAUDE = os.path.dirname(HERE)
ROOT = os.path.dirname(CLAUDE)
SETTINGS = os.path.join(CLAUDE, "settings.json")
STATE = os.path.join(CLAUDE, "STATE.md")
PROJECT = os.path.join(CLAUDE, "PROJECT.md")

DOOR = 10000        # Claude Code's per-hook-entry character limit

fails = []


def chk(cond, msg):
    if not cond:
        fails.append(msg)
    print("  %-4s %s" % ("pass" if cond else "FAIL", msg))
    return cond


def run(script, *args):
    """-> (returncode, stdout). Runs the REAL script, not a simulation."""
    p = subprocess.run([sys.executable, os.path.join(HERE, script)] + list(args),
                       capture_output=True, text=True, encoding="utf-8")
    return p.returncode, (p.stdout or "")


def main():
    print("Continuity Kit -- acceptance test\n")

    # 1 -- settings parse
    ok = os.path.exists(SETTINGS)
    cfg = {}
    if ok:
        try:
            with open(SETTINGS, "r", encoding="utf-8") as fh:
                cfg = json.load(fh)
            chk(True, "settings.json parses as valid JSON")
        except Exception as e:
            chk(False, "settings.json is not valid JSON: %s" % e)
    else:
        chk(False, "settings.json exists")

    # 2 -- hooks registered, and SessionStart covers ALL THREE triggers.
    # Registering one trigger means the agent wakes oriented sometimes and
    # blank other times, which is harder to diagnose than never working.
    hooks = (cfg or {}).get("hooks", {})
    ss = hooks.get("SessionStart", [])
    matchers = " ".join(h.get("matcher", "") for h in ss)
    chk(bool(ss), "SessionStart hook is registered")
    for trig in ("startup", "compact", "clear"):
        chk(trig in matchers, "SessionStart covers '%s'" % trig)
    chk(bool(hooks.get("PreCompact")), "PreCompact hook is registered")

    # THE INTERPRETER IN settings.json MUST ACTUALLY EXIST ON THIS MACHINE.
    # settings.json names an interpreter by word ("python" / "python3"), and
    # Claude Code runs that word through the shell -- NOT through the Python
    # that is running this verifier. On macOS "python" frequently does not
    # exist at all, only "python3". When it is wrong the hook fails silently:
    # the session starts, the agent sounds fine, and the orientation payload
    # simply never arrives. That is the single most likely cross-platform
    # break, and without this check every other test still reports PASS.
    import shutil
    cmds = []
    for group in list(ss) + list(hooks.get("PreCompact", [])):
        for h in group.get("hooks", []):
            c = (h.get("command") or "").split()
            if c:
                cmds.append(c[0])
    for interp in sorted(set(cmds)):
        chk(shutil.which(interp) is not None,
            "hook interpreter %r resolves on this machine (settings.json "
            "names it; a wrong name fails SILENTLY)" % interp)

    # 3/4 -- the hook actually runs, and fits through the door
    rc, out = run("session_start.py")
    chk(rc == 0, "session_start.py exits 0 (a non-zero hook can block a session)")
    chk(len(out.strip()) > 0, "orientation payload is non-empty")
    chk(len(out) < DOOR,
        "payload is %d chars, under the %d-char door" % (len(out), DOOR))

    # 5 -- CONTENT arrives, not merely files existing
    for name, probe in (("PROJECT.md", "PROJECT"),
                        ("DECISIONS.md", "DECISION"),
                        ("STATE.md", "STATE")):
        path = os.path.join(CLAUDE, name)
        got = False
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as fh:
                first = [l.strip() for l in fh if l.strip()][:6]
            got = any(l in out for l in first if len(l) > 12)
        chk(got, "%s CONTENT reaches the payload (not just the file existing)"
            % name)

    # 6 -- NEGATIVE CONTROL. Break it on purpose; a missing document must be
    # reported as MISSING, never silently omitted. Restored in `finally` so a
    # crash mid-check cannot leave the user's install damaged.
    if os.path.exists(PROJECT):
        tmp = PROJECT + ".verify-bak"
        os.replace(PROJECT, tmp)
        try:
            _, broken = run("session_start.py")
            chk("MISSING" in broken,
                "NEGATIVE CONTROL: a missing document is reported as MISSING, "
                "not silently dropped")
        finally:
            os.replace(tmp, PROJECT)
        chk(os.path.exists(PROJECT), "negative control restored the file")
    else:
        chk(False, "PROJECT.md exists (needed for the negative control)")

    # 7/8 -- banking works and stays BOUNDED
    before = open(STATE, encoding="utf-8").read() if os.path.exists(STATE) else ""
    for i in range(4):
        run("pre_compact.py", "verify probe %d" % i)
    after = open(STATE, encoding="utf-8").read() if os.path.exists(STATE) else ""
    chk(len(after) > 0 and "Working thread" in after,
        "pre_compact.py appends a banked block to STATE.md")
    n = after.count("### banked ")
    chk(n == 3,
        "bank is BOUNDED at 3 blocks after 4 runs (found %d) -- unbounded "
        "growth would silently truncate the whole payload" % n)

    rc2, out2 = run("session_start.py", "--check")
    chk(rc2 == 0 and "budget" in out2,
        "budget check still reports after banking")

    # 9 -- recall finds by description only
    mem = os.path.join(CLAUDE, "memory")
    os.makedirs(mem, exist_ok=True)
    probe = os.path.join(mem, "_verify_probe.md")
    with open(probe, "w", encoding="utf-8") as fh:
        fh.write("---\nname: verify-probe\n"
                 "description: zqxjkw sentinel used only by the verifier\n"
                 "---\n\nbody text that does not contain the sentinel.\n")
    try:
        rc3, out3 = run("recall.py", "zqxjkw")
        chk(rc3 == 0 and "verify-probe" in out3,
            "recall.py finds a memory by a word in its description only")
    finally:
        os.remove(probe)

    print()
    if fails:
        print("CONTINUITY: FAIL (%d)" % len(fails))
        for f in fails:
            print("  - %s" % f)
        return 1
    print("CONTINUITY: PASS -- the agent will wake oriented.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
