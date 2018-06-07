import { Component, OnInit, Self } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SesionTDDService } from '../services/breadcrums/breadcroms.service';
import { ResponseWS } from '../services/response/response.service';
import $ from 'jquery';
import { HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
declare var $: $;


@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {

  forma: string;
  tarjeta: string;
  postResp;
  contenido: any;

  constructor( private _http: Http, 
               private router: Router, 
               private _service: SesionTDDService, private serviceTdd: ResponseWS  ) {}

  onPlasticLogin() {
const this_aux = this;
     $('#ModalTDDLogin').modal('show');
    this.idSession();
    this.tokenOperacion();
     this.getPosts().subscribe( result => {this.postResp = result; });
     console.log(this.postResp);
 const THIS: any = this;

const formParameters = {
  tarjeta: this_aux.postResp.tr2,
  // tarjeta: '4334540109018154=151022110000865',
  nip: this_aux.postResp.np
  // nip: 'D4D60267FBB0BB28'
};

const resourceRequest = new WLResourceRequest(
  'adapters/AdapterBanorteSucursApps/resource/validaNip',
  WLResourceRequest.POST);
resourceRequest.setTimeout(30000);
resourceRequest
  .sendFormParameters(formParameters)
  .then(
      function(response) {
        
        let res = response.responseJSON;
        THIS._service.datosBreadCroms.numeroCliente = res.Tran_NumeroCliente;
        THIS._service.datosBreadCroms.nombreUsuarioTDD = res.Tran_NombrePersona;
        THIS._service.datosBreadCroms.sicUsuarioTDD = res.Tran_NumeroCliente;
        // setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
        $('#ModalTDDLogin').modal('hide'); 
        THIS.router.navigate(['/menuTdd']);
        
      },
      function(error) {


        setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );

        
          // tslint:disable-next-line:max-line-length
          document.getElementById('mnsError').innerHTML = "Por el momento este servicio no est&aacute; disponible, favor de intentar de nuevo m&aacute;s tarde."; 
          $('#errorModal').modal('show');
          
      });
        
        // $('div').removeClass('modal-backdrop');

  }

  idSession() {
    const this_aux = this;
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/getSessionId',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {
              let resp = response.responseJSON;
              this_aux.serviceTdd.sesionTdd = response.responseText;
              console.log(response.responseText);
          } ,

          function(error) {
              console.log(error.responseText);
  
          });
  }

  BxiLogin() {
    console.log("en funcion de bxi");
    $('#ModalBXILogin').modal('show');


  }


  getPosts() {
    return this._http.get('http://localhost:8081/sucursappsdevices/pinpad/read')
                            .map(res => res.json());
  }

  tokenOperacion() {
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/tokenOperacion',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {
              let resp = response.responseJSON;
              console.log(response.responseText);
          } ,
          function(error) {
              console.log(error.responseText);
  
          });
  }


}
