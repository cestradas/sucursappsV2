var USR;
var KEY;
var AMBIENTES = ["","","","",""];

$( document ).ready(function() {
    $('#modal_please_wait').modal('show');  
    if(localStorage.getItem("Ambientes") ){
             AMBIENTES=localStorage.getItem("Ambientes").split(",");
            console.log(localStorage.getItem("Ambientes")) 
           
            
                getContextRoot();
                 
    }else if(localStorage.getItem("Ambientes") == "" ){
        console.log("no hay mas contextos")
    }
    else{

        
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


function getContextRoot(){

    setTimeout(function() {
       
        console.log(AMBIENTES[0]);
    
        var wlInitOptions = {
            mfpContextRoot: AMBIENTES[0],
            applicationId: 'com.banorte.sucursapps',
        };
    
        WL.Client.init(wlInitOptions).then(function() {
            console.info("VERSION: 1.3, 07/06/2018")
            
               var formParameters = { };
               var resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL/resource/checkServer',
                WLResourceRequest.POST);
                resourceRequest.setTimeout(10000);
                resourceRequest.sendFormParameters().then(
                function(response){
                   console.log(response);
                    setTimeout(function(){
                        $('#modal_please_wait').modal('hide');
                    },500);
               }, function(error){
                    console.log(error);
                    AMBIENTES.shift();
                    localStorage.setItem("Ambientes",AMBIENTES);
                    WL.Client.reloadApp();
               });
              
    
        }, function(error){
            console.log(error);
        });
    }, 1000)
    
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