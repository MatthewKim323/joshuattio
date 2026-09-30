#!/bin/zsh
# Port one captured route end to end: sources, missing media, stylesheet union, page markup.
# usage: scripts/port-route.sh <route>   (e.g. contact/sales)
set -e
cd "$(dirname "$0")/.."
r=$1; n=site-${r//\//-}
python3 scripts/fetch-sources.py reference/$n
python3 scripts/fetch-media.py reference/$n 2>/dev/null
bun scripts/port.ts css >/dev/null
bun scripts/port.ts page $n /$r | tail -1
