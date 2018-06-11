// export funciona metodo con importacion en ts
// function saveDocElectron(documentoB64, numDoc, fechaDoc) {
function saveDocElectron(documentoB64, nombremDoc) {

    var fs1 = require("fs");
    console.log(fs1);
    console.log(documentoB64);
    console.log(nombremDoc);

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

    //Llama a servicio de impresion de docuemnto
    callPrinter(nombremDoc);
}


function callPinPad() {

    var url = 'http://localhost:8081/sucursappsdevices/pinpad/read';

    // fetch(url).then((resp) => { return resp.text() }).then((text) => { console.log(text) });

    fetch(url).then(function(response) {
        // Convert to JSON
        return response.json();
    }).then(function(res) {

        console.log(res);

        localStorage.setItem("tr2", res.tr2);
        localStorage.setItem("np", res.np);
        localStorage.setItem("res", res.res);


    }, function(err) {
        if (err) {
            return console.log(err);
        }

    });

}

function callPrinter(nombremDoc) {

    var url = 'http://localhost:8082/sucursappsdevices/printer/pdf?f=' + nombremDoc + '.pdf';

    fetch(url).then((resp) => { return resp.text() }).then((text) => { console.log("Estatus impresion:" + text) });



}
