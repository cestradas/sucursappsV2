import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgControl, FormControl } from '@angular/forms';
import { ResponseWS } from '../../../../services/response/response.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-impresion-edc-tdc-final',
  templateUrl: './impresion-edc-tdc-final.component.html',
})
export class ImpresionEdcTdcFinalComponent implements OnInit {


  forma: FormGroup;

  contraZip: string;
  confirmCorreo: string;
  correo: string;
  correosIgual = 0;
  correoIgualAux = 0;

  constructor( private router: Router, private serviceTdd: ResponseWS) { 

    const this_aux = this;
    
    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

    this_aux.forma = new FormGroup({

      'correo': new FormControl('', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'confCorreo': new FormControl('', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'contra': new FormControl('', [Validators.required, Validators.maxLength(5), Validators.minLength(5)])

    });

    //console.log(this.forma);

    this.forma.controls['correo'].valueChanges.subscribe(
      data => {
        // console.log('correo', data);
        // console.log('forma', this.forma);
        
        this_aux.correo = data;
        this_aux.validateFields();
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

    // ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuarCancelacion = document.getElementById("continuarEdc");
    let btnCerrar = document.getElementById("cerrar");
     
    if (storageTipoClienteTar === "true") {
      btnContinuarCancelacion.classList.remove("color-botones");
      btnContinuarCancelacion.classList.add("color-botones_Preferente");
      btnCerrar.classList.remove("color-botones");
      btnCerrar.classList.add("color-botones_Preferente");

    }
  }

  enviaCorreo() {

    const this_aux = this;
    $('#_modal_please_wait').modal('show');
 const formParameters = {
  fechaCorte: this_aux.serviceTdd.fechaCorte,
  idDocumento: this_aux.serviceTdd.numDoc,
  psw: this_aux.contraZip,
  correo: this_aux.confirmCorreo,
  id: this_aux.serviceTdd.idOpe,
  // nombre: this_aux.serviceTdd.NombreUsuario
};

const resourceRequest = new WLResourceRequest(
  'adapters/AdapterBanorteSucursAppsTdc/resource/envioDoc',
  WLResourceRequest.POST
);
resourceRequest.setTimeout(100000);
resourceRequest.sendFormParameters(formParameters).then(
  function(response) {
    //console.log(response.responseText);
    const respNotificador = response.responseJSON;
    //console.log(respNotificador);

    if ( respNotificador.Id === '1') {
        $('#_modal_please_wait').modal('hide');
        setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
        this_aux.finishPagePrint();
    } else {
      setTimeout(function() {
        $("#_modal_please_wait").modal("hide");
        this_aux.showErrorSucces(respNotificador);
      }, 500);
    }
  },
    function(error) {
      $('#_modal_please_wait').modal('hide');
      console.error("Error");
      this_aux.showErrorPromise(error);
    });

  }

  finishPagePrint() {

    const this_aux = this;
 //
 this_aux.serviceTdd.validaMail = "1";

     this_aux.router.navigate(['/docElectronTdc']);
  }

  showErrorPromise(error) {
    console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "El servicio no esta disponible, favor de intentar más tarde";
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

  showErrorSucces(json) {
    // console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === "2") {
      document.getElementById("mnsError").innerHTML =
        "El servicio no esta disponible, favor de intentar más tarde";
    } else {
      document.getElementById("mnsError").innerHTML = json.MensajeAUsuario;
    }
    $('#_modal_please_wait').modal('hide');
    $("#errorModal").modal("show");
  }

}
