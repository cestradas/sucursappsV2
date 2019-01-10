import { Component, OnInit } from '@angular/core';
import { ResponseWS } from '../../../services/response/response.service';

import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-pago-tarjeta-credito-final',
  templateUrl: './pago-tarjeta-credito-final.component.html'
})
export class PagoTarjetaCreditoFinalComponent implements OnInit {

  detallePago: any = {
    institucion: '',
    operacion: '',
    fechaOperacion: '',
    claveRastreo: '',
    comisioneiva: '',
    cuentaOrigen: '',
    cuentaDestino: '',
    horaOperacion: '',
    importe: ''

};

  constructor(private _response: ResponseWS) { }

  ngOnInit() {
    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
    $("#ModalTDDLogin").modal("hide");
    this.showData();
  }

  showData() {

    setTimeout(() => {
      $('#_modal_please_wait').modal('hide');  
    }, 500);
    const this_aux = this;
    const resPagoString = this_aux._response.detallePagoTarjeta;
    const respPagoJson  = JSON.parse(resPagoString);
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

    this_aux.detallePago.institucion = this_aux._response.nameBancoDestino;
    this_aux.detallePago.cuentaOrigen = this_aux._response.numeroCuentaTdd;
    this_aux.detallePago.cuentaDestino = this_aux._response.numCuentaDestino;
    this_aux.detallePago.operacion = this_aux._response.nameOperacion;
  }
}
