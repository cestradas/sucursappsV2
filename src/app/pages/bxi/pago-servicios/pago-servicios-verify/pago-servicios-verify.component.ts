import { SesionBxiService } from './../../sesion-bxi.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-pago-servicio-verify',
  templateUrl: './pago-servicio-verify.component.html',
  styleUrls: []
})
export class PagoServicioVerifyComponent implements OnInit {

   detallePago: any = {
      nombreServicio: '',
      fechaOperacion: '',
      claveRastreo: '',
      comisioneiva: '',
      cuentaCargo: '',
      horaOperacion: '',
      importe: ''

  };
  constructor(public service: SesionBxiService) { }

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
