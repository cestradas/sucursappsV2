import { SesionBxiService } from './../../pages/bxi/sesion-bxi.service';
import { Component, OnInit ,  ViewChild, ElementRef} from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';


@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  NombreUsuario: string; 
  constructor(private service: SesionBxiService )  {}


  ngOnInit() {
    const this_aux = this;
    const detalleUsuario = JSON.parse( this_aux.service.infoUsuario);
     this_aux.NombreUsuario = detalleUsuario.NombreUsuario;
  }

}
