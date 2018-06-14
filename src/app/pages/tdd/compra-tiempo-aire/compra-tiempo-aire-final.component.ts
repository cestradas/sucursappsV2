import { Component, OnInit } from '@angular/core';
import { ResponseWS } from '../../../services/response/response.service';

@Component({ 
  selector: 'app-compra-tiempo-aire-final',
  templateUrl: './compra-tiempo-aire-final.component.html'
})
export class CompraTiempoAireFinalComponent implements OnInit {
  
  detallePago: any = {
    referenciaNumerica: '',
    fechaOperacion: '',
    cuentaOrdenante: '',
    telefono: '',
    importe: ''

};
  constructor(private service: ResponseWS) { }

  ngOnInit() {
    const this_aux = this;
    const respPago = this_aux.service.detalleConfirmacionCTA;
    const respPagoJson = JSON.parse(respPago);
    console.log(respPagoJson);

    this_aux.detallePago.referenciaNumerica = respPagoJson.NumReferencia;
    
    this_aux.detallePago.fechaOperacion  = respPagoJson.FechaHoraOperacion;
    // this_aux.detallePago.cuentaOrdenante = this_aux.service.numCuentaCTASel;
    this_aux.detallePago.telefono = respPagoJson.NumeroTelefono;
    this_aux.detallePago.importe = respPagoJson.ImporteCompra;
  }

}
