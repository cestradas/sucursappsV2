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
    
    this.res  = this._response.respuesta.respuestaWS;
    
  }

}
