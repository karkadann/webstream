#!/bin/sh
# Fabrique config.js d'après l'environnement, à chaque démarrage (lancé par l'entrypoint de nginx).
set -eu
list() { echo "$1" | tr ',' '\n' | sed 's/^ *//; s/ *$//' | grep -v '^$' | sed "s/.*/'&'/" | paste -sd, -; }
ADDRS=$(list "${WEBSTREAM_ADDRS:-3.3.3.1}")
FPS=$(list "$(echo "${WEBSTREAM_FINGERPRINTS:-}" | tr 'a-f' 'A-F')")
PORT=$(echo "${WEBSTREAM_PORT:-3333}" | tr -cd '0-9')
cat > /usr/share/nginx/html/config.js <<JS
// Fabriqué au démarrage du conteneur (WEBSTREAM_ADDRS, WEBSTREAM_PORT, WEBSTREAM_FINGERPRINTS).
window.WEBSTREAM_CONFIG = { addrs: [${ADDRS:-'3.3.3.1'}], port: ${PORT:-3333}, fingerprints: [${FPS}] };
JS
echo "webstream : config.js — adresses ${WEBSTREAM_ADDRS:-3.3.3.1}, port ${PORT:-3333}"
