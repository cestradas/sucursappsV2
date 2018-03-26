import { Injectable } from '@angular/core';

@Injectable()
export class SesionBxiService {

  // Login
    // Datos Especificos
    usuarioLogin: string;
    metodoAutenticaMayor: string;
    NombreUsuario: string;
    // Respuesta Servicios
    detalleIdentificacion: string;
    metodosAutenticacionUsario: string;
    infoUsuario: string;

  // Menu BXI
      // Respuesta Servicios
     infoCuentas: string;
     infoUsuarioSIC: string;

  // PagoServcios
    // Datos Especificos
     detalleEmpresa_PS: string;
     idFacturador: string;
     numCuentaSeleccionado: string;
     nombreServicio: string;
    // Respuesta Servicios
      detalleConfirmacionPS: string;

  // Transferencia SPEI
   // Datos especificos

   // Respuesta del servicio
   detalleConfirmacionSPEI: string;



  constructor() {  }

}
