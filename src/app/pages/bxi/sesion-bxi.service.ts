import { Injectable } from '@angular/core';

@Injectable()
export class SesionBxiService {

  // Login
    // Datos Especificos
    usuarioLogin: string;
    metodoAutenticaMayor: string;
    metodoAutenticaEtiqueta: string;
    NombreUsuario: string;
    isPreferente: true;
    // Respuesta Servicios
    detalleIdentificacion: string;
    metodosAutenticacionUsario: string;
    infoUsuario: string;

  // Menu BXI
      // Respuesta Servicios
     infoCuentas: string;
     infoCuentasBeneficiarios: string;
     infoDatosDeBeneficiarios: string;
     infoUsuarioSIC: string;
     alertasActivas: boolean;


  // PagoServcios
    // Datos Especificos
     detalleEmpresa_PS: string;
     idFacturador: string;
     numCuentaSeleccionado: string;
     nombreServicio: string;
    // Respuesta Servicios
      detalleConfirmacionPS: string;

      // Transferencia SPEI , TEF, QUICK
      validaFinishTipoTransfer: string;
      numCuentaSPEISel: string;
      AliasCuentaSPEISel: string;

      // Transferencia SPEI
      // Datos especificos
       numCuentaDestinario: string;
       correoBeneficiario: string;
       nombreBeneficiario: string;
       clabeDestinatario: string;
       claveBancoDestino: string;
       claveAliasCuenta: string;
       claveNumBenefi: string;
      // Respuesta del servicio
      detalleConfirmacionSPEI: string;

      // Transferencia QUICK
      // Datos especificos

      // Respuesta del servicio
      detalleConfirmacionTEF: string;

      // Transferencia QUICK
      // Datos especificos

      // Respuesta del servicio
      detalleConfirmacionQUICK: string;


   // PagoTarjetas
    // Datos Especificos
    numCtaBenSeleccionada: string;
    nameBancoDestino: string;
    nameOperacion: string;
   // Respuesta Servicios
     detallePagoTarjeta: string;

     // Compra TA
     Importerecargas: string;
     numCuentaCTASel: string;
     // Respuesta Servicios
     detalleConfirmacionCTA: string;



  constructor() {  }

}
