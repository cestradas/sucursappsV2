import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from './../../sesion-bxi.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';


declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-pago-tarjeta-credito-verify',
  templateUrl: './pago-tarjeta-credito-verify.component.html',
  styleUrls: []
})


export class PagoTarjetaCreditoVerifyComponent implements OnInit {

  constructor(private service: SesionBxiService, private router: Router) { }

  detallePago: any = {
    institucion: '',
    operacion: '',
    fechaOperacion: '',
    claveRastreo: '',
    comisioneiva: '',
    cuentaOrigen: '',
    cuentaDestino: '',
    horaOperacion: '',
    importe: ''

};

  ngOnInit() {
    const this_aux = this;

      this_aux.showData();

      //ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("terminar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
  }

  showData() {


    const this_aux = this;
    const resPagoString = this_aux.service.detallePagoTarjeta;
    const respPagoJson  = JSON.parse(resPagoString);

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

    this_aux.detallePago.institucion = this_aux.service.nameBancoDestino;
    this_aux.detallePago.operacion = this_aux.service.nameOperacion;
    this_aux.detallePago.cuentaOrigen = this_aux.service.numCuentaSeleccionado;
    this_aux.detallePago.cuentaDestino = this_aux.service.numCtaBenSeleccionada;
    setTimeout(function() {
      $('#_modal_please_wait').modal('hide');
    }, 500);
  }

  irMenuBXI() {
    const this_aux = this;
    this_aux.router.navigate(['/menuBXI']);
  }
}
