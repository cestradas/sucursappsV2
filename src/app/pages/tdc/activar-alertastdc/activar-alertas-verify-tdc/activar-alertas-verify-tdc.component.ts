import { Component, OnInit } from '@angular/core';
import { ConsultaSaldosTddService } from '../../../../services/service.index';
import { Router } from '@angular/router';
//import { consultaCatalogos } from '../../../../services/consultaCatalogos/consultaCatalogos.service';
import { ConsultaCatalogosTdcService } from '../../../../services/consultaCatalogosTDC/consulta-catalogos-tdc.service';
declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-activar-alertas-verify-tdc',
  templateUrl: './activar-alertas-verify-tdc.component.html',
})
export class ActivarAlertasVerifyTdcComponent implements OnInit {
  NumCuenta: string;
  Email: string;
  Celular: string;
  
  saldoDispoinible: string;
  SaldoActual: string;
  NumeroTarjeta: string;

  numCuenta_show: string;
  constructor(private _service: ConsultaSaldosTddService, private router: Router) { }
  ngOnInit() {
   
    $('#_modal_please_wait').modal('show');
    this.consultaSaldosTarjetas();
     // this._service.validarDatosSaldoTdd().then(
      // mensaje => {
         this.consultarDatosContacto();
         setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
      // }
    // );    
  
  }


  consultarDatosContacto() {

    const this_aux = this;
    const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
    operaciones.consultarDatosContacto().then(
      function(respPago) {
  
        const jsonRespuesta = respPago.responseJSON;
        if (jsonRespuesta.Id === '1') {
         console.log(respPago.responseText);
         this_aux.Email = jsonRespuesta.Email;
         this_aux.Celular = jsonRespuesta.Telefono;
          console.log("Consulta de Datos Exitosa");
          
        } else {
          this_aux.showErrorSucces(jsonRespuesta);
          console.log("No hay Datos");
        }
        setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
      }, function(error) { this_aux.showErrorPromise(error); }
    );
  }

  irMenuTDC() {
    const this_aux = this;
    this_aux.router.navigate(['/menuTDC']);
  }

  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === '2') {
      document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
    } else {
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    }
    $('#errorModal').modal('show');
  }
  showErrorPromise(error) {
    
    $('#errorModal').modal('show');
    if (error.errorCode === 'API_INVOCATION_FAILURE') {
        document.getElementById('mnsError').innerHTML = 'Tu sesi�n ha expirado';
    } else {
      document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
    }
  
  }
  // consulta TDC
 consultaSaldosTarjetas() {
  const this_aux = this;
  const formParameters = { 
  }; 
  
  console.log(formParameters);
  const resourceRequest = new WLResourceRequest(
    
    'adapters/AdapterBanorteSucursAppsTdc/resource/consultaSaldosTarjetas', WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);
    
    resourceRequest.sendFormParameters(formParameters).then(
      function(response1) {
        console.log(response1.responseText);

        const detalleSaldos = response1.responseJSON;
        $('#_modal_please_wait').modal('hide');
        if ( detalleSaldos.Id === '1') {
          this_aux.saldoDispoinible = detalleSaldos.SaldoDisponible;
          this_aux.saldoDispoinible = this_aux.saldoDispoinible;
          this_aux.SaldoActual = detalleSaldos.SaldoActual;
          this_aux.NumeroTarjeta = detalleSaldos.NumeroTarjeta;
          this_aux.mascaraNumeroCuenta(this_aux.NumeroTarjeta);
          $('#_modal_please_wait').modal('hide');

        } else {
           this_aux.showErrorSucces(detalleSaldos);
        }
      }, function(error) {
        this_aux.showErrorPromise(error);
  });
}

mascaraNumeroCuenta(numCtaSel) {
  const tamNumCta = numCtaSel.length;
  const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
  this.numCuenta_show = '******' + numCta_aux;
  return this.numCuenta_show;
}

}
