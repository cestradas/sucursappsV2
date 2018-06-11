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
let clabe = "";
let nombreBene = "";
let ref = "";

let importe = "";
let descripcion = "";
let correo = "";
let rfcEmi = "";
let aliasCta = "";

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

  listaCuentasUsr: Array<any> = [];
  listaCuentasBen: Array<any> = [];
  listaDatosBen: Array<any> = [];
  datosCuenta: any[] = [];
  transferSPEI: any[] = [];

  labelTipoAutentica: string;
  CuentaDestino: string;


  cuentaOrigenModal = "";
  correoBeneModal = "";
  nombreBeneModal = "";

  forma: FormGroup;

  importeF = "";
  descripcionF = "";
  refF = "";

  rfcEmiF = "";

  tipoCuentaF = "";
  bancoReceptF =  "";
  clabeF = "";


  constructor(private _http: Http, private router: Router, public service: SesionBxiService, private renderer: Renderer2) {

    const this_aux = this;

    this.forma = new FormGroup({

      // SPEI
      'amountSPEI': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000)]),
      'descriptionSPEI': new FormControl('', [Validators.required, Validators.maxLength(60)]),
      'referenceSPEI': new FormControl('', [Validators.required, Validators.maxLength(7)]),

      // TEF

      'amountTEF': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000)]),
      'descriptionTEF': new FormControl('', [Validators.required, Validators.maxLength(60)]),
      'referenceTEF': new FormControl('', [Validators.required, Validators.maxLength(7)]),

      // Quick


      'cuenta': new FormControl('', [Validators.required, Validators.maxLength(20)]),
      'sel1': new FormControl('', [Validators.required]),
      'clabe': new FormControl('', [Validators.required, Validators.maxLength(16)]),
      'ammountQUICK': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000)]),
      'referenceQuick': new FormControl('', [Validators.required, Validators.maxLength(7)])
    });

    console.log(this.forma);

    this.forma.controls['amountSPEI'].valueChanges.subscribe(
      data => {
        console.log('amountSPEI', data);
        console.log('forma', this.forma);

        this_aux.importeF = data;
      });

      this.forma.controls['descriptionSPEI'].valueChanges.subscribe(
        data => {
          console.log('descriptionSPEI', data);
          console.log('forma', this.forma);

          this_aux.descripcionF = data;
        });

        this.forma.controls['referenceSPEI'].valueChanges.subscribe(
          data => {
            console.log('referenceSPEI', data);
            console.log('forma', this.forma);

            this_aux.refF = data;
          });

            this.forma.controls['amountTEF'].valueChanges.subscribe(
              data => {
                console.log('amountTEF', data);
                console.log('forma', this.forma);

                this_aux.importeF = data;
              });

              this.forma.controls['descriptionTEF'].valueChanges.subscribe(
                data => {
                  console.log('descriptionTEF', data);
                  console.log('forma', this.forma);

                  this_aux.descripcionF = data;
                });

                this.forma.controls['referenceTEF'].valueChanges.subscribe(
                  data => {
                    console.log('referenceTEF', data);
                    console.log('forma', this.forma);

                    this_aux.refF = data;
                  });

                  this.forma.controls['cuenta'].valueChanges.subscribe(
                    data => {
                      console.log('cuenta', data);
                      console.log('forma', this.forma);

                      this_aux.tipoCuentaF = data;
                    });

                    this.forma.controls['sel1'].valueChanges.subscribe(
                      data => {
                        console.log('sel1', data);
                        console.log('forma', this.forma);

                        this_aux.bancoReceptF = data;
                      });

                      this.forma.controls['clabe'].valueChanges.subscribe(
                        data => {
                          console.log('clabe', data);
                          console.log('forma', this.forma);

                          this_aux.clabeF = data;
                        });

                        this.forma.controls['ammountQUICK'].valueChanges.subscribe(
                          data => {
                            console.log('ammountQUICK', data);
                            console.log('forma', this.forma);

                            this_aux.importeF = data;
                          });

                          this.forma.controls['referenceQuick'].valueChanges.subscribe(
                            data => {
                              console.log('referenceQuick', data);
                              console.log('forma', this.forma);

                              this_aux.refF = data;
                            });


  }

  ngOnInit() {

    //ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("continuarspei");
    let btnConfirmar = document.getElementById("confirmar");
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


            document.getElementById('tranTEF').style.display = 'none';
            document.getElementById('tranQuick').style.display = 'none';

            document.getElementById('tranSPEI').style.display = 'block';

            document.getElementById('beneficiarios').style.display = '';


            break;
      case '2':  // TEF

            document.getElementById('tranSPEI').style.display = 'none';
            document.getElementById('tranQuick').style.display = 'none';

            document.getElementById('tranTEF').style.display = 'block';

            document.getElementById('beneficiarios').style.display = '';

            break;
      case '3':  // QUICK


            document.getElementById('tranTEF').style.display = 'none';
            document.getElementById('tranSPEI').style.display = 'none';

            document.getElementById('tranQuick').style.display = 'block';

            document.getElementById('beneficiarios').style.display = '';
            break;


          }
  }

  showDetallePago() {
    const this_aux = this;



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
      clabe = this_aux.clabeF;
      importe = this_aux.importeF;
      ref = this_aux.refF;



            break;


          }



      this_aux.setTipoAutenticacionOnModal();
  }

  setTipoAutenticacionOnModal() {
    const this_aux = this;
    const divChallenge = document.getElementById('challenger');
    const divTokenPass = document.getElementById('divPass');
    if (this_aux.service.metodoAutenticaMayor.toString() === '5') {

      this_aux.labelTipoAutentica = 'Token Celular';
      divChallenge.setAttribute('style', 'display: block');
      divTokenPass.setAttribute('style', 'display: block');

    } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {

      divChallenge.setAttribute('style', 'display: none');
      divTokenPass.setAttribute('style', 'display: block');
      this_aux.labelTipoAutentica = 'Contrase&atilde;a';
    } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {

      divChallenge.setAttribute('style', 'display: none');
      divTokenPass.setAttribute('style', 'display: block');
      this_aux.labelTipoAutentica = 'Token Fisico';
    }


    this.validaDatosBen();


    const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());


    switch (operacionSelect) {

      case '1':  // SPEI

      $('#confirmModalSPEI').modal('show');

            break;

      case '2':  // TEF


      $('#confirmModalTEF').modal('show');

            break;
      case '3':  // QUICK

      $('#confirmModalQUICK').modal('show');

            break;
          }

}

  fillSelectCuentas() {
    const this_aux = this;
    const cuentasString = this_aux.service.infoCuentas;
    console.log(this_aux.service.infoCuentas);
    const consultaCuentas = JSON.parse(cuentasString);
    const cuentasArray = consultaCuentas.ArrayCuentas;
      cuentasArray.forEach(cuenta => {
          const li =  this.renderer.createElement('li');
          const a = this.renderer.createElement('a');
          const textoCuenta = this.renderer.createText( cuenta.Alias);
          this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
          this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target); });
          this.renderer.appendChild(a, textoCuenta),
          this.renderer.appendChild(li, a);
          this.renderer.appendChild(this.listaCuentas.nativeElement, li);
    });

}

setDatosCuentaSeleccionada(elementHTML) {

  const this_aux = this;
  console.log(elementHTML);
  const tableOrigen = document.getElementById('tableOrigen');
  const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
  const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
  const lblAliasOrigen = document.getElementById('lblAliasOrigen');
  const numCuenta_seleccionada = elementHTML.value;
  const AliasCuenta_seleccionada = elementHTML.text;

  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');

  lblAliasOrigen.innerHTML = elementHTML.textContent;
  lblAliasOrigen.innerHTML = AliasCuenta_seleccionada.toString();
  lblCuentaOrigen.innerHTML = numCuenta_seleccionada.toString();
  this_aux.service.numCuentaSPEISel = numCuenta_seleccionada;
  this_aux.service.AliasCuentaSPEISel = AliasCuenta_seleccionada;
  this_aux.cuentaOrigenModal = this_aux.service.numCuentaSPEISel;
  this_aux.getSaldoDeCuenta(numCuenta_seleccionada);



}

getSaldoDeCuenta(numCuenta_seleccionada) {

  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuenta_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {
          const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
        } else {
          console.log(detalleSaldos.MensajeAUsuario);
        }
      }, function(error) {
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
  arrayCuentasXBeneficiario.forEach(element1 => {
    cuenta = element1.Cuenta;
        cuenta.forEach(data => {

          this_aux.listaCuentasBen.push(data);



        });
  });

  datosBeneficiarios.forEach(element1 => {
    datosB = element1;
   // datosB.forEach(data => {

          this_aux.listaDatosBen.push(element1);



    //    });
  });




  console.log(this_aux.listaCuentasBen);
  console.log(this_aux.listaDatosBen);
  console.log(this_aux.listaCuentasUsr);
  this_aux.defineFiltros();
}

crearListaBeneficiarios(data) {

  const this_aux = this;
  const li =  this.renderer.createElement('li');
  const a = this.renderer.createElement('a');
  const textoCuenta = this.renderer.createText( data.Alias);
  this.renderer.setProperty(a, 'value', data.NoCuenta);
  this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target); });
  this.renderer.appendChild(a, textoCuenta),
  this.renderer.appendChild(li, a);
  this.renderer.appendChild(this_aux.listaCuentasBeneficiario.nativeElement, li);

}

setDatosCuentaBeneficiario(elementHTML) {

  const this_aux = this;
  console.log(elementHTML);
  const tableBeneficiarios = document.getElementById('tableBeneficiarios');
  const tableDefaultBeneficiarios = document.getElementById('tableDefaultBeneficiarios');
  const lblCuentaDestino = document.getElementById('lblCuentaDestino');
  const lbDescripcionCtaBen = document.getElementById('lbDescripcionCtaBen');
  const valueElement = elementHTML.value;

  tableBeneficiarios.setAttribute('style', 'display: block');
  tableDefaultBeneficiarios.setAttribute('style', 'display: none');
  lbDescripcionCtaBen.innerHTML = elementHTML.textContent;
  lblCuentaDestino.innerHTML = this_aux.getNumeroCuentaDestino(valueElement);
  this_aux.CuentaDestino = this_aux.getNumeroCuentaDestino(valueElement);
  this_aux.service.numCuentaDestinario = this_aux.CuentaDestino;
  this_aux.service.claveBancoDestino = this_aux.getNameInstitucion(valueElement);
  this_aux.service.claveAliasCuenta = this_aux.getNameAliasCuenta(valueElement);
  this_aux.service.claveNumBenefi = this_aux.getNumBeneficiario(valueElement);

  this_aux.consultaClabeSaldos(this_aux.service.numCuentaDestinario);

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
  const this_aux = this;
  console.log('setCuentasBenficiarioXTipo');
  console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());
  const node = document.getElementById("ul_CuentasBen");
  console.log(node);
  while (node.firstChild) {
    node.removeChild(node.firstChild);
   }

  this_aux.listaCuentasBen.forEach(auxcuenta => {


    if (this_aux.selectTipo.nativeElement.value.toString() === "1") {  // SPEI

      document.getElementById('tranTEF').style.display = 'none';
      document.getElementById('tranQuick').style.display = 'none';
      document.getElementById('beneficiarios').style.display = 'block';

      document.getElementById('tranSPEI').style.display = 'block';

      document.getElementById('beneficiarios').style.display = '';

      if (auxcuenta.AplicaSPEI.toString() === "true") {

        const li =  this.renderer.createElement('li');
        const a = this.renderer.createElement('a');
        const textoCuenta = this.renderer.createText( auxcuenta.DescripcionTipoCuenta);
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

    if (this_aux.selectTipo.nativeElement.value.toString() === "2") { // TEF

      document.getElementById('tranSPEI').style.display = 'none';
      document.getElementById('tranQuick').style.display = 'none';
      document.getElementById('beneficiarios').style.display = 'block';

      document.getElementById('tranTEF').style.display = 'block';

      document.getElementById('beneficiarios').style.display = '';

      if (auxcuenta.AplicaTEF.toString() === "true") {

        const li =  this.renderer.createElement('li');
        const a = this.renderer.createElement('a');
        const textoCuenta = this.renderer.createText( auxcuenta.DescripcionTipoCuenta);
        this.renderer.setProperty(a, 'value', auxcuenta.Alias + ','
                                            + auxcuenta.NoCuenta + ','
                                            + auxcuenta.ClaveBanco + ','
                                            + auxcuenta.DescripcionTipoCuenta + ','
                                            + auxcuenta.NumBenef );
        this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target); });
        this.renderer.appendChild(a, textoCuenta),
        this.renderer.appendChild(li, a);
        this.renderer.appendChild(this_aux.listaCuentasBeneficiario.nativeElement, li);
       }

    }



    if (this_aux.selectTipo.nativeElement.value.toString() === "3") {  // Quick


      document.getElementById('tranTEF').style.display = 'none';
      document.getElementById('tranSPEI').style.display = 'none';
      document.getElementById('beneficiarios').style.display = 'none';

      document.getElementById('tranQuick').style.display = 'block';

      // document.getElementById('beneficiarios').style.display = '';


    }


 });

}


consultaClabeSaldos(numCuentaDestinario_seleccionada) {
  const this_aux =  this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuentaDestinario_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {

          this_aux.service.clabeDestinatario = detalleSaldos.ClabeCuenta;

          $('#amountSPEI').prop("disabled", false);
          $('#descriptionSPEI').prop("disabled", false);
          $('#referenceSPEI').prop("disabled", false);

        } else {
          console.log(detalleSaldos.MensajeAUsuario);

          document.getElementById('mnsError').innerHTML = detalleSaldos.MensajeAUsuario;
          $('#errorModal').modal('show');

          this_aux.service.clabeDestinatario = null;
          // Mostrar modal de error

          // Bloquear campos

          /*
          $('#amountSPEI').prop("disabled", true);
          $('#descriptionSPEI').prop("disabled", true);
          $('#referenceSPEI').prop("disabled", true);
          */

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



  confirmarPago(token) {



    const this_aux = this;
    let mensajeError;
    // this.validaDatosBen();

    ctaO = this_aux.service.numCuentaSPEISel;
    ctaDest = this_aux.service.numCuentaDestinario;
    sic = this_aux.service.infoUsuarioSIC;
    bancoRecep = this_aux.service.claveBancoDestino;
    aliasCta = this_aux.service.claveAliasCuenta;

    if (clabe === null || clabe === "") {
      clabe = "014180570107939481";
    } else {
      clabe = this_aux.service.clabeDestinatario;
    }


    // nombreBene
    nombreBene = this_aux.service.nombreBeneficiario;
    // correo
    // correo = "miguel.garcia_softtek@banorte.com";
    correo = this_aux.service.correoBeneficiario;
    // rfcEmi
    rfcEmi = "no capturado";



    refFront = ref;
    importeFront = importe;
    descripcionFront = descripcion;

    const autenticacion: Autenticacion = new Autenticacion();
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();


    const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());

    switch (operacionSelect) {

      case '1':  // SPEI

      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Nivel de autenticacion alcanzado');

                  operacionesbxi.confirmaTransferSPEI(ctaO, ctaDest, sic, bancoRecep, clabe,
                                                      nombreBene, refFront, importeFront,
                                                      descripcionFront, correo, rfcEmi, aliasCta)
                  .then(

                    function(response) {
                      console.log(response.responseJSON);

                      const transferSPEI = response.responseJSON;


                       if ( transferSPEI.Id === '1') {

                         console.log(transferSPEI);
                         this_aux.service.validaFinishTipoTransfer = "1";
                         this_aux.service.detalleConfirmacionSPEI = response.responseText;
                         console.log(this_aux.service.detalleConfirmacionSPEI);
                         this_aux.router.navigate(['/TransferFinishSpei']);

                       } else {
                        this_aux.showErrorSuccesMoney(transferSPEI);
                       }

                    }, function(error) { this_aux.showErrorPromise(error); }
                  );
              } else {
                console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                mensajeError = this_aux.controlarError(infoUsuarioJSON);
                document.getElementById('mnsError').innerHTML =  mensajeError;
                $('#_modal_please_wait').modal('hide');
                $('#errorModal').modal('show');
              }
        }, function(error) {
          this_aux.showErrorPromise(error);
        });


            break;
      case '2':  // TEF


      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Nivel de autenticacion alcanzado');

                  operacionesbxi.confirmaTransferTEF(this_aux.service.AliasCuentaSPEISel, ctaO, sic, rfcEmi,
                                                     this_aux.service.claveAliasCuenta , this_aux.service.claveNumBenefi, clabe,
                                                     this_aux.service.NombreUsuario, importeFront, descripcionFront, refFront)

                  .then(

                    function(response) {
                      console.log(response.responseJSON);

                      const transferTEF = response.responseJSON;


                       if ( transferTEF.Id === '1') {

                         console.log(transferTEF);
                         this_aux.service.validaFinishTipoTransfer = "2";
                         this_aux.service.detalleConfirmacionTEF = response.responseText;
                         console.log(this_aux.service.detalleConfirmacionTEF);
                         this_aux.router.navigate(['/TransferFinishSpei']);

                       } else {
                        this_aux.showErrorSuccesMoney(transferTEF);
                       }

                    }, function(error) { this_aux.showErrorPromise(error); }
                  );
              } else {
                console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                mensajeError = this_aux.controlarError(infoUsuarioJSON);
                document.getElementById('mnsError').innerHTML =  mensajeError;
                $('#_modal_please_wait').modal('hide');
                $('#errorModal').modal('show');
              }
        }, function(error) {
          this_aux.showErrorPromise(error);
        });


            break;
      case '3':  // QUICK


      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Nivel de autenticacion alcanzado');

                  operacionesbxi.confirmaTransferQUICK(ctaO, this_aux.tipoCuentaF, sic, this_aux.bancoReceptF,
                                                      this_aux.clabeF, nombreBene, this_aux.refF , importeFront,
                                                      descripcionFront, correo, rfcEmi)
                  .then(

                    function(response) {
                      console.log(response.responseJSON);

                      const transferQUICK = response.responseJSON;


                       if ( transferQUICK.Id === '1') {

                         console.log(transferQUICK);
                         this_aux.service.validaFinishTipoTransfer = "3";
                         this_aux.service.detalleConfirmacionQUICK = response.responseText;
                         console.log(this_aux.service.detalleConfirmacionQUICK);
                         this_aux.router.navigate(['/TransferFinishSpei']);

                       } else {
                        this_aux.showErrorSuccesMoney(transferQUICK);
                       }

                    }, function(error) { this_aux.showErrorPromise(error); }
                  );
              } else {
                console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                mensajeError = this_aux.controlarError(infoUsuarioJSON);
                document.getElementById('mnsError').innerHTML =  mensajeError;
                $('#_modal_please_wait').modal('hide');
                $('#errorModal').modal('show');
              }
        }, function(error) {
          this_aux.showErrorPromise(error);
        });

            break;

          }
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

showErrorSuccesMoney(json) {
  console.log(json.Id + json.MensajeAUsuario);
  document.getElementById('msgError').innerHTML =   json.MensajeAUsuario;
  $('#_modal_please_wait').modal('hide');
  $('#ModalErrorTransaccion').modal('show');
}

}
