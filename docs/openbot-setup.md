# OpenBot — Clone & Install Notes

Reference notes for the [isl-org/OpenBot](https://github.com/isl-org/OpenBot)
checkout used in this workspace. The clone itself is **not** committed to this
config repo (see `.gitignore`); these notes let you rebuild it in one pass.

## Clone

```bash
git clone --depth 1 https://github.com/isl-org/OpenBot.git OpenBot
```

Cloned at commit `master` @ `0679c46` (~3.8 GB with dependencies installed).

## Python environment (policy training + robot scripts)

A single virtualenv at `OpenBot/.venv` (Python 3.11) covers `policy/`,
`python/`, and `controller/python/`. The upstream `policy/environment_*.yml`
files are conda environments pinned to Python 3.9 / TensorFlow 2.9, which will
not resolve on a modern interpreter — pip against current releases is used
instead.

```bash
cd OpenBot
python3 -m venv .venv
.venv/bin/pip install --upgrade pip setuptools wheel
.venv/bin/pip install -r policy/requirements.txt
.venv/bin/pip install "numpy<2" tensorflow-cpu wandb absl-py aiohttp \
    aiohttp-json-rpc aiohttp-devtools zeroconf aiozeroconf netifaces2 imageio
.venv/bin/pip install -r controller/python/requirements.txt
.venv/bin/pip install pyserial pyrealsense2 tflite-runtime pytest
.venv/bin/pip install --no-deps openbot-frontend==0.7.0
```

Notes:

- `numpy<2` is pinned because the OpenBot policy code and TensorFlow data
  pipeline still assume the NumPy 1.x API.
- Install `openbot-frontend` **from PyPI**, not from the local
  `policy/frontend` directory. The local `setup.py` finds no Python packages
  (the frontend is TypeScript), so a local install produces an empty
  distribution and `import openbot_frontend` fails.
- `pyrealsense2` needs a system library: `apt-get install -y libusb-1.0-0`.
  Without it the import fails with `libusb-1.0.so.0: cannot open shared
  object file`.
- `openvino-dev[tensorflow2]` from `python/requirements.txt` was deliberately
  skipped — it pins an older TensorFlow and would downgrade the policy
  environment. Install it in a separate venv if you need
  `python/export_openvino.py`.

### Verify

```bash
cd OpenBot/policy
../.venv/bin/python -c "import tensorflow; from openbot import models, train"
../.venv/bin/python -m openbot.server        # serves http://0.0.0.0:8000
```

The server starts, registers itself over Zeroconf, and serves the bundled
frontend (HTTP 200 on `/`).

## Node components

```bash
cd OpenBot/controller/node-js  && npm install                    # 335 pkgs (+264 in server/)
cd OpenBot/controller/web-server && npm install                  # 372 pkgs
cd OpenBot/open-code           && npm install --legacy-peer-deps # 1649 pkgs
```

`open-code` needs `--legacy-peer-deps` for its React peer ranges.

Smoke test: `cd OpenBot/controller/node-js && npm test` → 10/10 passing.

Run the controller with `npm start` (server + Vite client on port 8081).

## Not installable in this container

| Component | Needs | Status |
| --- | --- | --- |
| `android/` | Android SDK (`ANDROID_HOME` unset) | Java 21 and Gradle are present, SDK is not |
| `ios/` | Xcode / macOS | n/a on Linux |
| `firmware/` | Arduino IDE or `arduino-cli` | not installed |
| `controller/flutter/` | Flutter SDK | not installed |

These all target the phone, the robot body, or the microcontroller, so they
need hardware to be useful anyway.
