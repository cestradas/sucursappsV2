import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { SaldosDiaMesService } from '../../../services/SaldosDiaMes/saldoDiaMes.service';
import { EventEmitter } from 'events';
import { ResponseWS } from '../../../services/response/response.service';
import { Router } from '@angular/router';
import { ValidaNipTransaccion } from '../../../services/validaNipTrans/validaNipTrans.service';

import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-pago-tarjeta-credito',
  templateUrl: './pago-tarjeta-credito.component.html'
})
export class PagoTarjetaCreditoComponent implements OnInit {

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;

  opcionSeleccionado = '0';
  id;
  bancos;

  forma: FormGroup;

  noTarjeta: string;
  importe: string;
  correo: string;


  constructor(
               private _service: ConsultaSaldosTddService,
               private _serviceSesion: SesionTDDService,
               private _saldosDiaMes: SaldosDiaMesService,
               private _response: ResponseWS,
               private _validaNipService: ValidaNipTransaccion,
               private router: Router
              ) {

                this._service.cargarSaldosTDD();

                $('#_modal_please_wait').modal('show');

    this.forma = new FormGroup({

      'selectBanco': new FormControl('0', [Validators.required
        // , this.selectDifCero
      ]),
      'numTarjeta': new FormControl('', [Validators.required]),
      'importe': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])

    });

    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.saldoClienteTdd = mensaje.SaldoDisponible;
        this.cuentaClienteTdd = mensaje.NumeroCuenta;
        this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;

      }
    );

    this.forma.controls['selectBanco'].valueChanges.subscribe(
      data => {
        console.log(data);
      });

    this.forma.controls['numTarjeta'].valueChanges.subscribe(
      data => {
        this.noTarjeta = data;
      });

    this.forma.controls['importe'].valueChanges.subscribe(
      data => {
        this.importe = data;
      });

    this.forma.controls['email'].valueChanges.subscribe(
      data => {
        this.correo = data;
      });

    const THIS: any = this;

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/consultaBancosNacionales',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {

          THIS.bancos = response.responseJSON;

          },
          function(error) {

            console.error("El WS respondio incorrectamente1");
            // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
            $('#errorModal').modal('show');


          });

          setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );

   }

  ngOnInit() {

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("continuar");
    let btnContinuar2 = document.getElementById("continuar2");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnContinuar2.classList.remove("color-botones");
      btnContinuar2.classList.add("color-botones_Preferente");
    }


  }

  cargaBancos() {

    console.log(this.opcionSeleccionado);

    if ( this.opcionSeleccionado === "Amex") {

      this.id = 2230;

    } else {

      this.id = 165;

    }

  }

  selectDifCero(control: FormControl): {[s: string]: boolean} {

    console.log(control.value);

    if (control.value === '0') {
      return{
        noestrada: true
      };
    }

    return null;


  }

  pagarTarjetaCredito() {

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
          this.pagarTarjetaCreditoTrans();
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

  pagarTarjetaCreditoTrans() {

    const THIS: any = this;

    let pImporte = parseFloat(this.importe).toFixed(2);
    // let deImpore: number = parseFloat(pImporte).toFixed(2);

    console.log(pImporte);

    const formParameters = {

      emisora: '2230',
      montoPagar: pImporte,
      referencia: THIS.noTarjeta,
      ctaCargo: THIS.cuentaClienteTdd

    };

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/pagarTarjetaCredito',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .sendFormParameters(formParameters)
      .then(
          function(response) {

          THIS._response.respuesta.respuestaWS = response.responseJSON;
          console.log("Service desde la pantalla principal: " , THIS._response.respuesta.respuestaWS);

          setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
          THIS.router.navigate(['/pagoCreditoFinal']);

          },
          function(error) {

            console.error("El WS respondio incorrectamente1");
            // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
            $('#errorModal').modal('show');


          });

  }


}
