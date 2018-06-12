import { Component, OnInit } from '@angular/core';
import { ResponseWS } from '../../../services/response/response.service';

import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-pago-tarjeta-credito-final',
  templateUrl: './pago-tarjeta-credito-final.component.html'
})
export class PagoTarjetaCreditoFinalComponent implements OnInit {

  res;

  constructor(private _response: ResponseWS) { }

  ngOnInit() {
    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }

    this.res  = this._response.respuesta.respuestaWS;

  }

}
