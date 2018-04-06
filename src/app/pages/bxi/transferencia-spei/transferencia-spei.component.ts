import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
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

 
  listaCuentasBen: Array<any> = [];
  listaDatosBen: Array<any> = [];
  datosCuenta: any[] = [];
  transferSPEI: any[] = [];

  labelTipoAutentica: string;
  CuentaDestino: string;
  

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

      'rfcTEF': new FormControl('', [Validators.required, Validators.maxLength(13)]),
      'amountTEF': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000)]),
      'descriptionTEF': new FormControl('', [Validators.required, Validators.maxLength(60)]),
      'referenceTEF': new FormControl('', [Validators.required, Validators.maxLength(7)]),

      // Quick

      
      'cuenta': new FormControl('', [Validators.required, Validators.maxLength(20)]),
      'sel1': new FormControl('', [Validators.required]),
      'clabe': new FormControl('', [Validators.required, Validators.maxLength(15)]),
      'ammountQUICK': new FormControl('', [Validators.required, Validators.min(0), Validators.max(7000)]),
  
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

          this.forma.controls['rfcTEF'].valueChanges.subscribe(
            data => {
              console.log('rfcTEF', data);
              console.log('forma', this.forma);

              this_aux.rfcEmiF = data;
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
  }

  ngOnInit() {

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

            document.getElementById('tranSPEI').style.display = '';
            

            break;
      case '2':  // TEF
            
            document.getElementById('tranSPEI').style.display = 'none';
            document.getElementById('tranQuick').style.display = 'none';
         
            document.getElementById('tranTEF').style.display = 'block';

            document.getElementById('tranTEF').style.display = '';

            break;
      case '3':  // QUICK

            
            document.getElementById('tranTEF').style.display = 'none';
            document.getElementById('tranSPEI').style.display = 'none';
        
            document.getElementById('tranQuick').style.display = 'block';
           
            document.getElementById('tranQuick').style.display = '';
            break;
          
  
          }
  }

  showDetallePago() {
    const this_aux = this;  
      
    
    
    console.log("adentro Trnsferencias Internacionales SPEI ");

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

  $('#confirmModal').modal('show');
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

  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');

  lblAliasOrigen.innerHTML = elementHTML.textContent;
  lblCuentaOrigen.innerHTML = numCuenta_seleccionada.toString();
  this_aux.service.numCuentaSeleccionado = numCuenta_seleccionada;
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

  /*cuentasArray.forEach(cuentaUsuario => {

       if (cuentaUsuario.TipoCuenta.toString() === '5') {
        this_aux.listaCuentasBen.push(cuentaUsuario);
        this_aux.crearListaBeneficiarios(cuentaUsuario);
       }

    });*/
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

      if (auxcuenta.AplicaTEF.toString() === "true") {

        const li =  this.renderer.createElement('li');
        const a = this.renderer.createElement('a');
        const textoCuenta = this.renderer.createText( auxcuenta.DescripcionTipoCuenta);
        this.renderer.setProperty(a, 'value', auxcuenta.NoCuenta);
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
        this_aux.service.nombreBeneficiario = Beneficiarios.NombreSinFormato;
      }
    });
        
        
    
      });
}



  confirmarPago(token) {

    

    const this_aux = this;

    this.validaDatosBen();
    
    ctaO = this_aux.service.numCuentaSeleccionado;
    ctaDest = this_aux.service.numCuentaDestinario;
    sic = this_aux.service.infoUsuarioSIC;
    bancoRecep = this_aux.service.claveBancoDestino;
    aliasCta = this_aux.service.claveAliasCuenta;

    if (clabe === null || clabe === "") {
      clabe = "014180570107939481";
    } else {
      clabe = this_aux.service.clabeDestinatario; 
    }
    
    
    // nombreBene  // de donde?   
    nombreBene = this_aux.service.nombreBeneficiario;
    // correo // DE DONDE?
    // correo = "miguel.garcia_softtek@banorte.com";
    correo = this_aux.service.correoBeneficiario;
    // rfcEmi // menu bxi?
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
              
                      
                       
                      
                       if ( this.transferSPEI.Id === '1') {
           
                         console.log(this.transferSPEI);
                         this_aux.service.detalleConfirmacionSPEI = response.responseText;
                         console.log(this_aux.service.detalleConfirmacionSPEI);
                         this.router.navigate(['/TransferFinishSpei']);
                                
                       } else {
                         console.log(this.transferSPEI.MensajeAUsuario);
                       }
  
                    }, function(error) { }
                  );
              } else {
                console.log(infoUsuarioJSON.MensajeAUsuario);
              }
        }, function(error) {
        });
        

            break;
      case '2':  // TEF
            

            break;
      case '3':  // QUICK

            
 

            break;
          
  
          }


    

}
  
 

}
