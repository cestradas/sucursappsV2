import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import $ from 'jquery';
declare var $: $;

@Injectable()
export class ValidaNipTransaccionTdcService {

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


   // trae los datos de sesion de login al pedir validacion de TDD por segunda vez
   let tr2_serv = localStorage.getItem("tr2_serv");
   let np_serv = localStorage.getItem("np_serv");
   let respTar_serv = localStorage.getItem("res_serv");
   this.respuestaTrjeta_serv = respTar_serv;
   let descripcion = localStorage.getItem("des");
   
    // tslint:disable-next-line:max-line-length
    if ((descripcion === "El Lector de Tarjetas no esta conectado" || descripcion === "Tarjeta no detectada" || descripcion === "Tarjeta no retirada" || descripcion === "Operacion Cancelada por Cliente" || descripcion === "PIN incorrecto debe de ser 4 Digitos" || descripcion === "ATR error or NO smart card" || descripcion === "Error al leer la tarjeta" || descripcion === "Error lectura pin")  && (np_serv === null || np_serv === "")) {
        $('#ModalTDDLogin').modal('hide');
       // console.log("Pinpad Trans respondio con " + this.respuestaTrjeta);
       clearInterval(THIS.intervalo);
       // tslint:disable-next-line:max-line-length
       if (descripcion === "ATR error or NO smart card") {
        document.getElementById('mnsError').innerHTML = "Tarjeta no detectada.";
       } else if (descripcion === "Error al leer la tarjeta" || descripcion === "Error lectura pin") {
        document.getElementById('mnsError').innerHTML = "Plástico no válido, por favor verifica que sea un plástico Banorte.";
       } else if (descripcion === "El Lector de Tarjetas no esta conectado") {
        document.getElementById('mnsError').innerHTML = "El Lector de Tarjetas no esta conectado";
      } else {
        document.getElementById('mnsError').innerHTML = descripcion;
       }
       
        $('#errorModal').modal('show');
        setTimeout( () => $('#ModalTDDLogin').modal('hide'), 1000 );
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
                'adapters/AdapterBanorteSucursAppsTdc/resource/validaNipTrans',
                WLResourceRequest.POST);
            resourceRequest.setTimeout(30000);
            resourceRequest
                .sendFormParameters(formParameters)
                .then(
                    function(response) {
                      setTimeout( () => $('#ModalTDDLogin').modal('hide'), 1000 );
                        if (response.responseJSON === true) {
                            THIS.respuestaNip.res = response.responseJSON;
                            // console.log("Respuesta desde el Service RES: " , THIS.respuestaNip.res);
                           } else {
                            THIS.respuestaNip.res = response.responseJSON;
                            $('#ModalTDDLogin').modal('hide');
                            // tslint:disable-next-line:max-line-length                            
                           }
   
   
                    } ,
   
                    function(error) {
                        document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
                            $('#errorModal').modal('show');
                            $('#ModalTDDLogin').modal('hide');
                        // console.log(error.responseText);
   
                    });
   
        }
      }
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

    callPinPadTransTdc() {
        const this_aux = this;
        console.log("Entra a call pinpad Trans");
       let url = 'http://localhost:8083/sucursappsdevices/pinpad/read';
       $('#ModalTDDLogin').modal('show');
       document.getElementById('capturaInicio').style.display = 'block';
       document.getElementById('caputuraSesion').style.display = 'none';
       localStorage.removeItem("tr2_serv");
       localStorage.removeItem("np_serv");
       localStorage.removeItem("res_serv");
       localStorage.removeItem("des");
   
       fetch(url).then(function(response) {
           // Convert to JSON
           return response.json();
       }).then(function(res) {
        console.log("Responde call pinpad Trans");
           let respuesta = JSON.parse(res);
   
   
                   localStorage.setItem("tr2_serv", respuesta.tr2);
                   localStorage.setItem("np_serv", respuesta.np);
                   localStorage.setItem("res_serv", respuesta.res);
                   localStorage.setItem("des", respuesta.des);
          
   
           
   
           this_aux.validaNipTrans();
   
       }, function(err) {
           if (err) {
               return console.log(err);
           }
   
       });
   }

    getPosts() {
        return this._http.get('http://localhost:8083/sucursappsdevices/pinpad/read')
                                .map(res => res.json());
      }

      consultaTablaYValidaSaldo(importe) {
        const formParameters = {
            importe: importe
        };
      const resourceRequest = new WLResourceRequest(
        "adapters/AdapterBanorteSucursAppsTdc/resource/consultaMontosMaximos",
        WLResourceRequest.POST
      );
      resourceRequest.setTimeout(30000);
      return resourceRequest.sendFormParameters(formParameters);
    }

}
interface RespuestaNip {

    res: any;

}
