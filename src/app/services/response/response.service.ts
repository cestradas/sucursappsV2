import { Injectable } from '@angular/core';


@Injectable()
export class ResponseWS {

    detalleMantenimiento: string;
    datosBeneficiarios: string;
    respuesta: Respuesta = {

        respuestaWS: ''

    };

}

interface Respuesta {

    respuestaWS: string;
    

}
