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

- [QR code generation](#qr-code-generation)
- [Translate](#translate)
- More to come soon™...

### QR code generation

Generates a QR code for the given data.

1. Generate an invoice: `curl https://api.lightning.ws/qr` <div id="generateBtnContainerQr"><button onclick="generateInvoiceQR()">Generate invoice now</button></div>
2. Pay the invoice that's in the response body <div id="responseContainerQr"><input type="text" id="responseAreaQr"><button onclick="copyToClipboard('responseAreaQr')">Copy to clipboard</button></div>
3. Send the request with the preimage as payment proof (hex encoded) and the data you want in the QR code as query parameter: `curl -H "x-preimage: <PAYMENT_PREIMAGE>" https://api.lightning.ws/qr?data=testtext` <div id="preimageContainerQr"><input id="preimageQr" placeholder="preimage" type="text" /><textarea placeholder="data" id="dataAreaQr"></textarea><button onclick="sendPreImageQR()">Create QR code</button><div id="sendErrorQr"></div></div>
4. The response is the QR code as PNG image <div id="qrImageContainer"><img id="qrImage" src="" alt="qrCode" /></div>


### Translate

Translate a text with the translate API.

1. Generate an invoice: `curl https://api.lightning.ws/translate` <div id="generateBtnContainerTr"><button onclick="generateInvoiceTr()">Generate invoice now</button></div>
2. Pay the invoice that's in the response body <div id="responseContainerTr"><input type="text" id="responseAreaTr"><button onclick="copyToClipboard('responseArea')">Copy to clipboard</button></div>
3. Send the request with the preimage as payment proof (hex encoded) and the text you want to translate in your chosen target language: `curl -H "x-preimage: <PAYMENT_PREIMAGE>" https://api.lightning.ws/translate?text=hello&to=de[&from=en]` <div id="preimageContainerTr"><input id="preimageTr" placeholder="preimage" type="text" /><input id="fromTr" placeholder="from (default: autodetection)" type="text" /><input id="toTr" placeholder="target language" type="text" /><textarea placeholder="text to translate" id="textAreaTr"></textarea><button onclick="sendPreImageTr()">Translate text</button><div id="sendErrorTr"></div></div>
4. The response is a JSON array with the translation. <div id="translationContainer"> Your text was translated from <i><span id="responseFromTr"></span></i> to <i><span id="responseToTr"></span></i>: <textarea id="translatedText"></textarea></div>
