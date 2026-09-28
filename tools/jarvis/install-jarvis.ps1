<#
.SYNOPSIS
    Clone and install Jarvis (github.com/isair/jarvis) from source on Windows.

.DESCRIPTION
    Jarvis is a third-party, local-first voice assistant. This script does not
    vendor its code into this repository; it clones upstream into %USERPROFILE%\src\jarvis
    and runs the project's own PowerShell setup script.

    Most people should NOT use this script. Jarvis ships a prebuilt
    Jarvis-Windows-x64.zip on GitHub Releases that needs no Python at all.
    Use this only if you want to read or modify the code, or want Chatterbox
    TTS (source installs only). See tools/jarvis/README.md.

    LICENSING: Jarvis is released under a non-commercial licence. Business use
    (EpiVail / Epique Realty work) requires a separate commercial licence from
    the author. See tools/jarvis/README.md before relying on it.

.PARAMETER InstallDir
    Where to clone Jarvis. Defaults to $HOME\src\jarvis.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File tools\jarvis\install-jarvis.ps1
#>

Param(
  [string]$InstallDir = (Join-Path $HOME 'src\jarvis')
)

$ErrorActionPreference = 'Stop'
$RepoUrl = 'https://github.com/isair/jarvis.git'

function Say($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Note($msg) { Write-Host "    $msg" }
function Die($msg) { Write-Host "`nError: $msg" -ForegroundColor Red; exit 1 }

if (-not $IsWindows -and $PSVersionTable.PSVersion.Major -ge 6) {
  Die 'This script targets Windows. On Linux run scripts/run_linux.sh from the clone.'
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Die 'git not found. Install it with: winget install --id Git.Git'
}

# Micromamba is strongly preferred on Windows. Upstream's fallback path is
# venv + pip, which compiles webrtcvad and av from source and therefore needs
# the Visual C++ Build Tools (a multi-GB install that often fails).
$micromamba = Get-Command micromamba -ErrorAction SilentlyContinue
if (-not $micromamba) {
  Say 'Micromamba not found. Installing it first.'
  Note 'Without it, setup compiles native dependencies and needs Visual C++ Build Tools.'
  try {
    winget install --id AnacondaInc.Micromamba --accept-source-agreements --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
                [System.Environment]::GetEnvironmentVariable('Path', 'User')
  } catch {
    Note 'Automatic install failed. Install Micromamba manually, then re-run:'
    Note '  https://mamba.readthedocs.io/en/latest/installation/micromamba-installation.html'
    Die 'Micromamba is required for a reliable source install on Windows.'
  }
  if (-not (Get-Command micromamba -ErrorAction SilentlyContinue)) {
    Die 'Micromamba installed but not on PATH. Open a new PowerShell window and re-run this script.'
  }
}

if (Test-Path (Join-Path $InstallDir '.git')) {
  Say "Jarvis already cloned at $InstallDir - updating"
  git -C $InstallDir pull --ff-only
} else {
  Say "Cloning Jarvis into $InstallDir"
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $InstallDir) | Out-Null
  git clone $RepoUrl $InstallDir
}

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Say 'Ollama is not installed. Jarvis needs a local model server.'
  Note 'Install it with:   winget install --id Ollama.Ollama'
  Note 'Then pull a model: ollama pull gemma4:e2b'
  Note 'Or point Jarvis at LM Studio / llama.cpp in its setup wizard.'
}

# Optional, and only on NVIDIA hardware. Many ThinkPads ship Intel integrated
# graphics only, in which case speech recognition runs on CPU - slower, but it
# works. Skip CUDA entirely on those machines.
$gpu = (Get-CimInstance Win32_VideoController -ErrorAction SilentlyContinue).Name -join ', '
if ($gpu -match 'NVIDIA') {
  Say 'NVIDIA GPU detected - CUDA will speed up speech recognition considerably.'
  Note 'After setup, from the clone:'
  Note "  powershell -ExecutionPolicy Bypass -File installer\windows\install_cuda.ps1 -TargetDir `"$InstallDir\cuda`""
} elseif ($gpu) {
  Say "GPU: $gpu"
  Note 'No NVIDIA GPU, so speech recognition runs on CPU. Expect slower transcription;'
  Note 'choose a smaller chat model (qwen3.5:0.8b) and enable Low Power Mode in Settings.'
}

Say "Running Jarvis's own Windows setup (Micromamba env, requirements, then the daemon)"
Note 'First run downloads speech and language models; this takes a while.'
Note 'Allow microphone access when Windows asks. Ctrl-C stops the daemon.'
Write-Host ''
Set-Location $InstallDir
& powershell -ExecutionPolicy Bypass -File (Join-Path $InstallDir 'scripts\run_windows.ps1')
exit $LASTEXITCODE
