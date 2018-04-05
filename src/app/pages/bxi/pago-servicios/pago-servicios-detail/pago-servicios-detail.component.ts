import { Autenticacion } from './../../autenticacion';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Renderer2  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgControl, FormControl } from '@angular/forms';
import {CurrencyPipe} from '@angular/common';

declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-pago-servicios-detail',
  templateUrl: './pago-servicios-detail.component.html',
  styleUrls: []
})
export class PagoServiciosDetailComponent implements OnInit {

 @ViewChild('rImporte', { read: ElementRef}) rImporte: ElementRef ;
 // @ViewChild('rCuentaCargo', { read: ElementRef}) rCuentaCargo: ElementRef ;

  myForm: FormGroup;
  labelTipoAutentica: string;
  nombreServicio: any;
  cuentaCargo: string;
  importe: string;
  referenciaPago: string;
  fechaVencimiento: string;
  importeAux: string;

  constructor( private service: SesionBxiService, private fb: FormBuilder, private router: Router, private currencyPipe: CurrencyPipe) {

    this.myForm = this.fb.group({
      fcTelefono: ['', [Validators.required, Validators.minLength(10)]],
       fcReferencia: ['', [Validators.required]],
       fcDigitoVerificador: ['', [Validators.required]],
      fcFechaVencimiento: ['', [Validators.required , Validators.pattern(/^\d{2,4}\-\d{1,2}\-\d{1,2}$/)]],
     fcImporte: ['', [Validators.required /*Validators.pattern(/^[0-9]+[0-9]*$/ )*/]],

    });
   }

  ngOnInit() {

    const this_aux = this;
    const detalleEmpresa = JSON.parse(this_aux.service.detalleEmpresa_PS);

    this_aux.nombreServicio =  detalleEmpresa.empresa;
    this_aux.service.nombreServicio = this_aux.nombreServicio;
    this_aux.cuentaCargo = this_aux.service.numCuentaSeleccionado;

    if (this_aux.service.idFacturador === '1310') {

        this_aux.myForm.removeControl('fcReferencia');
    } else {

        this_aux.myForm.removeControl('fcTelefono');
        this_aux.myForm.removeControl('fcDigitoVerificador');
    }
    $('#_modal_please_wait').modal('hide');

  }

  showDetallePago( myForm) {
    const this_aux = this;
      this_aux.importe = this_aux.importeAux;
      console.log(this_aux.importe);
      this_aux.fechaVencimiento = myForm.fcFechaVencimiento.toString();
      if (this_aux.service.idFacturador === '1310') {
        this_aux.referenciaPago = myForm.fcTelefono.toString() + myForm.fcDigitoVerificador.toString();
      } else {
        this_aux.referenciaPago = myForm.fcReferencia.toString();
      }
       this_aux.setTipoAutenticacionOnModal();
  }

  setTipoAutenticacionOnModal() {
      const this_aux = this;
      const divChallenge = document.getElementById('challenger');
      const divTokenPass = document.getElementById('divPass');
      if (this_aux.service.metodoAutenticaMayor.toString() === '5') {

        this_aux.labelTipoAutentica = 'Token Celular';
        divChallenge.setAttribute('style', 'display: block');
        divTokenPass.setAttribute('style', 'display: block');

      } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {

        divChallenge.setAttribute('style', 'display: none');
        divTokenPass.setAttribute('style', 'display: block');
        this_aux.labelTipoAutentica = 'Contrase&atilde;a';
      } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {

        divChallenge.setAttribute('style', 'display: none');
        divTokenPass.setAttribute('style', 'display: block');
        this_aux.labelTipoAutentica = 'Token Fisico';
      }

    $('#confirmModal').modal('show');
  }

  confirmarPago(token) {
    $('#_modal_please_wait').modal('show');
      const this_aux = this;
      const autenticacion: Autenticacion = new Autenticacion();
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      let mensajeError;
      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                
                console.log('Pago validado');

                  operacionesbxi.pagaServicio(this_aux.service.idFacturador, this_aux.importeAux, this_aux.referenciaPago
                  , this_aux.service.numCuentaSeleccionado, this_aux.fechaVencimiento).then(
                    function(respPago) {

                      const jsonDetallePago = respPago.responseJSON;
                      if (jsonDetallePago.Id === '1') {
                        this_aux.service.detalleConfirmacionPS = respPago.responseText;
                        $('div').removeClass('modal-backdrop');
                        this_aux.router.navigate(['/pagoservicios_verify']);
                      } else {
                        this_aux.showErrorSuccesMoney(jsonDetallePago);
                      }
                    }, function(error) { this_aux.showErrorPromise(error); }
                  );
              } else {
                  console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);  
                  mensajeError = this_aux.controlarError(infoUsuarioJSON.Id);
                  document.getElementById('mnsError').innerHTML =  mensajeError;
                  $('#_modal_please_wait').modal('hide');
                  $('#errorModal').modal('show');
              }
        }, function(error) {
        });

  }

  transformAmount(importe) {
    const this_aux = this;
    if (importe !== '') {
      const control: FormControl = new FormControl('');
      this_aux.myForm.setControl('fcImporte', control);
      this_aux.importeAux = this_aux.replaceSimbolo(importe);
      this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAux, 'USD');
      this_aux.importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;

    } else {
        if (this_aux.myForm.get('fcImporte').errors === null) {
          const control: FormControl = new FormControl('', Validators.required);
          this_aux.myForm.setControl('fcImporte', control );
        }
    }
  }

  replaceSimbolo(importe) {
    const importeAux = importe.replace('$', '');
    return importeAux;
  }

  espacioTeclado() {
    // ESTILO TECLADO (QUITAR ESTILO AL SALIR DE PAGINA PARA EVITAR QUE BAJE MAS EN OTRAS PANTALLAS)
    $( ".cdk-overlay-container" ).css( "margin-top", "8%" );
    // $( ".cdk-visually-hidden" ).css( "margin-bottom", "0%" );
  }

  controlarError(id) {

    let mensajeError; 

    switch (id) {
          
      case 'SEG0003': mensajeError = "Usuario bloqueado, favor de esperar 15 minutos e intentar nuevamente.";
                    break; 
      case 'SEG0004': mensajeError =  "Usuario bloqueado, favor de marcar a Banortel.";
                    break; 
      case 'SEG0005': mensajeError =  "Los datos proporcionados son incorrectos, favor de verificar.";
                    break; 
      case 'SEG0007': mensajeError = "Los datos proporcionados son incorrectos, favor de verificar.";
                    break; 
      case 'SEG0008':  mensajeError = "La sesión ha caducado.";
                    break; 
      case 'SEG0009':  mensajeError = "Límite de sesiones superado, favor de cerrar las sesiones de banca en línea activas.";
                    break; 
      // tslint:disable-next-line:max-line-length
      case 'SEGOTP1': mensajeError = "Token desincronizado. Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                    break;
      case 'SEGOTP2': mensajeError = "Token bloqueado, favor de marcar a Banortel.";
                    break;
      case 'SEGOTP3': mensajeError = "Token deshabilitado, favor de marcar a Banortel.";
                    break;
      case 'SEGOTP4': mensajeError = "Token no activado, favor de marcar a Banortel.";
                    break;
      // tslint:disable-next-line:max-line-length
      case 'SEGAM81': mensajeError = "Token desincronizado. Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                    break; 
      case 'SEGAM82': mensajeError = "Token bloqueado, favor de marcar a Banortel."; 
                    break;   
      case 'SEGAM83': mensajeError = "Token deshabilitado, favor de marcar a Banortel.";
                    break;   
      case 'SEGAM84': mensajeError = "Token no activado, favor de marcar a Banortel.";
                    break;  
      case '2'      : mensajeError = "Error Desconocido";            
    }

    return mensajeError;
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

  showErrorSuccesMoney(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('msgError').innerHTML =   json.MensajeAUsuario; 
    $('#_modal_please_wait').modal('hide');
    $('#ModalErrorTransaccion').modal('show');
  }
}
