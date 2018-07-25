import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';
import { Autenticacion } from '../autenticacion';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';



import $ from 'jquery';
declare var $: $;

let sic = "";
let ctaO = "";
let ctaDest = "";
let paramMnsEmail = "";

let importe = "";
let concepto = "";


@Component({
  selector: 'app-transferencias-banorte',
  templateUrl: './transferencias-banorte.component.html',
  styles: []
})
export class TransferenciasBanorteComponent implements OnInit {

  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  @ViewChild('listaCuentasBeneficiario', { read: ElementRef}) listaCuentasBeneficiario: ElementRef ;
  @ViewChild('selectTipo', { read: ElementRef}) selectTipo: ElementRef;
  @ViewChild('rImporte', { read: ElementRef}) rImporte: ElementRef ;

  listaCuentasUsr: Array<any> = [];
  listaCuentasBen: Array<any> = [];
  listaDatosBen: Array<any> = [];
  datosCuenta: any[] = [];

  labelTipoAutentica: string;
  CuentaDestino: string;

  forma: FormGroup;

  importeAux: string;

  importeF = "";
  conceptoF = "";
  fcTokenTr = "";

  cuentaOrigenModal = "";
  correoBeneModal = "";
  nombreBeneModal = "";

  NumeroSeguridad: string;

  SaldoOrigen: number;

  nombreCuenta: string;
  nombreCuentaTer: string;
  nombreCuentaProp: string;
  numeroTarjeta: string;

  constructor(private _http: Http, private router: Router, private fb: FormBuilder, public service: SesionBxiService, private renderer: Renderer2, private currencyPipe: CurrencyPipe) {

    const this_aux = this;


    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);


    this.forma = new FormGroup({


      'amount': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000), Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)]),
      'concepto': new FormControl('', [Validators.required, Validators.maxLength(40)]),

      'fcTokenTr': new FormControl('')

    });

    console.log(this.forma);

    this.forma.controls['amount'].valueChanges.subscribe(
      data => {
        console.log('amount', data);
        console.log('forma', this.forma);

        this_aux.importeF = data;
        this_aux.desabilitaBtn();
      });

      this.forma.controls['concepto'].valueChanges.subscribe(
        data => {
          console.log('concepto', data);
          console.log('forma', this.forma);

          this_aux.conceptoF = data;
          this_aux.desabilitaBtn();
        });

        this.forma.controls['fcTokenTr'].valueChanges.subscribe(
          data2 => {
            console.log('fcTokenTr', data2);
            console.log('forma', this.forma);

            this_aux.fcTokenTr = data2;
            if (this_aux.fcTokenTr !== " ") {

                $('#ValToken').prop("disabled", false);
            }
          });

  }



  ngOnInit() {

    this.resetLista();
    this.fillSelectCuentas();
    // this.consultaCuentas();
    this.fillCuentasBeneficiario();

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
  if ((cuenta.TipoCuenta === 1 && cuenta.NoCuenta.length === 10) || (cuenta.TipoCuenta === 4 && cuenta.NoCuenta.length === 10)) {
    this_aux.crearListaCuentas(cuenta);
  }
}


crearListaCuentas(cuenta) {
  const this_aux = this;
  const cuentasString = this_aux.service.infoCuentas;
  console.log(this_aux.service.infoCuentas);
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  const li =  this.renderer.createElement('li');
  this_aux.renderer.addClass(li, 'text-li');
  const a = this.renderer.createElement('a');
  const textoCuenta = this.renderer.createText( cuenta.Alias  + ' ' +operacionesbxi.mascaraNumeroCuenta(cuenta.NoCuenta));
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
  //const lblAliasOrigen = document.getElementById('lblAliasOrigen');
  const numCuenta_seleccionada = elementHTML.value;
  const AliasCuenta_seleccionada = elementHTML.text;

  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');

  //lblAliasOrigen.innerHTML = elementHTML.textContent;
  //lblAliasOrigen.innerHTML = AliasCuenta_seleccionada.toString();
  lblCuentaOrigen.innerHTML = operacionesbxi.mascaraNumeroCuenta(numCuenta_seleccionada.toString());

  if (this_aux.includesL(numCuenta_seleccionada, ","))  {

    this_aux.service.numCuentaTranPropBanorte = this_aux.getNumeroCuentaDestino(numCuenta_seleccionada);
    this_aux.service.AliasCuentaTranPropBanorte  = this_aux.getNameAliasCuenta(numCuenta_seleccionada);
    this_aux.cuentaOrigenModal = this_aux.service.numCuentaTranPropBanorte;
    this_aux.getSaldoDeCuenta(this_aux.getNumeroCuentaDestino(numCuenta_seleccionada));

  } else {

    this_aux.service.numCuentaTranPropBanorte = numCuenta_seleccionada;
    this_aux.service.AliasCuentaTranPropBanorte  = AliasCuenta_seleccionada;
    this_aux.cuentaOrigenModal = this_aux.service.numCuentaTranPropBanorte;
    this_aux.getSaldoDeCuenta(numCuenta_seleccionada);

  }


  // desactiva combo cuentas usuario
  $('#dropdownMenu2').prop("disabled", false);

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

         setTimeout(function() {
          //const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          //lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
          this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
            $('#_modal_please_wait').modal('hide');
          }, 500);
        } else {
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

         setTimeout(function() {
          //const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          //lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
           this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
            $('#_modal_please_wait').modal('hide');
          }, 500);
        } else {
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
  arrayCuentasXBeneficiario.forEach(element1 => {
    cuenta = element1.Cuenta;
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

  console.log(this_aux.listaCuentasBen);
  console.log(this_aux.listaDatosBen);
  console.log(this_aux.listaCuentasUsr);
  this_aux.defineFiltros();
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
  $( ".cdk-visually-hidden" ).css( "margin-top", "15%" );
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

  // selleciono cta propias
  if (this_aux.selectTipo.nativeElement.value.toString() === "1") {
    console.log('setCuentasUsuario');
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());
    const node = document.getElementById("ul_CuentasBen");
    console.log(node);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
     }

  }

  // selleciono cta terceros
  if (this_aux.selectTipo.nativeElement.value.toString() === "2") {
    console.log('setCuentasBenficiarioXTipo');
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());
    const node = document.getElementById("ul_CuentasBen");
    console.log(node);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
     }

  }

  // CUENTAS DEL USUSARIO

  console.log('setCuentasUsuario');
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());
    const node = document.getElementById("ul_Cuentas");
    console.log(node);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
     }


  this_aux.listaCuentasUsr.forEach(auxcuenta => {

    // VALIDAR TIPOS DE CUENTA (CUENTAS USUARIO)
          if (auxcuenta.TipoCuenta.toString() === "1") {



          const cuentasString = this_aux.service.infoCuentas;
          console.log(this_aux.service.infoCuentas);
          const operacionesbxi: OperacionesBXI = new OperacionesBXI();
          const consultaCuentas = JSON.parse(cuentasString);
        //  const cuentasArray = consultaCuentas.ArrayCuentas;
        //  cuentasArray.forEach(cuenta => {
              const li =  this.renderer.createElement('li');
              this_aux.renderer.addClass(li, 'text-li');
              const a = this.renderer.createElement('a');
              const textoCuenta = this.renderer.createText( auxcuenta.Alias + ' ' +operacionesbxi.mascaraNumeroCuenta(auxcuenta.NoCuenta));
              this.renderer.setProperty(a, 'value', auxcuenta.NoCuenta);
              this.renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target);
                this_aux.numeroTarjeta = auxcuenta.Plastico;
                this_aux.nombreCuenta = auxcuenta.Alias;
                 });
              this.renderer.appendChild(a, textoCuenta),
              this.renderer.appendChild(li, a);
              this.renderer.appendChild(this.listaCuentas.nativeElement, li);
          //  });

           }

           $('#dropdownMenu1').prop("disabled", false);

          });




    if (this_aux.selectTipo.nativeElement.value.toString() === "1") {  // PROPIAS
      let contCtas = 0;
      // document.getElementById('tranTEF').style.display = 'none';
      this_aux.listaCuentasUsr.forEach(auxcuenta => {

// VALIDAR TIPOS DE CUENTA BANORTE PROPIAS
      if (((auxcuenta.TipoCuenta.toString() === "1") && (auxcuenta.NoCuenta.length === 10)) || ((auxcuenta.TipoCuenta.toString() === "4") && (auxcuenta.NoCuenta.length === 10)) ) {


        contCtas ++;
      const cuentasString = this_aux.service.infoCuentas;
      console.log(this_aux.service.infoCuentas);
      const consultaCuentas = JSON.parse(cuentasString);
     // const cuentasArray = consultaCuentas.ArrayCuentas;
     // cuentasArray.forEach(cuenta => {
          const li =  this.renderer.createElement('li');
          this_aux.renderer.addClass(li, 'text-li');
          const a = this.renderer.createElement('a');
          const textoCuenta = this.renderer.createText( auxcuenta.Alias + ' ' + auxcuenta.NoCuenta);
          this.renderer.setProperty(a, 'value', auxcuenta.Alias + ','
                                              + auxcuenta.NoCuenta);
          this.renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target);
                this_aux.numeroTarjeta = auxcuenta.Plastico;
                this_aux.nombreCuentaProp = auxcuenta.Alias;
                 });
          this.renderer.appendChild(a, textoCuenta),
          this.renderer.appendChild(li, a);
          this.renderer.appendChild(this.listaCuentasBeneficiario.nativeElement, li);
      //  });

       }


       if (contCtas >= 1) {
        $('#dropdownMenu1').prop("disabled", false);
       } else {
        document.getElementById('mnsError').innerHTML = "No tienes cuentas registradas";
        $('#errorModal').modal('show');
        $('#dropdownMenu2').prop("disabled", true);
        $('#amount').prop("disabled", true);
        $('#concepto').prop("disabled", true);
       }

      });

    }




    if (this_aux.selectTipo.nativeElement.value.toString() === "2") { // TERCEROS
      let contCtasTer = 0;
      // document.getElementById('tranSPEI').style.display = 'none';
      this_aux.listaCuentasBen.forEach(auxcuenta => {

// VALIDAR TIPOS DE CUENTA BANORTE TERCEROS
// auxcuenta.ClaveBanco.toString() == "40072"  cve BANORTE
      if ( ((auxcuenta.TipoCuenta.toString() === "1") && (auxcuenta.ClaveBanco.toString() === "40072") ) || ((auxcuenta.TipoCuenta.toString() === "4") && (auxcuenta.ClaveBanco.toString() === "40072") )) {

        contCtasTer ++;
        const li =  this.renderer.createElement('li');
        this_aux.renderer.addClass(li, 'text-li');
        const a = this.renderer.createElement('a');
        const textoCuenta = this.renderer.createText( auxcuenta.DescripcionTipoCuenta + ' ' + auxcuenta.NoCuenta);
        this.renderer.setProperty(a, 'value', auxcuenta.Alias + ','
                                            + auxcuenta.NoCuenta + ','
                                            + auxcuenta.ClaveBanco + ','
                                            + auxcuenta.DescripcionTipoCuenta + ','
                                            + auxcuenta.NumBenef );
        this.renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target);
                this_aux.numeroTarjeta = auxcuenta.Plastico;
                this_aux.nombreCuentaTer = auxcuenta.Alias;
                 });
        this.renderer.appendChild(a, textoCuenta),
        this.renderer.appendChild(li, a);
        this.renderer.appendChild(this_aux.listaCuentasBeneficiario.nativeElement, li);
       }

       // desbloquea CUENTAS ORIGEN
       if (contCtasTer >= 1) {
        $('#dropdownMenu1').prop("disabled", false);
       } else {
        document.getElementById('mnsError').innerHTML = "No tienes cuentas registradas";
        $('#errorModal').modal('show');
        $('#dropdownMenu2').prop("disabled", true);
        $('#amount').prop("disabled", true);
        $('#concepto').prop("disabled", true);
       }




  });


}
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


  // this_aux.consultaClabeSaldos(this_aux.service.numCuentaDestinario);


   if (this_aux.cuentaOrigenModal === this_aux.CuentaDestino) {
    // bloquea campos
    document.getElementById('mnsError').innerHTML = "Por favor selecciona una cuenta diferente a la de origen";
    $('#errorModal').modal('show');
    $('#amount').prop("disabled", true);
    $('#concepto').prop("disabled", true);

   } else {
    // desbloquea campos
    $('#amount').prop("disabled", false);
    $('#concepto').prop("disabled", false);
   }


  console.log(this_aux.service.claveBancoDestino + this_aux.service.claveAliasCuenta + this_aux.service.claveNumBenefi);

}

resetLista() {
  const node = document.getElementById("ul_CuentasBen");
  console.log(node);
  while (node.firstChild) {
    node.removeChild(node.firstChild);
   }
}


getNumeroCuentaDestino(text) {
  const  separador = ',';
  const  arregloDeSubCadenas = text.split(separador);
  const numCuentaDestino = arregloDeSubCadenas[1];
  console.log(arregloDeSubCadenas);
  console.log(numCuentaDestino);

  return numCuentaDestino;
}

getNameInstitucion(text) {
  const  separador = ',';
  const  arregloDeSubCadenas = text.split(separador);
  const nameInstitucion = arregloDeSubCadenas[2];
  console.log(arregloDeSubCadenas);
  console.log(nameInstitucion);

  return nameInstitucion;
}

getNameAliasCuenta(text) {
  const  separador = ',';
  const  arregloDeSubCadenas = text.split(separador);
  const nameAliasCuenta = arregloDeSubCadenas[0];
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

consultaClabeSaldos(numCuentaDestinario_seleccionada) {
  const this_aux =  this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuentaDestinario_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {

          this_aux.service.clabeDestinatario = detalleSaldos.ClabeCuenta;

          $('#amount').prop("disabled", false);
          $('#concepto').prop("disabled", false);


        } else {
          console.log(detalleSaldos.MensajeAUsuario);

          document.getElementById('mnsError').innerHTML = detalleSaldos.MensajeAUsuario;
          $('#errorModal').modal('show');

          this_aux.service.clabeDestinatario = null;
          // Mostrar modal de error

          // Bloquear campos

          /*
          $('#amount').prop("disabled", true);
          $('#concepto').prop("disabled", true);

          */

        }
      }, function(error) {
  });
}


showDetallePago() {
  const this_aux = this;

  $('#inputToken').val('');

  console.log("adentro Trnsferencias Internacionales");

  const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
  console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());

  switch (operacionSelect) {

    case '1':  // Cuentas propias Banorte

    importe = this_aux.importeAux;
    concepto = this_aux.conceptoF;


          break;

    case '2':  // Cuentas a terceros Banorte

    importe = this_aux.importeAux;
    concepto = this_aux.conceptoF;


          break;


        }



    this_aux.setTipoAutenticacionOnModal();
}


setTipoAutenticacionOnModal() {
  const this_aux = this;
  let mensajeError;
  const divChallenge = document.getElementById('challenger');
  const divTokenPass = document.getElementById('divPass');
  const control: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{6})*$/)]);
      this_aux.forma.setControl('fcTokenTr', control );
  if (this_aux.service.metodoAutenticaMayor.toString() === '5') {
    $('#_modal_please_wait').modal('show');
    this_aux.labelTipoAutentica = 'Token Celular';
    divTokenPass.setAttribute('style', 'display: flex');
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    operacionesbxi.preparaAutenticacion().then(
      function(response) {
        const detallePrepara = response.responseJSON;
        console.log(detallePrepara);
        if (detallePrepara.Id === 'SEG0001') {
          divChallenge.setAttribute('style', 'display: flex');
          this_aux.NumeroSeguridad = detallePrepara.MensajeUsuarioUno;
          setTimeout(() => {
            $('#_modal_please_wait').modal('hide');
         }, 500);

        } else {

          setTimeout(() => {
            $('#_modal_please_wait').modal('hide');
            console.log(detallePrepara.Id + detallePrepara.MensajeAUsuario);
                        mensajeError = this_aux.controlarError(detallePrepara);
                        document.getElementById('mnsError').innerHTML =  mensajeError;
                        $('#errorModal').modal('show');
         }, 1000);
        }
      }, function(error) {

        setTimeout(() => {
          $('#_modal_please_wait').modal('hide');
          this_aux.showErrorPromise(error);
       }, 1000);

      });

  } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {

    divChallenge.setAttribute('style', 'display: none');
    divTokenPass.setAttribute('style', 'display: flex');
    this_aux.labelTipoAutentica = 'Contrase&atilde;a';
  } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {

    divChallenge.setAttribute('style', 'display: none');
    divTokenPass.setAttribute('style', 'display: flex');
    this_aux.labelTipoAutentica = 'Token Físico';
  }


  this.validaDatosBen();


  const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
  console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());


  switch (operacionSelect) {

    case '1':  // Cuentas propias Banorte

        setTimeout(function() {

          this_aux.validarSaldo("1");
          //$('#confirmModal').modal('show');
        }, 500);

        break;

    case '2':  // Cuentas a terceros Banorte


          setTimeout(function() {

            this_aux.validarSaldo("2");
            //$('#confirmModal').modal('show');
          }, 500);

          break;

        }

}

includesL(container, value) {
  let returnValue = false;
  let pos = String(container).indexOf(value);
  if (pos >= 0) {
    returnValue = true;
  }
  return returnValue;
}

validarSaldo(tipoOperecionPago) {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    let importeOpe = this_aux.importeAux;
    importeOpe.replace(',', "");
    operacionesbxi.consultaTablaYValidaSaldo(this_aux.service.numCuentaTranPropBanorte, importeOpe).then(
      function(response) {

        let DatosJSON = response.responseJSON;
        console.log(response.responseText);
        if (DatosJSON.Id === "1") {

          console.log("Pago validado");
          //setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

          // MANDAR A LLAMAR MODAL DE CONFIRMACION
          if (tipoOperecionPago === "1") {           // Cuentas propias Banorte
            $( ".cdk-visually-hidden" ).css( "margin-top", "16%" );
            $('#confirmModalBanorte').modal('show');
          } else if (tipoOperecionPago === "2") {   // Cuentas a terceros Banorte
            $( ".cdk-visually-hidden" ).css( "margin-top", "16%" );
            $('#confirmModal').modal('show');
          }

        } else if ( DatosJSON.Id === "4" ) {
          $('#modalLimiteDiario').modal('show');
        } else if ( DatosJSON.Id === "5" ) {
          $('#modalLimiteMensual').modal('show');
        } else {
          $('#errorModal').modal('show');
        }
        $('#_modal_please_wait').modal('hide');

      }, function(error) {
       $('#_modal_please_wait').modal('hide');
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


  $('#_modal_please_wait').modal('show');
  const this_aux = this;
  let mensajeError;
  // this.validaDatosBen();

  ctaO = this_aux.service.numCuentaTranPropBanorte;
  ctaDest = this_aux.service.numCuentaDestinario;
  sic = this_aux.service.infoUsuarioSIC;


  // obtener mensaje de EMAIL
  paramMnsEmail = "Transferencia Banorte";


  const autenticacion: Autenticacion = new Autenticacion();
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();


  const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
  console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());

  switch (operacionSelect) {

    case '1':  // Cuentas propias Banorte
    $('#_modal_please_wait').modal('show');

    /*
    autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
      function(detalleAutentica) {
            // console.log(detalleAutentica.responseJSON);
            const infoUsuarioJSON = detalleAutentica.responseJSON;
            if (infoUsuarioJSON.Id === 'SEG0001') {
                console.log('Nivel de autenticacion alcanzado');
    */
                operacionesbxi.confirmaTransferPropTerBanorte(sic, this_aux.service.correoBeneficiario, paramMnsEmail,
                                                              this_aux.service.AliasCuentaTranPropBanorte, ctaO,
                                                              ctaDest, importe, concepto,
                                                              this_aux.service.NombreUsuario)
                .then(


                  function(response) {
                    $('#_modal_please_wait').modal('show');
                    console.log(response.responseJSON);

                    const transferPropTer = response.responseJSON;


                     if ( transferPropTer.Id === '1') {

                       console.log(transferPropTer);
                       this_aux.service.validaFinishTipoTransfer = "1";
                       $('#_modal_please_wait').modal('show');
                       this_aux.service.detalleConfirmacionTranPropBanorte = response.responseText;
                       console.log(this_aux.service.detalleConfirmacionTranPropBanorte);
                       this_aux.router.navigate(['/TransferFinishBanorte']);

                     } else {
                        this_aux.showErrorSucces(transferPropTer);
                        setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
                     }

                  }, function(error) {
                    this_aux.showErrorPromiseMoney(error);
                    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
                  }
                );
            /*} else {
              console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
              mensajeError = this_aux.controlarError(infoUsuarioJSON);
              document.getElementById('mnsError').innerHTML =  mensajeError;
              $('#_modal_please_wait').modal('hide');
              $('#errorModal').modal('show');
            }
      }, function(error) {
        this_aux.showErrorPromise(error);
      });*/


          break;
    case '2':  // Cuentas a terceros Banorte
    $('#_modal_please_wait').modal('show');


    autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
      function(detalleAutentica) {
            // console.log(detalleAutentica.responseJSON);
            const infoUsuarioJSON = detalleAutentica.responseJSON;
            if (infoUsuarioJSON.Id === 'SEG0001') {
                console.log('Nivel de autenticacion alcanzado');

                operacionesbxi.confirmaTransferPropTerBanorte(sic, this_aux.service.correoBeneficiario, paramMnsEmail,
                                                              this_aux.service.AliasCuentaTranPropBanorte, ctaO,
                                                              ctaDest, importe, concepto,
                                                              this_aux.service.NombreUsuario)
                .then(

                  function(response) {
                    console.log(response.responseJSON);

                    const transferPropTer = response.responseJSON;


                     if ( transferPropTer.Id === '1') {

                       console.log(transferPropTer);
                       this_aux.service.validaFinishTipoTransfer = "1";
                       $('#_modal_please_wait').modal('show');
                       this_aux.service.detalleConfirmacionTranPropBanorte = response.responseText;
                       console.log(this_aux.service.detalleConfirmacionTranPropBanorte);
                       this_aux.router.navigate(['/TransferFinishBanorte']);

                     } else {
                        this_aux.showErrorSucces(transferPropTer);
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

showErrorPromiseMoney(error) {


  if (error.errorCode === 'API_INVOCATION_FAILURE') {
    $('#errorModal').modal('show');
    document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
  } else {
    document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
    $('#ModalErrorTransaccion').modal('show');
  }
}

transformAmount(impor) {
  const this_aux = this;

      if (impor !== '') {
        const control: FormControl = new FormControl('');
        this_aux.forma.setControl('amount', control);
        this_aux.importeAux = this_aux.replaceSimbolo(impor);
        this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAux, 'USD');
        this_aux.importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;

      } else {
          if (this_aux.forma.get('amount').errors === null) {
            const control: FormControl = new FormControl('', Validators.required);
            this_aux.forma.setControl('amount', control );
          }
      }

      let importeTran = $('#amount').val();
      let conceptoTran = $('#concepto').val();


      if ((importeTran !== "") && (conceptoTran !== "")) {

        $('#continuarspei').prop("disabled", false);

      }

}

desabilitaBtn() {

  const this_aux = this;
  let importeTran = $('#amount').val();
  let conceptoTran = $('#concepto').val();
  let expreg = new RegExp(" /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/");

  if ((this_aux.replaceSimbolo(importeTran) !== "") && (conceptoTran !== "")) {
    if ( expreg.test(importeTran)) {
        console.log("correcto");
        //document.getElementById('valdaAmmount').style.display = 'none';
        $('#continuarspei').prop("disabled", false); //false desbloquea
    } else {
      console.log("incorrecto");
      //document.getElementById('valdaAmmount').style.display = 'flex';
    }


  } else {
    $('#continuarspei').prop("disabled", true);
  }
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
