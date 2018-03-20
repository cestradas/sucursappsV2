import { Component, OnInit,  Input, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { FormsModule, NgForm, FormGroup } from '@angular/forms';

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

  datosCuenta: any[] = [];
  @Input() transferSPEI: any[] = [];
 
  
  constructor(private _http: Http, private router: Router) { }

  ngOnInit() {

    this.consultaCuentas();

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
  
    
  
      const THIS: any = this;
  
      let formParameters = {
        bancoRecep:  bancoRecep,
        clabe: clabe,
        nombreBene: nombreBene,
        rfcBenef: rfcBenef,
        ref: ref,
        importe: importe,
        descripcion: descripcion,
        correo: correo,
        rfcEmi: rfcEmi
      };
     
  
  const resourceRequest = new WLResourceRequest(
    'adapters/AdapterBanorteSucursApps/resource/transferInterSPEI',
    WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
    .sendFormParameters(formParameters)
    .then(
        function(response) {
          
          console.log(response.responseJSON);
            
           THIS.transferSPEI = response.responseJSON;
            
            console.log(THIS.transferSPEI);
            THIS.router.navigate(['/TransferFinishSpei']);
          
        },
        function(error) {
          THIS.loading = false;
  
        });
  
  
  
  }
  
  consultaCuentas() {
       
    console.log("adentro cnsultaCuentas");
  
    let tipoMovimiento = "1";
    let numeroCuenta = "0665815063";
  
      const THIS: any = this;
  
  const formParameters = {
    tipoMovimiento:  tipoMovimiento,
    numeroCuenta: numeroCuenta
  
  };
  
  const resourceRequest = new WLResourceRequest(
    'adapters/AdapterBanorteSucursApps/resource/consultaClabeSaldo',
    WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
    .sendFormParameters(formParameters)
    .then(
        function(response) {
          
          console.log(response.responseJSON);
            
            THIS.datosCuenta = response.responseJSON;
            console.log(THIS.datosCuenta);
          
        },
        function(error) {
          THIS.loading = false;
  
        });
  
  
  }

}
