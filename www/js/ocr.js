"use strict";

var APIURL_OCR = BASE_URL + "/ocr";

function generateInvoiceOcr(){
    generateInvoice(APIURL_OCR, ["responseContainerOcr", "preimageContainerOcr"], "responseAreaOcr", "invoiceQrOcr");
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
            drawBoundingBoxes(imageUrl, JSON.parse(response));
        } else {
            show("sendErrorOcr");
            document.getElementById("sendErrorOcr").innerHTML = response;
        }
    });
}

function drawBoundingBoxes(imageUrl, data){
    setSrcById("ocrImage", imageUrl);
    console.log(imageUrl)
    document.getElementById("ocrImage").addEventListener('load', function() {
        document.getElementById('ocrSVG').setAttribute("height", this.naturalHeight + "px");
        document.getElementById('ocrSVG').setAttribute("width", this.naturalWidth + "px");
        drawBoxes(data);
    });
}

// For old API
function drawBoxes(data){
    if (typeof data.regions !== "undefined" && typeof data.regions[0].lines !== "undefined") {
        var html = '';
        data.regions[0].lines.forEach((line) => {
            line.words.forEach((word) => {
                var boxData = word.boundingBox.split(",");
                html += '<rect x="' + boxData[0] + '" y="' + boxData[1] + '" width="' + boxData[2] + '" height="' + boxData[3] + '"' +
                        ' style="stroke:red;stroke-width:2;fill-opacity:0;stroke-opacity:1" />';
            });
        });
        setInnerHtmlById("ocrSVG", html);
    }
}


/*
For new OCR API
function drawBoxes(data){
    if (typeof data.recognitionResult !== "undefined" && typeof data.recognitionResult.lines !== "undefined") {
        var html = '';
        data.recognitionResult.lines.forEach((line) => {
            var p1 = line.boundingBox[0] - line.boundingBox[1];
            var height = line.boundingBox[2] - line.boundingBox[0];
            html += '<line x1="' + line.boundingBox[0] + '" y1="' + line.boundingBox[1] + '" x2="'
                    + line.boundingBox[2] + '" y2="' + line.boundingBox[3] + '" style="stroke:rgb(255,0,0);stroke-width:2" />';
            html += '<line x1="' + line.boundingBox[2] + '" y1="' + line.boundingBox[3] + '" x2="'
                    + line.boundingBox[4] + '" y2="' + line.boundingBox[5] + '" style="stroke:rgb(255,0,0);stroke-width:2" />';
            html += '<line x1="' + line.boundingBox[4] + '" y1="' + line.boundingBox[5] + '" x2="'
                    + line.boundingBox[6] + '" y2="' + line.boundingBox[7] + '" style="stroke:rgb(255,0,0);stroke-width:2" />';
            html += '<line x1="' + line.boundingBox[6] + '" y1="' + line.boundingBox[7] + '" x2="'
                    + line.boundingBox[0] + '" y2="' + line.boundingBox[1] + '" style="stroke:rgb(255,0,0);stroke-width:2" />';
        });
        setInnerHtmlById("ocrSVG", html);
    }
}
*/
