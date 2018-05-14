import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-impresion-edc-tdd',
  templateUrl: './impresion-edc-tdd.component.html',
  styles: []
})
export class ImpresionEdcTddComponent implements OnInit {
  
  fechas: any[];

  constructor(private router: Router) { }

  ngOnInit() {

    const THIS: any = this;

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/consultaEdcTdd',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {

          let res = response.responseJSON;

          console.log(res);

          for (let i = 0 ; i < res.length; i++) {
            
            let temp = res[i].split("-");

            for (let k = 0; k < temp.length; k++) {
    
              if ( k === 0 ) {

                THIS.fechas.push({
                  "Dia" : temp[k]
                });

              }

              if ( k === 1 ) {

                THIS.fechas.push({
                  "Mes" : temp[k]
                });

              }

              if ( k === 2 ) {

                let str = temp[k];
                let resStr = str.substring( 0 , 2 );

                THIS.fechas.push({
                  "Anio" : resStr
                });

              }

            }
            
         }

         console.log(THIS.fechas);
  
          },
          function(error) {

            console.error("El WS respondio incorrectamente1");
            // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
            $('#errorModal').modal('show');
            
  
          });

  }

  operacion(id) {

    const this_aux = this;

    if (id ===  '1') {
      // Envio por correo

      this_aux.router.navigate(['/impresion-edc-final']);

    } else {
      // Imprimir

    }


  }

}
