export class OperacionesBXI {

    getSaldo(numCuenta_seleccionada): any {

        const formParameters1 = {
            numCuenta : numCuenta_seleccionada
          };
          const resourceRequest1 = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/getSaldoCuenta', WLResourceRequest.POST);
            resourceRequest1.setTimeout(30000);

            return resourceRequest1.sendFormParameters(formParameters1);

    }

    consultaClabeSaldo(): any {
      
        console.log("adentro cnsultaCuentas");
    
        let tipoMovimiento = "1";
        let numeroCuenta = "0665815063";
    
        const THIS: any = this;
    
        const formParameters = {
            tipoMovimiento:  tipoMovimiento,
            numeroCuenta: numeroCuenta
        
        };
    
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/consultaClabeSaldo',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters);
            
        
        
            return resourceRequest.sendFormParameters(formParameters);
  
    }

    consultaEmpresas() {

    const formParameters = { };
    const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursApps/resource/getEmpresas', WLResourceRequest.POST);
       resourceRequest.setTimeout(30000);

       return resourceRequest.sendFormParameters(formParameters);
    }

    consultaDetalleEmpresa(idFacturador): any {

        const formParameters = {
            empresaSeleccionada: idFacturador
          };

          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/getDetalleEmpresa', WLResourceRequest.POST);
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
                'adapters/AdapterBanorteSucursApps/resource/pagoDisposicionCredito', WLResourceRequest.POST);
          } else {
             resourceRequest = new WLResourceRequest(
                'adapters/AdapterBanorteSucursApps/resource/pagoConcentracionEmpresarial', WLResourceRequest.POST);
          }
          resourceRequest.setTimeout(30000);

          return resourceRequest.sendFormParameters(formParameters);
    }

    confirmaTransferSPEI(bancoRecep, clabe, nombreBene, rfcBenef, ref, importe, descripcion, correo, rfcEmi): any {

  
      let formParameters = {
        bancoRecep:  bancoRecep,
        clabe: clabe,
        nombreBene: nombreBene,
        rfcBenef: rfcBenef,
        ref: ref,
        importe: importe,
        descripcion: descripcion,
        correo: correo,
        rfcEmi: rfcEmi
      };
     
  
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/transferInterSPEI',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
            .sendFormParameters(formParameters);

        
    return resourceRequest.sendFormParameters(formParameters);

    }

}
