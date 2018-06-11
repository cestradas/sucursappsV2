import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import $ from 'jquery';
declare var $: $;

let numCuenta = "";
let importe = "";
let descripcion = "";
let correo = "";

@Component({
  selector: 'app-transfer-internacionales',
  templateUrl: './transfer-internacionales.component.html',
  styles: []
})
export class TransferInternacionalesComponent implements OnInit {

  datosCuenta: any[] = [];
  transferSPEI: any[] = [];


  constructor(private _http: Http, private router: Router) { }

  ngOnInit() {

    this.consultaCuentas();
    //ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("continuar");
    let btnConfirmar = document.getElementById("confirmar");
    let btnCerrar = document.getElementById("cerrar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnConfirmar.classList.remove("color-botones");
      btnConfirmar.classList.add("color-botones_Preferente");
      btnCerrar.classList.remove("color-botones");
      btnCerrar.classList.add("color-botones_Preferente");
    }

  }



// getCurrency(amount: number) {
//  return this.currencyPipe.transform(amount, 'EUR', true, '1.2-2');
// }

onConfirmacion() {

  console.log("adentro Trnsferencias Internacionales SPEI ");
  //numCuenta = document.getElementById("accountNumber").value;

  let attribute = $("#accountNumber").val();
  console.log(attribute);

    const THIS: any = this;

    let formParameters = {
      numCuenta:  numCuenta,
      importe: importe,
      descripcion: descripcion,
      correo: correo
    };
    formParameters.numCuenta = document.getElementById("accountNumber").nodeValue;

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
