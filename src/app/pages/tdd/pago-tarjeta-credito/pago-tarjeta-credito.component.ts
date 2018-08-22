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

  @ViewChild("rImporte", { read: ElementRef }) rImporte: ElementRef;
  @ViewChild('rcbFiltro', { read: ElementRef}) rcbFiltro: ElementRef ;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  tipoCuentaTdd: string;
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
  numeroBanco = "0";


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

      'selectBanco': new FormControl('0', [Validators.required]),
      // tslint:disable-next-line:max-line-length
      'numTarjeta': new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{1,})$/), Validators.minLength(16), Validators.maxLength(16)]),
      'importe': new FormControl('', [Validators.required, Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)]),
      'selecTipo': new FormControl('0', Validators.required)
    });

    this._service.validarDatosSaldoTdd().then(
      mensaje => {
        const operaciones: consultaCatalogos = new consultaCatalogos();
        console.log('Saldos cargados correctamente TDD');
        this.saldoClienteTdd = mensaje.SaldoDisponible;
        this.cuentaClienteTdd = mensaje.NumeroCuenta;
        this.mostrarCuentaMascara = operaciones.mascaraNumeroCuenta(this.cuentaClienteTdd);
        this.tipoCuentaTdd = mensaje.Producto;
        this.consultaBancos();
      }
    ); 

    this.forma.controls['selectBanco'].valueChanges.subscribe(
      data => {
        console.log(data);
        this.opcionSeleccionado = data;
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
    $( ".cdk-visually-hidden" ).css( "margin-top", "15%" );      
    $( ".cdk-visually-hidden" ).css("margin-bottom", "0px !important");
    localStorage.removeItem("des");
    localStorage.removeItem("np");
    localStorage.removeItem("res");
    localStorage.removeItem("tr2");
    localStorage.removeItem("tr2_serv");
    localStorage.removeItem("np_serv");
    localStorage.removeItem("res_serv");

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
            setTimeout(function() {
              THIS
              .showErrorPromise(error);
            }, 500);
          });
          setTimeout(() => {
            $("#_modal_please_wait").modal("hide");
          }, 5000);
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

  tipoTarjeta () {
    const this_aux = this;

    if (this_aux.rcbFiltro.nativeElement.value.toString() === "311") {
      this_aux._response.nameOperacion = "Pago tarjeta de crédito Propias Banorte";
      this_aux.numeroBanco = "22";
    } else if (this_aux.rcbFiltro.nativeElement.value.toString() === "312") {
      this_aux._response.nameOperacion = "Pago tarjeta de crédito Terceros Banorte";
      this_aux.numeroBanco = "22";
    } else if (this_aux.rcbFiltro.nativeElement.value.toString() === "313") {
      this_aux._response.nameOperacion = "Pago tarjeta de crédito Otros Bancos";
      this_aux.numeroBanco = "0";
    } else if (this_aux.rcbFiltro.nativeElement.value.toString() === "314") {
      this_aux._response.nameOperacion = "Pago tarjeta de crédito American Express";
      this_aux.numeroBanco = "2";
    }

    if (this_aux.numeroBanco === "2") {
      // tslint:disable-next-line:max-line-length
      const controlTar: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{1,})$/), Validators.minLength(15), Validators.maxLength(15)]);
      this_aux.forma.setControl('numTarjeta', controlTar);
    } else {
      // tslint:disable-next-line:max-line-length
      const controlTar: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{1,})$/), Validators.minLength(16), Validators.maxLength(16)]);
      this_aux.forma.setControl('numTarjeta', controlTar);
    }
    this.forma.controls['numTarjeta'].valueChanges.subscribe(
      data => {
        this.noTarjeta = data;
      });
    
    this_aux.bancos.forEach(function(value, key)  {
      if (this_aux.numeroBanco !== "0") {
        if (value.IdBanco !== this_aux.numeroBanco) {
          value.Mostrar = '0';
        } else {
          value.Mostrar = '1';
        }
      } else {
        if (value.IdBanco === "22" || value.IdBanco === "2") {
          value.Mostrar = '0';
        } else {
          value.Mostrar = '1';
        }
      }
      
       });
       $("#tipoBanco").val("0");       
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
          document.getElementById('mnsError').innerHTML =   "Los datos proporcionados son incorrectos, favor de verificar.";
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
      opFinanciero: this_aux.rcbFiltro.nativeElement.value.toString(),
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
            }  else {
              setTimeout(function() {
                this_aux.showErrorSucces(jsonDetallePago);
              }, 500);
            }
          },
          function(error) {
            console.error("El WS respondio incorrectamente");
            // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
            setTimeout(function() {
              this_aux.showErrorPromiseMoney(error);
            }, 500);
            $('#ModalTDDLogin').modal('hide');
          });
  }

  validarSaldo(bancoRec) {
    const this_aux = this;
    let importeOpe = "";
    this_aux.selectBanco(bancoRec);
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
          setTimeout(function() {
            $("#_modal_please_wait").modal("hide");
            this_aux.showErrorSucces(DatosJSON);
          }, 500);
        }
        setTimeout(function() {
          $('#_modal_please_wait').modal('hide');
        }, 500);
        
      }, function(error) {
        setTimeout(function() {
          this_aux.showErrorPromise(error);
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
    const expre2 =  /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/;
    if (impor !== '' && impor !== '.' && impor !== '-' && expre2.test(impor)) {
      importeAux = this_aux.replaceSimbolo(impor);
        this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(importeAux, 'USD');
        importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;
    }
}

showErrorPromise(error) {
  console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('mnsError').innerHTML =   "El servicio no esta disponible, favor de intentar mas tarde";
  $('#_modal_please_wait').modal('hide');
  $('#errorModal').modal('show');
}

showErrorPromiseMoney(json) {
  console.log(json.Id + json.MensajeAUsuario);
  document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
  $('#_modal_please_wait').modal('hide');
  $('#ModalErrorTransaccion').modal('show');
}

showErrorSucces(json) {
  console.log(json.Id + json.MensajeAUsuario);
  if (json.Id === "2") {
    document.getElementById("mnsError").innerHTML =
      "El servicio no esta disponible, favor de intentar mas tarde";
  } else {
    document.getElementById("mnsError").innerHTML = json.MensajeAUsuario;
  }
  $('#_modal_please_wait').modal('hide');
  $("#errorModal").modal("show");
}

}
