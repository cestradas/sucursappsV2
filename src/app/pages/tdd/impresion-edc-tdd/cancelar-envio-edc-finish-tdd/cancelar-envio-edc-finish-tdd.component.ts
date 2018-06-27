import { Component, OnInit } from '@angular/core';
import { consultaCatalogos } from '../../../../services/consultaCatalogos/consultaCatalogos.service';
import { ResponseWS } from '../../../../services/response/response.service';
declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-cancelar-envio-edc-finish-tdd',
  templateUrl: './cancelar-envio-edc-finish-tdd.component.html'
})
export class CancelarEnvioEdcFinishTddComponent implements OnInit {
  correoRegistrado: string;
  constructor(private serviceTdd: ResponseWS) { }

  ngOnInit() {
    this.correoRegistrado = this.serviceTdd.email;
  }


}
