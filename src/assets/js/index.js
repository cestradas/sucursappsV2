
var USR;
var KEY;
var AMBIENTES = ["", "", "", "", ""];

$(document).ready(function() {
    $('#modal_please_wait').modal('show');
   cargaScripts();
    //  checkServer();
});


function getContextRoot() {

    setTimeout(function() {

        // console.log(AMBIENTES[0]);

        var wlInitOptions = {
            // mfpContextRoot: AMBIENTES[0],
            mfpContextRoot: AMBIENTES[0],
            applicationId: 'com.banorte.sucursapps',
        };

        WL.Client.init(wlInitOptions).then(function() {
            console.info("VERSION: 2.18, 30/08/2018, Versi�n Productiva V2")

            var formParameters = {};
            var resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL/resource/checkServer',
                WLResourceRequest.POST);
            resourceRequest.setTimeout(10000);
            resourceRequest.sendFormParameters().then(
                function(response) {
                    // console.log(response);
                    // borra datos TDD en localstorage
                    localStorage.removeItem("des");
                    localStorage.removeItem("np");
                    localStorage.removeItem("res");
                    localStorage.removeItem("tr2");
                    localStorage.removeItem("tr2_serv");
                    localStorage.removeItem("np_serv");
                    localStorage.removeItem("res_serv");
                    localStorage.removeItem("validaNipServ");
                    var responseJson = response.responseJSON;
                    localStorage.setItem("TimeOut", responseJson.TimeOut);
                    localStorage.setItem("TimeOutIni", responseJson.TimeOut);

                    $('#modal_please_wait').modal('hide');

                },
                function(error) {
                    // console.log(error);
                    AMBIENTES.shift();
                    localStorage.setItem("Ambientes", AMBIENTES);
                    WL.Client.reloadApp();
                });


        }, function(error) {
            // console.log(error);
        });
    }, 1000)

}

function checkServer(){
    if (localStorage.getItem("Ambientes")) {
        AMBIENTES = localStorage.getItem("Ambientes").split(",");
        // console.log(localStorage.getItem("Ambientes"))


        getContextRoot();

    } else if (localStorage.getItem("Ambientes") == "") {
        // console.log("no hay mas contextos")
        $.getJSON('assets/js/cfg.json', function(datos) {
            AMBIENTES[0] = datos['root'];
            AMBIENTES[1] = datos['root1'];
            AMBIENTES[2] = datos['root2'];
            AMBIENTES[3] = datos['root3'];
            AMBIENTES[4] = datos['root4'];
            USR = datos['user'];
            KEY = datos['key'];

        });

        getContextRoot();
    } else {


        $.getJSON('assets/js/cfg.json', function(datos) {
            AMBIENTES[0] = datos['root'];
            AMBIENTES[1] = datos['root1'];
            AMBIENTES[2] = datos['root2'];
            AMBIENTES[3] = datos['root3'];
            AMBIENTES[4] = datos['root4'];
            USR = datos['user'];
            KEY = datos['key'];

        });

        getContextRoot();
    }


}

function cargaScripts(){
    console.log("Ini")
    var body = document.getElementsByTagName('body')[0];
    
    var script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/node_modules/ibm-mfp-web-sdk/node_modules/sjcl/sjcl.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/js/popper.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/node_modules/ibm-mfp-web-sdk/node_modules/jssha/src/sha.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/node_modules/ibm-mfp-web-sdk/node_modules/promiz/promiz.min.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/node_modules/ibm-mfp-web-sdk/lib/analytics/ibmmfpfanalytics.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/node_modules/ibm-mfp-web-sdk/ibmmfpf.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/jquery/calendario/moment.min.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/jquery/calendario/tempusdominus-bootstrap-4.js";
    body.appendChild(script1);
    
    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/jquery/calendario/moment-with-locales.js";
    body.appendChild(script1);


    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/js/jquery.twbsPagination.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/js/jquery.twbsPagination.min.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/js/bundle.js";
    body.appendChild(script1);

    script1 = document.createElement('script');
    script1.type="text/javascript"
    script1.src="assets/js/mca-cec-electron.js";
    body.appendChild(script1);
    
    checkServer();
}


function handlerWriteDoc() {
    // console.log("entra funcion para escribir PDF");

    var storagePDF = localStorage.getItem("doc");
    var storageNombrePDF = localStorage.getItem("nombreDoc");
    saveDocElectron(storagePDF, storageNombrePDF);
}


function handlerCallPinpad() {
    // console.log("entra funcion para llamar pinpad");

    callPinPad();

}

function handlerCallPinpadtdc() {
    // console.log("entra funcion para llamar pinpad");

    callPinPadtdc();

}
