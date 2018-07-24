import { Injectable } from '@angular/core';

@Injectable()
export class ConsultaCatalogosTdcService {

  consultaDetalleEmpresa(idFacturador): any {

    const formParameters = {
        empresaSeleccionada: idFacturador
      };

      const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsTdc/resource/getDetalleEmpresa', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

     return  resourceRequest.sendFormParameters(formParameters);
}

consultaEmpresas() {

    const formParameters = { };
    const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsTdc/resource/getEmpresas', WLResourceRequest.POST);
       resourceRequest.setTimeout(30000);

       return resourceRequest.sendFormParameters(formParameters);
    }
    
    pagaServicio(idFacturador, montoAPagar, referencia, fechaVencimiento): any {
      console.log("entrando al dar click en confirmar pago");  
      const formParameters = {
             idFacturador: idFacturador,
             montoAPagar: montoAPagar,
             referencia: referencia,
             fechaVencimiento: fechaVencimiento
            
          };
          let resourceRequest;
          if (idFacturador === '1310' || idFacturador === '88924') {
             resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsTdc/resource/pagoDisposicionCredito', WLResourceRequest.POST);
          } else {
             resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsTdc/resource/pagoConcentracionEmpresarial', WLResourceRequest.POST);
          }
          resourceRequest.setTimeout(30000);
          console.log("saliendo al dar click en confirmar pago");
          return resourceRequest.sendFormParameters(formParameters);
    }


    actualizaDatosContacto(correo, celular) {

        const formParameters = {
            
            correo: correo,
            celular: celular
          };

          const    resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsTdc/resource/actualizaDatosContacto', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

      return resourceRequest.sendFormParameters(formParameters);
    }

    consultarDatosContacto() {
       const formParameters = {
          };

          const    resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsTdc/resource/consultaDatosContacto', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

      return resourceRequest.sendFormParameters(formParameters);
    }

    altaServicioAlertasTDC(evento) {

      const formParameters = {
        servicio: evento
        };

        const    resourceRequest = new WLResourceRequest(
          'adapters/AdapterBanorteSucursAppsTdc/resource/altaServicioAlertas', WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);

    return resourceRequest.sendFormParameters(formParameters);
  }

  mantieneAlertas() {

    const formParameters = {
      };

      const    resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsTdc/resource/consultaServicioAlertas', WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);

  return resourceRequest.sendFormParameters(formParameters);
}

   constructor() {  }

}
