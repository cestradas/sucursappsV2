export class OperacionesBXI {

    getSaldo(numCuenta_seleccionada): any {

        const formParameters1 = {
            numCuenta : numCuenta_seleccionada
          };
          const resourceRequest1 = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/getSaldoCuenta', WLResourceRequest.POST);
            resourceRequest1.setTimeout(30000);

            return resourceRequest1.sendFormParameters(formParameters1);

    }

    consultaEmpresas() {

    const formParameters = { };
    const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsBEL/resource/getEmpresas', WLResourceRequest.POST);
       resourceRequest.setTimeout(30000);

       return resourceRequest.sendFormParameters(formParameters);
    }

    consultaDetalleEmpresa(idFacturador): any {

        const formParameters = {
            empresaSeleccionada: idFacturador
          };

          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/getDetalleEmpresa', WLResourceRequest.POST);
          resourceRequest.setTimeout(30000);

         return  resourceRequest.sendFormParameters(formParameters);
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
          if (idFacturador === '1003') {
             resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL/resource/pagoDisposicionCredito', WLResourceRequest.POST);
          } else {
             resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursAppsBEL/resource/pagoConcentracionEmpresarial', WLResourceRequest.POST);
          }
          resourceRequest.setTimeout(30000);

          return resourceRequest.sendFormParameters(formParameters);
    }

}
