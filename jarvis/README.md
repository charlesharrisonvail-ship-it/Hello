# JARVIS — a personal OS in four parts

Four parts, one system. Nothing here is a service you sign up for: it's Claude
Code, a folder of markdown, two Python files, and about an evening of setup.

| Part | What it is | Where |
|------|-----------|-------|
| **The brain** | Claude Code + a folder of small skills | `.claude/skills/jarvis*` |
| **The memory** | An Obsidian-readable markdown vault | `$JARVIS_VAULT` (default `~/Vault`) |
| **The voice** | Local push-to-talk STT + local TTS | `jarvis/voice/ptt.py` |
| **The face** | One dark terminal HUD | `jarvis/hud/hud.py` |

## Install

```bash
git clone https://github.com/charlesharrisonvail-ship-it/hello.git
cd hello
./jarvis/install.sh                    # vault at ~/Vault, skills into ~/.claude/skills
```

Options: `--project` installs the skills for one repo instead of your user
account, `--dry-run` shows what it would do, `JARVIS_VAULT=~/Notes` puts the
vault somewhere else. The script is idempotent — it never overwrites a note you
already have, so re-run it after a `git pull`.

Point Obsidian at the vault folder and you get the graph view for free. The
skills read and write plain files, so Obsidian is optional.

## Step 1 — the brain

Six skills, each one file. Claude Code loads a skill only when the request
matches it, so the whole brain costs nothing until it's used.

| Skill | Fires on |
|-------|----------|
| `jarvis` | router + daily routine; "jarvis", "run the routine" |
| `jarvis-inbox` | "morning brief", "what's in my inbox" |
| `jarvis-metrics` | "metrics pull", "check my numbers" |
| `jarvis-trends` | "what's moving", "AI news", "trend scan" |
| `jarvis-plan` | "plan today", "close the day" |
| `jarvis-vault` | "remember this", "what do you know about X" |

The rule that keeps it working: **small, single-purpose skills beat one giant
prompt.** When a workflow gets its own shape, give it its own file.

## Step 2 — the memory

```
Vault/
  raw/       everything captured, verbatim
  wiki/      distilled knowledge, one topic per note
  outputs/   everything JARVIS produces — briefs, plans, reports
  system/    schedule.md, metrics.json (JSONL), queue.jsonl
```

Every report is markdown; no database. Notes link with `[[wiki links]]`, so the
graph builds itself. **If it's not in the vault, it didn't happen.**

## Step 3 — the voice

```bash
pip install sounddevice numpy faster-whisper
sudo apt install espeak-ng          # or: brew install piper
python3 jarvis/voice/ptt.py         # hold SPACE, speak, let go · q to quit
```

Audio never leaves the machine: faster-whisper transcribes locally, the text
goes to `claude -p`, and a local TTS binary speaks the reply. Free forever,
private by default, no API round-trip. No mic yet? `--text` runs the same loop
over typed input.

Setup time: ~15 minutes, most of it the first model download.

## Step 4 — the face

```bash
pip install psutil                  # optional, better vitals
python3 jarvis/hud/hud.py           # --once renders a single frame
```

One screen, no tabs: system vitals, the command deck, today's schedule, audio
I/O status, the live vault feed, and the primary directive counter with a pace
projection from `system/metrics.json`.

The HUD is a read-only face — it renders what's in the vault. To change what it
shows, edit the vault (or ask Claude to).

## The daily routine

| Time | What happens |
|------|--------------|
| 07:00 | Morning brief — inbox, calendar, AI news read aloud |
| 09:00 | Plan today — top 3 priorities saved in the vault |
| 14:00 | Metrics pull — subs, views, followers tracked |
| 19:00 | Close the day — reflection logged, tomorrow queued |
| Anytime | Ask anything — the vault remembers everything |

Run a slot by saying its name to Claude Code. To automate, either use Claude
Code's own scheduler (ask: *"schedule the morning brief for 7am on weekdays"*)
or cron:

```cron
0 7 * * 1-5 cd ~/hello && claude -p "morning brief" >> ~/Vault/system/cron.log 2>&1
0 9 * * 1-5 cd ~/hello && claude -p "plan today"    >> ~/Vault/system/cron.log 2>&1
0 14 * * 1-5 cd ~/hello && claude -p "metrics pull" >> ~/Vault/system/cron.log 2>&1
0 19 * * 1-5 cd ~/hello && claude -p "close the day" >> ~/Vault/system/cron.log 2>&1
```

Edit `Vault/system/schedule.md` to change the times — the HUD reads that file.

## Connecting real data

The skills use whatever tools Claude Code already has. Mail and calendar come
from the Gmail / Google Calendar / Microsoft 365 connectors; metrics from
analytics connectors or your own script; trends from web search. A source
that isn't connected is skipped and named in the report — no skill invents a
number to fill a gap.
