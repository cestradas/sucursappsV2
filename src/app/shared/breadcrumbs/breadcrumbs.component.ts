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
              private _service: SesionTDDService,
              private router: Router )  {}


  ngOnInit() {

    console.log("TDD ", this._service.datosBreadCroms.nombreUsuarioTDD);
    console.log("BEL ", this.service.NombreUsuario); 
    
    if ( this._service.datosBreadCroms.nombreUsuarioTDD !== '' ) {

      this.NombreUsuario =  this._service.datosBreadCroms.nombreUsuarioTDD;

    } 
     if ( this.service.NombreUsuario !== '' || this.service.NombreUsuario !== undefined ) {

      this.NombreUsuario = this.service.NombreUsuario;

    }
     
  }

   cerrarSesion() {

    const THIS: any = this;

    console.log("Cerrar sesion");

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/cerrarSesion',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest.send().then(
          function(response) {
            
            console.log(response);

            THIS.router.navigate(['/login']);
  
          },
          function(error) {
            
            console.log(error);
            THIS.router.navigate(['/login']);
  
          });

  }

}
