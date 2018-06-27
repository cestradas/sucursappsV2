import { OperacionesBXI } from './../../operacionesBXI';
import { SesionBxiService } from './../../sesion-bxi.service';
import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

declare var jquery: any; // jquery
declare var $: any;

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
  constructor(private service: SesionBxiService, private router: Router) { }

  ngOnInit() {

    const this_aux = this;
    const respPago = this_aux.service.detalleConfirmacionPS;
    const respPagoJson = JSON.parse(respPago);
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    console.log(respPagoJson);
    this_aux.detallePago.nombreServicio = this_aux.service.nombreServicio;
    this_aux.detallePago.cuentaCargo = operacionesbxi.mascaraNumeroCuenta( this_aux.service.numCuentaSeleccionado);
    if (this.service.idFacturador === '1310') {

      const certificadoPago = respPagoJson.CertificadoPago;
      certificadoPago.forEach(element => {
          if (element.FechaUno !== undefined) {
            this_aux.detallePago.fechaOperacion = element.FechaUno;
          }
          if (element.ImporteTotal !== undefined) {
            this_aux.detallePago.importe = element.ImporteTotal;
          }
          if (element.ClaveConfirmacion !== undefined) {
            this_aux.detallePago.claveRastreo = element.ClaveConfirmacion;
          }
          if (element.ImporteComisionRespCons !== undefined) {
            this_aux.detallePago.comisioneiva = element.ImporteComisionRespCons;
          }
          if (element.HoraOperacion !== undefined) {
            this_aux.detallePago.horaOperacion = element.HoraOperacion ;

          }
      });

    } else {

      this_aux.detallePago.fechaOperacion = respPagoJson.FechaUno;
      this_aux.detallePago.horaOperacion = respPagoJson.HoraOperacion;
      const certificadoPago = respPagoJson.CertificadoPago;
        certificadoPago.forEach(element => {
          this_aux.detallePago.comisioneiva = element.ImporteComisionRespCons;
          this_aux.detallePago.importe = element.ImporteTotal;
          });

      const datosEmpresa = respPagoJson.DatosPagoEmpresa;
        datosEmpresa.forEach(element => {
          this_aux.detallePago.claveRastreo = element.ClaveConfirmacion;
        });


      }
      setTimeout(function() {
        $('#_modal_please_wait').modal('hide');
      }, 500);

      // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("contiuar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }



  }

  irMenuBXI() {
    const this_aux = this;
    this_aux.router.navigate(['/menuBXI']);
  }

}
