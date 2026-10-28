"""Charles's cloned voice, free, on his own laptop - a thin wrapper around Chatterbox.

    python speak.py clone my-voice.wav               # once: make the clone
    python speak.py say "Good morning, y'all."       # speak a line
    python speak.py say --file script.txt            # speak a whole script

Everything stays on the laptop, in %USERPROFILE%\\EpiVail-Voice unless the
EPIVAIL_VOICE_DIR environment variable points elsewhere. See README.md beside
this file for setup and the rules for using the voice.
"""

import argparse
import os
import re
import sys
from datetime import datetime
from pathlib import Path

VOICE_DIR = Path(os.environ.get("EPIVAIL_VOICE_DIR", Path.home() / "EpiVail-Voice"))
CHUNK_CHARS = 250    # Chatterbox drifts on long passages; speak a script in pieces
PAUSE_SECONDS = 0.3  # silence between pieces


def clone_path(model_name):
    return VOICE_DIR / f"charles-voice-{model_name}.pt"


def load_model(model_name):
    import torch
    from chatterbox.tts_turbo import ChatterboxTurboTTS

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Loading Chatterbox {model_name} on {device} (first run downloads it)...")
    return ChatterboxTurboTTS.from_pretrained(device=device, nano=(model_name == "nano")), device


def split_text(text):
    """Break text at sentence ends into pieces of at most CHUNK_CHARS."""
    sentences = re.split(r"(?<=[.!?])\s+", " ".join(text.split()))
    chunks, current = [], ""
    for sentence in sentences:
        if current and len(current) + 1 + len(sentence) > CHUNK_CHARS:
            chunks.append(current)
            current = sentence
        else:
            current = f"{current} {sentence}".strip()
    if current:
        chunks.append(current)
    return chunks


def clone(args):
    recording = Path(args.recording)
    if not recording.is_file():
        sys.exit(f"Can't find {recording}. Record yourself first - see README.md.")

    model, _ = load_model(args.model)
    model.prepare_conditionals(str(recording))
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    model.conds.save(clone_path(args.model))
    print(f"Voice cloned: {clone_path(args.model)}")


def say(args):
    import numpy as np
    import soundfile
    from chatterbox.tts_turbo import Conditionals

    text = Path(args.file).read_text(encoding="utf-8") if args.file else args.text
    if not text or not text.strip():
        sys.exit("Give me something to say: a line in quotes, or --file script.txt.")
    if not clone_path(args.model).is_file():
        sys.exit(f"No clone yet for {args.model}. Run: python speak.py clone my-voice.wav --model {args.model}")

    model, device = load_model(args.model)
    model.conds = Conditionals.load(clone_path(args.model), map_location="cpu").to(device)

    pause = np.zeros(int(PAUSE_SECONDS * model.sr), dtype=np.float32)
    pieces = []
    chunks = split_text(text)
    for number, chunk in enumerate(chunks, 1):
        print(f"Speaking {number}/{len(chunks)}...")
        pieces += [model.generate(chunk).squeeze(0).numpy(), pause]

    if args.out:
        out = Path(args.out)
    else:
        out = VOICE_DIR / "out" / f"{datetime.now():%Y-%m-%d_%H%M%S}.wav"
    out.parent.mkdir(parents=True, exist_ok=True)
    soundfile.write(out, np.concatenate(pieces[:-1]), model.sr)
    print(f"Saved: {out}")


def main():
    model_option = argparse.ArgumentParser(add_help=False)
    model_option.add_argument("--model", choices=["nano", "turbo"], default="nano",
                              help="nano is quick on a laptop CPU; turbo sounds better but is slower")

    parser = argparse.ArgumentParser(description="Charles's cloned voice, run locally with Chatterbox.")
    commands = parser.add_subparsers(dest="command", required=True)

    clone_cmd = commands.add_parser("clone", parents=[model_option],
                                    help="make the clone from a recording of Charles")
    clone_cmd.add_argument("recording", help="WAV or FLAC, 10-20 seconds of Charles speaking")
    clone_cmd.set_defaults(run=clone)

    say_cmd = commands.add_parser("say", parents=[model_option], help="speak text in the cloned voice")
    say_cmd.add_argument("text", nargs="?", help="the line to speak, in quotes")
    say_cmd.add_argument("--file", help="a .txt script to speak instead")
    say_cmd.add_argument("-o", "--out", help="where to save the .wav")
    say_cmd.set_defaults(run=say)

    args = parser.parse_args()
    args.run(args)


if __name__ == "__main__":
    main()
