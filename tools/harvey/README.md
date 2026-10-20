# Harvey — free Windows setup, leads only

Setup notes for [Harvey](https://github.com/ethanplusai/harvey) by ethanplusai.
Harvey is an open-source AI sales agent that finds businesses, reads their
websites, works out who the decision-makers are, and lists them for you.

Targets **Windows** (ThinkPad). This directory holds **notes and a config
file only**; Harvey's source is not vendored here. Written against upstream
commit `e114e95` (2026-10-15).

**What this setup does:** Harvey finds and scores real estate agents and
brokerages in Colorado ski towns, then saves them to a spreadsheet (CSV).
**What it does not do:** send anything. Email and LinkedIn are switched off in
the config file, so Harvey cannot send.

## Read this first: what is free and what is not

**Charles does not pay for this.** Nothing below needs a card.

| Part | Free? | Notes |
|---|---|---|
| Harvey itself | Yes | MIT licence |
| Its thinking | Uses your Claude plan | Runs on the Claude Pro or Max plan you already sign in to Claude Code with. No API key, no per-use bill. The config holds it to 50% of your daily plan. |
| Finding brokerages | Yes, with Serper | **Serper** gives 2,500 free searches with no card. One full run of this config uses about 140 of them. |
| Harvey's default free source (OpenStreetMap) | Can't be used | It only knows roofers, plumbers, HVAC, electricians, dentists, lawyers, contractors and landscapers. It has **no real estate category**, so we use Serper instead. |
| Checking email addresses | Optional, free | A free **Reoon** key gives 600 checks a month. Without it, addresses are marked "guess". |
| DataForSEO | Skip | It needs a $50 deposit to go live |

If Harvey or any website asks for a card, stop and skip that step.

## Install (Windows)

Open **PowerShell** (not as Administrator) and run these one at a time.

1. **Install Python 3.13 and Git** (skip either one you already have):

   ```powershell
   winget install --id Python.Python.3.13
   winget install --id Git.Git
   ```

   Close PowerShell and open it again afterwards so it finds them.

2. **Check that Claude Code is signed in.** Harvey does its thinking through it:

   ```powershell
   claude -p "say hi"
   ```

   If it answers, you're set. If it asks you to log in, run `claude` and sign
   in with your Claude account, then try again.

3. **Download Harvey** into `C:\Users\<you>\src\harvey`:

   ```powershell
   mkdir "$env:USERPROFILE\src" -Force; cd "$env:USERPROFILE\src"
   git clone https://github.com/ethanplusai/harvey.git
   cd harvey
   ```

4. **Set up its Python environment:**

   ```powershell
   py -3.13 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -e .
   ```

   If step 2 of that says *running scripts is disabled*, run
   `Set-ExecutionPolicy -Scope Process Bypass` and try again. That only lasts
   until you close the window.

   Skip `harvey install`. All it adds is a browser for LinkedIn, and LinkedIn
   stays off.

## Configure

1. **Copy in the EpiVail config.** From the Harvey folder, with your copy of
   this repo at `C:\Users\<you>\src\Hello` (change the path if yours is
   elsewhere):

   ```powershell
   Copy-Item "$env:USERPROFILE\src\Hello\tools\harvey\harvey.local.yaml" .
   ```

   It searches for real estate brokerages and agents in 23 Colorado ski towns,
   starting with Breckenridge, Aspen, Telluride and Steamboat Springs, then the
   Vail Valley, Summit County, Crested Butte, Winter Park, Durango and others.
   To add a town, open it in Notepad and add a line under `geography:`, such as
   `- "Leadville, CO"`. Each town adds two searches, about 6 of your free
   Serper searches.

   To search only some towns, name them with `--city`, separated by
   semicolons: `harvey discover --provider serper --city "Aspen, CO;Telluride, CO"`.

   Leave `enabled: false` under both `email:` and `linkedin:`. Those two lines
   are what keep Harvey from sending.

2. **Get a free Serper key.** Sign up at [serper.dev](https://serper.dev) (no
   card), then copy your API key from the dashboard.

3. **Make the `.env` file and paste the key in:**

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

   Find `SERPER_API_KEY=` and paste your key straight after the `=`. Save and
   close. Fill in nothing else, and never put this key in a chat or a commit.

   *Optional:* for checked email addresses, sign up free at
   [reoon.com/email-verifier](https://reoon.com/email-verifier) and paste its
   key after `REOON_API_KEY=`.

## Find leads

Do these with `.venv` active. Each new PowerShell window needs
`cd "$env:USERPROFILE\src\harvey"; .\.venv\Scripts\Activate.ps1` first.

1. **Allow Harvey to note what it sees.** It collects nothing until you say so.
   `free` turns on the 21 signals that cost nothing:

   ```powershell
   harvey signals --confirm free
   ```

2. **Preview the search, then run it:**

   ```powershell
   harvey discover --provider serper --estimate
   harvey discover --provider serper
   ```

   The preview should show 46 searches (two per town). Its "Estimated cost" comes out of your
   2,500 free Serper searches, not your wallet. Lines saying *no coordinates*
   are harmless for Serper. It also reads each brokerage's website for free.

3. **Find the people.** Brokerages are found by now, but the agents in them are
   found by Harvey's main loop:

   ```powershell
   harvey run
   ```

   When the log shows a `scout` line with prospects found, press **Ctrl+C**.
   After that Harvey would start drafting emails, which email being off means
   nobody will ever send. Stopping saves your Claude plan.

4. **Save the list to a spreadsheet:**

   ```powershell
   harvey export --all --out vail-agents.csv
   ```

   `--all` includes people whose address is only a guess. With a Reoon key,
   leave `--all` off to get checked addresses only.

To see everything in a browser instead, run `harvey dashboard` and open
<http://localhost:5555>.

## Before these leads go anywhere

- **Check the "Do not contact" list** in this repo's `CLAUDE.md` and delete
  anyone on it from the CSV **before** it goes into Lofty or any sequence.
  Harvey doesn't know about that list.
- **Enrich before you write.** Harvey's list is a starting point. Run the
  `lead-enrichment` agent on the good ones, load them into Lofty, then write.
- **A "guess" email is a guess.** Don't send to it until it's confirmed.

## If you ever turn sending on

Not recommended for now, but worth knowing. Harvey wants a **separate sending
domain** (never your main email) with SPF, DKIM and DMARC set up and warmed up
for 2–4 weeks. Every email waits for your approval by default. The
"Do not contact" list would need to be blocked inside Harvey too. Any message
Harvey writes for EpiVail must be signed exactly
**Charles Harrison, Epique Area/Growth Leader**. Ask Claude to set this up
properly first rather than flipping `enabled` to `true`.

## Troubleshooting

- **`harvey` is not recognized** — the Python environment isn't active. Run
  `.\.venv\Scripts\Activate.ps1` from the Harvey folder.
- **`py -3.13` not found** — reopen PowerShell after installing Python. If it
  is still missing, run `py -0` to see which versions are installed. Harvey
  needs 3.11 or newer.
- **Harvey starts a setup wizard** — `harvey.local.yaml` isn't in the Harvey
  folder. Redo Configure step 1.
- **Discover finds nothing** — check `SERPER_API_KEY` in `.env` and run
  `harvey signals --confirm free` again.
- **`harvey run` does nothing during the evening** — quiet hours are 9 pm to
  7 am Mountain time. Change them under `quiet_hours:` in the config.
- **Claude errors** — run `claude -p "say hi"`. If that fails, sign in to
  Claude Code again.
- **Stop it right now** — **Ctrl+C**. Everything is saved in
  `data\harvey.db`, so it resumes cleanly.

All data stays on your laptop in the Harvey folder: `data\harvey.db`, `.env`
and `harvey.local.yaml`.
