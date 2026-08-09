"""Command-line entry point for agent_reach.

Runnable as either ``agent-reach`` (installed script) or
``python -m agent_reach.cli`` / ``python -m agent_reach``.
"""

from __future__ import annotations

import argparse
import os
import sys

from . import __version__
from .config import config_dir, config_path, load_config, save_config

VALID_ENVS = ("local", "staging", "prod")


def _cmd_version(_: argparse.Namespace) -> int:
    print(f"agent-reach {__version__}")
    return 0


def _cmd_env(_: argparse.Namespace) -> int:
    """Show where the sandbox is reading and writing state."""
    print(f"config_dir: {config_dir()}")
    print(f"config_path: {config_path()}")
    print(f"config_exists: {config_path().exists()}")
    return 0


def _cmd_install(args: argparse.Namespace) -> int:
    """Initialize sandbox state for the given environment (idempotent)."""
    if args.env not in VALID_ENVS:
        print(
            f"error: invalid --env {args.env!r}; choose from {', '.join(VALID_ENVS)}",
            file=sys.stderr,
        )
        return 2
    config = load_config()
    already = config.get("installed") is True and config.get("env") == args.env
    config["env"] = args.env
    config["installed"] = True
    path = save_config(config)
    verb = "already installed" if already else "installed"
    print(f"agent-reach {verb} (env={args.env})")
    print(f"config: {path}")
    return 0


def _check(label: str, ok: bool, detail: str = "") -> bool:
    mark = "ok  " if ok else "FAIL"
    line = f"[{mark}] {label}"
    if detail:
        line += f": {detail}"
    print(line)
    return ok


def _cmd_doctor(_: argparse.Namespace) -> int:
    """Run environment diagnostics; exit non-zero if anything is wrong."""
    results = []

    py_ok = sys.version_info >= (3, 9)
    results.append(
        _check("python >= 3.9", py_ok, ".".join(map(str, sys.version_info[:3])))
    )

    cdir = config_dir()
    try:
        cdir.mkdir(parents=True, exist_ok=True)
        probe = cdir / ".doctor-probe"
        probe.write_text("ok")
        probe.unlink()
        writable = True
    except OSError as exc:
        writable = False
        results.append(_check("config dir writable", False, str(exc)))
    else:
        results.append(_check("config dir writable", True, str(cdir)))

    isolated = "XDG_CONFIG_HOME" in os.environ
    results.append(
        _check(
            "sandbox isolation (XDG_CONFIG_HOME set)",
            isolated,
            os.environ.get("XDG_CONFIG_HOME", "unset — running outside wrapper"),
        )
    )

    config = load_config()
    installed = config.get("installed") is True
    results.append(
        _check("installed", installed, f"env={config.get('env')}" if installed else "run: areach install --env=local")
    )

    ok = all(results)
    print()
    print("doctor: " + ("all checks passed" if ok else "problems found"))
    return 0 if ok else 1


def _cmd_config_get(args: argparse.Namespace) -> int:
    config = load_config()
    if args.key is None:
        for key, value in sorted(config.items()):
            print(f"{key}={value}")
        return 0
    if args.key not in config:
        print(f"error: no such key: {args.key}", file=sys.stderr)
        return 1
    print(config[args.key])
    return 0


def _cmd_config_set(args: argparse.Namespace) -> int:
    config = load_config()
    config[args.key] = args.value
    path = save_config(config)
    print(f"set {args.key}={args.value} in {path}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="agent-reach",
        description="Sandbox CLI for agent outreach workflows.",
    )
    parser.add_argument(
        "-V", "--version", action="version", version=f"agent-reach {__version__}"
    )
    sub = parser.add_subparsers(dest="command")

    p_version = sub.add_parser("version", help="print the version")
    p_version.set_defaults(func=_cmd_version)

    p_env = sub.add_parser("env", help="show sandbox config locations")
    p_env.set_defaults(func=_cmd_env)

    p_install = sub.add_parser("install", help="initialize sandbox state")
    p_install.add_argument(
        "--env",
        default="local",
        help=f"target environment ({', '.join(VALID_ENVS)}); default: local",
    )
    p_install.set_defaults(func=_cmd_install)

    p_doctor = sub.add_parser("doctor", help="run environment diagnostics")
    p_doctor.set_defaults(func=_cmd_doctor)

    p_get = sub.add_parser("config-get", help="read a config value (or all)")
    p_get.add_argument("key", nargs="?", help="key to read; omit to list all")
    p_get.set_defaults(func=_cmd_config_get)

    p_set = sub.add_parser("config-set", help="write a config value")
    p_set.add_argument("key")
    p_set.add_argument("value")
    p_set.set_defaults(func=_cmd_config_set)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if not getattr(args, "func", None):
        parser.print_help()
        return 0
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
