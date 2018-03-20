import { Component, OnInit,  Input, Output } from '@angular/core';
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

  datosCuenta: any[] = [];
  @Input() transferSPEI: any[] = [];
 
  
  constructor(private _http: Http, private router: Router, public service: SesionBxiService ) { }

  ngOnInit() {

    console.log("entroooo");
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

                    if ( this.datosCuenta.Id === '1') {
                     
                    } else {
                      console.log(this.datosCuenta.MensajeAUsuario);
                    }

        }, function(error) {

        });
  
  
  }

}
