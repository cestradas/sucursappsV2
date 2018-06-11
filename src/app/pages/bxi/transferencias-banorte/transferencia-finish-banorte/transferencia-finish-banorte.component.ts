import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SesionBxiService } from './../../sesion-bxi.service';

import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-transferencia-finish-banorte',
  templateUrl: './transferencia-finish-banorte.component.html',
  styles: []
})
export class TransferenciaFinishBanorteComponent implements OnInit {


  detallePago: any = {

    referenciaNumerica: '',
    fechaOperacion: '',
    horaOperacion: '',
    cuentaOrdenante: '',
    cuentaClabeBeneficia: '',
    nombreBeneficario: '',
    numMovimientoAbono: '',
    importeIva: '',
    importeTotTraspaso: ''

};


  constructor(private service: SesionBxiService, private _http: Http, private router: Router) { }

  ngOnInit() {

    //ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }

    const this_aux = this;
    $('div').removeClass('modal-backdrop');

    const operacionSelect = this_aux.service.validaFinishTipoTransfer;

    switch (operacionSelect) {

      case '1':  // Cuentas propias Banorte

      const respPagoPropias = this_aux.service.detalleConfirmacionTranPropBanorte;
      const respPagoJsonPropias = JSON.parse(respPagoPropias);
      console.log(respPagoJsonPropias);


      this_aux.detallePago.referenciaNumerica = respPagoJsonPropias.NumReferencia;

      this_aux.detallePago.fechaOperacion  = respPagoJsonPropias.FechaOperacion;
      this_aux.detallePago.horaOperacion = respPagoJsonPropias.HoraOperacion;
      this_aux.detallePago.cuentaOrdenante = respPagoJsonPropias.CccCargo;
      this_aux.detallePago.cuentaClabeBeneficia = respPagoJsonPropias.CccAbono;
      this_aux.detallePago.nombreBeneficario = respPagoJsonPropias.TitularAbono;
      this_aux.detallePago.numMovimientoAbono = respPagoJsonPropias.NumMovimientoAbono;
      this_aux.detallePago.importeIva = respPagoJsonPropias.ImporteIva;
      this_aux.detallePago.importeTotTraspaso = respPagoJsonPropias.ImporteTotTraspaso;

            break;

      case '2':  // Cuentas a terceros Banorte

      const respPagoTerceros = this_aux.service.detalleConfirmacionTranPropBanorte;
      const respPagoJsonTerceros = JSON.parse(respPagoTerceros);
      console.log(respPagoJsonTerceros);


      this_aux.detallePago.referenciaNumerica = respPagoJsonTerceros.NumReferencia;

      this_aux.detallePago.fechaOperacion  = respPagoJsonTerceros.FechaOperacion;
      this_aux.detallePago.horaOperacion = respPagoJsonTerceros.HoraOperacion;
      this_aux.detallePago.cuentaOrdenante = respPagoJsonTerceros.CccCargo;
      this_aux.detallePago.cuentaClabeBeneficia = respPagoJsonTerceros.CccAbono;
      this_aux.detallePago.nombreBeneficario = respPagoJsonTerceros.TitularAbono;
      this_aux.detallePago.numMovimientoAbono = respPagoJsonTerceros.NumMovimientoAbono;
      this_aux.detallePago.importeIva = respPagoJsonTerceros.ImporteIva;
      this_aux.detallePago.importeTotTraspaso = respPagoJsonTerceros.ImporteTotTraspaso;


            break;

          }

  }

}
