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

    this_aux.detallePago.referenciaNumerica = respPagoJson.Referencia;
    this_aux.detallePago.claveRastreoSpei = respPagoJson.ClaveRastreoSpei;
    this_aux.detallePago.fechaOperacion  = respPagoJson.FechaOperacion;
    this_aux.detallePago.comision = respPagoJson.Comision;
    this_aux.detallePago.importeIva = respPagoJson.ImporteIva;
    this_aux.detallePago.cuentaOrdenante = respPagoJson.CuentaOrdenante;
    this_aux.detallePago.cuentaClabeBeneficia = respPagoJson.CuentaClabeBeneficia;
    this_aux.detallePago.nombreBeneficario = respPagoJson.NombreBeneficario;
    this_aux.detallePago.importeOperacion = respPagoJson.ImporteOperacion;
    this_aux.detallePago.totalCargo = respPagoJson.TotalCargo;

  }

}
