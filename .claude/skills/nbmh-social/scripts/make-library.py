"""Pre-make free NBMH photos with Z-Image Turbo (open-source, the model in Charles's Open Generative AI app).

Usage: python make-library.py <models_dir> <prompts.txt> <out_dir>
Skips photos that already exist; commits and pushes each one so a reclaimed container loses nothing.
"""
import subprocess, sys, time
from pathlib import Path
from stable_diffusion_cpp import StableDiffusion

STYLE = ("Photorealistic, vivid saturated color, bright natural sunlight, joyful and peaceful mood, "
         "professional nature photography. The main subject sits in the upper two-thirds of the frame; "
         "the lower third is soft, calm, out-of-focus foreground. No people, no faces, no text, no logos.")

models, prompts, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
out.mkdir(parents=True, exist_ok=True)
repo = Path(__file__).resolve().parents[4]

sd = StableDiffusion(
    diffusion_model_path=str(models / "z_image_turbo-Q4_0.gguf"),
    llm_path=str(models / "Qwen3-4B-Q4_K_M.gguf"),
    vae_path=str(models / "ae.safetensors"),
    n_threads=4, diffusion_flash_attn=True, verbose=False,
)

for i, line in enumerate(l for l in prompts.read_text().splitlines() if l.strip()):
    slug, subject = line.split("|", 1)
    dest = out / f"{i + 1:02d}-{slug}.jpg"
    made_before = subprocess.run(["git", "-C", str(repo), "log", "-1", "--format=%h", "--", str(dest)],
                                 capture_output=True, text=True).stdout.strip()
    if dest.exists() or made_before:
        continue
    t = time.time()
    img = sd.generate_image(prompt=f"{subject}. {STYLE}", width=768, height=960,
                            cfg_scale=1.0, sample_steps=8, seed=1000 + i)[0]
    img.convert("RGB").save(dest, quality=92)
    print(f"{dest.name} {time.time() - t:.0f}s", flush=True)
    subprocess.run(["git", "-C", str(repo), "add", str(dest)], check=True)
    subprocess.run(["git", "-C", str(repo), "commit", "-q", "-m",
                    f"NBMH library: {dest.stem} (free, Z-Image Turbo)\n\n"
                    "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n"
                    "Claude-Session: https://claude.ai/code/session_01LW9SEtd1vuXF94PuzgikiE",
                    "--", str(dest)], check=True)
    subprocess.run(["git", "-C", str(repo), "push", "-q", "origin", "HEAD"], check=False)
