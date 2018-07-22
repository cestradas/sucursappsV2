import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers,  URLSearchParams, RequestOptions } from "@angular/http";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConsultaCatalogosTdcService } from '../../../services/consultaCatalogosTDC/consulta-catalogos-tdc.service';
// import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
// import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service'      ;

import $ from "jquery";
import { DOCUMENT } from "@angular/platform-browser";
import { Session } from "protractor";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

declare var $: $;


@Component({
  selector: "app-menutdc",
  templateUrl: "./menutdc.component.html",
  styles: []
})
export class MenutdcComponent implements OnInit {
ArrayAlertasCliente: Array<any> = [];  
AlertasActivas = false;
  constructor(private router: Router) {}

  ngOnInit() {
     
    
  }

  mandarPage(id) {
    console.log(id);

    switch (id) {
      case "saldosMovtdc":
        this.router.navigate(["/movimientoSaldotdc"]);
        break;

       case 'edc-tdc':
       this.router.navigate(['/ImpresionEdcTdc']);
       break;

      case "pagoServicios":
        this.router.navigate(["/pagoServiciosTdc"]);
        break;
      case "actDatosContactotdc":
      this.router.navigate(["/actualizarDatosContactotdc"]);
      break;
      case "activarAlertas":
      this.router.navigate(["/activarAlertastdc"]);
      break;

      default:
        this.router.navigate(["/menuTdc"]);
    }
  }

  
  moreOptions() {
    setTimeout(() => {

    document.getElementById("operacionesFrecuentes").style.display = "none";
    document.getElementById("opciones").style.display = "none";
    document.getElementById("masOpciones").style.display = "block";
    document.getElementById("regresar").style.display = "block";
    $('#operacionesFrecuentes').removeClass('animated fadeOutUp slow');
    $('#opciones').removeClass('flipOutY fast');

  }, 2000);

  $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
  $('#masOpciones').addClass('animated fadeInUp slow');
  $('#opciones').addClass('flipOutY fast');
  $('#regresar').addClass('flipInY slow');
  const this_aux = this;
  this_aux.consultaAlertas();
  }

  regresar() {
    setTimeout(() => {

    document.getElementById("operacionesFrecuentes").style.display = "block";
    document.getElementById("opciones").style.display = "block";
    document.getElementById("masOpciones").style.display = "none";
    document.getElementById("regresar").style.display = "none";
    $('#masOpciones').removeClass('animated fadeOutUp slow');
      $('#regresar').removeClass('flipOutY fast');
    }, 2000);
    $('#masOpciones').addClass('animated fadeOutUp slow');
    $('#operacionesFrecuentes').addClass('animated fadeInUp slow');
    $('#regresar').addClass('flipOutY fast');
    $('#opciones').addClass('flipInY slow');
  }

  consultaAlertas() {

  const this_aux = this;
  const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
    operaciones.mantieneAlertas().then(
      function(detalleAlertas) {
            const detalle = detalleAlertas.responseJSON;
            let AlertasActivas_true = false;
            console.log(detalle);
            if (detalle .Id === '1') {

              const alertas = detalle.AlertasXCliente;
              this_aux.ArrayAlertasCliente = alertas;
              alertas.forEach(alerta => {
                  if (alerta.IndicadorServicio === 'S' ) {   AlertasActivas_true = true;
                  }
              });
              this_aux.AlertasActivas = AlertasActivas_true;
              console.log('this_aux.AlertasActivas' + this_aux.AlertasActivas);
              if (this_aux.AlertasActivas) {
                
                this_aux.conAlertas();
              } else {
                this_aux.sinAlertas();
              }


              
            }
            if(detalle .Id === '0') {
                this_aux.conAlertas();
            }
            else {
              this_aux.sinAlertas();
              this_aux.showErrorSucces(detalle);      
            }
            setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
      }, function(error) {
        this_aux.sinAlertas();
        setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
        this_aux.showErrorPromise(error);    }
    );
  }

  sinAlertas() {
    const div = document.getElementById('imgdatoscontacto').style.marginLeft="520px";
    const div2 = document.getElementById('txtdatoscontacto').style.marginLeft="520px";

   const div4 = document.getElementById('Alertas');
   div4.style.display = "block";
   const div5 = document.getElementById('alertasTxt');
   div5.style.display = "block";
  }
  conAlertas() {
    const div = document.getElementById('imgdatoscontacto').style.marginLeft="633px";
   const div2 = document.getElementById('txtdatoscontacto').style.marginLeft="633px";

    const div4 = document.getElementById('Alertas');
    div4.style.display = "none";
    const div5 = document.getElementById('alertasTxt');
    div5.style.display = "none";
  }
  showErrorPromise(error) {

    $('#errorModal').modal('show');
    if (error.errorCode === 'API_INVOCATION_FAILURE') {
        document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
    } else {
      document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
    }
  
  }

  showErrorSucces(json) {

    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    $('#errorModal').modal('show');
  
  }
}