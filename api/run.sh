#!/bin/bash

# Starts the container without a public port.
# The Caddy container can be started with a link to this container and then properly reverse-proxy the requests.
docker run -d \
    --name qr-code \
    --restart unless-stopped \
    -v $(pwd)/data/:/root/data/ \
    philippgille/qr-code \
    - addr "$LND_ADDR"
