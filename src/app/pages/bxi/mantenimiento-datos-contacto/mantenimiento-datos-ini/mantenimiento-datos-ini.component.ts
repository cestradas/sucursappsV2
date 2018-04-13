
import { ElementRef } from '@angular/core';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-mantenimiento-datos-ini',
  templateUrl: './mantenimiento-datos-ini.component.html',
  styleUrls: ['./mantenimiento-datos-ini.component.css']
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
    $( ".cdk-visually-hidden" ).css( "margin-top", "19%" );
    this.getDatosContacto();
  }

  getDatosContacto() {
    console.log('getDatosContacto');
    const this_aux = this;
    const operaciones: OperacionesBXI = new OperacionesBXI();
    operaciones.consultaDatosContacto(this_aux.service.infoUsuarioSIC).then(
      function(data) {
        const jsonData = data.responseJSON;
        if (jsonData.Id === '1') {
            console.log(jsonData);
              if (jsonData.Email !== undefined) {
                this_aux.correoElectronico.nativeElement.value  = jsonData.Email;
                const controlCorreo: FormControl = new FormControl(this_aux.correoElectronico.nativeElement.value);
                this_aux.myForm.setControl('fcCorreo', controlCorreo );
              } else   if (jsonData.Telefono !== undefined ) {
                this_aux.numeroCelular.nativeElement.value = jsonData.Telefono;
                const controlCelular: FormControl = new FormControl(  this_aux.numeroCelular.nativeElement.value);
                this_aux.myForm.setControl('fcCelular', controlCelular );
              } 
        } else {
                  this_aux.showErrorSucces(jsonData);
        }
      }, function (error) { this_aux.showErrorPromise(error);   }
    );
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
    const control: FormControl = new FormControl(this_aux.numeroCelular.nativeElement.value, [Validators.required, Validators.pattern(/^([0-9])*$/), Validators.minLength(10) ]);
    this_aux.myForm.setControl('fcCelular', control );
    this_aux.IsControlCelular = true;
  }

  modificarDatos(correo , celular) {
    const this_aux = this;
    const operaciones: OperacionesBXI = new OperacionesBXI();
    operaciones.actualizaDatosContacto(this_aux.service.infoUsuarioSIC, correo, celular).then(
      function(respActualiza) {
        const jsonRespuesta = respActualiza.responseJSON;
          if (jsonRespuesta.Id === '1') {
              console.log(jsonRespuesta);
              this_aux.service.Email = correo;
              this_aux.service.Celular = celular;
              this_aux.router.navigate(['/mantiene-datos-fin']);
        } else { this_aux.showErrorSucces(jsonRespuesta); }
      }, function(error) {   this_aux.showErrorPromise(error);   }
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

  irMenuBXI() {
    const this_aux = this;
    this_aux.router.navigate(['/menuBXI']);
  }
}
