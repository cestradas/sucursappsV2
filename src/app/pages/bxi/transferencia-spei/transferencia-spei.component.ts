import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';
import { Autenticacion } from '../autenticacion';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';



import $ from 'jquery';
declare var $: $;

let sic = "";
let ctaO = "";
let ctaDest = "";

let tipoCuenta = "";
let bancoRecept = "";
//let clabe = "";
let nombreBene = "";
let ref = "";

let importe = "";
let descripcion = "";
let correo = "";
let rfcEmi = "";
let aliasCta = "";
let clabeTEF_SPEI = "";

let bancoRecep = "";
let refFront = "";
let importeFront = "";
let descripcionFront = "";




@Component({
  selector: 'app-transferencia-spei',
  templateUrl: './transferencia-spei.component.html',
})
export class TransferenciaSpeiComponent implements OnInit {

  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  @ViewChild('listaCuentasBeneficiario', { read: ElementRef}) listaCuentasBeneficiario: ElementRef ;
  @ViewChild('selectTipo', { read: ElementRef}) selectTipo: ElementRef;
  @ViewChild('rImporteSPEI', { read: ElementRef}) rImporteSPEI: ElementRef ;
  @ViewChild('rImporteTEF', { read: ElementRef}) rImporteTEF: ElementRef ;
  @ViewChild('rImporteQUICK', { read: ElementRef}) rImporteQUICK: ElementRef ;

  listaCuentasUsr: Array<any> = [];
  listaCuentasBen: Array<any> = [];
  listaDatosBen: Array<any> = [];
  datosCuenta: any[] = [];
  transferSPEI: any[] = [];

  labelTipoAutentica: string;
  CuentaDestino: string;
  CuentaDestinoM: string;


  cuentaOrigenModal = "";
  correoBeneModal = "";
  nombreBeneModal = "";

  forma: FormGroup;

  importeAuxSPEI: string;
  importeAuxTEF: string;
  importeAuxQUICK: string;

  importeF = "";
  descripcionF = "";
  refF = "";

  rfcEmiF = "";

  tipoCuentaF = "";
  bancoReceptF =  "";
  clabeF = "";

  bancoRecep: any = "";
  nombreSele: any = "";
  nombreBanco: any = "";

  listaBancos: any;

  NumeroSeguridad: string;
  SaldoOrigen: number;

  nombreCuenta: string;
  numeroTarjeta: string;

  amountSPEI = "";
  cuenta = "";

  fcTokenSp = "";
  fcTokenTef = "";
  fcTokenQuick = "";


  constructor(private _http: Http, private router: Router, public service: SesionBxiService, private renderer: Renderer2, private currencyPipe: CurrencyPipe) {

    const this_aux = this;

    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

    this.forma = new FormGroup({

      // SPEI
      'amountSPEI': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000), Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)]),
      'descriptionSPEI': new FormControl('', [Validators.required, Validators.maxLength(60)]),
      'referenceSPEI': new FormControl('', [Validators.required, Validators.maxLength(7)]),

      // TEF

      'amountTEF': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000), Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)]),
      'descriptionTEF': new FormControl('', [Validators.required, Validators.maxLength(60)]),
      'referenceTEF': new FormControl('', [Validators.required, Validators.maxLength(7)]),

      // Quick


      'cuenta': new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)]),
      'sel1': new FormControl('', [Validators.required]),
      //'clabe': new FormControl('', [Validators.required, Validators.maxLength(16)]),
      'ammountQUICK': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000), Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)]),
      'referenceQuick': new FormControl('', [Validators.required, Validators.maxLength(7)]),

      'fcTokenSp': new FormControl(),
      'fcTokenTef': new FormControl(),
      'fcTokenQuick': new FormControl()

    });



    console.log(this.forma);

    this.forma.controls['amountSPEI'].valueChanges.subscribe(
      data => {
        console.log('amountSPEI', data);
        console.log('forma', this.forma);

        this_aux.importeF = data;
        this_aux.desabilitaBtn();
      });

      this.forma.controls['descriptionSPEI'].valueChanges.subscribe(
        data => {
          console.log('descriptionSPEI', data);
          console.log('forma', this.forma);

          this_aux.descripcionF = data;
          this_aux.desabilitaBtn();
        });

        this.forma.controls['referenceSPEI'].valueChanges.subscribe(
          data => {
            console.log('referenceSPEI', data);
            console.log('forma', this.forma);

            this_aux.refF = data;
            this_aux.desabilitaBtn();
          });

            this.forma.controls['amountTEF'].valueChanges.subscribe(
              data => {
                console.log('amountTEF', data);
                console.log('forma', this.forma);

                this_aux.importeF = data;
                this_aux.desabilitaBtn();
              });

              this.forma.controls['descriptionTEF'].valueChanges.subscribe(
                data => {
                  console.log('descriptionTEF', data);
                  console.log('forma', this.forma);

                  this_aux.descripcionF = data;
                  this_aux.desabilitaBtn();
                });

                this.forma.controls['referenceTEF'].valueChanges.subscribe(
                  data => {
                    console.log('referenceTEF', data);
                    console.log('forma', this.forma);

                    this_aux.refF = data;
                    this_aux.desabilitaBtn();
                  });

                  this.forma.controls['cuenta'].valueChanges.subscribe(
                    data => {
                      console.log('cuenta', data);
                      console.log('forma', this.forma);

                      this_aux.tipoCuentaF = data;
                      this_aux.desabilitaBtn();
                    });

                    this.forma.controls['sel1'].valueChanges.subscribe(
                      data => {
                        console.log('sel1', data);
                        console.log('forma', this.forma);

                        this_aux.bancoReceptF = data;
                        this_aux.desabilitaBtn();
                      });

                      /*
                      this.forma.controls['clabe'].valueChanges.subscribe(
                        data => {
                          console.log('clabe', data);
                          console.log('forma', this.forma);

                          this_aux.clabeF = data;
                        });
                      */
                        this.forma.controls['ammountQUICK'].valueChanges.subscribe(
                          data => {
                            console.log('ammountQUICK', data);
                            console.log('forma', this.forma);

                            this_aux.importeF = data;
                            this_aux.desabilitaBtn();
                          });

                          this.forma.controls['referenceQuick'].valueChanges.subscribe(
                            data => {
                              console.log('referenceQuick', data);
                              console.log('forma', this.forma);

                              this_aux.refF = data;
                              this_aux.desabilitaBtn();
                            });

                            this.forma.controls['fcTokenSp'].valueChanges.subscribe(
                              data2 => {
                                console.log('fcTokenSp', data2);
                                console.log('forma', this.forma);

                                this_aux.fcTokenSp = data2;
                                if (this_aux.fcTokenSp !== " ") {

                                    $('#ValToken').prop("disabled", false);
                                }
                              });

                              this.forma.controls['fcTokenTef'].valueChanges.subscribe(
                                data2 => {
                                  console.log('fcTokenTef', data2);
                                  console.log('forma', this.forma);

                                  this_aux.fcTokenTef = data2;
                                  if (this_aux.fcTokenTef !== " ") {

                                      $('#confirmarP').prop("disabled", false);
                                  }
                                });

                                this.forma.controls['fcTokenQuick'].valueChanges.subscribe(
                                  data2 => {
                                    console.log('fcTokenQuick', data2);
                                    console.log('forma', this.forma);

                                    this_aux.fcTokenQuick = data2;
                                    if (this_aux.fcTokenQuick !== " ") {

                                        $('#confirmarP2').prop("disabled", false);
                                    }
                                  });


  }

  ngOnInit() {


      this.resetLista();
      //ESTILOS Preferente
      let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
      let btnContinuar = document.getElementById("continuarspei");
      let btnConfirmar = document.getElementById("ValToken");
      let btnContinuarP = document.getElementById("confirmarP");
      let btnContinuarP2 = document.getElementById("confirmarP2");
      let btnCerrar = document.getElementById("cerrar");

      if (storageTipoClienteBEL === "true") {

        btnContinuar.classList.remove("color-botones");
        btnContinuar.classList.add("color-botones_Preferente");
        btnConfirmar.classList.remove("color-botones");
        btnConfirmar.classList.add("color-botones_Preferente");
        btnContinuarP.classList.remove("color-botones");
        btnContinuarP.classList.add("color-botones_Preferente");
        btnContinuarP2.classList.remove("color-botones");
        btnContinuarP2.classList.add("color-botones_Preferente");
        btnCerrar.classList.remove("color-botones");
        btnCerrar.classList.add("color-botones_Preferente");
      }

    this.fillSelectCuentas();
    // this.consultaCuentas();
    this.fillCuentasBeneficiario();

  }

  selecionaTransfer() {
    const this_aux = this;
    const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());

    switch (operacionSelect) {


      case '1':  // SPEI

      setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

            document.getElementById('tranTEF').style.display = 'none';
            document.getElementById('tranQuick').style.display = 'none';

            document.getElementById('tranSPEI').style.display = 'block';

            document.getElementById('beneficiarios').style.display = '';


            break;
      case '2':  // TEF

      setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

            document.getElementById('tranSPEI').style.display = 'none';
            document.getElementById('tranQuick').style.display = 'none';

            document.getElementById('tranTEF').style.display = 'block';

            document.getElementById('beneficiarios').style.display = '';

            break;
      case '3':  // QUICK

      setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);



            document.getElementById('tranTEF').style.display = 'none';
            document.getElementById('tranSPEI').style.display = 'none';

            document.getElementById('tranQuick').style.display = 'block';

            document.getElementById('beneficiarios').style.display = '';
            break;


          }
  }

  showDetallePago() {
    const this_aux = this;

    $('#inputTokenSPEI').val('');
    $('#inputTokenTEF').val('');
    $('#inputTokenQUICK').val('');

    console.log("adentro Trnsferencias Internacionales");

    const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());

    switch (operacionSelect) {

      case '1':  // SPEI

      importe = this_aux.importeF;
      descripcion = this_aux.descripcionF;
      ref = this_aux.refF;

            break;

      case '2':  // TEF


      rfcEmi = this_aux.rfcEmiF;
      importe = this_aux.importeF;
      descripcion = this_aux.descripcionF;
      ref = this_aux.refF;


            break;
      case '3':  // QUICK

      tipoCuenta = this_aux.tipoCuentaF;
      bancoRecept =  this_aux.bancoReceptF;
      //clabe = this_aux.clabeF;
      importe = this_aux.importeF;
      ref = this_aux.refF;



            break;


          }



      this_aux.setTipoAutenticacionOnModal();
  }

  setTipoAutenticacionOnModal() {
    const this_aux = this;
    const operacion = this_aux.selectTipo.nativeElement.value.toString();
    const divMjeTipoAutentica = document.getElementById('mensajeTipoAutentica');
    const control: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{6})$/)]);
    this_aux.forma.setControl('fcTokenSp', control );
    const control1: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{6})$/)]);
    this_aux.forma.setControl('fcTokenTef', control1 );
    const control2: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{6})$/)]);
    this_aux.forma.setControl('fcTokenQuick', control2 );

    let mensajeError;
    const divChallengeSPEI = document.getElementById('challengerSPEI');
    const divTokenPassSPEI = document.getElementById('divPassSPEI');
    const divChallengeTEF = document.getElementById('challengerTEF');
    const divTokenPassTEF = document.getElementById('divPassTEF');
    const divChallengeQUICK = document.getElementById('challengerQUICK');
    const divTokenPassQUICK = document.getElementById('divPassQUICK');


    if (this_aux.service.metodoAutenticaMayor.toString() === '5') {
      $('#_modal_please_wait').modal('show');
      this_aux.labelTipoAutentica = 'Token Celular';
      divMjeTipoAutentica.setAttribute('style', 'display: flex');
       if (operacion === "1") {
        divTokenPassSPEI.setAttribute('style', 'display: flex');
        this_aux.forma.setControl('fcTokenSp', control );
        $( ".cdk-visually-hidden" ).css( "margin-top", "19%" );
       } else if (operacion === "2") {
        divTokenPassTEF.setAttribute('style', 'display: flex');
        $( ".cdk-visually-hidden" ).css( "margin-top", "19%" );
        this_aux.forma.setControl('fcTokenTef', control1 );
       } else if (operacion === "3") {
        divTokenPassQUICK.setAttribute('style', 'display: flex');
        $( ".cdk-visually-hidden" ).css( "margin-top", "19%" );
        this_aux.forma.setControl('fcTokenQuick', control2 );
       }

      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      operacionesbxi.preparaAutenticacion().then(
        function(response) {
          const detallePrepara = response.responseJSON;
          console.log(detallePrepara);
          if (detallePrepara.Id === 'SEG0001') {

            if (operacion === "1") {
              divChallengeSPEI.setAttribute('style', 'display: flex');
             } else if (operacion === "2") {
              divChallengeTEF.setAttribute('style', 'display: flex');
             } else if (operacion === "3") {
              divChallengeQUICK.setAttribute('style', 'display: flex');
             }


            this_aux.NumeroSeguridad = detallePrepara.MensajeUsuarioUno;
            setTimeout(() => {
              $('#_modal_please_wait').modal('hide');
           }, 500);

          } else {
            setTimeout(function() {
              $('#_modal_please_wait').modal('hide');
              console.log(detallePrepara.Id + detallePrepara.MensajeAUsuario);
              mensajeError = this_aux.controlarError(detallePrepara);
              document.getElementById('mnsError').innerHTML =  mensajeError;
              $('#errorModal').modal('show');
            }, 500);
          }
        }, function(error) {

          setTimeout(() => {
            $('#_modal_please_wait').modal('hide');
            this_aux.showErrorPromise(error);
         }, 500);

        });

  } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {

      divMjeTipoAutentica.setAttribute('style', 'display: flex');
      if (operacion === "1") {
        divChallengeSPEI.setAttribute('style', 'display: none');
        divTokenPassSPEI.setAttribute('style', 'display: flex');
       } else if (operacion === "2") {
        divChallengeTEF.setAttribute('style', 'display: none');
        divTokenPassTEF.setAttribute('style', 'display: flex');
       } else if (operacion === "3") {
        divChallengeQUICK.setAttribute('style', 'display: none');
        divTokenPassQUICK.setAttribute('style', 'display: flex');
       }

      this_aux.labelTipoAutentica = 'Contrase&atilde;a';
    } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {

      divMjeTipoAutentica.setAttribute('style', 'display: flex');
      if (operacion === "1") {
        divChallengeSPEI.setAttribute('style', 'display: none');
        divTokenPassSPEI.setAttribute('style', 'display: flex');
       } else if (operacion === "2") {
        divChallengeTEF.setAttribute('style', 'display: none');
        divTokenPassTEF.setAttribute('style', 'display: flex');
       } else if (operacion === "3") {
        divChallengeQUICK.setAttribute('style', 'display: none');
        divTokenPassQUICK.setAttribute('style', 'display: flex');
       }

      this_aux.labelTipoAutentica = 'Token Físico';
    }
 setTimeout(function() {
     $( ".cdk-visually-hidden" ).css( "margin-top", "16%" );
    $('#confirmModal').modal('show');
 }, 500);


    this.validaDatosBen();


    const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());
    let tipoOperecionPago = "";

    switch (operacionSelect) {

      case '1':  // SPEI


            setTimeout(function() {

              this_aux.validarSaldo("1");
              //$('#confirmModalSPEI').modal('show');
            }, 500);

            break;

      case '2':  // TEF


            setTimeout(function() {

              this_aux.validarSaldo("2");
              //$('#confirmModalTEF').modal('show');
            }, 500);

            break;
      case '3':  // QUICK

            setTimeout(function() {

              this_aux.validarSaldo("3");
              //$('#confirmModalQUICK').modal('show');
            }, 500);

            break;
          }

}


validarSaldo(tipoOperecionPago) {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    let importeOpe = this_aux.importeF;
    importeOpe.replace(',', "");
    operacionesbxi.consultaTablaYValidaSaldo(this_aux.service.numCuentaSPEISel, importeOpe).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        console.log(response.responseText);
        if (DatosJSON.Id === "1") {

          console.log("Pago validado");
          if (tipoOperecionPago === "1") {          // SPEI
            $( ".cdk-visually-hidden" ).css( "margin-top", "14%" );
            $('#confirmModalSPEI').modal('show');
          } else if (tipoOperecionPago === "2") {   //TEF
            $( ".cdk-visually-hidden" ).css( "margin-top", "14%" );
            $('#confirmModalTEF').modal('show');
          } else if (tipoOperecionPago === "3") {   //QUICK
            $( ".cdk-visually-hidden" ).css( "margin-top", "14%" );
            $('#confirmModalQUICK').modal('show');
          }

        } else if ( DatosJSON.Id === "4" ) {
          $('#modalLimiteDiario').modal('show');
        } else if ( DatosJSON.Id === "5" ) {
          $('#modalLimiteMensual').modal('show');
        } else {
          $('#modalErrorMessage').modal('show');
        }
        $('#_modal_please_wait').modal('hide');
      }, function(error) {
       $('#_modal_please_wait').modal('hide');
  });
  }

  fillSelectCuentas() {
    const this_aux = this;
    const cuentasString = this_aux.service.infoCuentas;
    console.log(this_aux.service.infoCuentas);
    const consultaCuentas = JSON.parse(cuentasString);
    const cuentasArray = consultaCuentas.ArrayCuentas;
      cuentasArray.forEach(cuenta => {

        this_aux.filtraCtaVista(cuenta);

    });

}

filtraCtaVista(cuenta) {
  const this_aux = this;
  if ((cuenta.TipoCuenta === 1  && cuenta.NoCuenta.length === 10)  || (cuenta.TipoCuenta === 4  && cuenta.NoCuenta.length === 10) ) {
    this_aux.crearListaCuentas(cuenta);
  }
}

crearListaCuentas(cuenta) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  const li =  this.renderer.createElement('li');
  this_aux.renderer.addClass(li, 'text-li');
  const a = this.renderer.createElement('a');
  const textoCuenta = this.renderer.createText( cuenta.Alias + ' ' + operacionesbxi.mascaraNumeroCuenta(cuenta.NoCuenta) );
  this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
  this.renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target);
    this_aux.numeroTarjeta = cuenta.Plastico;
    this_aux.nombreCuenta = cuenta.Alias;
     });
  this.renderer.appendChild(a, textoCuenta),
  this.renderer.appendChild(li, a);
  this.renderer.appendChild(this_aux.listaCuentas.nativeElement, li);
}

setDatosCuentaSeleccionada(elementHTML) {

  $('#_modal_please_wait').modal('show');
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  console.log(elementHTML);
  const tableOrigen = document.getElementById('tableOrigen');
  const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
  const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
  const lblAliasOrigen = document.getElementById('lblAliasOrigen');
  const numCuenta_seleccionada = elementHTML.value;
  const AliasCuenta_seleccionada = elementHTML.text;

  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');

  //lblAliasOrigen.innerHTML = elementHTML.textContent;
  //lblAliasOrigen.innerHTML = AliasCuenta_seleccionada.toString();
  lblCuentaOrigen.innerHTML = operacionesbxi.mascaraNumeroCuenta(numCuenta_seleccionada.toString());
  this_aux.service.numCuentaSPEISel = numCuenta_seleccionada;
  this_aux.service.AliasCuentaSPEISel = AliasCuenta_seleccionada;
  this_aux.cuentaOrigenModal = operacionesbxi.mascaraNumeroCuenta(this_aux.service.numCuentaSPEISel);



  this_aux.getSaldoDeCuenta(numCuenta_seleccionada);



}

getSaldoDeCuenta(numCuenta_seleccionada) {

  console.log(numCuenta_seleccionada.length);
  if (numCuenta_seleccionada.length === 16) {
       this.getSaldoTDC(numCuenta_seleccionada);
  } else {
      this.getSaldoTDDOtras(numCuenta_seleccionada);
  }
}


getSaldoTDDOtras(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuenta_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {
          this_aux.service.clabeDestinatario = detalleSaldos.ClabeCuenta;
         setTimeout(function() {
          //const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          //lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;

          this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
            $('#_modal_please_wait').modal('hide');
          }, 500);
        } else {
          this_aux.service.clabeDestinatario = null;
         this_aux.SaldoOrigen = 0;
         setTimeout(function() {
         $('#_modal_please_wait').modal('hide');
           this_aux.showErrorSucces(detalleSaldos);
         }, 500);
        }
      }, function(error) {

      this_aux.SaldoOrigen = 0;
       setTimeout(function() {
         $('#_modal_please_wait').modal('hide');
           this_aux.showErrorPromise(error);
       }, 500);
  });
 }

 getSaldoTDC(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldoTDC(numCuenta_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {

          this_aux.service.clabeDestinatario = detalleSaldos.ClabeCuenta;
         setTimeout(function() {
          //const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          //lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
           this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
            $('#_modal_please_wait').modal('hide');
          }, 500);
        } else {
         this_aux.service.clabeDestinatario = null;
         this_aux.SaldoOrigen = 0;
         setTimeout(function() {
         $('#_modal_please_wait').modal('hide');
           this_aux.showErrorSucces(detalleSaldos);
         }, 500);
        }
      }, function(error) {

      this_aux.SaldoOrigen = 0;
       setTimeout(function() {
         $('#_modal_please_wait').modal('hide');
           this_aux.showErrorPromise(error);
       }, 500);
  });
 }


fillCuentasBeneficiario () {

  const this_aux = this;
  let cuenta;
  let datosB;
  let beneficiario;
  const cuentasUsuario = this_aux.service.infoCuentas;
  const jsoncuentasUsuario = JSON.parse(cuentasUsuario); // JSON CON CUENTAS PROPIAS
  const arrayCuentasXBeneficiario = JSON.parse(this_aux.service.infoCuentasBeneficiarios); // JSON CON CUENTAS DE BENEFICIARIOS
  const datosBeneficiarios = JSON.parse(this_aux.service.infoDatosDeBeneficiarios); // Json con datos de usuario Correo, nombre y num
  const cuentasArray = jsoncuentasUsuario.ArrayCuentas;

  cuentasArray.forEach(ArrayCuentas => {

      // if (ArrayCuentas.TipoCuenta.toString() === '5') {
        this_aux.listaCuentasUsr.push(ArrayCuentas);
      //  this_aux.crearListaBeneficiarios(cuentaUsuario);
      // }

    });
  arrayCuentasXBeneficiario.forEach(Cuenta => {
    cuenta = Cuenta.Cuenta;
      if (cuenta !== undefined) {

        cuenta.forEach(data => {

          this_aux.listaCuentasBen.push(data);

        });

      }

  });

  datosBeneficiarios.forEach(element1 => {
    datosB = element1;
   // datosB.forEach(data => {

          this_aux.listaDatosBen.push(element1);



    //    });
  });



  $('#_modal_please_wait').modal('hide');
  console.log(this_aux.listaCuentasBen);
  console.log(this_aux.listaDatosBen);
  console.log(this_aux.listaCuentasUsr);
  this_aux.defineFiltros();
}

crearListaBeneficiarios(data) {

  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  const li =  this.renderer.createElement('li');
  this_aux.renderer.addClass(li, 'text-li');
  const a = this.renderer.createElement('a');
  //const textoCuenta = this.renderer.createText( data.Alias);
  const textoCuenta = this.renderer.createText( data.Alias );
  this.renderer.setProperty(a, 'value', data.NoCuenta);
  this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target); });
  this.renderer.appendChild(a, textoCuenta),
  this.renderer.appendChild(li, a);
  this.renderer.appendChild(this_aux.listaCuentasBeneficiario.nativeElement, li);

}

setDatosCuentaBeneficiario(elementHTML) {

  const operacionesbxi: OperacionesBXI = new OperacionesBXI();

  const this_aux = this;
  console.log(elementHTML);
  const tableBeneficiarios = document.getElementById('tableBeneficiarios');
  const tableDefaultBeneficiarios = document.getElementById('tableDefaultBeneficiarios');
  const lblCuentaDestino = document.getElementById('lblCuentaDestino');
  const lbDescripcionCtaBen = document.getElementById('lbDescripcionCtaBen');
  const valueElement = elementHTML.value;

  tableBeneficiarios.setAttribute('style', 'display: flex');
  tableDefaultBeneficiarios.setAttribute('style', 'display: none');
  lbDescripcionCtaBen.innerHTML = elementHTML.textContent;
  lblCuentaDestino.innerHTML = this_aux.getNumeroCuentaDestino(valueElement);
  this_aux.CuentaDestino = this_aux.getNumeroCuentaDestino(valueElement);

  this_aux.service.numCuentaDestinario = this_aux.CuentaDestino;
  this_aux.service.claveBancoDestino = this_aux.getNameInstitucion(valueElement);
  this_aux.service.claveAliasCuenta = this_aux.getNameAliasCuenta(valueElement);
  this_aux.service.claveNumBenefi = this_aux.getNumBeneficiario(valueElement);

  //this_aux.consultaClabeSaldos(this_aux.service.numCuentaDestinario);

  if (this_aux.selectTipo.nativeElement.value.toString() === "1") {  // SPEI

    $('#amountSPEI').prop("disabled", false);
    $('#descriptionSPEI').prop("disabled", false);
    $('#referenceSPEI').prop("disabled", false);

  }

  if (this_aux.selectTipo.nativeElement.value.toString() === "2") { // TEF

    $('#amountTEF').prop("disabled", false);
    $('#descriptionTEF').prop("disabled", false);
    $('#referenceTEF').prop("disabled", false);

  }



  if (this_aux.selectTipo.nativeElement.value.toString() === "3") {  // Quick

    $('#cuenta').prop("disabled", false);
    $('#selecBanco').prop("disabled", false);
    $('#ammountQUICK').prop("disabled", false);
    $('#referenceQuick').prop("disabled", false);

  }


  console.log(this_aux.service.claveBancoDestino+this_aux.service.claveAliasCuenta+this_aux.service.claveNumBenefi);

}

getNumeroCuentaDestino(text) {
  const  separador = ',';
  const  arregloDeSubCadenas = text.split(separador);
  const numCuentaDestino = arregloDeSubCadenas[0];
  console.log(arregloDeSubCadenas);
  console.log(numCuentaDestino);

  return numCuentaDestino;
}

getNameInstitucion(text) {
  const  separador = ',';
  const  arregloDeSubCadenas = text.split(separador);
  const nameInstitucion = arregloDeSubCadenas[1];
  console.log(arregloDeSubCadenas);
  console.log(nameInstitucion);

  return nameInstitucion;
}

getNameAliasCuenta(text) {
  const  separador = ',';
  const  arregloDeSubCadenas = text.split(separador);
  const nameAliasCuenta = arregloDeSubCadenas[2];
  console.log(arregloDeSubCadenas);
  console.log(nameAliasCuenta);

  return nameAliasCuenta;
}

getNumBeneficiario(text) {
  const  separador = ',';
  const  arregloDeSubCadenas = text.split(separador);
  const numBeneCta = arregloDeSubCadenas[3];
  console.log(arregloDeSubCadenas);
  console.log(numBeneCta);

  return numBeneCta;
}

defineFiltros() {

  const this_aux = this;
  this_aux.listaCuentasBen.forEach(cuenta => {
/*
    if (cuenta.TipoCuenta.toString() === '9') {
      this_aux.existenTerceros = true;
    }
    if (cuenta.TipoCuenta.toString() === '5') {
      this_aux.existenPropias = true;
    }
    if (cuenta.TipoCuenta.toString() === '2' && cuenta.ClaveBanco.toString() === '40103' ) {
      this.existenAMEX = true;
    }
    if (cuenta.TipoCuenta.toString() === '2' && cuenta.ClaveBanco.toString() !== '40103') {
      this.existenExternas = true;
    }

    if ( data.AplicaTEF === 'true' ) {
            this_aux.listaCuentasBenTEF.push(data);
            this_aux.crearListaBeneficiarios(data);
          }

          if ( data.AplicaSPEI === 'true' ) {
            this_aux.listaCuentasBenSPEI.push(data);
            this_aux.crearListaBeneficiarios(data);
          }
*/
  });

}

setCuentasBenficiarioXTipo() {
  $('#_modal_please_wait').modal('show');
  $( ".cdk-visually-hidden" ).css( "margin-top", "14%" );
  const this_aux = this;
  const tableBeneficiarios = document.getElementById('tableBeneficiarios');
    const tableDefaultBeneficiarios = document.getElementById('tableDefaultBeneficiarios');
    const lblCuentaDestino = document.getElementById('lblCuentaDestino');
    const lbDescripcionCtaBen = document.getElementById('lbDescripcionCtaBen');
    this_aux.resetLista();
    lblCuentaDestino.innerHTML = "";
    lbDescripcionCtaBen.innerHTML = "";
    tableBeneficiarios.setAttribute('style', 'display: none;');
    tableDefaultBeneficiarios.setAttribute('style', 'display: block;height: 68px !important;');
    tableDefaultBeneficiarios.removeAttribute('style');
    tableDefaultBeneficiarios.setAttribute('style', 'height: 68px !important;');

  console.log('setCuentasBenficiarioXTipo');
  console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());
  const node = document.getElementById("ul_CuentasBen");
  console.log(node);
  while (node.firstChild) {
    node.removeChild(node.firstChild);
   }

  this_aux.listaCuentasBen.forEach(auxcuenta => {


    if (this_aux.selectTipo.nativeElement.value.toString() === "1") {  // SPEI

      this_aux.bloqueaBtn();

      $( ".cdk-visually-hidden" ).css( "margin-top", "10%" );

      setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

      const desactivaCtaOri = document.getElementById("dropdownMenu1");
      desactivaCtaOri.removeAttribute("disabled");
      const desactivaCtaDest = document.getElementById("dropdownMenu2");
      desactivaCtaDest.removeAttribute("disabled");
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();


      document.getElementById('tranTEF').style.display = 'none';
      document.getElementById('tranQuick').style.display = 'none';
      document.getElementById('beneficiarios').style.display = 'block';

      document.getElementById('tranSPEI').style.display = 'block';

      document.getElementById('beneficiarios').style.display = '';

      if (auxcuenta.AplicaSPEI.toString() === "true") {

        if ( ((auxcuenta.TipoCuenta.toString() === "1") && (auxcuenta.ClaveBanco.toString() !== "40072") ) || ((auxcuenta.TipoCuenta.toString() === "4") && (auxcuenta.ClaveBanco.toString() !== "40072") )) {

        const li =  this.renderer.createElement('li');
        this_aux.renderer.addClass(li, 'text-li');
        const a = this.renderer.createElement('a');

        const textoCuenta = this.renderer.createText( auxcuenta.Alias + ' ' + operacionesbxi.mascaraNumeroCuenta(auxcuenta.NoCuenta));
        this.renderer.setProperty(a, 'value', auxcuenta.NoCuenta + ','
                                            + auxcuenta.ClaveBanco + ','
                                            + auxcuenta.DescripcionTipoCuenta + ','
                                            + auxcuenta.NumBenef );
        this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target); });
        this.renderer.appendChild(a, textoCuenta),
        this.renderer.appendChild(li, a);
        this.renderer.appendChild(this_aux.listaCuentasBeneficiario.nativeElement, li);

        }


       }

    }

    if (this_aux.selectTipo.nativeElement.value.toString() === "2") { // TEF

      this_aux.bloqueaBtn();

      $( ".cdk-visually-hidden" ).css( "margin-top", "10%" );

      const desactivaCtaOri = document.getElementById("dropdownMenu1");
      desactivaCtaOri.removeAttribute("disabled");
      const desactivaCtaDest = document.getElementById("dropdownMenu2");
      desactivaCtaDest.removeAttribute("disabled");
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();

      setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

      document.getElementById('tranSPEI').style.display = 'none';
      document.getElementById('tranQuick').style.display = 'none';
      document.getElementById('beneficiarios').style.display = 'block';

      document.getElementById('tranTEF').style.display = 'block';

      document.getElementById('beneficiarios').style.display = '';

      if (auxcuenta.AplicaTEF.toString() === "true") {

        if ((auxcuenta.TipoCuenta.toString() === "1") || (auxcuenta.TipoCuenta.toString() === "4") ) {

          const li =  this.renderer.createElement('li');
          this_aux.renderer.addClass(li, 'text-li');
          const a = this.renderer.createElement('a');
          const textoCuenta = this.renderer.createText( auxcuenta.Alias  + ' ' + operacionesbxi.mascaraNumeroCuenta(auxcuenta.NoCuenta));
          this.renderer.setProperty(a, 'value',
                                              + auxcuenta.NoCuenta + ','
                                              + auxcuenta.IdSecovan + ','
                                              + auxcuenta.DescripcionTipoCuenta + ','
                                              + auxcuenta.NumBenef );
          this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target); });
          this.renderer.appendChild(a, textoCuenta),
          this.renderer.appendChild(li, a);
          this.renderer.appendChild(this_aux.listaCuentasBeneficiario.nativeElement, li);

         }


       }

    }



    if (this_aux.selectTipo.nativeElement.value.toString() === "3") {  // Quick

      //this_aux.bloqueaBtn();

      $( ".cdk-visually-hidden" ).css( "margin-top", "10%" );

      const desactivaCtaOri = document.getElementById("dropdownMenu1");
      desactivaCtaOri.removeAttribute("disabled");
      const desactivaCtaDest = document.getElementById("dropdownMenu2");
      desactivaCtaDest.setAttribute('disabled','true');

      setTimeout(() => $('#_modal_please_wait').modal('hide'), 5000);

       // Consulta bancos
       this_aux.consultaTablaCorpBancosService();

      document.getElementById('tranTEF').style.display = 'none';
      document.getElementById('tranSPEI').style.display = 'none';
      document.getElementById('beneficiarios').style.display = 'none';

      document.getElementById('tranQuick').style.display = 'block';

      // document.getElementById('beneficiarios').style.display = '';


    }


 });

}

resetLista() {
  const node = document.getElementById("ul_CuentasBen");
  console.log(node);
  while (node.firstChild) {
    node.removeChild(node.firstChild);
   }
}

desabilitaBtn() {

  const this_aux = this;
  let importeTranSPEI = $('#amountSPEI').val();
  let conceptoTranSPEI = $('#descriptionSPEI').val();
  let referenciaTranSPEI = $('#referenceSPEI').val();
  let importeTranTEF = $('#amountTEF').val();
  let conceptoTranTEF = $('#descriptionTEF').val();
  let referenciaTranTEF = $('#referenceTEF').val();
  let ctaTranQUICK = $('#cuenta').val();
  let bancoTranQUICK = $('#selecBanco').val();
  let importeTranQUICK = $('#ammountQUICK').val();
  let referenciaTranQUICK = $('#referenceQuick').val();

  let expreg = new RegExp("/^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/");

  if (this_aux.selectTipo.nativeElement.value.toString() === "1") {  // SPEI

    if ((this_aux.replaceSimbolo(importeTranSPEI) !== "") && (conceptoTranSPEI !== "") && (referenciaTranSPEI !== "")) {

      $('#continuarspei').prop("disabled", false); //false desbloquea
    } else {
      $('#continuarspei').prop("disabled", true);
    }

  }

  if (this_aux.selectTipo.nativeElement.value.toString() === "2") { // TEF

    if ((this_aux.replaceSimbolo(importeTranTEF) !== "") && (conceptoTranTEF !== "") && (referenciaTranTEF !== "")) {

      $('#continuarspei').prop("disabled", false); //false desbloquea
    } else {
      $('#continuarspei').prop("disabled", true);
    }

  }

  if (this_aux.selectTipo.nativeElement.value.toString() === "3") {  // Quick

    if ((this_aux.replaceSimbolo(importeTranQUICK) !== "") && (ctaTranQUICK !== "") && (bancoTranQUICK !== "") && (referenciaTranQUICK !== "")) {

      $('#continuarspei').prop("disabled", false); //false desbloquea
    } else {
      $('#continuarspei').prop("disabled", true);
    }

  }


}

bloqueaBtn() {

  const this_aux = this;
  let importeTranSPEI = $('#amountSPEI').val();
  let conceptoTranSPEI = $('#descriptionSPEI').val();
  let referenciaTranSPEI = $('#referenceSPEI').val();
  let importeTranTEF = $('#amountTEF').val();
  let conceptoTranTEF = $('#descriptionTEF').val();
  let referenciaTranTEF = $('#referenceTEF').val();
  let ctaTranQUICK = $('#cuenta').val();
  let bancoTranQUICK = $('#selecBanco').val();
  let importeTranQUICK = $('#ammountQUICK').val();
  let referenciaTranQUICK = $('#referenceQuick').val();

  if (this_aux.selectTipo.nativeElement.value.toString() === "1") {  // SPEI

    $('#amountSPEI').prop("disabled", true);
    $('#descriptionSPEI').prop("disabled", true);
    $('#referenceSPEI').prop("disabled", true);

  }

  if (this_aux.selectTipo.nativeElement.value.toString() === "2") { // TEF

    $('#amountTEF').prop("disabled", true);
    $('#descriptionTEF').prop("disabled", true);
    $('#referenceTEF').prop("disabled", true);

  }

  if (this_aux.selectTipo.nativeElement.value.toString() === "3") {  // Quick

    $('#cuenta').prop("disabled", true);
    $('#selecBanco').prop("disabled", true);
    $('#ammountQUICK').prop("disabled", true);
    $('#referenceQuick').prop("disabled", true);

  }


}


consultaClabeSaldos(numCuentaDestinario_seleccionada) {
  const this_aux =  this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuentaDestinario_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {

          //this_aux.service.clabeDestinatario = detalleSaldos.ClabeCuenta;

          $('#amountSPEI').prop("disabled", false);
          $('#descriptionSPEI').prop("disabled", false);
          $('#referenceSPEI').prop("disabled", false);

        } else {
          console.log(detalleSaldos.MensajeAUsuario);

          document.getElementById('errorMensaje').innerHTML = detalleSaldos.MensajeAUsuario;
          $('#modalErrorMessage').modal('show');

          //this_aux.service.clabeDestinatario = null;
          // Mostrar modal de error

          // Bloquear campos


          $('#amountSPEI').prop("disabled", true);
          $('#descriptionSPEI').prop("disabled", true);
          $('#referenceSPEI').prop("disabled", true);


        }
      }, function(error) {
  });
}

validaDatosBen() {

  const this_aux =  this;



  this_aux.listaCuentasBen.forEach(cuenta => {

    this_aux.listaDatosBen.forEach(Beneficiarios => {

      if (cuenta.NumBenef === Beneficiarios.NumBenef) {

        this_aux.service.correoBeneficiario = Beneficiarios.CorreoElecBenef;
        this_aux.correoBeneModal = this_aux.service.correoBeneficiario ;
        this_aux.service.nombreBeneficiario = Beneficiarios.NombreSinFormato;
        this_aux.nombreBeneModal = this_aux.service.nombreBeneficiario;

      }
    });



      });
}



  confirmarPago(token, tokenTef, tokenQuick) {


    $('#_modal_please_wait').modal('hide');
    const this_aux = this;
    let mensajeError;
    // this.validaDatosBen();

    ctaO = this_aux.service.numCuentaSPEISel;
    ctaDest = this_aux.service.numCuentaDestinario;
    sic = this_aux.service.infoUsuarioSIC;
    if (this_aux.service.claveBancoDestino !== undefined) {
      bancoRecep = this_aux.replaceSpaces(this_aux.service.claveBancoDestino);
    }
    aliasCta = this_aux.service.claveAliasCuenta;
    if (this_aux.service.clabeDestinatario !== undefined) {
      clabeTEF_SPEI = this_aux.replaceSpaces(this_aux.service.clabeDestinatario);
    }



    /*
    if (clabe === null || clabe === "" || clabe === undefined) {
      clabe = "014180570107939481";
    } else {
      clabe = this_aux.service.clabeDestinatario;
    }
    */
    // this_aux.service.clabeDestinatario


    // nombreBene
    nombreBene = this_aux.service.nombreBeneficiario;
    // correo
    // correo = "miguel.garcia_softtek@banorte.com";
    correo = this_aux.service.correoBeneficiario;
    // rfcEmi
    rfcEmi = "xxxx111111xxx";



    refFront = ref;
    importeFront = importe;
    descripcionFront = descripcion;

    const autenticacion: Autenticacion = new Autenticacion();
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();


    const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());

    switch (operacionSelect) {


      case '1':  // SPEI

      //this_aux.consultaTablaCorpBancosService();
      $('#_modal_please_wait').modal('show');

      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Nivel de autenticacion alcanzado');

                  operacionesbxi.confirmaTransferSPEI(ctaO, ctaDest, sic, bancoRecep, clabeTEF_SPEI,
                                                      nombreBene, refFront, importeFront,
                                                      descripcionFront, correo, this_aux.service.userRfc, aliasCta)
                  .then(


                    function(response) {
                      console.log(response.responseJSON);

                      const transferSPEI = response.responseJSON;


                       if ( transferSPEI.Id === '1') {

                         console.log(transferSPEI);
                         this_aux.service.validaFinishTipoTransfer = "1";
                         $("#_modal_please_wait").modal("show");
                         this_aux.service.detalleConfirmacionSPEI = response.responseText;
                         console.log(this_aux.service.detalleConfirmacionSPEI);
                         this_aux.router.navigate(['/TransferFinishSpei']);

                       } else {
                        this_aux.showErrorSucces(transferSPEI);
                        setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
                       }

                    }, function(error) {
                      this_aux.showErrorPromiseMoney(error);
                      setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
                    }
                  );
              } else {
                console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                mensajeError = this_aux.controlarError(infoUsuarioJSON);
                document.getElementById('errorMensaje').innerHTML =  mensajeError;
                $('#_modal_please_wait').modal('hide');
                $('#modalErrorMessage').modal('show');
              }
        }, function(error) {
          this_aux.showErrorPromise(error);
        });


            break;
      case '2':  // TEF

      this_aux.consultaTablaCorpBancosService();
      $('#_modal_please_wait').modal('show');

      autenticacion.autenticaUsuario(tokenTef, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Nivel de autenticacion alcanzado');

                  operacionesbxi.confirmaTransferTEF(this_aux.nombreCuenta, ctaO, sic, this_aux.service.userRfc, bancoRecep,
                                                     this_aux.service.claveAliasCuenta ,
                                                    // this_aux.service.claveNumBenefi,
                                                    ctaDest, this_aux.nombreBeneModal,
                                                     this_aux.service.NombreUsuario, importeFront, descripcionFront, refFront)

                  .then(

                    function(response) {
                      console.log(response.responseJSON);

                      const transferTEF = response.responseJSON;


                       if ( transferTEF.Id === '1') {

                         console.log(transferTEF);
                         $("#_modal_please_wait").modal("show");
                         this_aux.service.validaFinishTipoTransfer = "2";
                         this_aux.service.detalleConfirmacionTEF = response.responseText;
                         console.log(this_aux.service.detalleConfirmacionTEF);
                         this_aux.router.navigate(['/TransferFinishSpei']);

                       } else {
                        this_aux.showErrorSucces(transferTEF);
                       }

                    }, function(error) {
                      this_aux.showErrorPromiseMoney(error);
                    }
                  );
              } else {
                console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                mensajeError = this_aux.controlarError(infoUsuarioJSON);

                document.getElementById('errorMensaje').innerHTML =  mensajeError;
                $('#_modal_please_wait').modal('hide');
                $('#modalErrorMessage').modal('show');
              }
        }, function(error) {
          this_aux.showErrorPromise(error);
        });


            break;
      case '3':  // QUICK
      $('#_modal_please_wait').modal('show');



      autenticacion.autenticaUsuario(tokenQuick, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Nivel de autenticacion alcanzado');

                  operacionesbxi.confirmaTransferQUICK(ctaO, this_aux.tipoCuentaF, sic, this_aux.bancoRecep.trim(),
                                                      //this_aux.clabeF,
                                                       nombreBene, this_aux.refF , importeFront,
                                                      "Transferencia Quick", correo, this_aux.service.userRfc)
                  .then(

                    function(response) {
                      console.log(response.responseJSON);

                      const transferQUICK = response.responseJSON;


                       if ( transferQUICK.Id === '1') {

                         console.log(transferQUICK);
                         $("#_modal_please_wait").modal("show");
                         this_aux.service.validaFinishTipoTransfer = "3";
                         this_aux.service.detalleConfirmacionQUICK = response.responseText;
                         console.log(this_aux.service.detalleConfirmacionQUICK);
                         this_aux.router.navigate(['/TransferFinishSpei']);

                       } else {
                        this_aux.showErrorSucces(transferQUICK);
                       }

                    }, function(error) { this_aux.showErrorPromiseMoney(error); }
                  );
              } else {
                console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                mensajeError = this_aux.controlarError(infoUsuarioJSON);
                document.getElementById('errorMensaje').innerHTML =  infoUsuarioJSON.MensajeAUsuario;
                setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
                $('#modalErrorMessage').modal('show');
              }
        }, function(error) {
          this_aux.showErrorPromise(error);
        });

            break;

          }
}

showErrorPromiseMoney(error) {


  if (error.errorCode === 'API_INVOCATION_FAILURE') {
    $('#errorModal').modal('show');
    document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
  } else {
    document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
    $('#ModalErrorTransaccion').modal('show');
  }
}

selectBanco(bancoSeleccionado) {
  const this_aux = this;

  this_aux.bancoRecep = bancoSeleccionado;

  this_aux.nombreSele = document.getElementById("selecBanco");
  this_aux.nombreBanco =
    this_aux.nombreSele.options[this_aux.nombreSele.selectedIndex].text;
}

consultaTablaCorpBancosService() {
  const this_aux = this;
  this_aux.listaBancos = null;
  $("#_modal_please_wait").modal("show");

  const operacionesbxi: OperacionesBXI = new OperacionesBXI();

  operacionesbxi.consultaBancos().then(
    function(response) {
      console.log(response.responseText);

      this_aux.listaBancos = response.responseJSON;
      this_aux.listaBancos.sort(this_aux.sortByProperty('NombreBanco'));
      const bancos = this_aux.listaBancos.sort(this_aux.sortByProperty('Id'));
      let idBanco;

      for (let i = 0; i <= bancos.length; i++) {
        if (bancos[i].Id !== undefined) {
          idBanco = bancos[i].Id;
          break;
        }
      }

      if ( idBanco === '1') {


        $("#_modal_please_wait").modal("hide");

        // desbloquea compos

        $('#cuenta').prop("disabled", false);
        $('#selecBanco').prop("disabled", false);
        $('#ammountQUICK').prop("disabled", false);
        $('#referenceQuick').prop("disabled", false);

      } else {
        // bloquea campos

        $('#cuenta').prop("disabled", true);
        $('#selecBanco').prop("disabled", true);
        $('#ammountQUICK').prop("disabled", true);
        $('#referenceQuick').prop("disabled", true);
        document.getElementById('errorMensaje').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
        $("#modalErrorMessage").modal("show");
       }

    }, function(error) {
      console.error("El WS respondio incorrectamente");
      $("#_modal_please_wait").modal("hide");
      $("#modalErrorMessage").modal("show");
});



}

sortByProperty = function (property) {

  return function (x, y) {

      return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));

  };

};


transformAmount(impor) {
  const this_aux = this;
  const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();

  switch (operacionSelect) {

    case '1':  // SPEI


      if (impor !== '') {
        const control: FormControl = new FormControl('');
        this_aux.forma.setControl('amountSPEI', control);
        this_aux.importeAuxSPEI = this_aux.replaceSimbolo(impor);
        this_aux.rImporteSPEI.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAuxSPEI, 'USD');
        this_aux.importeAuxSPEI = this_aux.replaceSimbolo( this_aux.rImporteSPEI.nativeElement.value) ;

      } else {
          if (this_aux.forma.get('amountSPEI').errors === null) {
            const control: FormControl = new FormControl('', Validators.required);
            this_aux.forma.setControl('amountSPEI', control );
          }
      }

    break;

    case '2':  // TEF


      if (impor !== '') {
        const control: FormControl = new FormControl('');
        this_aux.forma.setControl('amountTEF', control);
        this_aux.importeAuxTEF = this_aux.replaceSimbolo(impor);
        this_aux.rImporteTEF.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAuxTEF, 'USD');
        this_aux.importeAuxTEF = this_aux.replaceSimbolo( this_aux.rImporteTEF.nativeElement.value) ;

      } else {
          if (this_aux.forma.get('amountTEF').errors === null) {
            const control: FormControl = new FormControl('', Validators.required);
            this_aux.forma.setControl('amountTEF', control );
          }
      }

    break;
    case '3':  // QUICK

        if (impor !== '') {
          const control: FormControl = new FormControl('');
          this_aux.forma.setControl('ammountQUICK', control);
          this_aux.importeAuxQUICK = this_aux.replaceSimbolo(impor);
          this_aux.rImporteQUICK.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAuxQUICK, 'USD');
          this_aux.importeAuxQUICK = this_aux.replaceSimbolo( this_aux.rImporteQUICK.nativeElement.value) ;


        } else {
            if (this_aux.forma.get('ammountQUICK').errors === null) {
              const control: FormControl = new FormControl('', Validators.required);
              this_aux.forma.setControl('ammountQUICK', control );
            }
        }

          break;
        }



}

replaceSpaces(cadena) {
  const cadenaLimpia = cadena.replace(/\s+/g,"");
  return cadenaLimpia;
}

replaceSimbolo(impor) {
  const importeAux = impor.replace('$', '');
  return importeAux;
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
    case '2'      : mensajeError = mensajeUsuario;
  }

  return mensajeError;
}

showErrorPromise(error) {
  console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('errorMensaje').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
  $('#_modal_please_wait').modal('hide');
  $('#modalErrorMessage').modal('show');
}

showErrorSucces(json) {
  console.log(json.Id + json.MensajeAUsuario);
  if ( json.Id === "2") {
    document.getElementById('errorMensaje').innerHTML =   json.ErrorMsg;
    $('#_modal_please_wait').modal('hide');
    $('#modalErrorMessage').modal('show');
  } else {
    document.getElementById('errorMensaje').innerHTML =   json.MensajeAUsuario;
    $('#_modal_please_wait').modal('hide');
    $('#modalErrorMessage').modal('show');
  }

}

showErrorSuccesMoney(json) {
  console.log(json.Id + json.MensajeAUsuario);
  document.getElementById('errorMensaje').innerHTML =   json.MensajeAUsuario;
  $('#_modal_please_wait').modal('hide');
  $('#ModalErrorTransaccion').modal('show');
}

}
