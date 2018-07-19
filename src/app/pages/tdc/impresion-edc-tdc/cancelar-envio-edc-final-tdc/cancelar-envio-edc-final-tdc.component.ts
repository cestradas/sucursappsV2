import { Component, OnInit } from '@angular/core';
import { ResponseWS } from '../../../../services/response/response.service';
declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-cancelar-envio-edc-final-tdc',
  templateUrl: './cancelar-envio-edc-final-tdc.component.html',
  
})
export class CancelarEnvioEdcFinalTdcComponent implements OnInit {

  correoRegistrado: string;
  constructor(private serviceTdd: ResponseWS) { }

  ngOnInit() {
    this.correoRegistrado = this.serviceTdd.email;
  }

}
