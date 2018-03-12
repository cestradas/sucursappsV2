import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';


import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-compra-ta',
  templateUrl: './compra-ta.component.html',
  styles: []
})
export class CompraTaComponent implements OnInit {

  postResp;
  tipoMovimiento: string;
  numeroCuenta: string;
  datosCuenta: any[] = [];

  constructor( private _http: Http, private router: Router ) { }

  ngOnInit() {
    this.consultaCuentas();
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
          console.log(response.responseJSON.SaldoDia);
        
          // THIS.router.navigate(['/homePage']);
          // THIS.loading = false;
          
        },
        function(error) {
          THIS.loading = false;
          console.log("hola");
          

        });
        console.log("hola2");
        

  }


  
}