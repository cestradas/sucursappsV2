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
    if (localStorage.getItem("contadorTime") === null)      {
      localStorage.setItem("contadorTime", "1");
      this_aux.comienzaContador();
    } 
    
    if ( this_aux._service.datosBreadCroms.nombreUsuarioTDD !== '' ) {

      this_aux.NombreUsuario =  this_aux._service.datosBreadCroms.nombreUsuarioTDD;
      // console.log("TDD ", this_aux._service.datosBreadCroms.nombreUsuarioTDD);

      // Valida preferencia Tarjeta cliente

      let storageTipoClienteTDD = localStorage.getItem("tipoClienteTar");
      let navElement = document.getElementById("navBar");

    if (storageTipoClienteTDD === "true") {

      navElement.classList.remove("nav-img-banorte");
      navElement.classList.add("nav-img-banorte-preferente");

      //localStorage.removeItem("tipoClienteBEL");

    } else {

      navElement.classList.remove("nav-img-banorte-preferente");
      navElement.classList.add("nav-img-banorte");

      //localStorage.removeItem("tipoClienteBEL");

    }

    } else
     if ( this_aux.service.NombreUsuario !== '' || this_aux.service.NombreUsuario !== undefined ) {

      this.NombreUsuario = this_aux.service.NombreUsuario;
      // console.log("BEL ", this_aux.service.NombreUsuario);
      this.service.Login = "1";
      // console.log("BEL ", this_aux.service.Login);

      let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
      let navElement = document.getElementById("navBar");

      if (storageTipoClienteBEL === "true") {

        navElement.classList.remove("nav-img-banorte");
        navElement.classList.add("nav-img-banorte-preferente");

        //localStorage.removeItem("tipoClienteBEL");

      } else {

        navElement.classList.remove("nav-img-banorte-preferente");
        navElement.classList.add("nav-img-banorte");

        //localStorage.removeItem("tipoClienteBEL");

      }
    }

  }



  cerrarSessionBEL() {
    const this_aux = this;
    localStorage.setItem("TimeOut", localStorage.getItem('TimeOutIni'));
    if (this_aux.service.Login === "1" ) {
      sessionStorage.removeItem("campania");
      sessionStorage.removeItem("idSesion");
      sessionStorage.removeItem("tipoClienteBEL");
      sessionStorage.removeItem("doc");
      sessionStorage.removeItem("nombreDoc");
      localStorage.removeItem("contadorTime");
      
    const THIS: any = this;
      this_aux.service.Login = "0";
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      console.log("Cerrar sesion BEL");
      operacionesbxi.cerrarSesionBEL().then(
          function(response) {
            // console.log(response);
            const responseJson = response.responseJSON;
            if (responseJson.Id === "SEG0001") {
              // console.log("BEL cerro sesion",  this_aux.service.Login);
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
             // localStorage.removeItem('TimeOut');
             // localStorage.removeItem('TimeOutIni');
              this_aux.router.navigate(['/final']);
            } else {
              // console.log("BEL error cerrar sesion", responseJson.Id  + responseJson.MensajeAUsuario);
              this_aux.router.navigate(['/final']);
              document.getElementById('msgError').innerHTML =   "Error en cerrar sesión";
              $('#ModalErrorTransaccion').modal('show');
            }
          },
          function(error) {
            this_aux.router.navigate(['/final']);
            // console.log(error);
            document.getElementById('msgError').innerHTML =   "Error en cerrar sesión";
            // console.log("BEL error cerrar sesion", error.errorCode  + error.errorMsg);
           // this_aux.router.navigate(['/login']);

          });


    } else {
        this.cerrarSesion();
    }

  }


   cerrarSesion() {

    const THIS: any = this;

    console.log("Cerrar sesion");
    localStorage.removeItem("validaNipServ");
    sessionStorage.removeItem("campania");
    sessionStorage.removeItem("idSesion");
    localStorage.removeItem("des");
    localStorage.removeItem("np");
    localStorage.removeItem("res");
    localStorage.removeItem("tr2");
    localStorage.removeItem("tr2_serv");
    localStorage.removeItem("np_serv");
    localStorage.removeItem("res_serv");
    localStorage.removeItem("tipoClienteTar");
    localStorage.removeItem("doc");
    localStorage.removeItem("nombreDoc");
    localStorage.removeItem("contadorTime");
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps2/resource/cerrarSesion',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest.send().then(
          function(response) {

            // console.log(response);

          WLAuthorizationManager.logout('banorteSecurityCheckSa');
           
            // setTimeout( () => THIS.router.navigate(['/login']), 500 );
            THIS.router.navigate(['/final']);


          },
          function(error) {

            WLAuthorizationManager.logout('banorteSecurityCheckSa');
            // console.log(error);
            THIS.router.navigate(['/final']);

          });

  }

  comienzaContador() {
    const this_aux = this;
    const body = $('body');
    body.on('click', function() {
      localStorage.setItem('TimeOut', localStorage.getItem('TimeOutIni'));
    });
  
    setInterval( function () {
      const valueNewTimeOut = +localStorage.getItem('TimeOut') - 1;
      localStorage.setItem('TimeOut', valueNewTimeOut.toString());
      if  (valueNewTimeOut === 15)  {
               $('#avisoSesionExpira').modal('show');
           }
           if  (valueNewTimeOut <= 15)  {
             document.getElementById('addExpira').innerHTML =  valueNewTimeOut.toString();
           } 
           if (valueNewTimeOut === 0) {
             $('#avisoSesionExpira').modal('hide');
              this_aux.cerrarSessionBEL();
           }
    }, 1000);
  
  }

}
