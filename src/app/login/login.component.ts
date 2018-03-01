import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  forma: string;
  tarjeta: string;
  postResp;

  constructor( public router: Router,
               public _http: Http ) { }

  ngOnInit() {
  }

  onPlasticLogin() {
    $('#ModalTDDLogin').modal('show');
     this.getPosts().subscribe( result => {this.postResp = result; });

     console.log(this.postResp);

      const THIS: any = this;

  // const formParameters = {
  //   tarjeta: this.postResp.tr2,
  //   nip: this.postResp.np

  // };

//   const resourceRequest = new WLResourceRequest(
//     'adapters/AdapterBanorteSucursApps/resource/validaNip',
//     WLResourceRequest.POST);
// resourceRequest.setTimeout(30000);
// resourceRequest
//     .sendFormParameters(formParameters)
//     .then(
//         function(response) {
//           console.log(response.responseText);
//           sessionStorage.setItem('tipoCliente', response.responseText);
//           $('div').removeClass('modal-backdrop');
//           THIS.router.navigate(['/menutdd']);
//           THIS.loading = false;
//         },
//         function(error) {
//           THIS.loading = false;

//         });

          $('#ModalTDDLogin').modal('hide');
          $('div').removeClass('modal-backdrop');

          THIS.router.navigate(['/menuTdd']);


  }

  getPosts() {
    return this._http.get('http://localhost:8081/sucursappsdevices/pinpad/read')
                            .map(res => res.json());
  }

}
