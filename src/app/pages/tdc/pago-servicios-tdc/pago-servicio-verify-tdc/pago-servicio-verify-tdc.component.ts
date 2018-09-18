import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from '../../../bxi/sesion-bxi.service';
import { Router } from '@angular/router';
import { ConsultaSaldosTddService } from '../../../../services/service.index';

declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-pago-servicio-verify-tdc',
  templateUrl: './pago-servicio-verify-tdc.component.html',
})
export class PagoServicioVerifyTdcComponent implements OnInit {
  
  detallePago: any = {
    nombreServicio: '',
    fechaOperacion: '',
    claveRastreo: '',
    comisioneiva: '',
    cuentaCargo: '',
    horaOperacion: '',
    importe: ''
};
saldoDispoinible: string;
SaldoActual: string;
NumeroTarjeta: string;
cuentaClienteTdd: string;

numCuenta_show: string;

  constructor(private service: SesionBxiService,
              private router: Router ,
              private _service: ConsultaSaldosTddService) {
                // this._service.cargarSaldosTDD();
                this.consultaSaldosTarjetas();
    // this._service.validarDatosSaldoTdd().then(
    // mensaje => {

        console.log('Saldos cargados correctamente TDC');
    //   this.cuentaClienteTdd = mensaje.NumeroCuenta;
    //  }
    // );
  }

  ngOnInit() {

    // ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
    
    const this_aux = this;
    const respPago = this_aux.service.detalleConfirmacionPS;
    const respPagoJson = JSON.parse(respPago);
    //console.log(respPagoJson);
    this_aux.detallePago.nombreServicio = this_aux.service.nombreServicio;
    this_aux.detallePago.cuentaCargo = this_aux.service.numCuentaSeleccionado;
    if (this.service.idFacturador === '1310') {

      const certificadoPago = respPagoJson.CertificadoPago;
      certificadoPago.forEach(element => {
          if (element.FechaUno !== undefined) {
            this_aux.detallePago.fechaOperacion = element.FechaUno;
          }
          if (element.ImporteTotal !== undefined) {
            this_aux.detallePago.importe = element.ImporteTotal;
          }
          if (element.ClaveConfirmacion !== undefined) {
            this_aux.detallePago.claveRastreo = element.ClaveConfirmacion;
          }
          if (element.ImporteComisionRespCons !== undefined) {
            this_aux.detallePago.comisioneiva = element.ImporteComisionRespCons;
          }
          if (element.HoraOperacion !== undefined) {
            this_aux.detallePago.horaOperacion = element.HoraOperacion ;

          }
      });

    } else {

      this_aux.detallePago.fechaOperacion = respPagoJson.FechaUno;
      this_aux.detallePago.horaOperacion = respPagoJson.HoraOperacion;
      const certificadoPago = respPagoJson.CertificadoPago;
        certificadoPago.forEach(element => {
          this_aux.detallePago.comisioneiva = element.ImporteComisionRespCons;
          this_aux.detallePago.importe = element.ImporteTotal;
          });

      const datosEmpresa = respPagoJson.DatosPagoEmpresa;
        datosEmpresa.forEach(element => {
          this_aux.detallePago.claveRastreo = element.ClaveConfirmacion;
        });


      }

      $('#_modal_please_wait').modal('hide');
      setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
  }

  irMenuTDC() {
    const this_aux = this;
    this_aux.router.navigate(['/menuTDC']);
  }

  // consulta TDC
consultaSaldosTarjetas() {
  const this_aux = this;
  const formParameters = { 
  }; 
  
  //console.log(formParameters);
  const resourceRequest = new WLResourceRequest(
    
    'adapters/AdapterBanorteSucursAppsTdc/resource/consultaSaldosTarjetas', WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);
    
    resourceRequest.sendFormParameters(formParameters).then(
      function(response1) {
        //console.log(response1.responseText);

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

showErrorSucces(json) {
  // console.log(json.Id + json.MensajeAUsuario);
  if (json.Id === '2') {
    document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
  } else {
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
  }
  $('#errorModal').modal('show');
}

showErrorPromise(error) {
  console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
  $('#_modal_please_wait').modal('hide');
  $('#errorModal').modal('show');
}
mascaraNumeroCuenta(numCtaSel) {
  const tamNumCta = numCtaSel.length;
  const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
  this.numCuenta_show = '************' + numCta_aux;
  return this.numCuenta_show;
}

}
