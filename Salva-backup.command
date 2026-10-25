#!/bin/zsh
cd "$(dirname "$0")" || exit 1
export PATH="/Users/marco/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
node scripts/backup.mjs
result=$?
echo "Premi Invio per chiudere."
read
exit $result
