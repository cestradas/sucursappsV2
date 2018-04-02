import { Injectable } from '@angular/core';

@Injectable()
export class SesionBxiService {

  // Login
    // Datos Especificos
    usuarioLogin: string;
    metodoAutenticaMayor: string;
    metodoAutenticaEtiqueta: string;
    NombreUsuario: string;
    // Respuesta Servicios
    detalleIdentificacion: string;
    metodosAutenticacionUsario: string;
    infoUsuario: string;

  // Menu BXI
      // Respuesta Servicios
     infoCuentas: string;
     infoCuentasBeneficiarios: string;
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
       numCuentaSel: string;
       numCuentaDestinario: string;
       clabeDestinatario: string;
       claveBancoDestino: string;
       claveAliasCuenta: string;
      // Respuesta del servicio
      detalleConfirmacionSPEI: string;


   // PagoTarjetas
    // Datos Especificos
    numCtaBenSeleccionada: string;
    nameBancoDestino: string;
    nameOperacion: string;
   // Respuesta Servicios
     detallePagoTarjeta: string;



  constructor() {  }

}
