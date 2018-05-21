import { OperacionesBXI } from './../../pages/bxi/operacionesBXI';
import { SesionBxiService } from './../../pages/bxi/sesion-bxi.service';
import { Component, OnInit ,  ViewChild, ElementRef} from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { SesionTDDService } from '../../services/breadcrums/breadcroms.service';

declare var jquery: any; // jquery
declare var $: any;
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
    const this_aux = this;  
    if ( this_aux._service.datosBreadCroms.nombreUsuarioTDD !== '' ) {

      this_aux.NombreUsuario =  this_aux._service.datosBreadCroms.nombreUsuarioTDD;
      console.log("TDD ", this_aux._service.datosBreadCroms.nombreUsuarioTDD);

    } else
     if ( this_aux.service.NombreUsuario !== '' || this_aux.service.NombreUsuario !== undefined ) {

      this.NombreUsuario = this_aux.service.NombreUsuario;
      console.log("BEL ", this_aux.service.NombreUsuario); 
      this.service.Login = "1";
      console.log("BEL ", this_aux.service.Login); 
    }
     
  }

  cerrarSessionBEL() {
    const this_aux = this;  
    if (this_aux.service.Login === "1" ) {
      
      this_aux.service.Login = "0";
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      console.log("Cerrar sesion BEL");
      operacionesbxi.cerrarSesionBEL().then(
          function(response) {
            console.log(response);
            const responseJson = response.responseJSON;
            if (responseJson.Id === "SEG0001") {
              console.log("BEL cerro sesion",  this_aux.service.Login); 
              this_aux.router.navigate(['/login']);
            } else {
              console.log("BEL error cerrar sesion", responseJson.Id  + responseJson.MensajeAUsuario);
              document.getElementById('msgError').innerHTML =   "Error en cerrar sesión";
              $('#ModalErrorTransaccion').modal('show'); 
            }
          },
          function(error) {
            
            console.log(error);
            document.getElementById('msgError').innerHTML =   "Error en cerrar sesión";
            console.log("BEL error cerrar sesion", error.errorCode  + error.errorMsg);
           // this_aux.router.navigate(['/login']);
  
          });


    } else { 
        this.cerrarSesion();
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
