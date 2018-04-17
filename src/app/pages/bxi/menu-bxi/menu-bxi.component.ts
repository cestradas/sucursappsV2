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
                  if (resCuentasXBeneficiario.Id === '1') {

                      this_aux.service.infoCuentasBeneficiarios = JSON.stringify(resCuentasXBeneficiario.arrayCuentasXBeneficiario);
                      this_aux.service.infoDatosDeBeneficiarios = JSON.stringify(resCuentasXBeneficiario.Beneficiarios);
                      console.log(this_aux.service.infoCuentasBeneficiarios);
                      console.log(this_aux.service.infoDatosDeBeneficiarios);
                      $('#_modal_please_wait').modal('hide');
                      $('div').removeClass('modal-backdrop');

                  } else {
                    this_aux.showErrorSucces(resCuentasXBeneficiario);
                  }
                }, function(error) {
                  this_aux.showErrorPromise(error);
                });
            } else {
              this_aux.showErrorSucces(getCuentasJSON);
            }
      }, function(error) {
        this_aux.showErrorPromise(error);
      }
    );
  }

  comenzarOperacion(idOperacion) {
    // $('div').removeClass('modal-backdrop');
    $('#_modal_please_wait').modal('show');

    switch (idOperacion) {

      case 'pagoserv': this.router.navigate(['/pagoservicios_ini']);
            break;
      case 'trnasfSPEI': this.router.navigate(['/speiBXI']);
            break;
      case 'compraTA': this.router.navigate(['/CompraTaComponent']);
            break;
      case 'pagotar': this.router.navigate(['/pagoTarjetaCredito_ini']);
            break;
      case 'activaAlertas': this.getDatosContacto(idOperacion);
            break;
      case 'actualizaDatos': this.getDatosContacto(idOperacion);
            break;
      case 'transferBanorte': this.router.navigate(['/TransferBanorte']);
            break;
      case 'impresionEDC': this.router.navigate(['/impresion_EDC']);
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

  showErrorPromise(error) {
    console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

  getDatosContacto(opc) {

    console.log('getDatosContacto');
    const this_aux = this;
    const operaciones: OperacionesBXI = new OperacionesBXI();
      if ( this_aux.service.CelCliente === null || this_aux.service.CelCliente === '' || this_aux.service.EmailCliente === null ||  this_aux.service.EmailCliente === '' || this_aux.service.EmailCliente === undefined || this_aux.service.CelCliente === undefined) {
        operaciones.consultaDatosContacto(this_aux.service.infoUsuarioSIC).then(
          function(data) {
            const jsonData = data.responseJSON;
            if (jsonData.Id === '1') {
                console.log('Datos contacto' + jsonData);
                  this_aux.service.EmailCliente = jsonData.Email;
                  this_aux.service.CelCliente = jsonData.Telefono;
                  if (jsonData.Email === undefined || jsonData.Email === '' || jsonData.Telefono === undefined || jsonData.Telefono === '') {
                      if (opc === 'activaAlertas') {
                          document.getElementById('mnsError').innerHTML =   "Estimado cliente, es necesario que registres tu correo electrónico y número móvil poder continuar. ";
                          $('#_modal_please_wait').modal('hide');
                          $('#errorModal').modal('show');
                      }
                    } else { if (opc === 'activaAlertas') {  this_aux.router.navigate(['/activaAlertas_ini']); }
                      }
                  if (opc === 'actualizaDatos') {  this_aux.router.navigate(['/mantiene-datos-ini']); }
            } else {  this_aux.showErrorSucces(jsonData);       }
          }, function (error) { this_aux.showErrorPromise(error);   }
        );
    } else {
      if (opc === 'activaAlertas') {  this_aux.router.navigate(['/activaAlertas_ini']); }
      if (opc === 'actualizaDatos') {  this_aux.router.navigate(['/mantiene-datos-ini']); }
    }
}

}
