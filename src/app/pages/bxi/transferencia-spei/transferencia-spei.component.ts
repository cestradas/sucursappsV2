import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { FormsModule, NgForm, FormGroup } from '@angular/forms';
import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';
import { Autenticacion } from '../autenticacion';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';



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
 
  
  constructor(private _http: Http, private router: Router, public service: SesionBxiService, private renderer: Renderer2) { }

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
            

            break;
      case '2':  // TEF
            
            document.getElementById('tranSPEI').style.display = 'none';
            document.getElementById('tranQuick').style.display = 'none';
         
            document.getElementById('tranTEF').style.display = 'block';

            break;
      case '3':  // QUICK

            
            document.getElementById('tranTEF').style.display = 'none';
            document.getElementById('tranSPEI').style.display = 'none';
        
            document.getElementById('tranQuick').style.display = 'block';
           

            break;
          
  
          }
  }

  showDetallePago(forma: NgForm) {
    const this_aux = this;  
      
    console.log("ngForm", forma);
    console.log("Valor forma", forma.value) ;
    
    console.log("adentro Trnsferencias Internacionales SPEI ");

    const operacionSelect = this_aux.selectTipo.nativeElement.value.toString();
    console.log('this_aux.selectTipo =' + this_aux.selectTipo.nativeElement.value.toString());

    switch (operacionSelect) {

      case '1':  // SPEI

      importe = forma.value.amountSPEI;
      descripcion = forma.value.descriptionSPEI;
      ref = forma.value.referenceSPEI;           

            break;

      case '2':  // TEF

      
      rfcEmi = forma.value.rfcTEF;
      importe = forma.value.amountTEF;
      descripcion = forma.value.descriptionTEF;
      ref = forma.value.referenceTEF;   

       
            break;
      case '3':  // QUICK

      tipoCuenta = forma.value.cuenta;
      bancoRecept =  forma.value.sel1;
      clabe = forma.value.clabe;
      importe = forma.value.ammountQUICK;
     
      
         
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
              
                      this.transferSPEI = response.responseJSON;
                       
                      
                       if ( this.transferSPEI.Id === '1') {
           
                         console.log(this.transferSPEI);
                         this_aux.service.detalleConfirmacionSPEI = this.transferSPEI;
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
