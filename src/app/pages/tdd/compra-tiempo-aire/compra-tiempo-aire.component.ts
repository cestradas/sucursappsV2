import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ResponseWS } from '../../../services/response/response.service';
import { SaldosDiaMesService } from '../../../services/SaldosDiaMes/saldoDiaMes.service';
import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-compra-tiempo-aire',
  templateUrl: './compra-tiempo-aire.component.html',
})
export class CompraTiempoAireComponent implements OnInit {

  @ViewChild("telefonoF", { read: ElementRef }) telefonoF: ElementRef;

  subscription: Subscription;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;
  cveTelefonicaF = "";
  forma: FormGroup;

  recargas: any[] = [];
  operador: string;
  importe: number;
  blClassT = false;
  blClassM = false;
  blClassU = false;
  blClassI = false;
  blnStyle: false;

  respuestaTrjeta = "";
  validacionNip = "";

  constructor(
               private _service: ConsultaSaldosTddService,
               private _serviceSesion: SesionTDDService,
               private _saldosDiaMes: SaldosDiaMesService,
               private serviceResponse: ResponseWS
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
    const this_aux =  this;

    console.log(id.id);

    this_aux.cveTelefonicaF = id.id;
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

    this.onPlasticLoginafterSecurity();

    if (this.validacionNip === "OK") {

      // Si el NIP es correcto ejecuta operacion

    const this_aux = this;
    let importeDecimal  = parseFloat(this_aux.importe.toString()).toFixed(2);
    let formParameters = {
      ctaO: this_aux.cuentaClienteTdd,
      cveTelefonica: this_aux.cveTelefonicaF,
      numTel: this_aux.telefonoF.nativeElement.value,
      importeTel: importeDecimal
    };
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/compraTiempoAire',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .sendFormParameters(formParameters)
      .then(
          function(response) {

            console.log(response.responseJSON);

            const compraTAResp = response.responseJSON;


             if ( compraTAResp.Id === '1') {

               console.log(compraTAResp);
               this_aux.serviceResponse.detalleConfirmacionCTA = response.responseText;
               console.log(this_aux.serviceResponse.detalleConfirmacionCTA);
               this.router.navigate(['/compraTiempoAireFinal']);

             } else {
              this_aux.showErrorSuccesMoney(compraTAResp);

             }
          },
          function(error) {


            console.error("El WS respondio incorrectamente2");
            this_aux.showErrorPromise(error);
          });

    }

  }


  onPlasticLoginafterSecurity() {
    const this_aux = this;


    //setTimeout(function() {

    let tr2 = localStorage.getItem("tr2");
     let np = localStorage.getItem("np");
     let respTar = localStorage.getItem("res");
     this.respuestaTrjeta = respTar;
     let descripcion = localStorage.getItem("des");



      if ((respTar !== "NO_OK") && (respTar !== null)) {


        const THIS: any = this;

        const formParameters = {
            //tarjeta: tr2,
             tarjeta: '4334540109018154=151022110000865',
            //nip: np
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
             THIS._service.datosBreadCroms.numeroCliente = res.Tran_NumeroCliente;
             THIS._service.datosBreadCroms.nombreUsuarioTDD = res.Tran_NombrePersona;
             THIS._service.datosBreadCroms.sicUsuarioTDD = res.Tran_NumeroCliente;
             this.validacionNip = "OK";
             // setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );

             // DATOS CORRECTOS

        $('#ModalTDDLogin').modal('hide');
        document.getElementById('mnsError').innerHTML = "Validacion exitosa";
        $('#errorModal').modal('show');
        // THIS.router.navigate(['/menuTdd']);
        // this_aux.consultaTablaCorpBancosService();

      },
      function(error) {


             setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );

              this.validacionNip = "NOK";
               // tslint:disable-next-line:max-line-length
               document.getElementById('mnsError').innerHTML = "Por el momento este servicio no est&aacute; disponible, favor de intentar de nuevo m&aacute;s tarde.";
               $('#errorModal').modal('show');

           });

         } else {

           setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );

              this.validacionNip = "NOK";
               // tslint:disable-next-line:max-line-length
               console.log("Pinpad respondio con " + this.respuestaTrjeta);
               document.getElementById('mnsError').innerHTML = "Por el momento este servicio no est&aacute; disponible, favor de intentar de nuevo m&aacute;s tarde.";
               $('#errorModal').modal('show');

         }

   // }, 50000);


  }

  showErrorPromise(error) {
    console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    $('#_modal_please_wait').modal('hide');
    $('#errorModal').modal('show');
  }

  showErrorSuccesMoney(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('msgError').innerHTML =   json.MensajeAUsuario;
    $('#_modal_please_wait').modal('hide');
    $('#ModalErrorTransaccion').modal('show');
  }


}
