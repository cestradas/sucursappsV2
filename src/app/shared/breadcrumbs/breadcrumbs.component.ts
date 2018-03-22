import { SesionBxiService } from './../../pages/bxi/sesion-bxi.service';
import { Component, OnInit ,  ViewChild, ElementRef} from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { SesionTDDService } from '../../services/breadcrums/breadcroms.service';


@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  NombreUsuario: string; 
  constructor(private service: SesionBxiService,
              private _service: SesionTDDService )  {}


  ngOnInit() {
    // const this_aux = this;
    // const detalleUsuario = JSON.parse( this_aux.service.infoUsuario);
    //  this_aux.NombreUsuario = detalleUsuario.NombreUsuario;
    
    if ( this._service.datosBreadCroms.nombreUsuarioTDD !== '' ) {

      this.NombreUsuario =  this._service.datosBreadCroms.nombreUsuarioTDD;

    } 
    // else if ( this.service. ) {

    // }
     
  }

   cerrarSesion() {

  }

}
