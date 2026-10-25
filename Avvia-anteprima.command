#!/bin/zsh
cd "$(dirname "$0")" || exit 1
export ASTRO_TELEMETRY_DISABLED=1
export PATH="/Users/marco/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
node node_modules/astro/astro.js dev --host 127.0.0.1 --port 4324
