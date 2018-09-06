import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SesionBxiService } from './../../sesion-bxi.service';
import { CurrencyPipe } from '@angular/common';
import { TransferenciaSpeiComponent } from "../../transferencia-spei/transferencia-spei.component";


import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-transferencia-finish-spei',
  templateUrl: './transferencia-finish-spei.component.html',
  styles: []
})
export class TransferenciaFinishSpeiComponent implements OnInit {

  detallePago: any = {
    referenciaNumerica: '',
    claveRastreoSpei: '',
    fechaOperacion: '',
    comision: '',
    importeIva: '',
    cuentaOrdenante: '',
    cuentaClabeBeneficia: '',
    nombreBeneficario: '',
    importeOperacion: '',
    totalCargo: '',
    nombreUsuario: '',

    fechaApli: ''

};

  constructor(private service: SesionBxiService, private _http: Http, private router: Router, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {

    const this_aux = this;
    $('div').removeClass('modal-backdrop');


    const operacionSelect = this_aux.service.validaFinishTipoTransfer;

    switch (operacionSelect) {

      case '1':  // SPEI

      const respPagoSPEI = this_aux.service.detalleConfirmacionSPEI;
      const respPagoJsonSPEI = JSON.parse(respPagoSPEI);
      // console.log(respPagoJsonSPEI);
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);

      document.getElementById('claveRastreoSPEI').style.display = 'flex';
      document.getElementById('comisionSPEI').style.display = 'flex';
      document.getElementById('nombreBeneficiario').style.display = 'flex';

      this_aux.detallePago.referenciaNumerica = respPagoJsonSPEI.Referencia;
      this_aux.detallePago.claveRastreoSpei = respPagoJsonSPEI.ClaveRastreoSpei;
      this_aux.detallePago.fechaOperacion  = respPagoJsonSPEI.FechaOperacion;
      this_aux.detallePago.comision = this_aux.currencyPipe.transform(respPagoJsonSPEI.Comision, 'USD');
      this_aux.detallePago.importeIva = this_aux.currencyPipe.transform(respPagoJsonSPEI.ImporteIva, 'USD');
      this_aux.detallePago.cuentaOrdenante = respPagoJsonSPEI.CuentaOrdenante;
      this_aux.detallePago.cuentaClabeBeneficia = respPagoJsonSPEI.CuentaClabeBeneficia;
      this_aux.detallePago.nombreBeneficario = respPagoJsonSPEI.NombreBeneficario;
      this_aux.detallePago.importeOperacion =  this_aux.currencyPipe.transform(respPagoJsonSPEI.ImporteOperacion, 'USD');
      this_aux.detallePago.totalCargo =  this_aux.currencyPipe.transform(respPagoJsonSPEI.TotalCargo, 'USD');

            break;

      case '2':  // TEF

      const respPagoTEF = this_aux.service.detalleConfirmacionTEF;
      const respPagoJsonTEF = JSON.parse(respPagoTEF);
      // console.log(respPagoJsonTEF);
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);

      document.getElementById('claveRastreoSPEI').style.display = 'none';
      document.getElementById('comisionSPEI').style.display = 'none';
      document.getElementById('nombreBeneficiario').style.display = 'none';
      document.getElementById('iva').style.display = 'none';


      this_aux.detallePago.nombreUsuario = respPagoJsonTEF.NombreDelOrdenante;
      this_aux.detallePago.importeOperacion = this_aux.currencyPipe.transform(respPagoJsonTEF.CampoImporte, 'USD');
      this_aux.detallePago.totalCargo  = this_aux.currencyPipe.transform(respPagoJsonTEF.CampoImporteIva, 'USD');
      this_aux.detallePago.referenciaNumerica = respPagoJsonTEF.CampReferencia;
      this_aux.detallePago.fechaOperacion = respPagoJsonTEF.FechaProgramada;
      this_aux.detallePago.fechaApli = respPagoJsonTEF.FechaAplicacion;
      this_aux.detallePago.cuentaOrdenante = this_aux.service.numCuentaSPEISel;
      this_aux.detallePago.cuentaClabeBeneficia = this_aux.service.numCuentaDestinario;


            break;
      case '3':  // QUICK

      const respPagoQUICK = this_aux.service.detalleConfirmacionQUICK;
      const respPagoJsonQUICK = JSON.parse(respPagoQUICK);
      // console.log(respPagoJsonQUICK);
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 500);

      document.getElementById('claveRastreoSPEI').style.display = 'none';
      document.getElementById('comisionSPEI').style.display = 'flex';
      document.getElementById('nombreBeneficiario').style.display = 'flex';

      this_aux.detallePago.referenciaNumerica = respPagoJsonQUICK.Referencia;
      this_aux.detallePago.claveRastreoSpei = respPagoJsonQUICK.ClaveRastreoSpei;
      this_aux.detallePago.fechaOperacion  = respPagoJsonQUICK.FechaOperacion;
      this_aux.detallePago.comision = this_aux.currencyPipe.transform(respPagoJsonQUICK.Comision, 'USD');
      this_aux.detallePago.importeIva = this_aux.currencyPipe.transform(respPagoJsonQUICK.ImporteIva, 'USD');
      this_aux.detallePago.cuentaOrdenante = respPagoJsonQUICK.CuentaOrdenante;
      this_aux.detallePago.cuentaClabeBeneficia = respPagoJsonQUICK.CuentaClabeBeneficia;
      this_aux.detallePago.nombreBeneficario = respPagoJsonQUICK.NombreBeneficario;
      this_aux.detallePago.importeOperacion = this_aux.currencyPipe.transform(respPagoJsonQUICK.ImporteOperacion, 'USD');
      this_aux.detallePago.totalCargo = this_aux.currencyPipe.transform(respPagoJsonQUICK.TotalCargo, 'USD');

            break;
          }




  }



}
