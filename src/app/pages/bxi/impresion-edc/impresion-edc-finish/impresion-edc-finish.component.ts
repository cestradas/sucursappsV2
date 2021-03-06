import { Autenticacion } from './../../autenticacion';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgControl, FormControl } from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import $ from 'jquery';
declare var $: $;


@Component({
  selector: 'app-impresion-edc-finish',
  templateUrl: './impresion-edc-finish.component.html',
  styles: []
})
export class ImpresionEdcFinishComponent implements OnInit {

  forma: FormGroup;

  contraZip: string;
  confirmCorreo: string;
  correo: string;
  correosIgual = 0;
  correoIgualAux = 0;
  escribiendoDatos = 0;
  escribiendoDatosConfirma = 0;

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2) {

    const this_aux = this;

    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

    this_aux.forma = new FormGroup({

      'correo': new FormControl('', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'confCorreo': new FormControl('', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),

      'contra': new FormControl('', [Validators.required, Validators.maxLength(5), Validators.minLength(5)])

    });

    // console.log(this.forma);

    this.forma.controls['correo'].valueChanges.subscribe(
      data => {
        // console.log('correo', data);
        // console.log('forma', this.forma);

        this_aux.correo = data;
       // this_aux.validateFields();
      });


      this.forma.controls['confCorreo'].valueChanges.subscribe(
        data => {
          // console.log('confCorreo', data);
          // console.log('forma', this.forma);

          this_aux.confirmCorreo = data;
          this_aux.correosIgual = 0;

        });

        this.forma.controls['contra'].valueChanges.subscribe(
          data => {
            // console.log('contra', data);
            // console.log('forma', this.forma);

            this_aux.contraZip = data;
           // this_aux.validateFields();
            this_aux.correoIgualAux = 1;
          });

  }

  validateFields() {

    const this_aux = this;

    if ( (this_aux.confirmCorreo !== this_aux.correo)) {
      this_aux.correosIgual = 1;
    //  $('#continuarEdc').prop("disabled", true);
    } else {
      this_aux.correosIgual = 0;
      if (this.forma.controls['contra'].valid) {
        this_aux.enviaCorreo();
      //  $('#continuarEdc').prop("disabled", false);
      }
    }

  }

  ngOnInit() {
    $( ".cdk-visually-hidden" ).css( "margin-top", "15%" );

    //ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnTerminar = document.getElementById("continuarEdc");


    if (storageTipoClienteBEL === "true") {

      btnTerminar.classList.remove("color-botones");
      btnTerminar.classList.add("color-botones_Preferente");


    }
  }

  enviaCorreo() {

    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    const autenticacion: Autenticacion = new Autenticacion();

    operacionesbxi.envioEDC(this_aux.service.fechaCorte , this_aux.service.numDoc, this_aux.contraZip,
                            this_aux.confirmCorreo, this_aux.service.idOpe,
                            this_aux.service.NombreUsuario).then(

      function(response) {
        // console.log(response.responseText);
        const respNotificador = response.responseJSON;
        $('#_modal_please_wait').modal('show');
        // console.log(respNotificador);

        if ( respNotificador.Id === '1') {


            $('#_modal_please_wait').modal('hide');
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

            this_aux.finishPagePrint();


        } else {
          this_aux.showErrorSucces(respNotificador);
          setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
       }
     }, function(error) {
      $('#_modal_please_wait').modal('hide');
        this_aux.showErrorPromise(error);
 });

  }


  finishPagePrint() {

    const this_aux = this;
 //
     this_aux.service.validaMail = "1";

     this_aux.router.navigate(['/impresion_EDC_Electron']);
  }


  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    setTimeout(() => {
      if (json.Id === "2") {
        document.getElementById("mnsError").innerHTML =
          "El servicio no esta disponible, favor de intentar mas tarde";
      } else {
        this.validaErr(json);
      }
      $('#_modal_please_wait').modal('hide');    
    }, 500);
    
  }
  
  validaErr(json) {
  
    setTimeout(() => {
       if (json.Id === "0") {
        if (json.MensajeAUsuario === "No existe documento") {
          // tslint:disable-next-line:max-line-length
          document.getElementById("mnsError").innerHTML = "No se encontró el archivo " + localStorage.getItem("fechaDocumentoSeleccionada") + " en el repositorio, favor de reportar el problema a un ejecutivo.";
        } else {
          document.getElementById("mnsError").innerHTML = json.MensajeAUsuario;
        }   
    
      } else if (json[0].Id === "2") {
        document.getElementById("mnsError").innerHTML = "El servicio no esta disponible, favor de intentar mas tarde";
      } else {
        document.getElementById("mnsError").innerHTML =
          "El servicio no esta disponible, favor de intentar mas tarde";
      }
      $('#_modal_please_wait').modal('hide');
      $("#errorModal").modal("show"); 
    }, 500);
     
  }

showErrorPromise(error) {
  // console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('mnsError').innerHTML =   "El servicio no está disponible, favor de intentar más tarde";
  $('#_modal_please_wait').modal('hide');
  $('#errorModal').modal('show');
}

ingresandoDatos() {  
  const this_aux = this;

  this_aux.escribiendoDatos = 1;

}

finalizaIngresoDatos() {
  const this_aux = this;

  this_aux.escribiendoDatos = 0;
}

ingresandoDatosConfirma() {  
  const this_aux = this;

  this_aux.escribiendoDatosConfirma = 1;

}

finalizaIngresoDatosConfirma() {
  const this_aux = this;

  this_aux.escribiendoDatosConfirma = 0;
} 

}
