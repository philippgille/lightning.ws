**lightning.ws API** Docker image
=================================

This Docker image contains the paywalled API of [https://lightning.ws](https://lightning.ws), which is an example API for the project *ln-paywall*. For more information please visit [https://github.com/philippgille/ln-paywall](https://github.com/philippgille/ln-paywall).

Tags
----

- `latest` ([Dockerfile](https://github.com/philippgille/lightning.ws/blob/master/api/Dockerfile))
- `develop` ([Dockerfile](https://github.com/philippgille/lightning.ws/blob/develop/api/Dockerfile))

Prerequisites
-------------

- A running lnd node, either on a remote host and accessible from outside, or on the same host, in which case you can either start this container in "host network" mode, or use the container's gateway IP address to reach the host's localhost
- An [Azure Cognitive Services "Translator Text API"](https://azure.microsoft.com/en-us/services/cognitive-services/translator-text-api/) subscription key
- An [Azure Cognitive Services "Computer Vision"](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/) subscription key

Usage
-----

1. Create a data directory on the host: `mkdir data`
2. Copy the `tls.cert` and `invoice.macaroon` from your lnd to the `data` directory
3. Run the container:
      - `docker run -d -v $(pwd)/data:/root/data -p 8080:8080 philippgille/ln-ws-api -addr "123.123.123.123:10009" -translateApiKey "abc123def456" -visionRegion "westus" -visionApiKey "abc123def456"`
4. Send a request to generate an invoice:
      - QR code: `curl http://localhost:8080/qr`
      - Translation: `curl http://localhost:8080/translate`
      - OCR (text recognition): `curl http://localhost:8080/ocr`
5. Pay the invoice that's in the response body via the Lightning Network
6. Send the request again, this time with the preimage as payment proof (hex encoded) and the data as query parameter:
      - QR code: `curl -H "x-preimage: 123abc456def" http://localhost:8080/qr?data=testtext`
      - Translation: `curl -H "x-preimage: 123abc456def" http://localhost:8080/translate?text=Hallo%Welt&to=en`
      - OCR: `curl -H "x-preimage: 123abc456def" http://localhost:8080/ocr?imageUrl=http%3A%2F%2Fexample%2Ecom%2Fimage%2Epng`

The response contains:
      - QR code: The QR code as PNG image
      - Translation: A JSON array with the translated text and other info
      - OCR: A JSON object with the bounding boxes and text of recognized text

You can try out a deployed version on [https://lightning.ws](https://lightning.ws).

Options
-------

```
  -addr string
        Address of the lnd node (including gRPC port) (default "localhost:10009")
  -dataDir string
        Relative path to the data directory, where tls.cert and invoice.macaroon are located (default "data/")
  -ocrPrice int
        Price of one request in Satoshis (at an exchange rate of $1,000 for 1 BTC 1000 Satoshis would be $0.01) (default 1000)
  -qrPrice int
        Price of one request in Satoshis (at an exchange rate of $1,000 for 1 BTC 1000 Satoshis would be $0.01) (default 1000)
  -translateApiKey string
        Azure Cognitive Services subscription key for the "Translator Text API"
  -translatePrice int
        Price of one request in Satoshis (at an exchange rate of $1,000 for 1 BTC 1000 Satoshis would be $0.01) (default 1000)
  -visionApiKey string
        Azure Cognitive Services subscription key for "Computer Vision"
  -visionRegion string
        Azure region of your created Azure resource - your "Computer Vision" subscription key is bound to this region (default "westcentralus")
```
