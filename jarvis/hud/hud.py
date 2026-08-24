#!/usr/bin/env python3
"""JARVIS HUD — one dark terminal screen: vitals, command deck, schedule,
audio I/O, live vault feed.

Stdlib only. psutil is used when present for better vitals; otherwise it falls
back to /proc on Linux and degrades to "n/a" elsewhere.

    python3 jarvis/hud/hud.py            # live, refreshes every 2s
    python3 jarvis/hud/hud.py --once     # render one frame and exit
    JARVIS_VAULT=~/Notes python3 hud.py  # custom vault
"""
from __future__ import annotations

import json
import os
import re
import shutil
import signal
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

VAULT = Path(os.environ.get("JARVIS_VAULT", Path.home() / "Vault"))
REFRESH = 2.0

DIM = "\x1b[38;5;240m"
LBL = "\x1b[38;5;108m"
TXT = "\x1b[38;5;186m"
HOT = "\x1b[38;5;191m"
ACC = "\x1b[38;5;141m"
RST = "\x1b[0m"
BOLD = "\x1b[1m"

try:
    import psutil  # type: ignore
except ImportError:
    psutil = None


# --- data ------------------------------------------------------------------

def _read_proc_meminfo() -> tuple[float, float] | None:
    try:
        info = {}
        for line in Path("/proc/meminfo").read_text().splitlines():
            k, _, v = line.partition(":")
            info[k] = float(v.split()[0]) / (1024 * 1024)  # GiB
        total = info["MemTotal"]
        avail = info.get("MemAvailable", info.get("MemFree", 0.0))
        return total - avail, total
    except Exception:
        return None


def vitals() -> dict:
    out: dict[str, str] = {}

    if psutil:
        out["cpu"] = f"{psutil.cpu_percent(interval=None):.1f}%"
        m = psutil.virtual_memory()
        out["mem"] = f"{(m.total - m.available) / 2**30:.1f} GB / {m.total / 2**30:.0f} GB"
        out["mem_pct"] = f"{m.percent:.0f}%"
        try:
            n = psutil.net_io_counters()
            out["net"] = f"{(n.bytes_sent + n.bytes_recv) / 2**30:.1f} GB total"
        except Exception:
            out["net"] = "n/a"
        boot = datetime.fromtimestamp(psutil.boot_time())
    else:
        try:
            load = os.getloadavg()[0]
            cpus = os.cpu_count() or 1
            out["cpu"] = f"{min(load / cpus * 100, 100):.1f}%"
        except (OSError, AttributeError):
            out["cpu"] = "n/a"
        mem = _read_proc_meminfo()
        if mem:
            used, total = mem
            out["mem"] = f"{used:.1f} GB / {total:.0f} GB"
            out["mem_pct"] = f"{used / total * 100:.0f}%"
        else:
            out["mem"], out["mem_pct"] = "n/a", "--"
        out["net"] = "n/a"
        boot = None
        try:
            boot = datetime.now() - timedelta(seconds=float(
                Path("/proc/uptime").read_text().split()[0]))
        except Exception:
            pass

    if boot:
        up = datetime.now() - boot
        out["uptime"] = f"{up.days}D {up.seconds // 3600:02d}H {up.seconds % 3600 // 60:02d}M"
    else:
        out["uptime"] = "n/a"
    return out


def schedule() -> list[tuple[str, str]]:
    """Rows of (HH:MM, what) parsed from system/schedule.md markdown table."""
    path = VAULT / "system" / "schedule.md"
    rows: list[tuple[str, str]] = []
    if not path.exists():
        return rows
    for line in path.read_text(errors="replace").splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 2 and re.fullmatch(r"\d{1,2}:\d{2}", cells[0]):
            rows.append((cells[0], cells[1]))
    return rows


def vault_feed(limit: int = 6) -> list[str]:
    """Most recently modified notes, newest first."""
    if not VAULT.exists():
        return ["vault not found — run jarvis/install.sh"]
    notes = [p for p in VAULT.rglob("*.md") if p.is_file()]
    notes.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    feed = []
    for p in notes[:limit]:
        age = time.time() - p.stat().st_mtime
        when = f"{int(age // 60)}m" if age < 3600 else (
            f"{int(age // 3600)}h" if age < 86400 else f"{int(age // 86400)}d")
        feed.append(f"{p.relative_to(VAULT)}  ({when})")
    return feed or ["vault is empty"]


def directive() -> tuple[str, int, int, str]:
    """(label, current, target, pace) from the newest line of metrics.json."""
    path = VAULT / "system" / "metrics.json"
    label, cur, target = "SUBS", 0, 0
    pace = "no baseline yet"
    if not path.exists():
        return label, cur, target, pace
    lines = [l for l in path.read_text(errors="replace").splitlines() if l.strip()]
    points = []
    for line in lines:
        try:
            points.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    if not points:
        return label, cur, target, pace
    latest = points[-1]
    key = next((k for k in latest if k.endswith("subs")), None)
    if key is None:
        key = next((k for k in latest if isinstance(latest[k], (int, float))
                    and k != "ts"), None)
    if key is None:
        return label, cur, target, pace
    label = key.replace("_", " ").upper()
    cur = int(latest[key])
    target = int(latest.get("target", 0))
    if len(points) >= 2 and key in points[0]:
        try:
            t0 = datetime.fromisoformat(str(points[0]["ts"]).replace("Z", "+00:00"))
            t1 = datetime.fromisoformat(str(latest["ts"]).replace("Z", "+00:00"))
            days = max((t1 - t0).total_seconds() / 86400, 1e-9)
            per_week = (cur - int(points[0][key])) / days * 7
            pace = f"{per_week:+,.0f}/wk"
            if target > cur and per_week > 0:
                eta = t1 + timedelta(weeks=(target - cur) / per_week)
                pace += f"  ·  at this pace {eta:%b %Y}"
        except (KeyError, ValueError, TypeError):
            pass
    return label, cur, target, pace


def audio_status() -> str:
    for mod in ("sounddevice", "faster_whisper"):
        try:
            __import__(mod)
        except ImportError:
            return "Offline — pip install sounddevice faster-whisper"
    for tts in ("say", "piper", "espeak-ng", "espeak"):
        if shutil.which(tts):
            return f"Online — STT local · TTS {tts}"
    return "STT ready · no TTS binary found"


# --- render ----------------------------------------------------------------

def panel(title: str, sub: str, rows: list[str], width: int) -> list[str]:
    inner = width - 2
    out = [f"{DIM}┌{'─' * inner}┐{RST}"]
    head = f" {LBL}{BOLD}{title}{RST} {DIM}{sub}{RST}"
    out.append(f"{DIM}│{RST}{head}{' ' * max(0, inner - len(title) - len(sub) - 2)}{DIM}│{RST}")
    for r in rows:
        plain = re.sub(r"\x1b\[[0-9;]*m", "", r)
        clipped = r if len(plain) <= inner - 2 else plain[: inner - 3] + "…"
        pad = " " * max(0, inner - len(re.sub(r"\x1b\[[0-9;]*m", "", clipped)) - 1)
        out.append(f"{DIM}│{RST} {clipped}{pad}{DIM}│{RST}")
    out.append(f"{DIM}└{'─' * inner}┘{RST}")
    return out


def columns(blocks: list[list[str]], gap: int = 1) -> list[str]:
    height = max(len(b) for b in blocks)
    widths = [max(len(re.sub(r"\x1b\[[0-9;]*m", "", l)) for l in b) for b in blocks]
    lines = []
    for i in range(height):
        row = []
        for b, w in zip(blocks, widths):
            cell = b[i] if i < len(b) else ""
            pad = w - len(re.sub(r"\x1b\[[0-9;]*m", "", cell))
            row.append(cell + " " * pad)
        lines.append((" " * gap).join(row))
    return lines


COMMANDS = [
    "MORNING BRIEF", "PLAN TODAY", "METRICS PULL",
    "TREND SCAN", "CLOSE THE DAY", "VAULT SEARCH",
]


def frame() -> str:
    cols = shutil.get_terminal_size((100, 30)).columns
    cols = max(72, min(cols, 140))
    half = cols // 2
    left_w, right_w = half, cols - half - 1

    v = vitals()
    now = datetime.now()

    header = (f"{ACC}{BOLD} J A R V I S {RST}{DIM} personal operating system{RST}"
              f"{' ' * max(1, cols - 60)}{HOT}{now:%H:%M:%S}{RST}")

    left = panel("SYSTEM VITALS", "all systems active", [
        f"{LBL}CPU{RST}      {TXT}{v['cpu']}{RST}",
        f"{LBL}MEMORY{RST}   {TXT}{v['mem']}  ({v['mem_pct']}){RST}",
        f"{LBL}NETWORK{RST}  {TXT}{v['net']}{RST}",
        f"{LBL}UPTIME{RST}   {TXT}{v['uptime']}{RST}",
    ], left_w)

    deck_rows = []
    for i in range(0, len(COMMANDS), 2):
        pair = COMMANDS[i:i + 2]
        cells = [f"{ACC}•{RST} {TXT}{c:<16}{RST}" for c in pair]
        deck_rows.append("".join(cells))
    deck_rows.append(f"{DIM}say any of these to Claude Code{RST}")
    left += panel("COMMAND DECK", "top 6", deck_rows, left_w)

    sched = schedule()
    clock = f"{now:%H:%M}"
    current = max((t for t, _ in sched if t <= clock), default=None)
    sched_rows = []
    for t, what in sched:
        marker = f"{HOT}  NOW{RST}" if t == current else ""
        room = right_w - 16 - (5 if marker else 0)
        if len(what) > room:
            what = what[: max(0, room - 1)] + "…"
        sched_rows.append(f"{LBL}{t}{RST}  {TXT}{what}{RST}{marker}")
    right = panel("SCHEDULE", "today's plan", sched_rows or ["no schedule.md"], right_w)
    right += panel("AUDIO I/O", "", [f"{TXT}{audio_status()}{RST}"], right_w)
    right += panel("LIVE VAULT FEED", "", [f"{ACC}•{RST} {TXT}{f}{RST}" for f in vault_feed()],
                   right_w)

    label, cur, target, pace = directive()
    remain = f"{target - cur:,} to go  ·  " if target > cur else ""
    footer = [
        f"{DIM}{'─' * cols}{RST}",
        f"{DIM}PRIMARY DIRECTIVE{RST}  {HOT}{BOLD}{cur:,}{RST} {LBL}{label}{RST}"
        f"   {DIM}{remain}{pace}{RST}",
        f"{DIM}vault: {VAULT}{RST}",
    ]

    body = columns([left, right])
    return "\n".join([header, ""] + body + footer)


def main() -> int:
    once = "--once" in sys.argv
    if once:
        print(frame())
        return 0
    signal.signal(signal.SIGINT, lambda *_: (_show_cursor(), sys.exit(0)))
    sys.stdout.write("\x1b[?25l")  # hide cursor
    try:
        while True:
            sys.stdout.write("\x1b[H\x1b[2J" + frame() + "\n")
            sys.stdout.flush()
            time.sleep(REFRESH)
    finally:
        _show_cursor()
    return 0


def _show_cursor() -> None:
    sys.stdout.write("\x1b[?25h")
    sys.stdout.flush()


if __name__ == "__main__":
    raise SystemExit(main())
