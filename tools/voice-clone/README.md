# Charles's voice clone — free, on the laptop

Setup notes for cloning Charles's speaking voice with
[Chatterbox](https://github.com/resemble-ai/chatterbox) by Resemble AI, plus
`speak.py`, a small script that makes the clone and speaks text in it.

Targets **Windows** (ThinkPad). This directory holds **notes and one script
only** — Chatterbox's source is not vendored here. Written against upstream
commit `5de7a54` (2026-07-21, package version 0.1.7).

**This is the backup.** Charles's approved voice is his HeyGen clone,
"Charles Harrison" (`recall.py voice`). Use this free route when HeyGen
credits run out, or for drafts not worth a credit. A clean 10–20 second
stretch of his own HeyGen source recording makes a good `my-voice.wav`.

**Not yet tested on Charles's laptop.** `speak.py` was written from
Chatterbox's source; nobody has run it end to end. Fix these notes with
whatever goes wrong the first time.

## Read this first: what is free and what is not

**Charles does not pay for this.** No account, no API key, no credits.

| Part | Free? | Why |
|---|---|---|
| Chatterbox (code and model weights) | Yes | MIT licence, so business use is allowed |
| Model download | Yes | Public on Hugging Face; no sign-in needed |
| Resemble AI's hosted service | No | Not used here. If a page asks you to sign up, you're on the wrong one |

The catch: the clone lives **only on the laptop**. A Claude cloud session
can write the script for the voice, but it can't speak in it.

## 1. Record yourself (10–20 seconds)

Chatterbox learns your voice from the **first 10–15 seconds** of one
recording, and refuses anything under 5 seconds. Longer doesn't help, but
cleaner does.

- Quiet room, no music or fan; phone or headset mic 6–8 inches away.
- Speak the way you do with a client: natural pace, your own warmth and
  accent. Don't put on a "recording voice".
- Something like: *"Good morning, this is Charles Harrison with Epique Realty
  here in the Colorado mountains. I wanted to reach out personally, because
  the agents I talk to tell me the same thing…"* Keep going for 20 seconds.
- On Windows 11: open **Sound Recorder**, go to **… → Settings → Recording
  format**, choose **WAV** (or FLAC), then record. Rename the file
  `my-voice.wav`.
- Listen back. If you hear a hum, a click, or another voice, record it again.
  The clone copies the room as well as the voice.

## 2. Install (one time, about 3 GB of disk)

1. Install **Python 3.11** from
   [python.org](https://www.python.org/downloads/windows/). On the first
   screen tick **Add python.exe to PATH**.
2. Install **Git for Windows** from [git-scm.com](https://git-scm.com/download/win)
   with the default options. Chatterbox pulls one part of itself from GitHub
   during install, so pip needs Git.
3. Make a folder for the voice and a private Python inside it. Open
   **PowerShell** (not as Administrator) and paste these one at a time:

   ```powershell
   mkdir $env:USERPROFILE\EpiVail-Voice
   ```

   ```powershell
   cd $env:USERPROFILE\EpiVail-Voice
   ```

   ```powershell
   py -3.11 -m venv venv
   ```

4. Install the CPU build of PyTorch, then Chatterbox at the version these
   notes were written for:

   ```powershell
   .\venv\Scripts\python.exe -m pip install --upgrade pip
   ```

   ```powershell
   .\venv\Scripts\python.exe -m pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu
   ```

   ```powershell
   .\venv\Scripts\python.exe -m pip install "chatterbox-tts @ git+https://github.com/resemble-ai/chatterbox.git@5de7a54"
   ```

   (If the laptop has an NVIDIA graphics card, leave out `--index-url …` in
   the PyTorch line and it will be much faster. A typical ThinkPad doesn't.)
5. Put `speak.py` from this folder into `EpiVail-Voice`. On GitHub, open
   `tools/voice-clone/speak.py` and click **Download raw file**, then move it
   there. Put `my-voice.wav` there too.

The commands call `.\venv\Scripts\python.exe` directly, so you never have to
"activate" anything and Windows' script-blocking setting never gets in the
way.

## 3. Make the clone (one time)

```powershell
.\venv\Scripts\python.exe speak.py clone my-voice.wav
```

The first run downloads the model from Hugging Face (several hundred MB,
once). It saves your voice as `charles-voice-nano.pt` in `EpiVail-Voice`.
**That small file is the clone.** Keep it and `my-voice.wav` backed up
somewhere private, like your own OneDrive, and nowhere else.

## 4. Speak

One line:

```powershell
.\venv\Scripts\python.exe speak.py say "Good morning, y'all. Thank you for taking a minute with me."
```

A whole script saved as a `.txt` file:

```powershell
.\venv\Scripts\python.exe speak.py say --file script.txt
```

Each run saves a `.wav` in `EpiVail-Voice\out\` and prints where. Add
`-o somewhere.wav` to choose the name.

**Nano or Turbo.** The default is **Nano**, the small model built for
laptops (upstream says about 3× faster than real time on an 8-core CPU).
For a recording that matters, try **Turbo**, which sounds better but is
slower on a CPU. It needs its own clone, made once:

```powershell
.\venv\Scripts\python.exe speak.py clone my-voice.wav --model turbo
```

```powershell
.\venv\Scripts\python.exe speak.py say --file script.txt --model turbo
```

**Tips.** Write for the ear: short sentences, contractions, commas where you
would breathe. The script reads long text in pieces of about 250
characters, split at sentence ends. If one sentence comes out odd, run it
again; every take is a little different. Chatterbox also understands a few
cues in the text, such as `[chuckle]`, `[laugh]` and `[sigh]`. Use them
sparingly.

## Rules for using the voice

- **Charles's voice only.** Never clone anyone else's voice without their
  written permission.
- **Never in automated calls.** The FCC ruled in February 2024 that
  AI-generated voices are "artificial" voices under the TCPA. Robocalls and
  ringless voicemail drops that use one need the recipient's prior express
  consent. Don't load the voice into a dialer, Lofty, or any voicemail-drop
  tool.
- **Every send goes through Charles,** and every send checks the "Do not
  contact" list in `CLAUDE.md` first, the same as written outreach.
- **Don't strip the watermark.** Chatterbox marks every file with Resemble
  AI's inaudible Perth watermark, which is what lets the audio be shown to
  be AI-made later.
- **Never commit the recording or the clone.** They are Charles's voiceprint.
  `.gitignore` here blocks the usual audio and `.pt` files, but don't rely
  on it: keep them on the laptop.
- **EpiVail first.** The clone was made for EpiVail. Using it for AiRE Estate
  is Charles's call. AiRE's public materials never front his name, and its
  narrator is "AiRE".
- **Scripts follow the EpiVail rules** in `CLAUDE.md`: the signature,
  Southern manners, and never "Epique Mountain Collective".

## Why it isn't vendored

Chatterbox comes with PyTorch, large model weights and many pinned
dependencies. Vendoring them would bloat this repo and go stale. These notes
pin an exact upstream commit instead. To move to a newer one, change the
`@5de7a54` in step 2 and test it.
