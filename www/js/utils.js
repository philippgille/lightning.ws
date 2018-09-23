"use strict";

var BASE_URL;

function detectBaseUrl(){
    if (document.location.href.indexOf("staging") !== -1 ||
            document.location.href.indexOf("localhost")) {
        BASE_URL = "https://staging.api.lightning.ws";
    } else {
        BASE_URL = "https://api.lightning.ws";
    }
}
detectBaseUrl();

function setCssById(id, obj) {
    Object.keys(obj).forEach(function (key) {
        document.getElementById(id).style[key] = obj[key];
    });
}

function setValueById(id, val) {
    document.getElementById(id).value = val;
}

function setSrcById(id, val) {
    document.getElementById(id).src = val;
}

function setInnerHtmlById(id, val) {
    document.getElementById(id).innerHTML = val;
}

function copyToClipboard(elemendId){
    document.getElementById(elemendId).select();
    document.execCommand('copy');
}

function show(id){
    setCssById(id, {display: "block"});
}

function hide(id){
    setCssById(id, {display: "none"});
}


function getValueById(id){
    return document.getElementById(id).value;
}

function generateInvoice(url, containerIdsToShow, inputFieldId, qrCodeImgId){
    fetch(url, {
        method: 'get',
        headers: new Headers({
        'Content-Type': 'text/plain'
        })
    }).then(function (response) {
        return response.text();
    }).then(function (data){
        containerIdsToShow.forEach(function (id) {
            show(id);
        });
        setValueById(inputFieldId, data);
        setSrcById(qrCodeImgId, "https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=" + data);
    });
}

