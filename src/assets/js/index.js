var ROOT;
var USR;
var KEY;

$.getJSON('assets/js/cfg.json', function(datos) {
    ROOT = datos['root'];
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
        console.info("VERSION: 1, 22/01/2018")
        setTimeout(function() {
            var userLoginChallengeHandler = UserLoginChallengeHandler(USR, KEY);
        }, 1000)

    });
}, 1000)