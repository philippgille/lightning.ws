lightning.ws
============

Web services and website files for [https://lightning.ws](https://lightning.ws).

*lightning.ws* hosts paywalled web services / APIs that are payable via the [Lightning Network](https://lightning.network).

It's "[eating your own dogfood](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)" for the project *ln-paywall*. For more information please visit the project's GitHub repository: [https://github.com/philippgille/ln-paywall](https://github.com/philippgille/ln-paywall)

The Docker image for deploying the web service is on Docker Hub: [https://hub.docker.com/r/philippgille/ln-ws-api](https://hub.docker.com/r/philippgille/ln-ws-api/)

Prerequisites
-------------

- A running lnd node, either on a remote host and accessible from outside, or on the same host, in which case you can either start this container in "host network" mode, or use the container's gateway IP address to reach the host's localhost
- An [Azure Cognitive Services "Translator Text API"](https://azure.microsoft.com/en-us/services/cognitive-services/translator-text-api/) subscription key

Usage
-----

1. Create a data directory on the host: `mkdir -p api/data`
2. Copy the `tls.cert` and `invoice.macaroon` from your lnd to the `api/data` directory
3. Run the web service container with your lnd's address and the Azure translation API key as argument:
    - `docker run -d --name ln-ws-api --restart unless-stopped -v $(pwd)/api/data:/root/data philippgille/ln-ws-api -addr "123.123.123.123:10009" -translateApiKey "abc123def456"`
4. Run the website and reverse proxy container:
    - `docker run -d --name caddy --link ln-ws-api -v $(pwd)/Caddyfile:/etc/Caddyfile -v $HOME/.caddy:/root/.caddy -v $(pwd)/www:/srv/www -p 80:80 -p 443:443 abiosoft/caddy`
5. Either use the interactive client on the website or make the requests programmatically
    - Website: See [https://lightning.ws](https://lightning.ws)
    - Programmatically:
        1. Send a request to generate an invoice:
            - QR code: `curl https://lightning.ws/qr`
            - Translation: `curl https://lightning.ws/translate`
        2. Take the invoice from the response body and pay it via the Lightning Network
        3. Send the request again, this time with the preimage as payment proof (hex encoded) and the data as query parameter:
            - QR code: `curl -H "x-preimage: 123abc456def" https://lightning.ws/qr?data=testtext`
            - Translation: `curl -H "x-preimage: 123abc456def" https://lightning.ws/translate?text=Hallo%Welt&to=en`

Note
----

**The configuration files in this repository only serve for a quick start for testing purposes!**

The deployment on [https://lightning.ws](https://lightning.ws) uses a different, non-public configuration.

In production, you should:

- Use [Redis](https://redis.io/) as storage for [ln-paywall](https://github.com/philippgille/ln-paywall) to make horizontal scaling of the web service containers possible (you can use the implementation in the `storage` package of *ln-paywall*, see [here](https://www.godoc.org/github.com/philippgille/ln-paywall/storage))
    - With persistence for backups and a proper cluster for redundancy
- Use [Docker Swarm](https://docs.docker.com/engine/swarm/) or [Kubernetes](https://kubernetes.io/) for container orchestration to make it easy to run the containers on a cluster of host machines
    - Set up auto-scaling for the web service containers
- Add rate limiting and other DoS protection measures
- Add proper logging (for example using the [Elastic Stack](https://www.elastic.co), [Graylog](https://www.graylog.org/) or a custom combination like [Fluent Bit](https://fluentbit.io/) + [Elasticsearch](https://www.elastic.co/products/elasticsearch) + [Kibana](https://www.elastic.co/products/kibana) (see [this article](https://fluentbit.io/articles/docker-logging-elasticsearch/)))
- Add proper metric collection (for example with [Prometheus](https://prometheus.io/) + [Grafana](https://grafana.com/))
- Maybe use [traefik](https://traefik.io/) instead of Caddy as reverse proxy
- Maybe use [nginx](https://nginx.org/en/) for serving the website files
- ...
