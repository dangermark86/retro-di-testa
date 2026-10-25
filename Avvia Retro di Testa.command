#!/bin/zsh
cd "${0:A:h}"
export ASTRO_TELEMETRY_DISABLED=1
RETRO_NODE="$(command -v node 2>/dev/null)"
if [[ -z "$RETRO_NODE" && -x /Users/marco/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ]]; then
  RETRO_NODE=/Users/marco/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
fi
if [[ -z "$RETRO_NODE" ]]; then
  echo "Installa Node.js da https://nodejs.org/ e segui README.md."
  read -r "?Premi Invio per chiudere."
  exit 1
fi
if [[ ! -f node_modules/astro/astro.js ]]; then
  echo "Dipendenze mancanti: esegui npm install in questa cartella."
  read -r "?Premi Invio per chiudere."
  exit 1
fi
export PATH="${RETRO_NODE:h}:$PATH"
exec "$RETRO_NODE" node_modules/astro/astro.js dev --host 127.0.0.1 --open
