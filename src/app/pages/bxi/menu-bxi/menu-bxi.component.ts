import { OperacionesBXI } from './../operacionesBXI';
import { Autenticacion } from './../autenticacion';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { SesionBxiService } from './../sesion-bxi.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-menu-bxi',
  templateUrl: './menu-bxi.component.html',
  styles: []
})
export class MenuBxiComponent implements OnInit {


  constructor(private service: SesionBxiService, private renderer: Renderer2,  private router: Router ) { }

  ngOnInit() {
    const body = $('body');
    body.off('click');
    this.setNombreUsuario();
  }

  setNombreUsuario() {
    const this_aux = this;
    const autenticacion: Autenticacion = new Autenticacion();
    const operaciones: OperacionesBXI = new OperacionesBXI();
    autenticacion.consultaCuentasUsuario(this_aux.service.usuarioLogin).then(
      function(response) {
          const getCuentasJSON = response.responseJSON;
            if (getCuentasJSON.Id === '1') {
                const getCuentas = response.responseText;
                this_aux.service.infoCuentas = getCuentas;
                operaciones.consultaCuentasBeneficiarios(this_aux.service.usuarioLogin).then(
                  function(cuentasBeneficiario) {
                  console.log(cuentasBeneficiario.responseJSON);
                  const resCuentasXBeneficiario = cuentasBeneficiario.responseJSON;
                  this_aux.service.infoCuentasBeneficiarios = JSON.stringify(resCuentasXBeneficiario.arrayCuentasXBeneficiario);
                  this_aux.service.infoDatosDeBeneficiarios = JSON.stringify(resCuentasXBeneficiario.Beneficiarios);
                  console.log(this_aux.service.infoCuentasBeneficiarios);
                  console.log(this_aux.service.infoDatosDeBeneficiarios);
                  $('#_modal_please_wait').modal('hide');
                  $('div').removeClass('modal-backdrop');
                });
            } else {
              console.log(getCuentasJSON.MensajeAUsuario);
            }
      }, function(error) {}
    );
  }

  comenzarOperacion(idOperacion) {
    $('div').removeClass('modal-backdrop');
    switch (idOperacion) {

      case 'pagoserv': this.router.navigate(['/pagoservicios_ini']);
            break;
      case 'trnasfSPEI': this.router.navigate(['/speiBXI']);
            break;
      case 'compraTA': this.router.navigate(['/CompraTaComponent']);
            break;
      case 'pagotar': this.router.navigate(['/pagoTarjetaCredito_ini']);
            break;
      case 'activaAlertas': this.router.navigate(['/pagoTarjetaCredito_ini']);
      break;

    }
  }

  moreOptions() {


    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'none';
      document.getElementById('opciones').style.display = 'none';
      document.getElementById('masOpciones').style.display = 'block';
      document.getElementById('regresar').style.display = 'block';
      $('#operacionesFrecuentes').removeClass('animated fadeOutUp slow');
      $('#opciones').removeClass('flipOutY fast');

    }, 2000);

    $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
    $('#masOpciones').addClass('animated fadeInUp slow');

    $('#opciones').addClass('flipOutY fast');
    $('#regresar').addClass('flipInY slow');



  }

  regresar() {



    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'block';
      document.getElementById('opciones').style.display = 'block';
      document.getElementById('masOpciones').style.display = 'none';
      document.getElementById('regresar').style.display = 'none';
      $('#masOpciones').removeClass('animated fadeOutUp slow');
      $('#regresar').removeClass('flipOutY fast');
    }, 2000);

    $('#masOpciones').addClass('animated fadeOutUp slow');
    $('#operacionesFrecuentes').addClass('animated fadeInUp slow');

    $('#regresar').addClass('flipOutY fast');
    $('#opciones').addClass('flipInY slow');



  }

}
