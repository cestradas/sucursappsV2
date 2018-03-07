import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-menu-bxi',
  templateUrl: './menu-bxi.component.html',
  styles: []
})
export class MenuBxiComponent implements OnInit {

  // let modalTime = 800;

  constructor(private _http: Http, private router: Router ) { }

  ngOnInit() {
  }


  compraTA() {
    this.router.navigate(['/compraTA']);
    $('div').removeClass('modal-backdrop');
  }

  moreOptions() {

  
    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'none';
      document.getElementById('opciones').style.display = 'none';
      document.getElementById('masOpciones').style.display = 'block';
      document.getElementById('regresar').style.display = 'block';
    }, 2000);

   // $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
    // $('#opciones').addClass('animated fadeOutUp slow');
   // $('#curp').removeClass('animated fadeOutUp slow');


    /*setTimeout(() => {

      $("#masOpciones").fadeToggle(1000);
    
    $("#regresar").fadeToggle(1000);
    }, 1000);
    

    
    $("#operacionesFrecuentes").fadeToggle(1000);
    
    $("#opciones").fadeToggle(1000);

    setTimeout(() => {
      document.getElementById('operacionesFrecuentes').style.display = 'none';
      document.getElementById('opciones').style.display = 'none';
      document.getElementById('masOpciones').style.display = 'block';
      
    
      document.getElementById('regresar').style.display = 'block';
    }, 1000);
    

    */
      
    
  }

  regresar() {



    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'block';
      document.getElementById('opciones').style.display = 'block';
      document.getElementById('masOpciones').style.display = 'none';
      document.getElementById('regresar').style.display = 'none';
    }, 2000);
    /*
    setTimeout(() => {

      $("#operacionesFrecuentes").fadeToggle(1000);
    
    $("#opciones").fadeToggle(1000);
    }, 1000);



    $("#masOpciones").fadeToggle(1000);
    
    $("#regresar").fadeToggle(1000);

    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'block';
      document.getElementById('masOpciones').style.display = 'none';
      document.getElementById('opciones').style.display = 'block';
      document.getElementById('regresar').style.display = 'none';
    }, 1000);

*/
   
  }

}
