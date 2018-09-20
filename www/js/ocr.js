"use strict";

var APIURL_OCR = BASE_URL + "/ocr";

function generateInvoiceOcr(){
    generateInvoice(APIURL_OCR, ["responseContainerOcr", "preimageContainerOcr"], "responseAreaOcr");
}

function sendPreImageOcr(){
    var isError = false;
    var preimage = getValueById('preimageOcr');
    if(preimage === ""){
        show("sendErrorOcr");
        document.getElementById("sendErrorOcr").innerHTML = "Preimage is empty.";
        return;
    };
    var imageUrl = encodeURI(getValueById("imageUrlOcr"));
    var url = APIURL_OCR + "?imageUrl=" + imageUrl;
    fetch(url, {
        method: 'get',
        headers: new Headers({
            'X-Preimage': preimage
        })
    }).catch(function (e){
        isError = true;
        show("sendErrorOcr");
        document.getElementById("sendErrorOcr").innerHTML = e.message;
    }).then(function (response) {
        if (response.status === 200) {
            return response.text();
        } else {
            isError = true;
            return response.text();
        }
    }).then(function (response){
        if (!isError) {
            hide("sendErrorOcr");
            show("ocrContainer");
            setValueById("ocrJson", response);
        } else {
            show("sendErrorOcr");
            document.getElementById("sendErrorOcr").innerHTML = response;
        }
    });
}