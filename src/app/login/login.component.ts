import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import $ from 'jquery';
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

  constructor( private _http: Http, private router: Router ) {}

  onPlasticLogin() {
    
    console.log("adentro");
     $('#ModalTDDLogin').modal('show');
     this.getPosts().subscribe( result => {this.postResp = result; });

     console.log(this.postResp);

      const THIS: any = this;

  const formParameters = {
    tarjeta: this.postResp.tr2,
    nip: this.postResp.np

  };

  const resourceRequest = new WLResourceRequest(
    'adapters/AdapterBanorteSucursApps/resource/validaNip',
    WLResourceRequest.POST);
resourceRequest.setTimeout(30000);
resourceRequest
    .sendFormParameters(formParameters)
    .then(
        function(response) {
          console.log(response.responseText);
          sessionStorage.setItem('tipoCliente', response.responseText);
          THIS.router.navigate(['/homePage']);
          THIS.loading = false;
        },
        function(error) {
          THIS.loading = false;
          console.log("hola");
          $('#ModalTDDLogin').modal('hide');

        });
        console.log("hola");
        $('#ModalTDDLogin').modal('hide');

  }

  BxiLogin() {
    console.log("en funcion de bxi");
    $('#ModalBXILogin').modal('show');
    
    
  }


  getPosts() {
    return this._http.get('http://localhost:8081/sucursappsdevices/pinpad/read')
                            .map(res => res.json());
  }


}
