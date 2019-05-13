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
- An [Azure Cognitive Services "Computer Vision"](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/) subscription key

Usage
-----

The following steps are for running the website and web service *locally*:

1. Create a data directory on the host: `mkdir api/data`
2. Copy the `tls.cert` and `invoice.macaroon` from your lnd to the `api/data` directory
3. Change the values in the `.env` file, which contains the lnd address and Azure region and API keys
4. Start the website and web service via Docker Compose: `docker-compose up -d`

Now you can either use the interactive client on the website or make the requests programmatically:

- Website:
  - If you did the above: [https://localhost:2015](https://localhost:2015), otherwise check out the deployed version on [https://lightning.ws](https://lightning.ws)
- Programmatically:
  1. Send a request to generate an invoice:
      - QR code: `curl -k https://localhost:2015/api/qr`
      - Translation: `curl -k https://localhost:2015/api/translate`
      - OCR (text recognition): `curl -k https://localhost:2015/api/ocr`
  2. Take the invoice from the response body and pay it via the Lightning Network
  3. Send the request again, this time with the preimage as payment proof (hex encoded) and the data as query parameter:
      - QR code: `curl -k -H "x-preimage: 123abc456def" https://localhost:2015/api/qr?data=testtext`
      - Translation: `curl -k -H "x-preimage: 123abc456def" https://localhost:2015/api/translate?text=Hallo%Welt&to=en`
      - OCR: `curl -k -H "x-preimage: 123abc456def" https://localhost:2015/api/ocr?imageUrl=http%3A%2F%2Fexample%2Ecom%2Fimage%2Epng`

> Note: The deployment on [https://lightning.ws](https://lightning.ws) uses a separate subdomain for the API, which is why there's no `/api/` in the path. If want to deploy this in a similar way you can just change the reverse proxy configuration in the `Caddyfile`.

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
