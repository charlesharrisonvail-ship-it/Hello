# Source this file to get the `areach` wrapper:
#   source scripts/areach.sh
#
# The wrapper runs the agent-reach CLI from the sandbox venv with an isolated
# HOME and XDG_CONFIG_HOME, so all state stays under the sandbox directory and
# never touches your real profile.
#
# Note: the sandbox base is computed once into `sbx` so the two env assignments
# don't re-expand $HOME after HOME has already been reassigned (which would
# otherwise double the path).
areach() {
  local sbx="${AGENT_REACH_SANDBOX:-$HOME/agent-reach-sandbox}"
  HOME="$sbx/home" \
  XDG_CONFIG_HOME="$sbx/home/.config" \
  "$sbx/venv/bin/python" -m agent_reach.cli "$@"
}
