"use strict";

function setCssById(id, obj) {
    Object.keys(obj).forEach(function (key) {
        document.getElementById(id).style[key] = obj[key];
    });
}

function setValueById(id, val) {
    document.getElementById(id).value = val;
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
