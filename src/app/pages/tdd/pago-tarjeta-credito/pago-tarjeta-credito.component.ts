import { Component, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { SaldosDiaMesService } from '../../../services/SaldosDiaMes/saldoDiaMes.service';
import { EventEmitter } from 'events';
import { ResponseWS } from '../../../services/response/response.service';
import { Router } from '@angular/router';
import { ValidaNipTransaccion } from '../../../services/validaNipTrans/validaNipTrans.service';
import { consultaCatalogos } from '../../../services/consultaCatalogos/consultaCatalogos.service';
import { CurrencyPipe } from "@angular/common";

import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-pago-tarjeta-credito',
  templateUrl: './pago-tarjeta-credito.component.html'
})
export class PagoTarjetaCreditoComponent implements OnInit {

  @ViewChild("rImporte", { read: ElementRef })
  rImporte: ElementRef;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;
  mostrarCuentaMascara: string;
  opcionSeleccionado = '0';
  id;
  bancos;

  forma: FormGroup;

  noTarjeta: string;
  importe: string;
  correo: string;
  nombreBanco: string;


  constructor(
               private _service: ConsultaSaldosTddService,
               private _serviceSesion: SesionTDDService,
               private _saldosDiaMes: SaldosDiaMesService,
               private _response: ResponseWS,
               private _validaNipService: ValidaNipTransaccion,
               private router: Router,
               private currencyPipe: CurrencyPipe
              ) {

                this._service.cargarSaldosTDD();

                $('#_modal_please_wait').modal('show');

    this.forma = new FormGroup({

      'selectBanco': new FormControl('0', [Validators.required
        // , this.selectDifCero
      ]),
      'numTarjeta': new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
      'importe': new FormControl('', Validators.required)
 //     'email': new FormControl('', [Validators.required,
   //     Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])

    });

    this._service.validarDatosSaldoTdd().then(
      mensaje => {
        const operaciones: consultaCatalogos = new consultaCatalogos();
        console.log('Saldos cargados correctamente TDD');
        this.saldoClienteTdd = mensaje.SaldoDisponible;
        this.cuentaClienteTdd = mensaje.NumeroCuenta;
        this.mostrarCuentaMascara = operaciones.mascaraNumeroCuenta(this.cuentaClienteTdd);
        this.consultaBancos();
      }
    ); 

    this.forma.controls['selectBanco'].valueChanges.subscribe(
      data => {
        console.log(data);
        this.opcionSeleccionado = data;
      });

    this.forma.controls['numTarjeta'].valueChanges.subscribe(
      data => {
        this.noTarjeta = data;
      });

    this.forma.controls['importe'].valueChanges.subscribe(
      data => {
        this.importe = data;
      });
/*
    this.forma.controls['email'].valueChanges.subscribe(
      data => {
        this.correo = data;
      }); */
    

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
    $(".cdk-visually-hidden").css("margin-top", "15%");
  }


  consultaBancos () {
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
          THIS.bancos.sort(THIS.sortByProperty('NombreBanco'));
          $('#_modal_please_wait').modal('hide');
          },
          function(error) {
            $('#_modal_please_wait').modal('hide');
            // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
            $('#errorModal').modal('show');
          });
  }
  
  sortByProperty = function (property) {

    return function (x, y) {

        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));

    };

};

  cargaBancos() {

    if ( this.opcionSeleccionado === '2') {

      this.id = 2230;

    } else {

      this.id = 165;

    }

    this.pagarTarjetaCredito();

  }

  selectBanco(bancoSeleccionado) {
    const this_aux = this;
    let nombreSele: any;
    nombreSele = document.getElementById("tipoBanco");
    this_aux.nombreBanco = nombreSele.options[nombreSele.selectedIndex].text;
    this_aux._response.nameBancoDestino = this_aux.nombreBanco;
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
    this._validaNipService.validaNipTrans();
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
          $('#ModalTDDLogin').modal('hide');
          $('#_modal_please_wait').modal('show');
          this_aux.pagarTarjetaCreditoTrans();
          this._validaNipService.respuestaNip.res = "";
        } else {
          console.error("Mostrar modal las tarjetas no son iguales");
          document.getElementById('mnsError').innerHTML =   "Los datos no corresponden";
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
    const this_aux = this;
    let pImporte = parseFloat(this.importe).toFixed(2);
    // let deImpore: number = parseFloat(pImporte).toFixed(2);
    this_aux._response.numCuentaDestino = THIS.noTarjeta;
    console.log(pImporte);
    const formParameters = {
      tipoTarjeta: THIS.id,
      montoAPagar: pImporte,
      cuentaAbono: THIS.noTarjeta,
      cuentaCargo: THIS.cuentaClienteTdd,
    };

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps2/resource/pagoTarjetaCredito',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .sendFormParameters(formParameters)
      .then(
          function(detallePago) {
            console.log('Pago Validado');
            const jsonDetallePago = detallePago.responseJSON;
            if (jsonDetallePago.Id === '1') {
                this_aux._response.detallePagoTarjeta = detallePago.responseText;
                this_aux._response.numeroCuentaTdd = this_aux.mostrarCuentaMascara;
                this_aux.router.navigate(['/pagoCreditoFinal']);
            } else {
              $('#_modal_please_wait').modal('hide');
              $("#errorModal").modal("show");
            }
          },
          function(error) {

            console.error("El WS respondio incorrectamente");
            // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
            $('#errorModal').modal('show');
            $('#ModalTDDLogin').modal('hide');

          });

  }

  validarSaldo() {
    const this_aux = this;
    let importeOpe = "";
    $('#_modal_please_wait').modal('show');
    importeOpe = this_aux.replaceSimbolo(this_aux.importe);
    this._validaNipService.consultaTablaYValidaSaldo(importeOpe).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        if (DatosJSON.Id === "1") {
          $('#confirmModal').modal('show');
        } else if ( DatosJSON.Id === "4" ) {
          $('#modalLimiteDiario').modal('show');
        } else if ( DatosJSON.Id === "5" ) {
          $('#modalLimiteMensual').modal('show');
        } else {
          $('#errorModal').modal('show');
        }
        setTimeout(function() {
          $('#_modal_please_wait').modal('hide');
        }, 500);
        
      }, function(error) {
        setTimeout(function() {
          $('#_modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
        }, 500);
       
  });
  }

  replaceSimbolo(importe) {
    const this_aux = this;
    let importeAux = importe.replace('$', '');
    const re = /\,/g;
    importeAux = importeAux.replace(re, '');
    console.log(importeAux);

        return importeAux;
  }

  transformAmount(impor) {
    const this_aux = this;
    let importeAux = "";
    if (impor !== '') {
      const control: FormControl = new FormControl('');
      this_aux.forma.setControl(this_aux.rImporte.nativeElement.value, control);
      importeAux = this_aux.replaceSimbolo(impor);
      this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(importeAux, 'USD');
      importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;
    } else {
      if (this_aux.forma.get('importe').errors === null) {
        const control: FormControl = new FormControl('', Validators.required);
        this_aux.forma.setControl('importe', control );
      }
  }
}

showErrorSucces(json) {

  $('#_modal_please_wait').modal('hide');
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    $('#errorModal').modal('show');
}

}
