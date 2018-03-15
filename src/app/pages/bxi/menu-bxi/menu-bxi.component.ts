import { Autenticacion } from './../autenticacion';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { SesionBxiService } from './../sesion-bxi.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-menu-bxi',
  templateUrl: './menu-bxi.component.html',
  styles: []
})
export class MenuBxiComponent implements OnInit {

  @ViewChild('nombreUsuario', { read: ElementRef}) nombreUsuario: ElementRef ;
  constructor(private service: SesionBxiService, private renderer: Renderer2,  private router: Router ) { }

  ngOnInit() {
    this.setNombreUsuario();
  }

  setNombreUsuario() {
    const this_aux = this;
  // console.log('Dentro setNombreUsuario');
   // console.log( this_aux.service.infoUsuario);
    const autenticacion: Autenticacion = new Autenticacion();
    const detalleUsuario = JSON.parse( this_aux.service.infoUsuario);
    const div = this.renderer.createElement('div');
    const nombre = this.renderer.createText(detalleUsuario.NombreUsuario);
    this.renderer.appendChild(div, nombre);
    this. renderer.appendChild(this.nombreUsuario.nativeElement, div);
    autenticacion.consultaCuentasUsuario(this_aux.service.usuarioLogin).then(
      function(response) {
          const getCuentasJSON = response.responseJSON;
            if (getCuentasJSON.Id === '1') {
                const getCuentas = response.responseText;
                this_aux.service.infoCuentas = getCuentas;
            } else {
              console.log(getCuentasJSON.MensajeAUsuario);
            }
      }, function(error) {}
    );
  }

  comenzarOperacion(idOperacion) {

    switch (idOperacion) {

      case 'pagoserv': this.router.navigate(['/pagoservicios_bxi']);
            break;


    }
  }


  compraTA() {
    this.router.navigate(['/compraTA']);
    $('div').removeClass('modal-backdrop');
  }

  transferInternacionales() {
    
    this.router.navigate(['/transferInternacionales']);
    $('div').removeClass('modal-backdrop');
  }

  moreOptions() {

  
    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'none';
      document.getElementById('opciones').style.display = 'none';
      document.getElementById('masOpciones').style.display = 'block';
      document.getElementById('regresar').style.display = 'block';
      $('#operacionesFrecuentes').removeClass('animated fadeOutUp slow');
      $('#opciones').removeClass('flipOutY fast');
      
    }, 2000);

    $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
    $('#masOpciones').addClass('animated fadeInUp slow');

    $('#opciones').addClass('flipOutY fast');
    $('#regresar').addClass('flipInY slow');
   
      
    
  }

  regresar() {



    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'block';
      document.getElementById('opciones').style.display = 'block';
      document.getElementById('masOpciones').style.display = 'none';
      document.getElementById('regresar').style.display = 'none';
      $('#masOpciones').removeClass('animated fadeOutUp slow');
      $('#regresar').removeClass('flipOutY fast');
    }, 2000);

    $('#masOpciones').addClass('animated fadeOutUp slow');
    $('#operacionesFrecuentes').addClass('animated fadeInUp slow');

    $('#regresar').addClass('flipOutY fast');
    $('#opciones').addClass('flipInY slow');
   
   
   
  }

}
