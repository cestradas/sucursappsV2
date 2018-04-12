import { Injectable } from '@angular/core';


@Injectable()
export class ResponseWS {

    respuesta: Respuesta = {

        respuestaWS: '',
        paramsExt: ''

    };

}

interface Respuesta {

    respuestaWS: string;
    paramsExt: string;
    

}
