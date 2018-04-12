import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SesionBxiService } from './../../sesion-bxi.service';
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

  constructor(private service: SesionBxiService, private _http: Http, private router: Router) { }

  ngOnInit() {

    const this_aux = this;
    

    const operacionSelect = this_aux.service.validaFinishTipoTransfer;
 
    switch (operacionSelect) {

      case '1':  // SPEI

      const respPagoSPEI = this_aux.service.detalleConfirmacionSPEI;
      const respPagoJsonSPEI = JSON.parse(respPagoSPEI);
      console.log(respPagoJsonSPEI);

      document.getElementById('claveRastreoSPEI').style.display = 'block';
      document.getElementById('comisionSPEI').style.display = 'block';
      document.getElementById('nombreBeneficiario').style.display = 'block';

      this_aux.detallePago.referenciaNumerica = respPagoJsonSPEI.Referencia;
      this_aux.detallePago.claveRastreoSpei = respPagoJsonSPEI.ClaveRastreoSpei;
      this_aux.detallePago.fechaOperacion  = respPagoJsonSPEI.FechaOperacion;
      this_aux.detallePago.comision = respPagoJsonSPEI.Comision;
      this_aux.detallePago.importeIva = respPagoJsonSPEI.ImporteIva;
      this_aux.detallePago.cuentaOrdenante = respPagoJsonSPEI.CuentaOrdenante;
      this_aux.detallePago.cuentaClabeBeneficia = respPagoJsonSPEI.CuentaClabeBeneficia;
      this_aux.detallePago.nombreBeneficario = respPagoJsonSPEI.NombreBeneficario;
      this_aux.detallePago.importeOperacion = respPagoJsonSPEI.ImporteOperacion;
      this_aux.detallePago.totalCargo = respPagoJsonSPEI.TotalCargo;       

            break;

      case '2':  // TEF

      const respPagoTEF = this_aux.service.detalleConfirmacionQUICK;
      const respPagoJsonTEF = JSON.parse(respPagoTEF);
      console.log(respPagoJsonTEF);

      document.getElementById('claveRastreoSPEI').style.display = 'none';
      document.getElementById('comisionSPEI').style.display = 'none';
      document.getElementById('nombreBeneficiario').style.display = 'none';

      this_aux.detallePago.nombreUsuario = respPagoJsonTEF.NombreDelOrdenante;
      this_aux.detallePago.totalCargo = respPagoJsonTEF.CampoImporte;
      this_aux.detallePago.importeOperacion  = respPagoJsonTEF.CampoImporteIva;
      this_aux.detallePago.referenciaNumerica = respPagoJsonTEF.CampReferencia;
      this_aux.detallePago.fechaOperacion = respPagoJsonTEF.FechaProgramada;
      this_aux.detallePago.fechaApli = respPagoJsonTEF.FechaAplicacion;
      this_aux.detallePago.cuentaOrdenante = this_aux.service.numCuentaSPEISel;
      this_aux.detallePago.cuentaClabeBeneficia = this_aux.service.numCuentaDestinario;


            break;
      case '3':  // QUICK

      const respPagoQUICK = this_aux.service.detalleConfirmacionQUICK;
      const respPagoJsonQUICK = JSON.parse(respPagoQUICK);
      console.log(respPagoJsonQUICK);

      document.getElementById('claveRastreoSPEI').style.display = 'none';
      document.getElementById('comisionSPEI').style.display = 'block';
      document.getElementById('nombreBeneficiario').style.display = 'block';

      this_aux.detallePago.referenciaNumerica = respPagoJsonQUICK.Referencia;
      this_aux.detallePago.claveRastreoSpei = respPagoJsonQUICK.ClaveRastreoSpei;
      this_aux.detallePago.fechaOperacion  = respPagoJsonQUICK.FechaOperacion;
      this_aux.detallePago.comision = respPagoJsonQUICK.Comision;
      this_aux.detallePago.importeIva = respPagoJsonQUICK.ImporteIva;
      this_aux.detallePago.cuentaOrdenante = respPagoJsonQUICK.CuentaOrdenante;
      this_aux.detallePago.cuentaClabeBeneficia = respPagoJsonQUICK.CuentaClabeBeneficia;
      this_aux.detallePago.nombreBeneficario = respPagoJsonQUICK.NombreBeneficario;
      this_aux.detallePago.importeOperacion = respPagoJsonQUICK.ImporteOperacion;
      this_aux.detallePago.totalCargo = respPagoJsonQUICK.TotalCargo;       
     
            break;
          }

    
    

  }

}
