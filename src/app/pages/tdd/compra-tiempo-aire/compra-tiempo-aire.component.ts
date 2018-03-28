import { Component, OnInit } from '@angular/core';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { Subscription } from 'rxjs/Subscription'; 
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import $ from 'jquery';
import { SaldosDiaMesService } from '../../../services/SaldosDiaMes/saldoDiaMes.service';
declare var $: $;

@Component({  
  selector: 'app-compra-tiempo-aire',
  templateUrl: './compra-tiempo-aire.component.html',
})
export class CompraTiempoAireComponent implements OnInit {

  subscription: Subscription;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;

  forma: FormGroup;

  recargas: any[] = [];
  loading = false;

  constructor( 
               private _service: ConsultaSaldosTddService,
               private _serviceSesion: SesionTDDService,
               private _saldosDiaMes: SaldosDiaMesService
              ) {

                $('#_modal_please_wait').modal('show');

                this.forma = new FormGroup({

                  'telefono': new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('/^([0-9])*$/')]),
                  'email': new FormControl('', [Validators.required,
                    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),

                });

                console.log(this.forma);

                this.forma.controls['telefono'].valueChanges.subscribe(
                  data => {
                    console.log('telefono', data);
                    console.log('forma', this.forma);
                  });

                this._service.validarDatosSaldoTdd().then(
                  mensaje => {
            
                    console.log('Saldos cargados correctamente TDD');
                    this.saldoClienteTdd = mensaje.SaldoDisponible;
                    this.cuentaClienteTdd = mensaje.NumeroCuenta;
                    this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;
            
                  }
                );         
                setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );
               }

  ngOnInit() {

    const THIS: any = this;

    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/consultaCatalogoEmpresaTel',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {
            
          let res = response.responseJSON;

          // tslint:disable-next-line:forin
          for ( let i in res ) {

            console.log(res[i].Nombre);

            switch (res[i].Nombre) { 
              case 'Telcel': { 
                document.getElementById("imagenTelcel").id = res[i].IdCatEmpresa;
                
                 break; 
              } 
              case 'Movistar': { 
                document.getElementById("importeMovi").id = res[i].IdCatEmpresa;
                
                 break; 
              }
              case 'Unefon': { 
                document.getElementById("importeUnefon").id = res[i].IdCatEmpresa;
                
                 break; 
              }
              case 'Iusacell': { 
                document.getElementById("importeIusa").id = res[i].IdCatEmpresa;
                
                 break; 
              }
              default: { 
                console.log("No se pudo cargar la informacion de los catalogos telefonicos");
                 break; 
              } 
           } 

          }

  
          },
          function(error) {

            console.error("El WS respondio incorrectamente1");
            // document.getElementById('mnsError').innerHTML = "El Ws no respondio";
            $('#errorModal').modal('show');
            
  
          });

          
          
  }
  

  cargaSaldo(id) {

    $('#_modal_please_wait').modal('show');

    const THIS: any = this;
    
    console.log(id.id);

    const formParameters = {
      
      paramIdCatEmpresa: id.id,
      
    };
    
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/consultaImporteTiempoAire',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .sendFormParameters(formParameters)
      .then(
          function(response) {
            
          let res = response.responseJSON;

          console.log(response.responseText);

          THIS.recargas = res;
  
          },
          function(error) {
  
  
            console.error("El WS respondio incorrectamente2");
  
          });

          setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );

  }

  recargaTiempoAire() {



  }


}
