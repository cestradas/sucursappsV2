import { Injectable } from '@angular/core';


@Injectable()
export class ResponseWS {

    detalleMantenimiento: string;
    datosBeneficiarios: string;
    datosTransferenciaSPEI: string;
    nombreOperacion: string;
    sesionTdd: string;
    // Envio EDC Correo
    fechaCorte: string;
    numDoc: string;
    idOpe: string;
    stringDocumento: string;
    numeroDocumento: string;
    fechaDocumento: string;
    // Compra TA
    detalleConfirmacionCTA: string;
    // Cancelacion Envio EDC Domicilio
    numeroCuentaTdd: string;
    email: string;
    respuesta: Respuesta = {

        respuestaWS: '',
        paramsExt: ''

    };

}

interface Respuesta {

    respuestaWS: string;
    paramsExt: string;
    

}
