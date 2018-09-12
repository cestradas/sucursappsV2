import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import $ from 'jquery';
declare var $: $;

@Injectable()
export class ValidaNipTransaccion {

    postResp;
    intervalo;
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

    //  setTimeout(function() {
        let contador = 0;
        let myTime = setInterval(detectarTarjeta, 2000);

        function detectarTarjeta () {
   // trae los datos de sesion de login al pedir validacion de TDD por segunda vez
   let tr2_serv = localStorage.getItem("tr2_serv");
   let np_serv = localStorage.getItem("np_serv");
   let respTar_serv = localStorage.getItem("res_serv");
   this.respuestaTrjeta_serv = respTar_serv;
   let descripcion = localStorage.getItem("des");
   
   if (tr2_serv != null) {
    clearInterval(myTime); 
    // tslint:disable-next-line:max-line-length
    if (descripcion === "Tarjeta no detectada" || descripcion === "Tarjeta no retirada" || descripcion === "Operacion Cancelada por Cliente" || descripcion === "PIN incorrecto debe de ser 4 Digitos" || descripcion === "ATR error or NO smart card") {
        $('#ModalTDDLogin').modal('hide');
       // console.log("Pinpad Trans respondio con " + this.respuestaTrjeta);
       clearInterval(THIS.intervalo);
       // tslint:disable-next-line:max-line-length
       if (descripcion === "ATR error or NO smart card") {
        document.getElementById('mnsError').innerHTML = "Tarjeta no detectada.";
       } else {
        document.getElementById('mnsError').innerHTML = descripcion;
       }
       
        $('#errorModal').modal('show');
                /* localStorage.removeItem("tr2_serv");
        localStorage.removeItem("des"); */        
      } else {
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
                            // console.log("Respuesta desde el Service RES: " , THIS.respuestaNip.res);
                           } else {
                            THIS.respuestaNip.res = response.responseJSON;
                            // tslint:disable-next-line:max-line-length                            
                           }
   
   
                    } ,
   
                    function(error) {
                        document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
                            $('#errorModal').modal('show');
                        // console.log(error.responseText);
   
                    });
                    /*
            localStorage.removeItem("tr2_serv");
            localStorage.removeItem("des"); */
   
        }
      }
      $("#_modal_please_wait").modal("hide");
        } else {
            // console.log("NO se detectaron datos Tarjeta: " + localStorage.getItem("tr2_serv"));  
            contador ++;
                    if (contador === 15) {
                      clearInterval(myTime);
                      clearInterval(THIS.intervalo);
                      $('#ModalTDDLogin').modal('hide');
                      $("#_modal_please_wait").modal("hide");
                      document.getElementById('mnsError').innerHTML = "Tarjeta no detectada.";
                      $('#errorModal').modal('show');
                    }  
        } // }, 30000);
        }
       
        localStorage.removeItem("des");
        localStorage.removeItem("np");
        localStorage.removeItem("res");
        localStorage.removeItem("tr2");
        localStorage.removeItem("tr2_serv");
        localStorage.removeItem("np_serv");
        localStorage.removeItem("res_serv");
    }

    validarDatosrespuesta(): Promise<any> {
        return new Promise( (resolve, reject) => {
            const this_aux = this;
            let resp;
            this_aux.intervalo = setInterval( () => {

            // console.log("Dentro de la promesa: " + this.respuestaNip.res);

                if ( this.respuestaNip.res !== '') {

                    resp = {

                        'response': this.respuestaNip.res

                    };                     
                    resolve(resp);
                    clearInterval(this_aux.intervalo);

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
