


export class Autenticacion {

    identificaUsuriao(usuarioBXI): any {
        const this_aux = this;
        const formParameters = {
          usuario : usuarioBXI
        };
        const  resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/identificaUsuario', WLResourceRequest.POST);
            resourceRequest.setTimeout(30000);

            return  resourceRequest.sendFormParameters(formParameters);
    }


    getMetodosAutenticacionUsuario() {

        const formParameters = { };
        const resourceRequest = new WLResourceRequest(
          'adapters/AdapterBanorteSucursAppsBEL/resource/getMetodosAutenticacion', WLResourceRequest.POST);
         resourceRequest.setTimeout(30000);

         return resourceRequest.sendFormParameters(formParameters);

    }

    autenticaUsuario(token, metodoAutenticacion) {
        const formParameters = {
            respUsuario: token,
            tipoMetodoAutentica: metodoAutenticacion
          };
          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/autenticaUsuario', WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);

          return  resourceRequest.sendFormParameters(formParameters);
    }

    consultaCuentasUsuario (usuarioBXI): any {
        const formParameters = {
            usuario: usuarioBXI
          };
          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/getCuentasUsuario', WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);

           return resourceRequest.sendFormParameters(formParameters);
    }

    consultaPreferencia (usuarioBXI): any {
        const formParameters = {
            usuario: usuarioBXI
          };
          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursAppsBEL/resource/consultaPreferencia', WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);

           return resourceRequest.sendFormParameters(formParameters);
    }
    
}
