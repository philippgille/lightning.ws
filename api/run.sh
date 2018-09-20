#!/bin/bash

set euxo -pipefail
SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Starts the container without a public port.
# The Caddy container can be started with a link to this container and then properly reverse-proxy the requests.
docker run -d \
    --name ln-ws-api \
    --restart unless-stopped \
    -v $SCRIPTDIR/data/:/root/data/ \
    philippgille/ln-ws-api \
    -addr "$LND_ADDR" \
    -translateApiKey "$TRANSLATE_API_KEY" \
    -visionRegion "$VISION_REGION" \
    -visionApiKey "$VISION_API_KEY"
