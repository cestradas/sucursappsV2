var banderaServidor = 0;
var datosLegacy = "";
var datosSesion = "";
var UserLoginChallengeHandler = function(usr, key) {

    var isChallenged = false;
    var securityCheckName = 'banorteSecurityCheckSa';
    var userLoginChallengeHandler = WL.Client
        .createSecurityCheckChallengeHandler(securityCheckName);

    login(usr, key);

    document.addEventListener("pause", logout, true);

    userLoginChallengeHandler.securityCheckName = securityCheckName;

    userLoginChallengeHandler.handleChallenge = function(challenge) {

        WL.Logger.debug("handleChallenge");
        isChallenged = true;
        var statusMsg = "Remaining Attempts: " + challenge.remainingAttempts;

        if (challenge.errorMsg !== null) {
            statusMsg = statusMsg + "<br/>" + challenge.errorMsg;
        }
        WL.Logger.debug("Status MSG = " + statusMsg);
    };

    userLoginChallengeHandler.handleSuccess = function(data) {
        WL.Logger.debug("handleSuccess");
        isChallenged = false;

        usuarioAgent = navigator.userAgent;
        // getidSesion();
        getUsrPassLegacy(usuarioAgent);

        //		document.getElementById("helloUser").innerHTML = "Hello, "
        //				+ data.user.displayName;
    };

    userLoginChallengeHandler.handleFailure = function(error) {
        WL.Logger.debug("handleFailure: " + error.failure);
        isChallenged = false;
        if (error.failure !== null) {
            alert(error.failure);
        } else {
            alert("Failed to login.");
        }
    };

    function login(usr, key) {

        var usr_ca = usr;
        var tarjet = key;

        console.log(usr_ca);
        console.log(tarjet);

        //var usr_ca = "sucursApps";
        //var tarjet = "adm-sucusWeb";

        if (isChallenged) {
            userLoginChallengeHandler.submitChallengeAnswer({
                'usr_ca': usr_ca,
                'tarjet': tarjet
            });
        } else {
            WLAuthorizationManager.login(securityCheckName, {
                'usr_ca': usr_ca,
                'tarjet': tarjet
            }).then(
                function() {

                    console.info('login onSuccess');



                },

                function(response) {


                    banderaServidor++;

                    if (banderaServidor == 1) {

                        var user = roots(ROOT1);
                    } else if (banderaServidor == 2) {
                        var user = roots(ROOT2);
                    } else if (banderaServidor == 3) {
                        var user = roots(ROOT3);
                    } else if (banderaServidor >= 3) {
                        console.info("*login onFailure: " +
                            JSON.stringify(response));

                    }

                });

        }

    }

    function servidor(param) {
        setTimeout(function() {
            console.log(param);
            var wlInitOptions = {
                mfpContextRoot: param,
                applicationId: 'com.banorte.sucursapps',

            };

            WL.Client.init(wlInitOptions).then(function() {
                console.info("VERSION: 1.2, 29/05/2018")
                setTimeout(function() {
                    var userLoginChallengeHandler = UserLoginChallengeHandler(USR, KEY);
                }, 1000)

            });
        }, 1000)
    }



    function logout() {

        alert("afuera");

        WLAuthorizationManager.logout(securityCheckName).then(function() {
                WL.Logger.debug("logout onSuccess");
                location.reload();
            },

            function(response) {
                WL.Logger.debug("logout onFailure: " + JSON.stringify(response));
            });
    }
    return userLoginChallengeHandler;
};

function getUsrPassLegacy(usrAgent) {

    if (datosLegacy == "") {

        var patron = /@/g;
        usrAgent = usrAgent.replace(patron, "");

        const formParameters = {
            terminal: usrAgent
                //terminal: 'T002'
        };
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/consultaUsrLegacy',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest.sendFormParameters(formParameters).then(
            function(response) {
                datosLegacy = response.responseJSON;
                console.log(datosLegacy);
                console.log("El servcio de informacion Legacy respondio correctamente");
            },
            function(error) {
                console.error("Ocurrio un error con el servcio de informacion Legacy");
                $('#errorModal').modal('show');
            });
    }
}

function getidSesion() {
    const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursApps/resource/getSessionId',
        WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);
    resourceRequest.send().then(
        function(response) {
            datosSesion = response.responseText;
            console.log(datosSesion);
            console.log("El servcio de id sesion respondio correctamente");
        },
        function(error) {
            console.error("Ocurrio un error con el servcio de id sesion");
        });
}
