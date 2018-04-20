
import { Injectable } from '@angular/core';

@Injectable()
// tslint:disable-next-line:class-name
export class consultaCatalogos {

    consultaDetalleEmpresa(idFacturador): any {

        const formParameters = {
            empresaSeleccionada: idFacturador
          };

          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/getDetalleEmpresa', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);

         return  resourceRequest.sendFormParameters(formParameters);
    }

    consultaEmpresas() {

        const formParameters = { };
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/getEmpresas', WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);
    
           return resourceRequest.sendFormParameters(formParameters);
        }
        
        pagaServicio(idFacturador, montoAPagar, referencia, cuentaCargo, fechaVencimiento): any {
            const formParameters = {
                idFacturador: idFacturador,
                montoAPagar: montoAPagar,
                referencia: referencia,
                cuentaCargo: cuentaCargo,
                fechaVencimiento: fechaVencimiento
                
              };
              let resourceRequest;
              if (idFacturador === '1310') {
                 resourceRequest = new WLResourceRequest(
                    'adapters/AdapterBanorteSucursApps/resource/pagoDisposicionCredito', WLResourceRequest.POST);
              } else {
                 resourceRequest = new WLResourceRequest(
                    'adapters/AdapterBanorteSucursApps/resource/pagoConcentracionEmpresarial', WLResourceRequest.POST);
              }
              resourceRequest.setTimeout(30000);
    
              return resourceRequest.sendFormParameters(formParameters);
        }

       constructor() {  }
        
}
