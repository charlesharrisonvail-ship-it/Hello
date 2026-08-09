# Hello World

This is my first GitHub repository!

## About Me

I'm learning how to use GitHub and excited to collaborate on projects!

## agent-reach sandbox

`agent_reach` is a small Python CLI for agent outreach workflows. It's designed
to run inside a **sandbox**: an isolated virtualenv plus an isolated `HOME` /
`XDG_CONFIG_HOME`, so it never reads or writes your real user profile.

### Setup

```bash
./scripts/setup-sandbox.sh      # creates ~/agent-reach-sandbox/{venv,home} and installs the package
source scripts/areach.sh        # loads the `areach` wrapper into your shell
```

### Usage

```bash
areach install --env=local      # initialize sandbox state (envs: local, staging, prod)
areach doctor                   # run diagnostics; exits non-zero if anything is wrong
areach env                      # show where config is read/written
areach config-set region colorado-mountain
areach config-get               # list all config values
areach version
```

All state lives under `~/agent-reach-sandbox/home/.config/agent-reach/`. Override
the sandbox location with the `AGENT_REACH_SANDBOX` environment variable.
