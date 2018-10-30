var USR;
var KEY;
var AMBIENTES = ["", "", "", "", ""];

$(document).ready(function() {
    $('#modal_please_wait').modal('show');

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


});


function getContextRoot() {

    setTimeout(function() {

        // console.log(AMBIENTES[0]);

        var wlInitOptions = {
            mfpContextRoot: AMBIENTES[0],
            // mfpContextRoot: '/DEVMFPSapp',
            // mfpContextRoot: '/mfp',
            applicationId: 'com.banorte.sucursapps',
        };

        if (localStorage.getItem("AmbienteOK") !== null) {
            wlInitOptions.mfpContextRoot = localStorage.getItem("AmbienteOK");
        }

        WL.Client.init(wlInitOptions).then(function() {
            console.info("VERSION: 5.2, 29/10/2018, Versión Productiva")

            if (localStorage.getItem("AmbienteOK") === null) {
                var usuarioAgent = navigator.userAgent;
                var patron = /@/g;
                usuarioAgent = usuarioAgent.replace(patron, '');

                var formParameters = {
                    terminal: usuarioAgent
                };
                var resourceRequest = new WLResourceRequest(
                    'adapters/AdapterBanorteSucursAppsBEL/resource/checkServer',
                    WLResourceRequest.POST);
                resourceRequest.setTimeout(10000);
                resourceRequest.sendFormParameters(formParameters).then(
                    function(response) {
                        // console.log(response);
                        // borra datos TDD en localstorage                    
                        var responseJson = response.responseJSON;
                        localStorage.setItem("TimeOutIni", responseJson.TimeOut);
                        localStorage.setItem("TimeOut", responseJson.TimeOut);
                        localStorage.setItem("AmbienteOK", wlInitOptions.mfpContextRoot);
                        localStorage.setItem("terminal", responseJson.CR)

                        $('#modal_please_wait').modal('hide');

                    },
                    function(error) {
                        // console.log(error);
                        AMBIENTES.shift();
                        localStorage.setItem("Ambientes", AMBIENTES);
                        WL.Client.reloadApp();
                    });
            }
        }, function(error) {
            // console.log(error);
        });
    }, 1000)

}