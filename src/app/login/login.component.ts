import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import $ from 'jquery';
import { SesionTDDService } from '../services/breadcrums/breadcroms.service';
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

  constructor( private _http: Http, 
               private router: Router, 
               private _service: SesionTDDService  ) {}

  onPlasticLogin() {

    console.log("adentro");
     $('#ModalTDDLogin').modal('show');
    //  this.getPosts().subscribe( result => {this.postResp = result; });

    //  console.log(this.postResp);

      const THIS: any = this;

  const formParameters = {
    // tarjeta: this.postResp.tr2,
    tarjeta: '4334540109018154=151022110000865',
    // nip: this.postResp.np
    nip: 'D4D60267FBB0BB28'
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

          THIS._service.datosBreadCroms.nombreUsuarioTDD = res.Tran_NombrePersona;
          THIS.router.navigate(['/menuTdd']);

        },
        function(error) {


          // $('#ModalTDDLogin').modal('hide');

        });

        // $('div').removeClass('modal-backdrop');

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
