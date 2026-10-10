#!/usr/bin/env bash
# Installs the free Z-Image Turbo model (the one in Charles's Open Generative AI app) on this machine.
# Usage: setup-free-model.sh <work_dir>   -> <work_dir>/sdenv and <work_dir>/models
set -euo pipefail
W="$1"; mkdir -p "$W/models"
[ -x "$W/sdenv/bin/python" ] || { python3 -m venv "$W/sdenv"; CMAKE_BUILD_PARALLEL_LEVEL="$(nproc)" "$W/sdenv/bin/pip" install -q stable-diffusion-cpp-python; }
cd "$W/models"
get() { [ -s "$2" ] || curl -sSfL -o "$2" "$1"; }
get https://huggingface.co/leejet/Z-Image-Turbo-GGUF/resolve/main/z_image_turbo-Q4_0.gguf z_image_turbo-Q4_0.gguf
get https://huggingface.co/unsloth/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf Qwen3-4B-Q4_K_M.gguf
get https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors ae.safetensors
echo "ready: $W"
