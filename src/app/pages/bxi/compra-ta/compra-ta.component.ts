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
  numeroTarjeta: string;
  nombreCuenta: string;
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

  // tslint:disable-next-line:max-line-length
  constructor( private _http: Http, private router: Router, public service: SesionBxiService, private renderer: Renderer2, private currencyPipe: CurrencyPipe ) {

    const this_aux = this;

    setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
   

    this.forma = new FormGroup({

      'telefono': new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(10),
        Validators.pattern( /^([0-9]{1,})$/)]),

        'fcToken': new FormControl(),
      // 'operador': new FormControl(),
      // 'importe': new FormControl()

    });

    // console.log(this.forma);

    this.forma.controls['telefono'].valueChanges.subscribe(
      data => {
        // console.log('telefono', data);
        // console.log('forma', this.forma);

        this_aux.telefonoF = data;
        this_aux.desabilitaBtn();
      });



       // console.log('data',  this.forma.controls['operador'].touched.valueOf());



  }



  ngOnInit() {

     this.fillSelectCuentas();

     this.consultaCatEmpresas();

     $( ".cdk-visually-hidden" ).css( "margin-top", "15%" );

     //ESTILOS Preferente
     let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("continuarTA");
    let btnConfirmar = document.getElementById("confirmar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnConfirmar.classList.remove("color-botones");
      btnConfirmar.classList.add("color-botones_Preferente");

      //localStorage.removeItem("tipoClienteBEL");

    }
  }


  consultaCatEmpresas() {
    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();


    operacionesbxi.getCatEmpresas().then(
      function(response) {

        // console.log(response.responseText);
        let res = response.responseJSON;

        // tslint:disable-next-line:forin
        for ( let i in res ) {

          // console.log(res[i].Nombre);

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
    // console.log(this_aux.service.infoCuentas);
    const consultaCuentas = JSON.parse(cuentasString);
    const cuentasArray = consultaCuentas.ArrayCuentas;
      cuentasArray.forEach(cuenta => {
       this_aux.filtraCtaVista(cuenta);
    });
}

filtraCtaVista(cuenta) {
const this_aux = this;
if ((cuenta.TipoCuenta === 1 && cuenta.NoCuenta.length === 10) || (cuenta.TipoCuenta === 4 && cuenta.NoCuenta.length === 10)) {
this_aux.crearListaCuentas(cuenta);
} 
}

crearListaCuentas(cuenta) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  const li =  this_aux.renderer.createElement('li');
  this_aux.renderer.addClass(li, 'text-li');
  const a = this_aux.renderer.createElement('a');
  const textoCuenta = this_aux.renderer.createText( cuenta.Alias + ' ' + operacionesbxi.mascaraNumeroCuenta(cuenta.NoCuenta));
  this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
  this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target);
  this_aux.numeroTarjeta = cuenta.Plastico;
  this_aux.nombreCuenta = cuenta.Alias;
   });
  this.renderer.appendChild(a, textoCuenta),
  this.renderer.appendChild(li, a);
  this.renderer.appendChild(this_aux.listaCuentas.nativeElement, li);
 }

setDatosCuentaSeleccionada(elementHTML) {

  $('#_modal_please_wait').modal('show');
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  // console.log(elementHTML);
  const tableOrigen = document.getElementById('tableOrigen');
  const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
  const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
  // const lblAliasOrigen = document.getElementById('lblAliasOrigen');
  const numCuenta_seleccionada = elementHTML.value;

  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');

  // lblAliasOrigen.innerHTML = elementHTML.textContent;
  lblCuentaOrigen.innerHTML = operacionesbxi.mascaraNumeroCuenta(numCuenta_seleccionada.toString());
  this_aux.service.numCuentaCTASel = numCuenta_seleccionada;
  this_aux.cuentaSeleccionada = operacionesbxi.mascaraNumeroCuenta(numCuenta_seleccionada.toString());
  this_aux.getSaldoDeCuenta(numCuenta_seleccionada);

  if ( this_aux.importe !== undefined ) {

    if (this_aux.importe.toString() !== "") {
    
       $('#telefono').prop("disabled", false);
    
    }
  }
  

}

getSaldoDeCuenta(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuenta_seleccionada).then(
      function(response1) {
        // console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {
          this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
          setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
        } else {
          // console.log(detalleSaldos.MensajeAUsuario);
          this_aux.showErrorSucces(detalleSaldos);
          setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
        }
      }, function(error) {
        this_aux.showErrorPromise(error);
        setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
  });
}


  insertaSaldo(id) {

    $('#_modal_please_wait').modal('show');

    const this_aux =  this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();

    // console.log(id.id);

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
        // console.log("No existe ese operador: " + id.id);
         break;
      }
   }

    operacionesbxi.getSaldoCompany(id.id).then(
      function(response1) {
        // console.log(response1.responseText);
        let detalleSaldos = response1.responseJSON;
        // if ( detalleSaldos[0].Id === '1') {
          if (detalleSaldos.Id = '1') {
          this_aux.recargas = detalleSaldos;
          setTimeout(() => $('#_modal_please_wait').modal('hide'), 3000);
        } else {
          this_aux.showErrorSucces(detalleSaldos);
        }
        // }

      }, function(error) {
        console.error("Error");
          this_aux.showErrorPromise(error);
          $('#errorModal').modal('show');
  });



  }


  cargaImporte(param) {


    const this_aux = this;

    $('label').removeClass('border border-danger');
    $('#' + param.id).addClass('border border-danger');
    this_aux.importe = param.id;

    if (this_aux.cuentaSeleccionada.toString() !== "") {
      $('#telefono').prop("disabled", false);
    }
    
   // $('#telefono').prop("disabled", false);
   // $('#continuarTA').prop("disabled", true);

  }

  desabilitaBtn() {

  const this_aux = this;
  let continuaCTA = $('#telefono').val();
  
  if ((continuaCTA !== "" || continuaCTA.length >= 10) && (this_aux.importe.toString() !== "")) {
    $('#continuarTA').prop("disabled", true);
  }
  


}



  setTipoAutenticacionOnModal() {

    $('#inputToken').val('');
    
    const this_aux = this;
    let mensajeError;
    const divChallenge = document.getElementById('challenger');
    const divTokenPass = document.getElementById('divPass');
    const control: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{6})*$/)]);
      this_aux.forma.setControl('fcToken', control );
    if (this_aux.service.metodoAutenticaMayor.toString() === '5') {
      $('#_modal_please_wait').modal('show');
      this_aux.labelTipoAutentica = 'Token Celular';
      divTokenPass.setAttribute('style', 'display: flex');
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      operacionesbxi.preparaAutenticacion().then(
        function(response) {
          const detallePrepara = response.responseJSON;
          // console.log(detallePrepara);
          if (detallePrepara.Id === 'SEG0001') {
            divChallenge.setAttribute('style', 'display: flex');
            this_aux.NumeroSeguridad = detallePrepara.MensajeUsuarioUno;
            setTimeout(() => {
              $('#_modal_please_wait').modal('hide');
           }, 500);

          } else {

            setTimeout(() => {
              $('#_modal_please_wait').modal('hide');
              // console.log(detallePrepara.Id + detallePrepara.MensajeAUsuario);
                          mensajeError = this_aux.controlarError(detallePrepara);
                          document.getElementById('mnsError').innerHTML =  mensajeError;
                          $('#errorModal').modal('show');
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

   // ctaO = this_aux.service.numCuentaCTASel;
   $('#_modal_please_wait').modal('show');
    // console.log(importeTel);

    const autenticacion: Autenticacion = new Autenticacion();
    

    autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
      function(detalleAutentica) {
            // console.log(detalleAutentica.responseJSON);
            const infoUsuarioJSON = detalleAutentica.responseJSON;
            if (infoUsuarioJSON.Id === 'SEG0001') {
                console.log('Nivel de autenticacion alcanzado');
                 this_aux.compraTA();
                
            } else {
              setTimeout(() => {
                $('#_modal_please_wait').modal('hide');
                console.log("llego respuesta con error");
                console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                            mensajeError = this_aux.controlarError(infoUsuarioJSON);
                            document.getElementById('mnsError').innerHTML =  mensajeError;
                            $('#errorModal').modal('show');
             }, 1000);
            }
      }, function(error) {
        setTimeout(() => {
          $('#_modal_please_wait').modal('hide'); } , 1000);
        console.log("No llego respuesta");
        this_aux.showErrorPromise(error);
      });


}

ocultaModal() {
  const this_aux = this;
  const control: FormControl = new FormControl('');
  this_aux.forma.setControl('fcToken', control );
}

compraTA() {
  console.log("Entro a pagar");
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  ctaO = this_aux.numeroTarjeta;
    importeTel = parseFloat(this_aux.importe.toString()).toFixed(2);
    numeroTelefono = this_aux.telefonoF;
    CveTelefonica = this_aux.cveTelefonicaF;


  operacionesbxi.compraTA(ctaO, CveTelefonica, numeroTelefono, importeTel)
  .then(

    function(response) {
      // console.log(response.responseJSON);

      const compraTAResp = response.responseJSON;


       if ( compraTAResp.Id === '1') {

        //  console.log(compraTAResp);
         this_aux.service.detalleConfirmacionCTA = response.responseText;
        //  console.log(this_aux.service.detalleConfirmacionCTA);
         setTimeout(() => {$('#confirmModal').modal('hide'); } , 1000);
         this_aux.service.operador = this_aux.operador;
         this_aux.router.navigate(['/CompraTaFinish']);

       } else {
        setTimeout(() => {
          $('#_modal_please_wait').modal('hide'); } , 1000);
        this_aux.showErrorSucces(compraTAResp);

       }

    }, function(error) {
      setTimeout(() => {
        $('#_modal_please_wait').modal('hide'); } , 1000);
       this_aux.showErrorPromiseMoney(error); }
  );
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
    case '2'      : mensajeError = 'El servicio no esta disponible, favor de intentar mas tarde.';
                  break;
    case 'SEGAA01': mensajeError = 'Usuario no enrolado. Favor de ejecutar el enrolamiento del usuario en el sitio web.';
                  break;
    // tslint:disable-next-line:no-switch-case-fall-through
    default:    mensajeError = "El servicio no esta disponible, favor de intentar mas tarde.";
                  // console.log("Id: 0 Mensaje:" + mensajeUsuario);
  }

  return mensajeError;
}

showErrorPromiseMoney(error) {

   
  if (error.errorCode === 'API_INVOCATION_FAILURE') {
    $('#errorModal').modal('show'); 
    document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
  } else {
    document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
    $('#ModalErrorTransaccion').modal('show');
  }
}

showErrorSucces(json) {

      // console.log(json.Id + json.MensajeAUsuario);
      if (json.Id === '2') {
        document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
      } else {
        document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
      }
      $('#errorModal').modal('show');
  }

    showErrorPromise(error) {
      $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
  }

validarSaldo() {
  const this_aux = this;
  importeTel = parseFloat(this_aux.importe.toString()).toFixed(2);
  $('#_modal_please_wait').modal('show');
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.consultaTablaYValidaSaldo(this_aux.service.numCuentaCTASel, this_aux.importe).then(
    function(response) {
      let DatosJSON = response.responseJSON;
      // console.log(response.responseText);
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
