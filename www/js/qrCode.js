"use strict";

var APIURL_QR = BASE_URL + "/qr";

function generateInvoiceQR(){
    generateInvoice(APIURL_QR, ["responseContainerQr", "preimageContainerQr"], "responseAreaQr", "invoiceQrQr");
}


function sendPreImageQR(){
    var preimage = getValueById('preimageQr');
    var data = encodeURI(getValueById("dataAreaQr"));
    fetch(APIURL_QR + "?data=" + data, {
        method: 'get',
        headers: new Headers({
            'X-Preimage': preimage
        })
    }).catch(function (e){
        show("sendErrorQr");
        document.getElementById("sendErrorQr").innerHTML = e.message;
    }).then(function (response) {
        if (response.status === 200) {
            return response.blob();
        } else {
            return response.text();
        }
    }).then(function (response){
        if (typeof response === "string" && preimage !== "") {
            show("sendErrorQr");
            document.getElementById("sendErrorQr").innerHTML = response;
        } else if (typeof response !== "string" && preimage !== "") {
            hide("sendErrorQr");
            show("qrImageContainer");
            var objectURL = URL.createObjectURL(response);
            document.getElementById('qrImage').src = objectURL;
        }
    });
}