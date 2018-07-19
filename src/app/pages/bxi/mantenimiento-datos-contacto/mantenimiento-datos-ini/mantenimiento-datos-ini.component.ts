
import { ElementRef } from '@angular/core';
import { Autenticacion } from './../../autenticacion';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-mantenimiento-datos-ini',
  templateUrl: './mantenimiento-datos-ini.component.html'
})
export class MantenimientoDatosIniComponent implements OnInit {

  @ViewChild('correoElectronico', { read: ElementRef}) correoElectronico: ElementRef ;
  @ViewChild('numeroCelular', { read: ElementRef}) numeroCelular: ElementRef ;
  myForm: FormGroup;
  IsControlCorreo = false;
  IsControlCelular = false;
  labelTipoAutentica: string;
  NumeroSeguridad: string;
  Correo: string;
  Celular: string;
  actCorreo = false;
  actCel = false;
 

  constructor(private service: SesionBxiService, private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      fcCorreo: [],
      fcCelular: [],
      fcToken: []
    });
  }

  ngOnInit() {
    const this_aux = this;
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
    this_aux.service.cambioCel = false;
    this_aux.service.cambioCorreo = false;
    this_aux.getDatosContacto();

    // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("guardar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
  }

  getDatosContacto() {

    console.log('Manteniento Datos Contacto');
      const this_aux = this;
      const controlCorreo: FormControl = new FormControl(this_aux.service.EmailCliente);
      this_aux.myForm.setControl('fcCorreo', controlCorreo );
      const controlCelular: FormControl = new FormControl(  this_aux.service.CelCliente);
      this_aux.myForm.setControl('fcCelular', controlCelular );
      setTimeout(function() {
        $('#_modal_please_wait').modal('hide');
        $('div').removeClass('modal-backdrop');
      }, 500);
  }


  editarCorreo(correoHTML) {
    const this_aux = this;
    correoHTML.readOnly = false;
   // tslint:disable-next-line:max-line-length
   const control: FormControl = new FormControl(this_aux.correoElectronico.nativeElement.value, [Validators.required,  Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]);
    this_aux.myForm.setControl('fcCorreo', control );
    this_aux.IsControlCorreo = true;

  }
  editarNumCel(numCelHTML) {
    const this_aux = this;
    numCelHTML.readOnly = false;
    // tslint:disable-next-line:max-line-length
    const control: FormControl = new FormControl(this_aux.numeroCelular.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(10), Validators.maxLength(10) ]);
    this_aux.myForm.setControl('fcCelular', control );
    this_aux.IsControlCelular = true;
  }

  modificarDatos(correo, celular) {

    const this_aux = this;
    const operaciones: OperacionesBXI = new OperacionesBXI();
    operaciones.actualizaDatosContacto(this_aux.service.infoUsuarioSIC, correo, celular).then(
      function(respActualiza) {
        const jsonRespuesta = respActualiza.responseJSON;
          if (jsonRespuesta.Id === '1') {
              console.log(jsonRespuesta);
              this_aux.service.EmailCliente = correo;
              this_aux.service.CelCliente = celular;
              const d = new Date();
              this_aux.service.Fecha =  d.getFullYear()  + '-' + d.getMonth() + '-' + d.getDate(); 
              this_aux.service.Tiempo = d.getHours() + ':' + d.getMinutes() + ':' + d.getMilliseconds();
              this_aux.router.navigate(['/mantiene-datos-fin']);
        } else {

          setTimeout(function() { 
            $('#_modal_please_wait').modal('hide');
          this_aux.showErrorSucces(jsonRespuesta); 
          }, 500);
        }
      }, function(error) {
        setTimeout(function() { 
          $('#_modal_please_wait').modal('hide');
          this_aux.showErrorPromiseMoney(error);   
        }, 500); 
      }
    );


  }

  showErrorPromise(error) {

      $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
  }

  showErrorPromiseMoney(error) {

   
    if (error.errorCode === 'API_INVOCATION_FAILURE') {
      $('#errorModal').modal('show'); 
      document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
    } else {
      document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tus datos.";
      $('#ModalErrorTransaccion').modal('show');
    }
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

  irMenuBXI() {
    const this_aux = this;
    this_aux.router.navigate(['/menuBXI']);
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

  setTipoAutenticacionOnModal(correo, celular) {
    const this_aux = this;
    const divChallenge = document.getElementById('challenger');
    const divTokenPass = document.getElementById('divPass');
    const control: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{6})*$/)]);
    this_aux.myForm.setControl('fcToken', control );
    this_aux.Correo = correo;
    this_aux.Celular = celular;

    if (this_aux.service.EmailCliente !== correo) {
        this_aux.actCorreo = true;
        this_aux.service.cambioCorreo = true;
    } 
    if (this_aux.service.CelCliente !== celular ) {
        this_aux.actCel = true;
        this_aux.service.cambioCel = true;
    } 

    if ( this_aux.actCel === true || this_aux.actCorreo === true) {
      if (this_aux.service.metodoAutenticaMayor.toString() === '5') {
        $('#_modal_please_wait').modal('show');
        this_aux.labelTipoAutentica = 'Token Celular';
          divTokenPass.setAttribute('style', 'display: flex');
          const operacionesbxi: OperacionesBXI = new OperacionesBXI();
          operacionesbxi.preparaAutenticacion().then(
            function(response) {
              const detallePrepara = response.responseJSON;
              console.log(detallePrepara);
              if (detallePrepara.Id === 'SEG0001') {
                divChallenge.setAttribute('style', 'display: flex');
                this_aux.NumeroSeguridad = detallePrepara.MensajeUsuarioUno;
                setTimeout(() => {
                  $('#_modal_please_wait').modal('hide');
               }, 500);
              } else {
                $('#_modal_please_wait').modal('hide');
                setTimeout(function() {
                  this_aux.showErrorSucces(detallePrepara);
                }, 1000);
              }
            }, function(error) {
              $('#_modal_please_wait').modal('hide');
              setTimeout(() => {
                this_aux.showErrorPromise(error);
             }, 1000);
  
            });
  
        } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {
    
          divChallenge.setAttribute('style', 'display: none');
          divTokenPass.setAttribute('style', 'display: flex');
          this_aux.labelTipoAutentica = 'Contrase&atilde;a';
        } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {
    
          
          divChallenge.setAttribute('style', 'display: none');
          divTokenPass.setAttribute('style', 'display: flex');
          this_aux.labelTipoAutentica = 'Token Fisico';
        }
          setTimeout(function() {
              $( ".cdk-visually-hidden" ).css( "margin-top", "23%" );
              $('#confirmModal').modal('show');
          }, 500);
    } else {

      document.getElementById('mnsError').innerHTML =  "No hay cambios en datos contacto, no es posible continuar";
      $('#errorModal').modal('show');
    }
    
  }

  confirmarOperacion(token) {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    let mensajeError;
      const autenticacion: Autenticacion = new Autenticacion();
      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Operacion validada');
                  this_aux.modificarDatos(this_aux.Correo, this_aux.Celular);
              } else {

                $('#_modal_please_wait').modal('hide');
                  console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                  mensajeError = this_aux.controlarError(infoUsuarioJSON);
                  document.getElementById('mnsError').innerHTML =  mensajeError;
                  $('#errorModal').modal('show');

              }
        }, function(error) {
          $('#_modal_please_wait').modal('hide');
           this_aux.showErrorPromiseMoney(error);
        });
  }

  controlarError(json) {

    const id = json.Id ;
    const mensajeUsuario = json.MensajeAUsuario;
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

      // tslint:disable-next-line:max-line-length
      case 'SEGTK03': mensajeError = "Token desincronizado."; // Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                    break;
      case '2'      : mensajeError = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
                    console.log("Id: 2 Mensaje:" + mensajeUsuario);
                  break;
    }

    return mensajeError;
  }

  ocultaModal() {
    const this_aux = this;
    const control: FormControl = new FormControl('');
    this_aux.myForm.setControl('fcToken', control );
  }

}

