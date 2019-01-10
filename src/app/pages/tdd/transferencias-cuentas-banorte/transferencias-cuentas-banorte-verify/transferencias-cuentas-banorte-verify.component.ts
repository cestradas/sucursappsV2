import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SesionTDDService } from '../../../../services/service.index';
import $ from 'jquery';
declare var $: $;


@Component({
  selector: 'app-transferencias-cuentas-banorte-verify',
  templateUrl: './transferencias-cuentas-banorte-verify.component.html'
})
export class TransferenciasCuentasBanorteVerifyComponent implements OnInit {
  detallePago: any = {
    FechaOperacion: '',
    HoraOperacion: '',
    TitularAbono: '',
    ImporteTotTraspaso: ''
};
  constructor(private router: Router,
              private _serviceSesion: SesionTDDService) { }

  ngOnInit() {
    const this_aux = this;
    const respPago = this_aux._serviceSesion.datosBreadCroms.repTrasferenciaCuentasBanorte;
    const respPagoJson = JSON.parse(respPago);
    // console.log(this._serviceSesion.datosBreadCroms.repTrasferenciaCuentasBanorte);
    this_aux.detallePago.FechaOperacion = respPagoJson.FechaOperacion;
    this_aux.detallePago.HoraOperacion = respPagoJson.HoraOperacion;
    this_aux.detallePago.TitularAbono = respPagoJson.TitularAbono;
    this_aux.detallePago.ImporteTotTraspaso = respPagoJson.ImporteTotTraspaso;


//  // ESTILOS Preferente
let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
let btnContinuar = document.getElementById("terminar");


if (storageTipoClienteTar === "true") {

  btnContinuar.classList.remove("color-botones");
  btnContinuar.classList.add("color-botones_Preferente");
   
 
}

$("#ModalTDDLogin").modal("hide");

setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
    setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );
  }

  irMenuTDD() {
    const this_aux = this;
    this_aux.router.navigate(['/menuTdd']);
  }
}
