import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from './../../sesion-bxi.service';
import { TransferenciaSpeiComponent } from "../../transferencia-spei/transferencia-spei.component";

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
    totalCargo: ''

};

  constructor(private service: SesionBxiService) { }

  ngOnInit() {

    const this_aux = this;
    const respPago = this_aux.service.detalleConfirmacionSPEI;
    const respPagoJson = JSON.parse(respPago);
    console.log(respPagoJson);

    this_aux.detallePago.referenciaNumerica = respPago;

    const certificadoPago = respPagoJson.CertificadoPago;
  

  }

}
