lightning.ws
============

Web services and website files for [https://lightning.ws](https://lightning.ws)

Usage
-----

1. Create a data directory on the host: `mkdir api/data/`
2. Copy the `tls.cert` and `invoice.macaroon` from your lnd to the `api/data/` directory
3. Run the web service container: `docker run -d --name qr-code --restart unless-stopped -v $(pwd)/api/data/:/root/data/ philippgille/qr-code -addr "123.123.123.123:10009"`
4. Run the website and reverse proxy container: `docker run -d --name caddy --link qr-code -v $(pwd)/Caddyfile:/etc/Caddyfile -v $HOME/.caddy:/root/.caddy -v $(pwd)/www:/srv/www -p 80:80 -p 443:443 abiosoft/caddy`
5. Send a request: `curl https://api.lightning.ws/qr`
6. Take the invoice from the response body and pay it via the Lightning Network
7. Send the request again, this time with the preimage as payment proof and the data as query parameter: `curl -H "x-preimage: c29tZSBwcmVpbWFnZQ==" https://api.lightning.ws/qr?data=testtext`

Note
----

The configuration files in this repository only serve for a quick start for testing purposes.

The deployment on [https://lightning.ws](https://lightning.ws) uses other configuration files.

In production, you should:

- Use [Redis](https://redis.io/) as storage for [ln-paywall](https://github.com/philippgille/ln-paywall) to make horizontal scaling of the web service container possible
    - With persistence for backups and a proper cluster for redundancy
- Use [Docker Swarm](https://docs.docker.com/engine/swarm/) or [Kubernetes](https://kubernetes.io/) for container orchestration to make it easy to run the containers on a cluster of host machines
    - Set up auto-scaling for the web service containers
- Add rate limiting and other DoS protection measures
- Maybe use [traefik](https://traefik.io/) instead of Caddy as reverse proxy
- Maybe use [nginx](https://nginx.org/en/) for serving the website files
- ...
