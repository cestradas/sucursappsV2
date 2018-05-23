import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { consultaCatalogos } from '../../../services/consultaCatalogos/consultaCatalogos.service';
import { SesionBxiService } from '../../bxi/sesion-bxi.service';
import { SesionTDDService } from '../../../services/service.index';


declare var $: any;
@Component({
  selector: 'app-mantenimientos-datos-contacto',
  templateUrl: './mantenimientos-datos-contacto.component.html'
})
export class MantenimientosDatosContactoComponent implements OnInit {

  @ViewChild('correoElectronico', { read: ElementRef}) correoElectronico: ElementRef ;
  @ViewChild('numeroCelular', { read: ElementRef}) numeroCelular: ElementRef ;
  myForm: FormGroup;
  IsControlCorreo = false;
  IsControlCelular = false;
  showCorreoError = false;
  showCelularError = false;
  
  constructor(private router: Router, private fb: FormBuilder, private _serviceSesion: SesionTDDService) {
    this.myForm = this.fb.group({ 
      fcCorreo: [],
      fcCelular: []
    });
   }

  ngOnInit() {
    const this_aux = this;
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
    this.getDatosContacto();
  }

  consultarDatos() {
    const this_aux = this;
    const operaciones: consultaCatalogos = new consultaCatalogos();
    operaciones.consultarDatosContacto().then(
      function(respPago) {
  
        const jsonRespuesta = respPago.responseJSON;
        if (jsonRespuesta.Id === '1') {
         console.log(respPago.responseText);
         this_aux._serviceSesion.datosBreadCroms.CelCliente = jsonRespuesta.Email;
         this_aux._serviceSesion.datosBreadCroms.EmailCliente = jsonRespuesta.Telefono;
          console.log("Consulta de Datos Exitosa");
          
        } else {
          this_aux.showErrorSucces(jsonRespuesta);
          this._serviceSesion.datosBreadCroms.CelCliente = "";
          this._serviceSesion.datosBreadCroms.EmailCliente = "";
          console.log("No hay Datos");
        }
      }, function(error) { this_aux.showErrorPromise(error); }
    );
  }

  getDatosContacto() {
    const this_aux = this;

    this_aux.consultarDatos();
    setTimeout(function() { 
      
      const controlCorreo: FormControl = new FormControl(this_aux._serviceSesion.datosBreadCroms.CelCliente);
      this_aux.myForm.setControl('fcCorreo', controlCorreo );
      const controlCelular: FormControl = new FormControl( this_aux._serviceSesion.datosBreadCroms.EmailCliente);
      this_aux.myForm.setControl('fcCelular', controlCelular );
    }, 500);
    
  }

  modificarDatos(correo , celular) {

    $('#_modal_please_wait').modal('show');


    console.log("si entre");
    const this_aux = this;
    const operaciones: consultaCatalogos = new consultaCatalogos();
    console.log(correo + "   " + celular);
    operaciones.actualizaDatosContacto(correo, celular).then(
        function(resp) {
    
          const jsonRespuesta = resp.responseJSON;
          if (jsonRespuesta.Id === '1') {
           console.log(resp.responseText);
            $('div').removeClass('modal-backdrop');
            this_aux.router.navigate(['/actualizarDatosContactoFinalTDD']);
            console.log("Datos Actualizados");
          } else {
            this_aux.showErrorSucces(jsonRespuesta);
            console.log("Datos no Actualizados");
          }
        }, function(error) { this_aux.showErrorPromise(error); }
      );
    
  }

  irMenuTDD() {
    const this_aux = this;
    this_aux.router.navigate(['/menuTdd']);
  }


  showErrorSucces(json) {
    setTimeout(function() { 
      console.log(json.Id + json.MensajeAUsuario);
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario; 
      $('#_modal_please_wait').modal('hide');
      $('#errorModal').modal('show');
    }, 500);
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
   const control: FormControl = new FormControl(this_aux.correoElectronico.nativeElement.value, [Validators.required,  Validators.email]);
    this_aux.myForm.setControl('fcCorreo', control );
    this_aux.IsControlCorreo = true;

  }
  editarNumCel(numCelHTML) {
    const this_aux = this;
    numCelHTML.readOnly = false;
    // tslint:disable-next-line:max-line-length
    const control: FormControl = new FormControl(this_aux.numeroCelular.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(10) ]);
    this_aux.myForm.setControl('fcCelular', control );
    this_aux.IsControlCelular = true;
  }



}

