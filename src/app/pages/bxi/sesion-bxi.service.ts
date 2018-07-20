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
     EmailCliente: string;
     CelCliente: string;


  // PagoServcios
    // Datos Especificos
     detalleEmpresa_PS: string;
     idFacturador: string;
     numCuentaSeleccionado: string;
     nombreServicio: string;
     formaPago: string;
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

      // Transferencia propias/terceros BANORTE
      // Datos especificos
      numCuentaTranPropBanorte: string;
      AliasCuentaTranPropBanorte: string;
     // Respuesta del servicio
     detalleConfirmacionTranPropBanorte: string;



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



     // cuenta consulta movimientos


    SaldoActual: string;
     tipoCuenta: String;
     aliasCuentaSeleccionada: String;
     noTarjetaSeleccionada: String;
     divisa: String;
     saldoSeleccionado: String;


     // EDC
    stringDocumento: string;
    numeroDocumento: string;
    fechaDocumento: string;
    numeroCuentaEDCSel: string;
    aliasCuentaEDCSel: string;
    opcionEDCSel: string;
     // Envio EDC Correo
    fechaCorte: string;
    numDoc: string;
    idOpe: string;
    validaMail: string;

    // Session

    Login: String;

    // datos contacto

    cambioCel = false;
    cambioCorreo = false;
    Fecha: string;
    Tiempo: string;


  constructor() {  }

}
