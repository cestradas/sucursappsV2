import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
 

  listaCuentasBen: Array<any> = [];
  
  datosCuenta: any[] = [];

  constructor( private _http: Http, private router: Router, public service: SesionBxiService, private renderer: Renderer2 ) { }

  ngOnInit() {
     this.consultaCatEmpresas();
     this.fillSelectCuentas();
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


  insertaSaldo(id) {

    $('#_modal_please_wait').modal('show');

    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    
    console.log(id.id);

    operacionesbxi.getSaldoCompany(id.id).then(
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
