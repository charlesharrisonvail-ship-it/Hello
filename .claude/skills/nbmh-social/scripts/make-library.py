"""Pre-make free NBMH photos with Z-Image Turbo (open-source, the model in Charles's Open Generative AI app).

Usage:
  make-library.py <models_dir> <prompts.txt> <out_dir>
      fill the library; skips photos already made, commits and pushes each one.
  make-library.py <models_dir> <prompts.txt> <out.jpg> --for-date YYYY-MM-DD
      the daily routine: ONE photo whose subject and seed come from the date,
      so a fresh session with no memory still picks a new picture.
"""
import subprocess, sys, time
from pathlib import Path
from stable_diffusion_cpp import StableDiffusion

STYLE = ("Photorealistic, vivid saturated color, bright natural sunlight, joyful and peaceful mood, "
         "professional nature photography. The main subject is centered in the middle of the frame with space around it; "
         "the top fifth is open sky or soft background and the bottom fifth is soft foreground. No people, no faces, no text, no logos.")

import argparse
from datetime import date
ap = argparse.ArgumentParser()
ap.add_argument("models"); ap.add_argument("prompts"); ap.add_argument("out")
ap.add_argument("--for-date", metavar="YYYY-MM-DD",
                help="make ONE photo for this posting date: the subject and seed come from the date, so "
                     "a fresh session with no memory of earlier days still gets a new picture; "
                     "OUT is then the output .jpg path")
args = ap.parse_args()
models, prompts, out = Path(args.models), Path(args.prompts), Path(args.out)
repo = Path(__file__).resolve().parents[4]
subjects = [l for l in prompts.read_text().splitlines() if l.strip()]

if args.for_date:
    d = date.fromisoformat(args.for_date)
    # 2026-10-20 starts at subject #5; #1-#4 were posted 10-11 to 10-19. One new subject per day,
    # wrapping after the whole list; a date-based seed makes repeats new variations.
    idx = (4 + (d - date(2026, 10, 20)).days) % len(subjects)
    slug, subject = subjects[idx].split("|", 1)
    print(f"{args.for_date}: subject #{idx + 1} {slug}", flush=True)
    jobs = [(idx, slug, subject.split(": ", 1)[-1], out, d.toordinal())]
else:
    out.mkdir(parents=True, exist_ok=True)
    jobs = []
    for i, line in enumerate(subjects):
        slug, subject = line.split("|", 1)
        dest = out / f"{i + 1:02d}-{slug}.jpg"
        made_before = subprocess.run(["git", "-C", str(repo), "log", "-1", "--format=%h", "--", str(dest)],
                                     capture_output=True, text=True).stdout.strip()
        if not (dest.exists() or made_before):
            jobs.append((i, slug, subject.split(": ", 1)[-1], dest, 1000 + i))

sd = StableDiffusion(
    diffusion_model_path=str(models / "z_image_turbo-Q4_0.gguf"),
    llm_path=str(models / "Qwen3-4B-Q4_K_M.gguf"),
    vae_path=str(models / "ae.safetensors"),
    n_threads=4, diffusion_flash_attn=True, verbose=False,
)

for i, slug, subject, dest, seed in jobs:
    t = time.time()
    img = sd.generate_image(prompt=f"{subject}. {STYLE}", width=768, height=960,
                            cfg_scale=1.0, sample_steps=8, seed=seed)[0]
    img.convert("RGB").save(dest, quality=92)
    print(f"{dest.name} {time.time() - t:.0f}s", flush=True)
    if args.for_date:
        break
    subprocess.run(["git", "-C", str(repo), "add", str(dest)], check=True)
    subprocess.run(["git", "-C", str(repo), "commit", "-q", "-m",
                    f"NBMH library: {dest.stem} (free, Z-Image Turbo)\n\n"
                    "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n"
                    "Claude-Session: https://claude.ai/code/session_01LW9SEtd1vuXF94PuzgikiE",
                    "--", str(dest)], check=True)
    subprocess.run(["git", "-C", str(repo), "push", "-q", "origin", "HEAD"], check=False)
