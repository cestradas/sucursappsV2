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

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2) {

    const this_aux = this;

    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

    this_aux.forma = new FormGroup({

      'correo': new FormControl('', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'confCorreo': new FormControl('', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),

      'contra': new FormControl('', [Validators.required, Validators.maxLength(10)])

    });

    console.log(this.forma);

    this.forma.controls['correo'].valueChanges.subscribe(
      data => {
        console.log('correo', data);
        console.log('forma', this.forma);

        this_aux.correo = data;

        this_aux.validateFields();

      });


      this.forma.controls['confCorreo'].valueChanges.subscribe(
        data => {
          console.log('confCorreo', data);
          console.log('forma', this.forma);

          this_aux.confirmCorreo = data;

          this_aux.validateFields();

        });

        this.forma.controls['contra'].valueChanges.subscribe(
          data => {
            console.log('contra', data);
            console.log('forma', this.forma);

            this_aux.contraZip = data;

            this_aux.validateFields();

          });

  }

  validateFields() {

    const this_aux = this;

    if ( (this_aux.confirmCorreo !== this_aux.correo) && (this_aux.contraZip !== undefined) ) {
      $('#continuarEdc').prop("disabled", true);
    } else {
      $('#continuarEdc').prop("disabled", false);
    }

  }

  ngOnInit() {
  }

  enviaCorreo() {

    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    const autenticacion: Autenticacion = new Autenticacion();

    operacionesbxi.envioEDC(this_aux.service.fechaCorte , this_aux.service.numDoc, this_aux.contraZip,
                            this_aux.confirmCorreo, this_aux.service.idOpe,
                            this_aux.service.NombreUsuario).then(

      function(response) {
        console.log(response.responseText);
        const respNotificador = response.responseJSON;
        $('#_modal_please_wait').modal('show');
        console.log(respNotificador);

        if ( respNotificador.Id === '1') {


            $('#_modal_please_wait').modal('hide');
            setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

            this_aux.finishPagePrint();


        } else {
          this_aux.showErrorSucces(respNotificador);
          setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
       }
     }, function(error) {
        //this_aux.showErrorPromise(error);
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
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    $('#errorModal').modal('show');

}

}
