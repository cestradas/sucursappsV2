


export class Autenticacion {

    identificaUsuriao(usuarioBXI): any {
        const this_aux = this;
        const formParameters = {
          usuario : usuarioBXI
        };
        const  resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/identificaUsuario', WLResourceRequest.POST);
            resourceRequest.setTimeout(30000);

            return  resourceRequest.sendFormParameters(formParameters);
    }


    getMetodosAutenticacionUsuario() {

        const formParameters = { };
        const resourceRequest = new WLResourceRequest(
          'adapters/AdapterBanorteSucursApps/resource/getMetodosAutenticacion', WLResourceRequest.POST);
         resourceRequest.setTimeout(30000);

         return resourceRequest.sendFormParameters(formParameters);

    }

    autenticaUsuario(token, metodoAutenticacion) {
        const formParameters = {
            respUsuario: token,
            tipoMetodoAutentica: metodoAutenticacion
          };
          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/autenticaUsuario', WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);

          return  resourceRequest.sendFormParameters(formParameters);
    }

    consultaCuentasUsuario (usuarioBXI): any {
        const formParameters = {
            usuario: usuarioBXI
          };
          const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/getCuentasUsuario', WLResourceRequest.POST);
           resourceRequest.setTimeout(30000);

           return resourceRequest.sendFormParameters(formParameters);
    }
}