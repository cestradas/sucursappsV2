import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class ValidaNipTransaccion {

    postResp;

    respuestaNip: RespuestaNip = {

        res: ''

    };

    constructor(private _http: Http) {}

    validaNipTrans() {

        this.getPosts().subscribe( result => {this.postResp = result; });

        console.log(this.postResp);

        const THIS: any = this;

        const formParameters = {
            tarjeta: this.postResp.tr2,
            // tarjeta: '4334540109018154=151022110000865',
            nip: this.postResp.np
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
