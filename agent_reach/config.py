"""Config location and read/write helpers.

The sandbox wrapper runs this package with an isolated ``HOME`` and
``XDG_CONFIG_HOME``, so all state stays under the sandbox directory and never
touches the real user profile.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

APP_NAME = "agent-reach"


def config_dir() -> Path:
    """Return the config directory, honoring ``XDG_CONFIG_HOME``."""
    base = os.environ.get("XDG_CONFIG_HOME")
    if base:
        root = Path(base)
    else:
        root = Path.home() / ".config"
    return root / APP_NAME


def config_path() -> Path:
    return config_dir() / "config.json"


def load_config() -> dict:
    path = config_path()
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text())
    except (json.JSONDecodeError, OSError):
        return {}


def save_config(data: dict) -> Path:
    path = config_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")
    return path
