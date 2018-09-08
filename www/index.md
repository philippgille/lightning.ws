---
# template:
title: Lightning web services
# sitename:
---

*lightning.ws* hosts paywalled web services / APIs that are payable via the [Lightning Network](https://lightning.network).

It's "[eating your own dogfood](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)" for the project *ln-paywall*. For more information please visit the project's GitHub repository: [https://github.com/philippgille/ln-paywall](https://github.com/philippgille/ln-paywall).

Currently running on **Testnet only**.

Prerequisites
-------------

You need to have either a direct channel or route to `034b1f48aff6d95965e2442b734b0dfb28421ef1815bf873ec5e1b736b76ed05da@node.lightning.ws:9735`

APIs
----

- [QR code ceneration](#qr-code-generation)
- More to come soon™...

### QR code ceneration

Generates a QR code for the given data.

1. Generate an invoice: `curl https://api.lightning.ws/qr`
2. Pay the invoice that's in the response body
3. Send the request with the preimage as payment proof and the data you want in the QR code as query parameter: `curl -H "x-preimage: <PAYMENT_PREIMAGE>" https://api.lightning.ws/qr?data=testtext`
4. The response is the QR code as PNG image
