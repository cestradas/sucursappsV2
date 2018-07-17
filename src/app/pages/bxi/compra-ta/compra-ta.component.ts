import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';
import { Autenticacion } from '../autenticacion';

import $ from 'jquery';
declare var $: $;

let ctaO = "";
let importeTel = "";
let numeroTelefono = "";
let CveTelefonica = "";


@Component({
  selector: 'app-compra-ta',
  templateUrl: './compra-ta.component.html',
  styles: []
})
export class CompraTaComponent implements OnInit {

  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;


  labelTipoAutentica: string;


  forma: FormGroup;

  cuentaSeleccionada = "";
  importeF = "";
  telefonoF = "";
  cveTelefonicaF = "";

  NumeroSeguridad: string;

  recargas: any[] = [];
  operador: string;
  importe: number;
  blClassT = false;
  blClassM = false;
  blClassU = false;
  blClassI = false;
  blnStyle: false;
  SaldoOrigen: number;

  constructor( private _http: Http, private router: Router, public service: SesionBxiService, private renderer: Renderer2, private currencyPipe: CurrencyPipe ) {

    const this_aux = this;

    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

    this.forma = new FormGroup({

      'telefono': new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10),
        Validators.pattern( /^([0-9]{1,})$/)]),
      // 'operador': new FormControl(),
      // 'importe': new FormControl()

    });

    console.log(this.forma);

    this.forma.controls['telefono'].valueChanges.subscribe(
      data => {
        console.log('telefono', data);
        console.log('forma', this.forma);

        this_aux.telefonoF = data;

      });



       // console.log('data',  this.forma.controls['operador'].touched.valueOf());



  }



  ngOnInit() {

     this.fillSelectCuentas();

     this.consultaCatEmpresas();

     $( ".cdk-visually-hidden" ).css( "margin-top", "15%" );
  }


  consultaCatEmpresas() {
    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();


    operacionesbxi.getCatEmpresas().then(
      function(response) {

        console.log(response.responseText);
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

          console.error("Error");

          $('#errorModal').modal('show');


        });
  }

  fillSelectCuentas() {
    const this_aux = this;
    const cuentasString = this_aux.service.infoCuentas;
    console.log(this_aux.service.infoCuentas);
    const consultaCuentas = JSON.parse(cuentasString);
    const cuentasArray = consultaCuentas.ArrayCuentas;
      cuentasArray.forEach(cuenta => {
        this_aux.filtraCtaVista(cuenta);
    });

}

filtraCtaVista(cuenta) {
  const this_aux = this;
  if (cuenta.TipoCuenta === 1 && cuenta.NoCuenta.length === 10) {
    this_aux.crearListaCuentas(cuenta);
  }
}

crearListaCuentas(cuenta) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  const li =  this.renderer.createElement('li');
  this_aux.renderer.addClass(li, 'text-li');
  const a = this.renderer.createElement('a');
  const textoCuenta = this.renderer.createText( cuenta.Alias + ' ' + operacionesbxi.mascaraNumeroCuenta(cuenta.NoCuenta) );
  this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
  this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target); });
  this.renderer.appendChild(a, textoCuenta),
  this.renderer.appendChild(li, a);
  this.renderer.appendChild(this_aux.listaCuentas.nativeElement, li);
}

setDatosCuentaSeleccionada(elementHTML) {

  $('#_modal_please_wait').modal('show');
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  console.log(elementHTML);
  const tableOrigen = document.getElementById('tableOrigen');
  const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
  const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
  const lblAliasOrigen = document.getElementById('lblAliasOrigen');
  const numCuenta_seleccionada = elementHTML.value;

  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');

  lblAliasOrigen.innerHTML = elementHTML.textContent;
  lblCuentaOrigen.innerHTML = operacionesbxi.mascaraNumeroCuenta(numCuenta_seleccionada.toString());
  this_aux.service.numCuentaCTASel = numCuenta_seleccionada;
  this_aux.cuentaSeleccionada = numCuenta_seleccionada;
  this_aux.getSaldoDeCuenta(numCuenta_seleccionada);


}

getSaldoDeCuenta(numCuenta_seleccionada) {

  console.log(numCuenta_seleccionada.length);
  if (numCuenta_seleccionada.length === 16) {
       this.getSaldoTDC(numCuenta_seleccionada);
  } else {
      this.getSaldoTDDOtras(numCuenta_seleccionada);
  }
}

getSaldoTDDOtras(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuenta_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {

         setTimeout(function() {
          //const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          //lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
          this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
            $('#_modal_please_wait').modal('hide');
          }, 500);
        } else {
         this_aux.SaldoOrigen = 0;
         setTimeout(function() {
         $('#_modal_please_wait').modal('hide');
           this_aux.showErrorSucces(detalleSaldos);
         }, 500);
        }
      }, function(error) {

      this_aux.SaldoOrigen = 0;
       setTimeout(function() {
         $('#_modal_please_wait').modal('hide');
           this_aux.showErrorPromise(error);
       }, 500);
  });
 }

 getSaldoTDC(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldoTDC(numCuenta_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {

         setTimeout(function() {
          //const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          //lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
           this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
            $('#_modal_please_wait').modal('hide');
          }, 500);
        } else {
         this_aux.SaldoOrigen = 0;
         setTimeout(function() {
         $('#_modal_please_wait').modal('hide');
           this_aux.showErrorSucces(detalleSaldos);
         }, 500);
        }
      }, function(error) {

      this_aux.SaldoOrigen = 0;
       setTimeout(function() {
         $('#_modal_please_wait').modal('hide');
           this_aux.showErrorPromise(error);
       }, 500);
  });
 }


  insertaSaldo(id) {

    $('#_modal_please_wait').modal('show');

    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();

    console.log(id.id);

    this_aux.cveTelefonicaF = id.id;

    switch (id.name) {
      case 'importeTelcel': {
        this_aux.operador = 'Telcel';
        this_aux.blClassT = true;
        this_aux.blClassM = false;
        this_aux.blClassU = false;
        this_aux.blClassI = false;
        console.log('Telcel');
         break;
      }
      case 'importeMovi': {
        this_aux.operador = 'Movistar';
        this_aux.blClassM = true;
        this_aux.blClassT = false;
        this_aux.blClassU = false;
        this_aux.blClassI = false;
         break;
      }
      case 'importeUnefon': {
        this_aux.operador = 'Unefon';
        this_aux.blClassT = false;
        this_aux.blClassM = false;
        this_aux.blClassU = true;
        this_aux.blClassI = false;
         break;
      }
      case 'importeIusa': {
        this_aux.operador = 'Iusacell';
        this_aux.blClassT = false;
        this_aux.blClassM = false;
        this_aux.blClassU = false;
        this_aux.blClassI = true;
         break;
      }
      default: {
        console.log("No existe ese operador: " + id.id);
         break;
      }
   }

    operacionesbxi.getSaldoCompany(id.id).then(
      function(response1) {
        console.log(response1.responseText);
        let detalleSaldos = response1.responseJSON;
        // if ( detalleSaldos[0].Id === '1') {

          this_aux.recargas = detalleSaldos;
          setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);

        // }

      }, function(error) {
        console.error("Error");

          $('#errorModal').modal('show');
  });



  }


  cargaImporte(param) {


    const this_aux = this;

    $('label').removeClass('border border-danger');
    $('#' + param.id).addClass('border border-danger');
    this_aux.importe = param.id;


    $('#telefono').prop("disabled", false);

  }



  setTipoAutenticacionOnModal() {

    $('#inputToken').val('');

    const this_aux = this;
    const divChallenge = document.getElementById('challenger');
    const divTokenPass = document.getElementById('divPass');
    if (this_aux.service.metodoAutenticaMayor.toString() === '5') {
      $('#_modal_please_wait').modal('show');
      this_aux.labelTipoAutentica = 'Token Celular';
      divTokenPass.setAttribute('style', 'display: flex');
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      operacionesbxi.preparaAutenticacion().then(
        function(response) {
          const detallePrepara = response.responseJSON;
          console.log(detallePrepara);
          if (detallePrepara.Id === 'SEG0001') {
            divChallenge.setAttribute('style', 'display: flex');
            this_aux.NumeroSeguridad = detallePrepara.MensajeUsuarioUno;
            setTimeout(() => {
              $('#_modal_please_wait').modal('hide');
           }, 500);

          } else {

            setTimeout(() => {
              $('#_modal_please_wait').modal('hide');
              this_aux.showErrorSucces(detallePrepara);
           }, 1000);
          }
        }, function(error) {

          setTimeout(() => {
            $('#_modal_please_wait').modal('hide');
            this_aux.showErrorPromise(error);
         }, 1000);

        });

    } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {

      divChallenge.setAttribute('style', 'display: none');
      divTokenPass.setAttribute('style', 'display: flex');
      this_aux.labelTipoAutentica = 'Contrase&atilde;a';
    } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {

      divChallenge.setAttribute('style', 'display: none');
      divTokenPass.setAttribute('style', 'display: flex');
      this_aux.labelTipoAutentica = 'Token Fisico';
    }


  setTimeout(function() {
    $( ".cdk-visually-hidden" ).css( "margin-top", "19%" );
    $('#confirmModal').modal('show');
  }, 500);

}


  confirmarPago(token) {

    const this_aux = this;
    let mensajeError;

    ctaO = this_aux.service.numCuentaCTASel;
    importeTel = parseFloat(this_aux.importe.toString()).toFixed(2);
    numeroTelefono = this_aux.telefonoF;
    CveTelefonica = this_aux.cveTelefonicaF;

    console.log(importeTel);

    const autenticacion: Autenticacion = new Autenticacion();
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();

    autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
      function(detalleAutentica) {
            // console.log(detalleAutentica.responseJSON);
            const infoUsuarioJSON = detalleAutentica.responseJSON;
            if (infoUsuarioJSON.Id === 'SEG0001') {
                console.log('Nivel de autenticacion alcanzado');

                operacionesbxi.compraTA(ctaO, CveTelefonica, numeroTelefono, importeTel)
                .then(

                  function(response) {
                    console.log(response.responseJSON);

                    const compraTAResp = response.responseJSON;


                     if ( compraTAResp.Id === '1') {

                       console.log(compraTAResp);
                       this_aux.service.detalleConfirmacionCTA = response.responseText;
                       console.log(this_aux.service.detalleConfirmacionCTA);
                       this.router.navigate(['/CompraTaFinish']);

                     } else {
                      this_aux.showErrorSuccesMoney(compraTAResp);

                     }

                  }, function(error) { this_aux.showErrorPromise(error); }
                );
            } else {
              console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                mensajeError = this_aux.controlarError(infoUsuarioJSON);
                document.getElementById('mnsError').innerHTML =   infoUsuarioJSON.MensajeAUsuario;
                $('#_modal_please_wait').modal('hide');
                $('#errorModal').modal('show');
            }
      }, function(error) {
        this_aux.showErrorPromise(error);
      });


}


controlarError(json) {

  const id = json.Id ;
  const mensajeUsuario = json.MensajeAUsuario;
  let mensajeError;

  switch (id) {

    case 'SEG0003': mensajeError = "Usuario bloqueado, favor de esperar 15 minutos e intentar nuevamente.";
                  break;
    case 'SEG0004': mensajeError =  "Usuario bloqueado, favor de marcar a Banortel.";
                  break;
    case 'SEG0005': mensajeError =  "Los datos proporcionados son incorrectos, favor de verificar.";
                  break;
    case 'SEG0007': mensajeError = "Los datos proporcionados son incorrectos, favor de verificar.";
                  break;
    case 'SEG0008':  mensajeError = "La sesión ha caducado.";
                  break;
    case 'SEG0009':  mensajeError = "Límite de sesiones superado, favor de cerrar las sesiones de banca en línea activas.";
                  break;
    // tslint:disable-next-line:max-line-length
    case 'SEGOTP1': mensajeError = "Token desincronizado. Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                  break;
    case 'SEGOTP2': mensajeError = "Token bloqueado, favor de marcar a Banortel.";
                  break;
    case 'SEGOTP3': mensajeError = "Token deshabilitado, favor de marcar a Banortel.";
                  break;
    case 'SEGOTP4': mensajeError = "Token no activado, favor de marcar a Banortel.";
                  break;
    // tslint:disable-next-line:max-line-length
    case 'SEGAM81': mensajeError = "Token desincronizado. Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                  break;
    case 'SEGAM82': mensajeError = "Token bloqueado, favor de marcar a Banortel.";
                  break;
    case 'SEGAM83': mensajeError = "Token deshabilitado, favor de marcar a Banortel.";
                  break;
    case 'SEGAM84': mensajeError = "Token no activado, favor de marcar a Banortel.";
                  break;
    case '2'      : mensajeError = mensajeUsuario;
  }

  return mensajeError;
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

validarSaldo() {
  const this_aux = this;
  importeTel = parseFloat(this_aux.importe.toString()).toFixed(2);
  $('#_modal_please_wait').modal('show');
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.consultaTablaYValidaSaldo(this_aux.service.numCuentaCTASel, this_aux.importe).then(
    function(response) {
      let DatosJSON = response.responseJSON;
      console.log(response.responseText);
      if (DatosJSON.Id === "1") {
        console.log("Pago validado");
        this_aux.setTipoAutenticacionOnModal();
      } else if ( DatosJSON.Id === "4" ) {
        $('#modalLimiteDiario').modal('show');
      } else if ( DatosJSON.Id === "5" ) {
        $('#modalLimiteMensual').modal('show');
      } else {
        $('#errorModal').modal('show');
      }
      setTimeout(function() {
        $('#_modal_please_wait').modal('hide');
      }, 500);

    }, function(error) {
      setTimeout(function() {
        $('#_modal_please_wait').modal('hide');
     this_aux.showErrorPromise(error);
      }, 500);

});
}


}
