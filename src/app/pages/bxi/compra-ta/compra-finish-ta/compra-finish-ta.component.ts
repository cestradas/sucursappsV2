import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from './../../sesion-bxi.service';
import $ from 'jquery';
declare var $: $;
@Component({
  selector: 'app-compra-finish-ta',
  templateUrl: './compra-finish-ta.component.html',
  styles: []
})
export class CompraFinishTaComponent implements OnInit {

  detallePago: any = {
    referenciaNumerica: '',
    fechaOperacion: '',
    cuentaOrdenante: '',
    telefono: '',
    importe: '',
    hora: '',
    operadorTelefono: ''
};

  constructor(private service: SesionBxiService) { }

  ngOnInit() {

    const this_aux = this;
    const respPago = this_aux.service.detalleConfirmacionCTA;
    const respPagoJson = JSON.parse(respPago);
    // console.log(respPagoJson);
    this_aux.detallePago.operadorTelefono = this_aux.service.operador;
    this_aux.detallePago.referenciaNumerica = respPagoJson.NumReferencia;
    this_aux.detallePago.hora = respPagoJson.FechaHoraOperacion;
    this_aux.detallePago.fechaOperacion  = respPagoJson.FechaHoraOperacion;
    this_aux.detallePago.cuentaOrdenante = this_aux.service.numCuentaCTASel;
    this_aux.detallePago.telefono = respPagoJson.NumeroTelefono;
    this_aux.detallePago.importe = respPagoJson.ImporteCompra;

    // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("terminarA");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }


    setTimeout(function() {
      $('#_modal_please_wait').modal('hide');
      $('div').removeClass('modal-backdrop');
            }, 500);

    // this_aux.detallePago.nombreBeneficario = respPagoJson.NombreBeneficario;

  }

}
