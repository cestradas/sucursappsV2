import { SesionBxiService } from './../../sesion-bxi.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-pago-servicios-verify',
  templateUrl: './pago-servicios-verify.component.html',
  styleUrls: []
})
export class PagoServiciosVerifyComponent implements OnInit {

   detallePago: any = {
      nombreServicio: '',
      fechaOperacion: '',
      claveRastreo: '',
      comisioneiva: '',
      cuentaCargo: '',
      horaOperacion: '',
      importe: ''

  };
  constructor(private service: SesionBxiService) { }

  ngOnInit() {
    const respPago = this.service.detalleConfirmacionPS;
    const respPagoJson = JSON.parse(respPago);
    this.detallePago.nombreServicio = this.service.nombreServicio;
    this.detallePago.fechaOperacion = respPagoJson.FechaUno;
    this.detallePago.claveRastreo = respPagoJson.ClaveConfirmacion;
    this.detallePago.comisioneiva = respPagoJson.ImporteComisionRespCons;
    this.detallePago.cuentaCargo = this.service.numCuentaSeleccionado;
    this.detallePago.horaOperacion = respPagoJson.HoraOperacion;
    this.detallePago.importe = respPagoJson.ImporteTotal;
  }

  irMenuBXI() {
  }

}
