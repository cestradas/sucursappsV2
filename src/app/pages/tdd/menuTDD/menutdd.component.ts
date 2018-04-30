import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-menutdd',
  templateUrl: './menutdd.component.html',
  styles: []
})
export class MenutddComponent implements OnInit {

  loadingM: boolean;

  constructor( private _http: Http, private router: Router  ) {

   }

  ngOnInit() {
    // $('div').removeClass('modal-backdrop');
  }

  mandarPage(id) {
    
    console.log(id);

    switch (id) {
      case 'saldosMov':
          this.router.navigate(['/movimientoSaldo']);
          break;
      case 'edc':
          this.router.navigate(['/impresion-edc']);
          break;
      case 'compraTA':
          this.router.navigate(['/compraTiempoAire']);
          break;
      case 'spei':
          this.router.navigate(['/spei']);
          break;
      case 'transBanorte':
          this.router.navigate(['/transBanorte']);
          break;
      case 'pagoServ':
          this.router.navigate(['/pagoServicios']);
          break;
      case 'mantoBeneficiarios':
          this.router.navigate(['/mantoBeneficiarios']);
          break;
      case 'pagoCredito':
          this.router.navigate(['/pagoCredito']);
          break;
      case 'actDatosContacto':
          this.router.navigate(['/actualizarDatosContacto']);
          break;
          
      default:
      this.router.navigate(['/menuTdd']);
  }

  }


  compraTA() {
    this.router.navigate(['/compraTA']);
    $('div').removeClass('modal-backdrop');
  }

  moreOptions() {

  
    // setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'none';
      document.getElementById('opciones').style.display = 'none';
      document.getElementById('masOpciones').style.display = 'block';
      document.getElementById('regresar').style.display = 'block';

    // }, 2000);

   // $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
   
      
    
  }

  regresar() {



    // setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'block';
      document.getElementById('opciones').style.display = 'block';
      document.getElementById('masOpciones').style.display = 'none';
      document.getElementById('regresar').style.display = 'none';

    // }, 2000);
    
   
  }

}
