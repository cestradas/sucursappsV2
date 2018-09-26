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

        var wlInitOptions = {
            mfpContextRoot: AMBIENTES[0],
            // mfpContextRoot: '/DEVMFPSapp',
            // mfpContextRoot: '/mfp',
            applicationId: 'com.banorte.sucursapps',
        };

        if( localStorage.getItem("AmbienteOK") !== null){
            wlInitOptions.mfpContextRoot =  localStorage.getItem("AmbienteOK");
        }

        WL.Client.init(wlInitOptions).then(function() {
            console.info("VERSION: 4.0, 21/09/2018, Versión Productiva")

            if( localStorage.getItem("AmbienteOK") === null){
            var formParameters = {};
            var resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL/resource/checkServer',
                WLResourceRequest.POST);
            resourceRequest.setTimeout(10000);
            resourceRequest.sendFormParameters().then(
                function(response) {
                    // console.log(response);
                    // borra datos TDD en localstorage                    
                    var responseJson = response.responseJSON;
                    localStorage.setItem("TimeOutIni", responseJson.TimeOut);
                    localStorage.setItem("TimeOut",  responseJson.TimeOut);
                    localStorage.setItem("AmbienteOK", wlInitOptions.mfpContextRoot )

                    $('#modal_please_wait').modal('hide');

                    
                   

                   const securityCheckName = 'banorteSecurityCheckSa';
                   const userLoginChallengeHandler = WL.Client
                       .createSecurityCheckChallengeHandler(securityCheckName);
                   const usr_ca = 'sucursApps';
                   const tarjet = 'adm-sucusWeb';
                  //  console.log(usr_ca);
                  //  console.log(tarjet);

                       WLAuthorizationManager.login(securityCheckName, {
                           'usr_ca': usr_ca,
                           'tarjet': tarjet
                       }).then(
                           function() {
                               var usuarioAgent = navigator.userAgent;
                               console.log('login onSuccess');
                    
                               setTimeout(function() {
                                   getUsrPassLegacyCR(usuarioAgent); // CONEXION TERMINAL Y BD
                                   
                                }, 500);

                       }, function(error) {
                          //  console.log(error);
                           $('#ModalTDDLogin').modal('hide');
                           setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
                       });
                    





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


function getUsrPassLegacyCR(usrAgent) {
    
    $('#_modal_please_wait').modal('show');

        var patron = /@/g;
        usrAgent = usrAgent.replace(patron, '');

        var formParameters = {
            terminal: usrAgent
                // terminal: 'T002'
        };
        var resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/consultaUsrLegacy',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest.sendFormParameters(formParameters).then(
            function(response) {
                datosLegacy = response.responseJSON;
                var resLegacyJson = response.responseJSON;
                console.log( datosLegacy);

                localStorage.setItem( "terminal", datosLegacy.idSucursal);

                if (resLegacyJson.Id === '0') {
                    WLAuthorizationManager.logout('banorteSecurityCheckSa');
                   
                    setTimeout(function() {
                      setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );
                      $('#errorModal').modal('show');
                    }, 500);
                    
                } else {
                  console.log("El servcio de informacion Legacy respondio correctamente");
                  // this_aux.validaUsuarioAfterSecurity(usuarioBxi);   
                 setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );

                }
              },
            function(error) {
              
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
                console.log("Ocurrio un error con el servcio de informacion Legacy");
                $('#errorModal').modal('show');
                setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );
            });
    
}
