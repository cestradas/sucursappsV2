import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from './../../sesion-bxi.service';

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
    importe: ''

};

  constructor(private service: SesionBxiService) { }

  ngOnInit() {

    const this_aux = this;
    const respPago = this_aux.service.detalleConfirmacionCTA;
    const respPagoJson = JSON.parse(respPago);
    console.log(respPagoJson);

    this_aux.detallePago.referenciaNumerica = respPagoJson.NumReferencia;
    
    this_aux.detallePago.fechaOperacion  = respPagoJson.FechaHoraOperacion;
    this_aux.detallePago.cuentaOrdenante = this_aux.service.numCuentaCTASel;
    this_aux.detallePago.telefono = respPagoJson.NumeroTelefono;
    this_aux.detallePago.importe = respPagoJson.ImporteCompra;

    
   
    // this_aux.detallePago.nombreBeneficario = respPagoJson.NombreBeneficario;
    
  }

}
