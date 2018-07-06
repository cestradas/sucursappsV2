
import { Injectable } from '@angular/core';

@Injectable()
// tslint:disable-next-line:class-name
export class consultaCatalogos {

    consultaDetalleEmpresa(idFacturador): any {

        const formParameters = {
            empresaSeleccionada: idFacturador
          };

          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps2/resource/getDetalleEmpresa', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);

         return  resourceRequest.sendFormParameters(formParameters);
    }

    consultaEmpresas() {

        const formParameters = { };
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps2/resource/getEmpresas', WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);
    
           return resourceRequest.sendFormParameters(formParameters);
        }
        
        pagaServicio(idFacturador, montoAPagar, referencia, fechaVencimiento): any {
            const formParameters = {
                idFacturador: idFacturador,
                montoAPagar: montoAPagar,
                referencia: referencia,
                fechaVencimiento: fechaVencimiento
                
              };
              let resourceRequest;
              if (idFacturador === '1310') {
                 resourceRequest = new WLResourceRequest(
                    'adapters/AdapterBanorteSucursApps2/resource/pagoDisposicionCredito', WLResourceRequest.POST);
              } else {
                 resourceRequest = new WLResourceRequest(
                    'adapters/AdapterBanorteSucursApps2/resource/pagoConcentracionEmpresarial', WLResourceRequest.POST);
              }
              resourceRequest.setTimeout(30000);
    
              return resourceRequest.sendFormParameters(formParameters);
        }


        actualizaDatosContacto(correo, celular) {

            const formParameters = {
                correo: correo,
                celular: celular
              };
    
              const    resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursApps/resource/actualizaDatosContacto', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);
    
          return resourceRequest.sendFormParameters(formParameters);
        }

        consultarDatosContacto() {

            const formParameters = {
              };
    
              const    resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursApps/resource/consultaDatosContacto', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);
    
          return resourceRequest.sendFormParameters(formParameters);
        }

        altaServicioAlertasTDD(evento) {

          const formParameters = {
            servicio: evento
            };
  
            const    resourceRequest = new WLResourceRequest(
              'adapters/AdapterBanorteSucursApps/resource/altaServicioAlertas', WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
  
        return resourceRequest.sendFormParameters(formParameters);
      }

      mantieneAlertas() {

        const formParameters = {
          };

          const    resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/consultaServicioAlertas', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);

      return resourceRequest.sendFormParameters(formParameters);
    }


    transferenciaCuentasBanorte(cuenDestino, importe, desc, correo) {

      const formParameters = {
        cuentaDestino : cuenDestino,
        importe: importe,
        descripcion: desc,
        correoNotificacion: correo
      };

        const    resourceRequest = new WLResourceRequest(
          'adapters/AdapterBanorteSucursApps2/resource/transCuentasBanorte', WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);

    return resourceRequest.sendFormParameters(formParameters);
  }

    mascaraNumeroCuenta(numCtaSel) {

      const tamNumCta = numCtaSel.length;
      const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
      const numCuenta_show = '******' + numCta_aux;

      return numCuenta_show;
  }

       constructor() {  }
        
}
