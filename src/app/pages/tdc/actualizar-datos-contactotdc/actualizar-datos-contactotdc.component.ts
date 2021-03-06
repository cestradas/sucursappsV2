import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaCatalogosTdcService } from '../../../services/consultaCatalogosTDC/consulta-catalogos-tdc.service';
import { SesionBxiService } from '../../bxi/sesion-bxi.service';
import { SesionTDDService } from '../../../services/service.index';
import { ValidaNipTransaccionTdcService } from '../../../services/validaNipTrans/valida-nip-transaccion-tdc.service';
import $ from 'jquery';

declare var $: any;
@Component({
  selector: 'app-actualizar-datos-contactotdc',
  templateUrl: './actualizar-datos-contactotdc.component.html',
})
export class ActualizarDatosContactotdcComponent implements OnInit {
  @ViewChild('correoElectronico', { read: ElementRef}) correoElectronico: ElementRef ;
  @ViewChild('numeroCelular', { read: ElementRef}) numeroCelular: ElementRef ;
  myForm: FormGroup;
  IsControlCorreo = false;
  IsControlCelular = false;
  showCorreoError = false;
  showCelularError = false;
  correoActualizado: string;
  celActualizado: string;
  validar = false;

  constructor(private router: Router, private fb: FormBuilder, private _serviceSesion: SesionTDDService, 
              private _validaNipService: ValidaNipTransaccionTdcService) {
    this.myForm = this.fb.group({
      fcCorreo: ['', [Validators.required, Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]],
      fcCelular: ['', [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(10), Validators.maxLength(10) ]]
    });
   }

  ngOnInit() {

    // ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnGuardar = document.getElementById("guardar");
    let btnSalir = document.getElementById("salir");
    let btnConfirmar = document.getElementById("Confirmar2");

    if (storageTipoClienteTar === "true") {

      btnGuardar.classList.remove("color-botones");
      btnGuardar.classList.add("color-botones_Preferente");
      btnSalir.classList.remove("color-botones");
      btnSalir.classList.add("color-botones_Preferente");
      btnConfirmar.classList.remove("color-botones");
      btnConfirmar.classList.add("color-botones_Preferente");

    }


    const this_aux = this;
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
    this_aux.getDatosContacto();
  }
  contieneDatosIncorrectos(texto) {
    const this_aux = this;
    let letras = ".- ";
    texto = texto.toLowerCase();
    for ( let i = 0; i < texto.length; i++) {
       if (letras.indexOf(texto.charAt(i) , 0) !== -1) {
          console.log("Contiene .- o esparcio");
          $('iNumeroCelular').value("");
       } else {
        console.log("esta limpio");
       }
    }
    
  }
  

  getDatosContacto() {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
   // this_aux.consultarDatos();
    setTimeout(function() { 
      $('#_modal_please_wait').modal('show');
      const controlCorreo: FormControl = new FormControl(this_aux._serviceSesion.datosBreadCroms.EmailCliente);
      this_aux.myForm.setControl('fcCorreo', controlCorreo );
      const controlCelular: FormControl = new FormControl(this_aux._serviceSesion.datosBreadCroms.CelCliente );
      this_aux.myForm.setControl('fcCelular', controlCelular );
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
    }, 500);

  }

  modificarDatos(correo , celular) {

    $('#_modal_please_wait').modal('show');


    console.log("si entre");
    const this_aux = this;
    const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
    console.log(correo + "   " + celular);
    operaciones.actualizaDatosContacto(correo, celular).then(
        function(resp) {

          const jsonRespuesta = resp.responseJSON;
          if (jsonRespuesta.Id === '1') {
           //console.log(resp.responseText);
            $('div').removeClass('modal-backdrop');
            this_aux.router.navigate(['/mantenimientoDatosContactoFinalTdc']);
            console.log("Datos Actualizados");
          } else if (this_aux.includesL(jsonRespuesta.MensajeAUsuario, "ERROR AL EJECUTAR PE80/PENM")) {
            operaciones.actualizaDatosContacto(correo, celular).then(
              function(resp2) {
      
                const jsonRespuesta2 = resp2.responseJSON;
                if (jsonRespuesta2.Id === '1') {
                 //console.log(resp.responseText);
                  $('div').removeClass('modal-backdrop');
                  this_aux.router.navigate(['/mantenimientoDatosContactoFinalTdc']);
                  console.log("Datos Actualizados");
                } else {
                  this_aux.showErrorSucces(jsonRespuesta2);
                  console.log("Datos no Actualizados");
                  $('#ModalTDDLogin').modal('hide');
                  $('#_modal_please_wait').modal('hide');
                }
              }, function(error) { this_aux.showErrorPromiseMoney(error);
                $('#ModalTDDLogin').modal('hide'); }
            );
          } else {
            this_aux.showErrorSucces(jsonRespuesta);
            console.log("Datos no Actualizados");
            $('#ModalTDDLogin').modal('hide');
            $('#_modal_please_wait').modal('hide');
          }
        }, function(error) { this_aux.showErrorPromiseMoney(error);
          $('#ModalTDDLogin').modal('hide'); }
      );

  }

  iniciaPinpad() {

    const this_aux = this;
    $('#ModalTDCLogin').modal('show');

  }

validartarjeta() {
  this._validaNipService.callPinPadTransTdc();
  const this_aux = this;
  document.getElementById('capturaInicio').style.display = 'none';
  document.getElementById('caputuraSesion').style.display = 'block';
  //$("#ModalTDDLogin").modal("show");
  $('#ModalTDCLogin').modal('hide');
let res;

  this._validaNipService.validarDatosrespuesta().then(
    mensaje => {

      res = this._validaNipService.respuestaNip.res;
      //console.log(res);

      if (res === true) {

        $('#ModalTDDLogin').modal('hide');
        this_aux.modificarDatos(this_aux.correoActualizado, this_aux.celActualizado);
      this._validaNipService.respuestaNip.res = "";
      } else {

        console.error("Mostrar modal las tarjetas no son iguales");
        document.getElementById('mnsError').innerHTML =   "Los datos proporcionados son incorrectos, favor de verificar.";
        $('#_modal_please_wait').modal('hide');
        $('#errorModal').modal('show');
        $('#ModalTDDLogin').modal('hide');
        this._validaNipService.respuestaNip.res = "";

      }
    }
  );
  $('#ModalTDDLogin').modal('hide');
}



  irMenuTDC() {
    const this_aux = this;
    this_aux.router.navigate(['/menuTDC']);
  }


  showErrorSucces(json) {

    // console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === '2') {
      document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
    } else {
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    }
    $('#errorModal').modal('show');
}

  showErrorPromise(error) {
    $('#errorModal').modal('show');
    if (error.errorCode === 'API_INVOCATION_FAILURE') {
        document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
    } else {
      document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
    }
}

  ErrorPatternCorreo(status) {
    const this_aux = this;
    if (status === 'show') {this_aux.showCorreoError = true;
    } else { this_aux.showCorreoError = false;    }
  }

  ErrorPatternCelular(status) {
    const this_aux = this;
    if (status === 'show') {this_aux.showCelularError = true;
    } else { this_aux.showCelularError = false;    }
  }

  editarCorreo(correoHTML) {
    const this_aux = this;
    this_aux.validar = true;
    correoHTML.readOnly = false;
   // tslint:disable-next-line:max-line-length
   const control: FormControl = new FormControl(this_aux.correoElectronico.nativeElement.value, [Validators.required,  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]);
    this_aux.myForm.setControl('fcCorreo', control );
    this_aux.IsControlCorreo = true;

  }
  editarNumCel(numCelHTML) {
    const this_aux = this;
    this_aux.validar = true;
    numCelHTML.readOnly = false;
    // tslint:disable-next-line:max-line-length
    const control: FormControl = new FormControl(this_aux.numeroCelular.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(10), Validators.maxLength(10) ]);
    this_aux.myForm.setControl('fcCelular', control );
    this_aux.IsControlCelular = true;
  }
  
  focusTeclado(element) {
    console.log("Entro focus");
    //console.log(element);
    if (element.readOnly === true) {
      $( ".cdk-visually-hidden" ).css( "margin-top", "100%" );
    } else {
      $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
    }

  }

mostrarConfirmacion(correo, celular) {
  const this_aux = this;

      if (correo !== this_aux._serviceSesion.datosBreadCroms.EmailCliente) {
        this_aux.correoActualizado = correo;
        const div2 = document.getElementById('correo');
        div2.style.display = "block";
      } else {
        this_aux.correoActualizado = this_aux._serviceSesion.datosBreadCroms.EmailCliente;
      }
      
      if (celular !== this_aux._serviceSesion.datosBreadCroms.CelCliente) {
        this_aux.celActualizado = celular;
        const div2 = document.getElementById('numCel');
        div2.style.display = "block";
      } else {
        this_aux.celActualizado = this_aux._serviceSesion.datosBreadCroms.CelCliente;
      }
      
      // tslint:disable-next-line:max-line-length
      if ((celular === this_aux._serviceSesion.datosBreadCroms.CelCliente) && (correo === this_aux._serviceSesion.datosBreadCroms.EmailCliente)) {
        $('#datosIguales').modal('show');
      } else {
        $('#actualizarCorreo').modal('show');
      }

      
}
showErrorPromiseMoney(error) {

   
  if (error.errorCode === 'API_INVOCATION_FAILURE') {
    $('#errorModal').modal('show'); 
    document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
  } else {
    document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
    $('#ModalErrorTransaccion').modal('show');
  }
}

includesL(container, value) {
  let returnValue = false;
  let pos = String(container).indexOf(value);
 
  if (pos >= 0) {
    returnValue = true;
  }
  return returnValue;
 }

}
