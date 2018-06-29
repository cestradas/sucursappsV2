import { Component, OnInit } from '@angular/core';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { SaldosDiaMesService } from '../../../services/SaldosDiaMes/saldoDiaMes.service';

import $ from 'jquery';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ValidaNipTransaccion } from '../../../services/validaNipTrans/validaNipTrans.service';
import { ResponseWS } from '../../../services/response/response.service';
import { Router } from '@angular/router';
declare var $: $;

@Component({
  selector: 'app-transferencia-terceros',
  templateUrl: './transferencia-terceros.component.html',
})
export class TransferenciaTercerosComponent implements OnInit {

  subscription: Subscription;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;

  forma: FormGroup;

  noTarjeta: string;
  importe = '';
  correo: string;
  desc: string;
  formattedAmount;

  importeAux: string;

  constructor(
    private _service: ConsultaSaldosTddService,
    private _serviceSesion: SesionTDDService,
    private _saldosDiaMes: SaldosDiaMesService,
    private currencyPipe: CurrencyPipe,
    private _validaNipService: ValidaNipTransaccion,
    private _response: ResponseWS,
    private router: Router
  ) {}

  ngOnInit() {

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("continuar");
    let btnConfirmar = document.getElementById("confirmar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnConfirmar.classList.remove("color-botones");
      btnConfirmar.classList.add("color-botones_Preferente");
    }



    this._service.cargarSaldosTDD();

    $('#_modal_please_wait').modal('show');

    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        this.saldoClienteTdd = mensaje.SaldoDisponible;
        this.cuentaClienteTdd = mensaje.NumeroCuenta;
        this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;

        console.log('Saldos cargados correctamente TDD: ' , mensaje);

      }
    );

    setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );

    this.forma = new FormGroup({

      'noCuenta': new FormControl('', [Validators.required]),
      'importe': new FormControl(this.importe, [Validators.required]),
      'desc': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])

    });

    this.forma.controls['noCuenta'].valueChanges.subscribe(
      data => {
        this.noTarjeta = data;
      });

    this.forma.controls['desc'].valueChanges.subscribe(
      data => {
        this.desc = data;
      });

    this.forma.controls['importe'].valueChanges.subscribe(
      data => {
        this.importe = data;
      });

    this.forma.controls['email'].valueChanges.subscribe(
      data => {
        this.correo = data;
      });

  }

  transform() {

    if (this.importe !== '') {

      this.importe = this.replaceSimbolo(this.importe);
      this.importe = this.currencyPipe.transform(this.importe, 'USD');

    }

  }

  replaceSimbolo(importe) {
    const importeAux = importe.replace('$', '');
    return importeAux;
  }

  transTercero() {

    $('#ModalTDDLogin').modal('show');
    $('#_modal_please_wait').modal('show');
    this._validaNipService.validaNipTrans();

    let res;

    this._validaNipService.validarDatosrespuesta().then(
      mensaje => {

        res = this._validaNipService.respuestaNip.res;
        console.log(res);

        if (res === true) {

          $('#ModalTDDLogin').modal('hide');
          setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );
          this.transTerceroTransaccion();
          this._validaNipService.respuestaNip.res = "";

        } else {

          console.error("Mostrar modal las tarjetas no son iguales");
          document.getElementById('mnsError').innerHTML =   "El NIP introducido no corresponde.";
          $('#_modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
          $('#ModalTDDLogin').modal('hide');
          this._validaNipService.respuestaNip.res = "";


        }



      }
    );

  }

  transTerceroTransaccion() {
/*
    const THIS: any = this;
    const this_aux = this;
    this.importe = this.replaceSimbolo(this.importe);

    let pImporte = parseFloat(this.importe).toFixed(2);

    const formParameters = {

      paramEmailBeneficiario: this.correo,
      paramMnsEmail: this.desc,
      paramAliasCuentaOrigen: 'Cuenta TDD',
      paramNumeroCuentaCargo: this.cuentaClienteTdd,
      paramCuentaAbono: this.noTarjeta,
      paramImporte: pImporte
    }

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps2/resource/transfenciaTerceroBanorte',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .sendFormParameters(formParameters)
      .then(
          function(response) {

          const transfResp = response.responseJSON;

          if ( transfResp.Id === '1') {

            THIS._response.respuesta.respuestaWS = response.responseJSON;
            THIS._response.respuesta.paramsExt = THIS.noTarjeta;
            console.log("Service desde la pantalla principal: " , THIS._response.respuesta.respuestaWS);

            setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
            THIS.router.navigate(['/transTercerosFinal']);

          } else {
              this_aux.showErrorSuccesMoney(transfResp);

          }


          },
          function(error) {

            console.error("El WS respondio incorrectamente2");
            this_aux.showErrorPromise(error);


          });
*/
  } 


  showErrorSuccesMoney(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('msgError').innerHTML =   json.MensajeAUsuario;
    $('#_modal_please_wait').modal('hide');
    $('#ModalErrorTransaccion').modal('show');
  }

  showErrorPromise(error) {
   console.log(error);
   // tslint:disable-next-line:max-line-length
   document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
   $('#_modal_please_wait').modal('hide');
   $('#errorModal').modal('show');
 }


}
