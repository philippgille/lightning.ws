"use strict";

var APIURL_TR = BASE_URL + "/translate";

function generateInvoiceTr(){
    generateInvoice(APIURL_TR, ["responseContainerTr", "preimageContainerTr"], "responseAreaTr", "invoiceQrTr");
}

function sendPreImageTr(){
    var preimage = getValueById('preimageTr');
    if(preimage === ""){
        show("sendErrorTr");
        document.getElementById("sendErrorTr").innerHTML = "Preimage is empty.";
        return;
    };
    var text = encodeURI(getValueById("textAreaTr"));
    var to = encodeURI(getValueById("toTr"));
    var fromTr = encodeURI(getValueById("fromTr"));
    var url = APIURL_TR + "?text=" + text + "&to=" + to;
    if (fromTr !== ""){
        url += "&from=" + fromTr;
    }
    fetch(url, {
        method: 'get',
        headers: new Headers({
            'X-Preimage': preimage
        })
    }).catch(function (e){
        show("sendErrorTr");
        document.getElementById("sendErrorTr").innerHTML = e.message;
    }).then(function (response) {
        if (response.status === 200) {
            return response.json();
        } else {
            return response.text();
        }
    }).then(function (response){
        if (typeof response === "object") {
            hide("sendErrorTr");
            show("translationContainer");
            setInnerHtmlById("responseFromTr", response[0].detectedLanguage.language);
            setInnerHtmlById("responseToTr", response[0].translations[0].to);
            setValueById("translatedText", response[0].translations[0].text);
        } else {
            show("sendErrorTr");
            document.getElementById("sendErrorTr").innerHTML = response;
        }
    });
}