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

  constructor( private _http: Http, private router: Router  ) { }

  ngOnInit() {
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
