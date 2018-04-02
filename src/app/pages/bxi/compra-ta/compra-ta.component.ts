import { Component, OnInit, Renderer2 } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';
import { Autenticacion } from '../autenticacion';

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
  box_price = 0;
  box_price_formatted = "$10.00";

  constructor( private _http: Http, private router: Router, public service: SesionBxiService, private renderer: Renderer2 ) { }

  ngOnInit() {
     this.consultaCatEmpresas();
  }


  consultaCatEmpresas() {
    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    

    operacionesbxi.getCatEmpresas().then(
      function(response) {
        
        console.log(response.responseText);
        let res = response.responseJSON;

        // tslint:disable-next-line:forin
        for ( let i in res ) {

          console.log(res[i].Nombre);

          switch (res[i].Nombre) { 
            case 'Telcel': { 
              document.getElementById("imagenTelcel").id = res[i].IdCatEmpresa;
              
               break; 
            } 
            case 'Movistar': { 
              document.getElementById("importeMovi").id = res[i].IdCatEmpresa;
              
               break; 
            }
            case 'Unefon': { 
              document.getElementById("importeUnefon").id = res[i].IdCatEmpresa;
              
               break; 
            }
            case 'Iusacell': { 
              document.getElementById("importeIusa").id = res[i].IdCatEmpresa;
              
               break; 
            }
            default: { 
              console.log("No se pudo cargar la informacion de los catalogos telefonicos");
               break; 
            } 
         } 

        }


        },
        function(error) {

          console.error("El WS respondio incorrectamente1");
          // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
          $('#errorModal').modal('show');
          

        });
  }


  insertaSaldo(id) {

    $('#_modal_please_wait').modal('show');

    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    
    console.log(id.id);

    operacionesbxi.getSaldo(id.id).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {
          
          this_aux.service.clabeDestinatario = detalleSaldos.ClabeCuenta;

        
        } else {
          console.log(detalleSaldos.MensajeAUsuario);

          this_aux.service.clabeDestinatario = null;
          

        }
      }, function(error) {
  });

    

  }
  
  
}
