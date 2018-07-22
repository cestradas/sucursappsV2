import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaCatalogosTdcService } from '../../../services/consultaCatalogosTDC/consulta-catalogos-tdc.service';
import { SesionBxiService } from '../../bxi/sesion-bxi.service';
import { SesionTDDService,ValidaNipTransaccion } from '../../../services/service.index';
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

  constructor(private router: Router, private fb: FormBuilder, private _serviceSesion: SesionTDDService,private _validaNipService: ValidaNipTransaccion) {
    this.myForm = this.fb.group({
      fcCorreo: ['', [Validators.required, Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]],
      fcCelular: ['', [Validators.required, ]]
    });
   }

  ngOnInit() {
        // ESTILOS Preferente
        let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
        let btnGuardar = document.getElementById("guardar");
        let btnSalir = document.getElementById("salir");
    
        if (storageTipoClienteTar === "true") {
    
          // btnGuardar.classList.remove("color-botones");
          // btnGuardar.classList.add("color-botones_Preferente");
          // btnSalir.classList.remove("color-botones");
          // btnSalir.classList.add("color-botones_Preferente");
        }
    
    
        const this_aux = this;
        $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
        // this.getDatosContacto(); 
        this.consultarDatos();
  }
  consultarDatos() {
    const this_aux = this;
    const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
    operaciones.consultarDatosContacto().then(
      function(respPago) {

        const jsonRespuesta = respPago.responseJSON;
        if (jsonRespuesta.Id === '1') {
         console.log(respPago.responseText);
         this_aux._serviceSesion.datosBreadCroms.CelCliente = jsonRespuesta.Telefono;
         this_aux._serviceSesion.datosBreadCroms.EmailCliente = jsonRespuesta.Email;
         /* const controlCorreo: FormControl = new FormControl(this_aux._serviceSesion.datosBreadCroms.CelCliente);
         this_aux.myForm.setControl('fcCorreo', controlCorreo );
         const controlCelular: FormControl = new FormControl( this_aux._serviceSesion.datosBreadCroms.EmailCliente);
         this_aux.myForm.setControl('fcCelular', controlCelular );*/
         console.log("Consulta de Datos Exitosa");

        } else {
          this_aux.showErrorSucces(jsonRespuesta);
          // this._serviceSesion.datosBreadCroms.CelCliente = "";
             this_aux._serviceSesion.datosBreadCroms.CelCliente = "";
          // this._serviceSesion.datosBreadCroms.EmailCliente = "";
            this_aux._serviceSesion.datosBreadCroms.EmailCliente = "";
          console.log("No hay Datos");
        }
         this_aux.getDatosContacto();
        setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
      }, function(error) { this_aux.showErrorPromise(error); }
    );
  }
  
  getDatosContacto() {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    // this_aux.consultarDatos();
    setTimeout(function() { 
      $('#_modal_please_wait').modal('show');
      const controlCorreo: FormControl = new FormControl(this_aux._serviceSesion.datosBreadCroms.EmailCliente);
      this_aux.myForm.setControl('fcCorreo', controlCorreo );
      
      const controlCelular: FormControl = new FormControl( this_aux._serviceSesion.datosBreadCroms.CelCliente);
      this_aux.myForm.setControl('fcCelular', controlCelular );
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
    }, 500);

  }

  modificarDatos(correo , celular) {

    $('#_modal_please_wait').modal('show');


    console.log("entrando metodo modificarDatos");
    const this_aux = this;
    const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
    console.log(correo + " " + celular);
    operaciones.actualizaDatosContacto(correo, celular).then(
        function(resp) {

          const jsonRespuesta = resp.responseJSON;
          if (jsonRespuesta.Id === '1') {
           console.log(resp.responseText);
            $('div').removeClass('modal-backdrop');
            this_aux.router.navigate(['/mantenimientoDatosContactoFinalTdc']);
            console.log("Datos Actualizados");
          } else {
            this_aux.showErrorSucces(jsonRespuesta);
            console.log("Datos no Actualizados");
          }
        }, function(error) { this_aux.showErrorPromise(error); }
      );

  }

  irMenuTDC() {
    const this_aux = this;
    this_aux.router.navigate(['/menuTDC']);
  }

  showErrorSucces(json) {
    
  console.log(json.Id + json.MensajeAUsuario);
  if (json.Id === '2') {
    document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
  } else {
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
  }
  $('#errorModal').modal('show');
  }


  showErrorPromise(error) {

    setTimeout(function() {
      $('#modal_please_wait').modal('hide');
      $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
    }, 500);
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
    correoHTML.readOnly = false;
   const control: FormControl = new FormControl(this_aux.correoElectronico.nativeElement.value, [Validators.required,  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]);
    this_aux.myForm.setControl('fcCorreo', control );
    this_aux.IsControlCorreo = true;

  }
  editarNumCel(numCelHTML) {
    const this_aux = this;
    numCelHTML.readOnly = false;
    // tslint:disable-next-line:max-line-length
    const control: FormControl = new FormControl(this_aux.numeroCelular.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(10),Validators.maxLength(10)]);
    this_aux.myForm.setControl('fcCelular', control );
    this_aux.IsControlCelular = true;
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
  validartarjeta() {
    const this_aux = this;
    /*this._validaNipService.validaNipTrans();
    const this_aux = this;
    document.getElementById('capturaInicio').style.display = 'none';
    document.getElementById('caputuraSesion').style.display = 'block';
    $("#ModalTDDLogin").modal("show");
  let res;
  
    this._validaNipService.validarDatosrespuesta().then(
      mensaje => {
  
        res = this._validaNipService.respuestaNip.res;
        console.log(res);
  
        if (res === true) {
  
      */    
          this_aux.modificarDatos(this_aux.correoActualizado, this_aux.celActualizado);
        /*this._validaNipService.respuestaNip.res = "";
        } else {
  
          console.error("Mostrar modal las tarjetas no son iguales");
          document.getElementById('mnsError').innerHTML =   "Las tarjetas no corresponden.";
          $('#_modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
          $('#ModalTDDLogin').modal('hide');
          this._validaNipService.respuestaNip.res = "";
  
        }
      }
    );
    $('#ModalTDDLogin').modal('hide');*/
  }
  focusTeclado(element) {
    console.log("Entro focus");
    console.log(element);
    if (element.readOnly === true) {
      $( ".cdk-visually-hidden" ).css( "margin-top", "100%" );
    } else {
      $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
    }

  }

}
