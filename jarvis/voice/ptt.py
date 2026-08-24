#!/usr/bin/env python3
"""JARVIS voice — push-to-talk, fully local.

Hold SPACE, speak, let go. Audio is transcribed on this machine
(faster-whisper), the text goes to Claude Code, and the reply is spoken back
with a local TTS binary. Nothing audio-shaped leaves the machine.

    python3 jarvis/voice/ptt.py            # hold SPACE to talk, q to quit
    python3 jarvis/voice/ptt.py --text     # type instead of talk (no mic needed)
    JARVIS_STT_MODEL=small.en python3 jarvis/voice/ptt.py

Requires: pip install sounddevice numpy faster-whisper
TTS binary: `say` (macOS), `piper` (+ $PIPER_MODEL), or `espeak-ng`.
"""
from __future__ import annotations

import os
import select
import shutil
import subprocess
import sys
import termios
import tty

SAMPLE_RATE = 16000
RELEASE_GAP = 0.35  # seconds without a SPACE repeat = key released
MODEL = os.environ.get("JARVIS_STT_MODEL", "base.en")
VAULT = os.environ.get("JARVIS_VAULT", os.path.expanduser("~/Vault"))

DIM, HOT, RST = "\x1b[38;5;240m", "\x1b[38;5;191m", "\x1b[0m"


# --- speech out -------------------------------------------------------------

def tts_command(text: str) -> list[str] | None:
    if shutil.which("say"):
        return ["say", text]
    piper_model = os.environ.get("PIPER_MODEL")
    if shutil.which("piper") and piper_model:
        return ["piper", "--model", piper_model, "--output_raw"]
    for binary in ("espeak-ng", "espeak"):
        if shutil.which(binary):
            return [binary, "-s", "165", text]
    return None


def speak(text: str) -> None:
    cmd = tts_command(text)
    if not cmd:
        print(f"{DIM}(no TTS binary — install piper or espeak-ng){RST}")
        return
    try:
        if cmd[0] == "piper":
            player = "aplay" if shutil.which("aplay") else "play"
            piper = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
            subprocess.run([player, "-r", "22050", "-f", "S16_LE", "-t", "raw", "-"],
                           stdin=piper.stdout, check=False)
            piper.communicate(text.encode())
        else:
            subprocess.run(cmd, check=False)
    except OSError as exc:
        print(f"{DIM}(TTS failed: {exc}){RST}")


# --- the brain --------------------------------------------------------------

def ask_claude(prompt: str) -> str:
    if not shutil.which("claude"):
        return "Claude Code is not on PATH, so I can't answer that yet."
    env = {**os.environ, "JARVIS_VAULT": VAULT}
    try:
        done = subprocess.run(
            ["claude", "-p", prompt],
            capture_output=True, text=True, env=env, timeout=180,
        )
    except subprocess.TimeoutExpired:
        return "That took too long — check the terminal."
    reply = (done.stdout or done.stderr).strip()
    return reply or "No reply."


def handle(text: str) -> None:
    print(f"{HOT}you{RST}  {text}")
    reply = ask_claude(text)
    print(f"{HOT}jarvis{RST}  {reply}\n")
    # Speak the first paragraph only; the long form lives in the vault.
    speak(reply.split("\n\n")[0][:600])


# --- speech in --------------------------------------------------------------

def load_stt():
    try:
        from faster_whisper import WhisperModel  # type: ignore
    except ImportError:
        sys.exit("faster-whisper missing — pip install faster-whisper")
    print(f"{DIM}loading {MODEL}…{RST}")
    return WhisperModel(MODEL, device="auto", compute_type="int8")


def record_while_held(sd, np) -> "np.ndarray | None":
    """Record until SPACE stops repeating. Returns mono float32 audio."""
    chunks: list = []
    with sd.InputStream(samplerate=SAMPLE_RATE, channels=1, dtype="float32",
                        callback=lambda data, *_: chunks.append(data.copy())):
        while True:
            ready, _, _ = select.select([sys.stdin], [], [], RELEASE_GAP)
            if not ready:
                break  # key released
            if sys.stdin.read(1) != " ":
                break
    if not chunks:
        return None
    return np.concatenate(chunks).flatten()


def voice_loop() -> int:
    try:
        import numpy as np
        import sounddevice as sd
    except ImportError:
        sys.exit("mic deps missing — pip install sounddevice numpy  (or use --text)")

    model = load_stt()
    print(f"{DIM}hold SPACE to talk · q to quit · vault {VAULT}{RST}")

    fd = sys.stdin.fileno()
    saved = termios.tcgetattr(fd)
    try:
        tty.setcbreak(fd)
        while True:
            key = sys.stdin.read(1)
            if key in ("q", "\x03", "\x04"):
                return 0
            if key != " ":
                continue
            print(f"{HOT}● listening{RST}", end="\r", flush=True)
            audio = record_while_held(sd, np)
            print(f"{DIM}○ transcribing{RST}", end="\r", flush=True)
            if audio is None or len(audio) < SAMPLE_RATE * 0.3:
                print(f"{DIM}too short{RST}          ")
                continue
            segments, _ = model.transcribe(audio, language="en", vad_filter=True)
            text = " ".join(s.text for s in segments).strip()
            print(" " * 30, end="\r")
            if not text:
                print(f"{DIM}heard nothing{RST}")
                continue
            termios.tcsetattr(fd, termios.TCSADRAIN, saved)
            try:
                handle(text)
            finally:
                tty.setcbreak(fd)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, saved)


def text_loop() -> int:
    print(f"{DIM}text mode — type a request, blank line to quit{RST}")
    while True:
        try:
            line = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            return 0
        if not line:
            return 0
        handle(line)


if __name__ == "__main__":
    try:
        raise SystemExit(text_loop() if "--text" in sys.argv else voice_loop())
    except KeyboardInterrupt:
        raise SystemExit(0)
