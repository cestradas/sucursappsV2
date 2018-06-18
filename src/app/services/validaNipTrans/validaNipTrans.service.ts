import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class ValidaNipTransaccion {

    postResp;
    respuestaTrjeta = "";
    respuestaTrjeta_serv = "";

    respuestaNip: RespuestaNip = {

        res: ''

    };

    constructor(private _http: Http) {}

    validaNipTrans() {

        //this.getPosts().subscribe( result => {this.postResp = result; });

        //console.log(this.postResp);

        const THIS: any = this;

      // trae los datos de sesion de login Tarjeta
      let tr2 = localStorage.getItem("tr2");
      let np = localStorage.getItem("np");

      let descripcion = localStorage.getItem("des");

      // trae los datos de sesion de login al pedir validacion de TDD por segunda vez
      let tr2_serv = localStorage.getItem("tr2_serv");
      let np_serv = localStorage.getItem("np_serv");
      let respTar_serv = localStorage.getItem("res");
      this.respuestaTrjeta_serv = respTar;


      if (tr2_serv != null) {


          if ((respTar !== "NO_OK") && (respTar !== null)) {

            const formParameters = {
              tarjeta: tr2,
              // tarjeta: '4334540109018154=151022110000865',
              nip: np
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

                        THIS.respuestaNip.res = response.responseJSON;
                        console.log("Respuesta desde el Service RES: " , THIS.respuestaNip.res);

                    } ,

                    function(error) {

                        console.log(error.responseText);

                    });

            }

       }

    }

    validarDatosrespuesta(): Promise<any> {
        return new Promise( (resolve, reject) => {

            let intervalo = setInterval( () => {

                console.log("Dentro de la promesa: " + this.respuestaNip.res);

                if ( this.respuestaNip.res !== '' ) {

                    let resp = {

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

}

interface RespuestaNip {

    res: any;

}
