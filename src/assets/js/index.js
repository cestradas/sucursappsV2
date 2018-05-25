var ROOT;
var USR;
var KEY;

$.getJSON('assets/js/cfg.json', function(datos) {
    ROOT = datos['root'];
    ROOT1 = datos['root1'];
    ROOT2 = datos['root2'];
    ROOT3 = datos['root3'];
    USR = datos['user'];
    KEY = datos['key'];

});

setTimeout(function() {
    console.log(ROOT);
    var wlInitOptions = {
        mfpContextRoot: ROOT,
        applicationId: 'com.banorte.sucursapps',

    };

    WL.Client.init(wlInitOptions).then(function() {
        console.info("VERSION: 1.1, 24/05/2018")
        setTimeout(function() {
            var userLoginChallengeHandler = UserLoginChallengeHandler(USR, KEY);
        }, 1000)

    });
}, 1000)



var roots = function(param) {

    setTimeout(function() {
        console.log(param);
        var wlInitOptions = {
            mfpContextRoot: param,
            applicationId: 'com.banorte.sucursapps',

        };

        var prom1 = new Promise(function(resolve, reject) {
            setTimeout(function() {
                // console.log("Promesa terminada");
                //termina bien
                resolve(valRoot(param));

            }, 1500);
        });


    });

}

function valRoot(param) {

    var wlInitOptions = {
        mfpContextRoot: param,
        applicationId: 'com.banorte.sucursapps',

    };
    console.info("VERSION: 1, 22/01/2018")
    var userLoginChallengeHandler = UserLoginChallengeHandler(USR, KEY);

}

function listener() {
    window.addEventListener('message', function(e) {
        var origin = event.origin || event.originalEvent.origin;
        if (origin !== "http://lnxsapl1d.dev.unix.banorte.com:9080") {
            return;
        }
        $('#campaniaModal').modal('toggle');
    }, false);
}
