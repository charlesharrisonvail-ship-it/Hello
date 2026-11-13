---
name: no-heygen-avatar-pipeline
description: How to make Charles's avatar lesson videos without HeyGen - Higgsfield voice clone + LatentSync lip-sync on a rented Higgsfield GPU (tested 2026-11-13)
---

Charles approved replacing HeyGen (2026-11-13). Tested and working:

1. **Voice**: Higgsfield `generate_audio`, model `seed_audio`, with `medias:[{role:"audio_references", value:<media id of a ~28 s clean clip of his Starfish voice>}]`. 0.1 credit per line; transcribed back word-perfect. Source audio: the Starfish WAVs from the HeyGen-era re-cuts (e.g. lm5.wav).
2. **Face**: open-source LatentSync 1.6 (ByteDance, Apache-2.0) lip-syncs his existing avatar footage (raw 1080x1920 HeyGen renders, downscaled to 720x1280 @25 fps) to the new audio.
3. **GPU**: Higgsfield `gpu_rent` L40S, 71 credits/hour billed per minute. Box image is Ubuntu 24.04 + Python 3.12, which LatentSync's pins do not support. Working setup: `apt-get install -y ffmpeg libgl1 libglib2.0-0 build-essential`; `pip3 install uv`; `uv venv --python 3.10`; `uv pip install -r requirements.txt` (needs build-essential for insightface); `huggingface-cli download ByteDance/LatentSync-1.6 whisper/tiny.pt latentsync_unet.pt --local-dir checkpoints`; run `python -m scripts.inference --unet_config_path configs/unet/stage2_512.yaml --inference_ckpt_path checkpoints/latentsync_unet.pt --inference_steps 20 --guidance_scale 1.5 --enable_deepcache --video_path src.mp4 --audio_path voice.wav --video_out_path out.mp4`. Inputs fetched by curl from Higgsfield media URLs; output PUT to a Higgsfield presigned upload URL.
4. **Timing/cost**: setup ~5 min; inference ~8.3 s of GPU per 1 s of video (29 s clip = 4 min). So a 4-min lesson is ~33 min of GPU (about 40 credits) plus setup. Batch lessons in one rental. Always `gpu_rental_stop` the moment output is uploaded.
5. **Lesson learned**: a session restart right after renting left the box idle for 11 min (13.56 credits wasted). Start the job in the SAME turn as `gpu_rent`, and use `nohup`; don't `pkill -f` a pattern that matches your own exec command line.
