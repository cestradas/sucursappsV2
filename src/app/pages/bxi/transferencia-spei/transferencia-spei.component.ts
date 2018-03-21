import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { FormsModule, NgForm, FormGroup } from '@angular/forms';
import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import $ from 'jquery';
declare var $: $;

let bancoRecep = "";
let clabe = "";
let nombreBene = "";
let rfcBenef = "";
let ref = "";

let importe = "";
let descripcion = "";
let correo = "";
let rfcEmi = "";


@Component({
  selector: 'app-transferencia-spei',
  templateUrl: './transferencia-spei.component.html',
})
export class TransferenciaSpeiComponent implements OnInit {

  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  datosCuenta: any[] = [];
  transferSPEI: any[] = [];
 
  
  constructor(private _http: Http, private router: Router, public service: SesionBxiService, private renderer: Renderer2) { }

  ngOnInit() {

    this.fillSelectCuentas();
    // this.consultaCuentas();
    

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



  guardar( forma: NgForm ) {
    console.log("ngForm", forma);
    console.log("Valor forma", forma.value) ;
    
  }

  onConfirmacion( forma: NgForm ) {

    console.log("ngForm", forma);
    console.log("Valor forma", forma.value) ;
    console.log("Valor forma", forma.value.accountNumber) ; 
    console.log("adentro Trnsferencias Internacionales SPEI ");

    const this_aux =  this;
  
    bancoRecep =  forma.value.sel1;
    clabe = forma.value.clabe;
    nombreBene = forma.value.beneficiario;
    rfcBenef = forma.value.rfc;
    ref = forma.value.referencia;
   
    importe = forma.value.importe;
    descripcion = forma.value.descripcion;
    correo = forma.value.email;
    rfcEmi = forma.value.rfcEmisor;
  
    
    // numCuenta = document.getElementById("accountNumber").value;
  
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    operacionesbxi.confirmaTransferSPEI(bancoRecep, clabe, nombreBene, rfcBenef, ref, importe, descripcion, correo, rfcEmi).then(
      function(response) {

        console.log(response.responseJSON);
            
           this.transferSPEI = response.responseJSON;
            
           
            if ( this.transferSPEI.Id === '1') {

              console.log(this.transferSPEI);
              this.router.navigate(['/TransferFinishSpei']);
                     
            } else {
              console.log(this.transferSPEI.MensajeAUsuario);
            }



      }, function(error) {

      });
  
  
  
  }
  
  consultaCuentas() {
       
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      operacionesbxi.consultaClabeSaldo().then(
        function(response) {

          console.log(response.responseJSON);
                    
                    this.datosCuenta = response.responseJSON;
                    console.log(this.datosCuenta);

                  //  if ( this.datosCuenta.Id === '1') {
                     
                  //  } else {
                  //    console.log(this.datosCuenta.MensajeAUsuario);
                  //  }

        }, function(error) {

        });
  
  
  }

}
