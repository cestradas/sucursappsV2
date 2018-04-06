import { Injectable } from '@angular/core';


@Injectable()
export class ResponseWS {

    respuesta: Respuesta = {

        respuestaWS: ''

    };

}

interface Respuesta {

    respuestaWS: string;
    

}
