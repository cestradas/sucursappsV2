//'use strict';

//getPDFS(fechasEnvioMail, arrPDFS);

//prueba2();



// export funciona metodo con importacion en ts
// function saveDocElectron(documentoB64, numDoc, fechaDoc) {
function saveDocElectron(documentoB64, nombremDoc) {

    var fs1 = require("fs");
    console.log(fs1);
    console.log(documentoB64);
    console.log(nombremDoc);
    //console.log(numDoc);
    //console.log(fechaDoc);
    // electron para DOCUMENTO

    // var tmpFileName0 = 'c:/temp/electron/' + 'D_' + numDoc + '_' + fechaDoc + '.pdf';

    var tmpFileName0 = 'c:/temp/' + nombremDoc + '.pdf';


    fs1.writeFile(tmpFileName0, documentoB64, 'base64', function(err) {
        if (err) {
            return console.log(err);
        }

    });

    setTimeout(function() {
        // Quita los datos almacenados del PDF
        //localStorage.removeItem(doc);
        //localStorage.removeItem(nombreDoc);
        console.log("borrado de doc");
    }, 2000);

    callPrinter(nombremDoc);
}


function callPinPad() {

    var url = 'http://localhost:8081/sucursappsdevices/pinpad/read';

    fetch(url).then((resp) => { return resp.text() }).then((text) => { console.log(text) });

}

function callPrinter(nombremDoc) {

    var url = 'http://localhost:8082/sucursappsdevices/printer/pdf?f=' + nombremDoc + '.pdf';

    fetch(url).then((resp) => { return resp.text() }).then((text) => { console.log(text) });



}






//console.log("Escribiendo archivo: " + tmpFileName);
//var numeroDocs = arrPDFS.length;


function getPDFS(arrFechasPDFS, PDFS) {
    console.log("getPDFS");
    console.log("getPDFS fechas: " + arrFechasPDFS);


    //	for(var i=0; i<=arrPDFS.length; i++){
    var fs1 = require("fs");
    var fs2 = require("fs");
    var fs3 = require("fs");

    if (arrPDFS[0] != null) {
        var tmpFileName0 = 'c:/temp/' + 'D_1_' + numeroCuenta + '_' + fechasEnvioMail[0] + '.pdf';
        //		setTimeout(function() {
        fs1.writeFile(tmpFileName0, arrPDFS[0], 'base64', function(err) {
            if (err) {
                return console.log(err);
            }

        });
    }

    if (arrPDFS[1] != null) {
        //		setTimeout(function(){	
        var tmpFileName1 = 'c:/temp/' + 'D_2_' + numeroCuenta + '_' + fechasEnvioMail[1] + '.pdf';
        fs2.writeFile(tmpFileName1, arrPDFS[1], 'base64', function(err) {
            if (err) {
                return console.log(err);
            }

        });
        //		}, 10000);
    }

    if (arrPDFS[2] != null) {
        //		setTimeout2(function(){	
        var tmpFileName2 = 'c:/temp/' + 'D_3_' + numeroCuenta + '_' + fechasEnvioMail[2] + '.pdf';
        fs3.writeFile(tmpFileName2, arrPDFS[2], 'base64', function(err) {
            if (err) {
                return console.log(err);
            }

        });
        //			}, 20000);
    }
    //	}




}