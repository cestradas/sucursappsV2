import { Component, OnInit } from '@angular/core';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { SaldosDiaMesService } from '../../../services/SaldosDiaMes/saldoDiaMes.service';
import $ from 'jquery';
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
  operador: string;
  importe: number;
  blClassT = false;
  blClassM = false;
  blClassU = false;
  blClassI = false;
  blnStyle: false;

  constructor(
               private _service: ConsultaSaldosTddService,
               private _serviceSesion: SesionTDDService,
               private _saldosDiaMes: SaldosDiaMesService
              ) {

                this._service.cargarSaldosTDD();

                $('#_modal_please_wait').modal('show');

                this.forma = new FormGroup({

                  'telefono': new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
                  'email': new FormControl('', [Validators.required,
                    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
                  'operador': new FormControl(),
                  'importe': new FormControl()

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

    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("continuar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }



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

    switch (id.name) {
      case 'importeTelcel': {
        this.operador = 'Telcel';
        this.blClassT = true;
        this.blClassM = false;
        this.blClassU = false;
        this.blClassI = false;
        console.log('Telcel');
         break;
      }
      case 'importeMovi': {
        this.operador = 'Movistar';
        this.blClassM = true;
        this.blClassT = false;
        this.blClassU = false;
        this.blClassI = false;
         break;
      }
      case 'importeUnefon': {
        this.operador = 'Unefon';
        this.blClassT = false;
        this.blClassM = false;
        this.blClassU = true;
        this.blClassI = false;
         break;
      }
      case 'importeIusa': {
        this.operador = 'Iusacell';
        this.blClassT = false;
        this.blClassM = false;
        this.blClassU = false;
        this.blClassI = true;
         break;
      }
      default: {
        console.log("No existe ese operador: " + id.id);
         break;
      }
   }

    console.log("Params img telefonos: " , id.name);

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

  cargaImporte(param) {

    $('label').removeClass('border border-danger');
    $('#' + param.id).addClass('border border-danger');
    this.importe = param.id;

  }

  recargaTiempoAire() {



  }


}
