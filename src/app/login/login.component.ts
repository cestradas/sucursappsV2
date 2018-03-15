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
    'http://localhost:9080/mfp/api/adapters/AdapterBanorteSucursApps/resource/validaNip',
    WLResourceRequest.POST);
resourceRequest.setTimeout(30000);
resourceRequest
    .sendFormParameters(formParameters)
    .then(
        function(response) {
          console.log(response.responseText);
          // sessionStorage.setItem('tipoCliente', response.responseText);
          THIS.router.navigate(['/menuTdd']);
          
        },
        function(error) {
          
          
          // $('#ModalTDDLogin').modal('hide');

        });
        
        $('div').removeClass('modal-backdrop');

  }

  BxiLogin() {
    console.log("en funcion de bxi");
    $('#ModalBXILogin').modal('show');
    
    
  }

  validaUsuario() {
    document.getElementById('view_usr').style.display = 'none';
    // document.getElementById('view_pass_token_cel').style.display = 'block';
    document.getElementById('view_pass_token').style.display = 'block';
    // document.getElementById('view_pass').style.display = 'block';
  }

  validaTokenFisico() {
    this.router.navigate(['/menuBXI']);
    $('div').removeClass('modal-backdrop');
  }

  getPosts() {
    return this._http.get('http://localhost:8081/sucursappsdevices/pinpad/read')
                            .map(res => res.json());
  }


}
