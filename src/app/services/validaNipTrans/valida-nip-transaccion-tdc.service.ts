import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import $ from 'jquery';
declare var $: $;

@Injectable()
export class ValidaNipTransaccionTdcService {

    postResp;
    respuestaTrjeta = "";
    respuestaTrjeta_serv = "";
    respuestaNip: RespuestaNip = {

        res: ''

    };

    constructor(private _http: Http) {}

    validaNipTrans() {

        // this.getPosts().subscribe( result => {this.postResp = result; });

        // console.log(this.postResp);

        const THIS: any = this;

      // trae los datos de sesion de login Tarjeta
      let tr2 = localStorage.getItem("tr2");
      let np = localStorage.getItem("np");
      let respTar = localStorage.getItem("res");

      setTimeout(function() {

          // trae los datos de sesion de login al pedir validacion de TDD por segunda vez
      let tr2_serv = localStorage.getItem("tr2_serv");
      let np_serv = localStorage.getItem("np_serv");
      let respTar_serv = localStorage.getItem("res_serv");
      this.respuestaTrjeta_serv = respTar_serv;
      
      if (tr2_serv != null) {


          if ((respTar_serv !== "NO_OK") && (respTar_serv !== null) && (localStorage.getItem("validaNipServ") === "1")) {

            const formParameters = {
              tarjeta: tr2_serv,
              // tarjeta: '4334540109018154=151022110000865',
              nip: np_serv
              // nip: 'D4D60267FBB0BB28'
            };

            const resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursApps/resource/validaNipTrans',
                WLResourceRequest.POST);
            resourceRequest.setTimeout(30000);
            resourceRequest
                .sendFormParameters(formParameters)
                .then(
                    function(response) {
                        if (response.responseJSON === true) {              
                            THIS.respuestaNip.res = response.responseJSON;
                            console.log("Respuesta desde el Service RES: " , THIS.respuestaNip.res);
                           } else {
                            THIS.respuestaNip.res = response.responseJSON;
                            // tslint:disable-next-line:max-line-length                            
                           }


                    } ,

                    function(error) {
                        document.getElementById('mnsError').innerHTML = "Por el momento este servicio no est&aacute; disponible, favor de intentar de nuevo m&aacute;s tarde.";
                            $('#errorModal').modal('show');
                        console.log(error.responseText);

                    });

        } } }, 30000);

    }

    validarDatosrespuesta(): Promise<any> {
        return new Promise( (resolve, reject) => {
            let resp;
            let intervalo = setInterval( () => {

                console.log("Dentro de la promesa: " + this.respuestaNip.res);

                if ( this.respuestaNip.res !== '') {

                    resp = {

                        'response': this.respuestaNip.res

                    };                     
                    resolve(resp);
                    clearInterval(intervalo);

                }
              

              }, 1000);
        });



    }

    getPosts() {
        return this._http.get('http://localhost:8081/sucursappsdevices/pinpad/read')
                                .map(res => res.json());
      }

      consultaTablaYValidaSaldo(importe) {
        const formParameters = {
            importe: importe
        };
      const resourceRequest = new WLResourceRequest(
        "adapters/AdapterBanorteSucursApps2/resource/consultaMontosMaximos",
        WLResourceRequest.POST
      );
      resourceRequest.setTimeout(30000);
      return resourceRequest.sendFormParameters(formParameters);
    }

}
interface RespuestaNip {

    res: any;

}
