"use strict";

var APIURL_QR = "https://api.lightning.ws/qr";

function generateInvoice(){
    fetch(APIURL_QR, {
        method: 'get',
        headers: new Headers({
        'Content-Type': 'text/plain'
        })
    }).then(function (response) {
        return response.text();
    }).then(function (data){
        show("responseContainer");
        show("preimageContainer");
        setValueById("responseArea", data);
    });
}


function sendPreImage(){
    var preimage = getValueById('preimage');
    var data = encodeURI(getValueById("dataArea"));
    fetch(APIURL_QR + "?data=" + data, {
        method: 'get',
        headers: new Headers({
            'X-Preimage': preimage
        })
    }).catch(function (e){
        document.getElementById("sendError").innerHTML = e.message;
    }).then(function (response) {
        if (response.status === 200) {
            return response.blob();
        } else {
            return response.text();
        }
    }).then(function (response){
        if (typeof response === "string" && preimage !== "") {
            show("sendError");
            document.getElementById("sendError").innerHTML = response;
        } else if (typeof response !== "string" && preimage !== "") {
            hide("sendError");
            show("qrImageContainer");
            var objectURL = URL.createObjectURL(response);
            document.getElementById('qrImage').src = objectURL;
        }
    });
}