
import { ElementRef } from '@angular/core';
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
  showCorreoError = false;
  showCelularError = false;

  constructor(private service: SesionBxiService, private fb: FormBuilder, private router: Router) {
    this.myForm = this.fb.group({
      fcCorreo: [],
      fcCelular: []
    });
  }

  ngOnInit() {
    const this_aux = this;
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
    this.getDatosContacto();

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

  modificarDatos(correo , celular) {

    $('#_modal_please_wait').modal('show');
    const this_aux = this;
    const operaciones: OperacionesBXI = new OperacionesBXI();
    operaciones.actualizaDatosContacto(this_aux.service.infoUsuarioSIC, correo, celular).then(
      function(respActualiza) {
        const jsonRespuesta = respActualiza.responseJSON;
          if (jsonRespuesta.Id === '1') {
              console.log(jsonRespuesta);
              this_aux.service.EmailCliente = correo;
              this_aux.service.CelCliente = celular;
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
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
      $('#errorModal').modal('show');

  }

  irMenuBXI() {
    const this_aux = this;
    this_aux.router.navigate(['/menuBXI']);
  }
}
