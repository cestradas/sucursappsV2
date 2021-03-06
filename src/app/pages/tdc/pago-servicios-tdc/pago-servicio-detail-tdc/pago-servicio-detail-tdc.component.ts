import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SesionTDDService, ConsultaSaldosTddService } from '../../../../services/service.index';
import $ from 'jquery';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SesionBxiService } from '../../../bxi/sesion-bxi.service';
import { CurrencyPipe } from '@angular/common';
import { Autenticacion } from '../../../bxi/autenticacion';
import { OperacionesBXI } from '../../../bxi/operacionesBXI';
import { Router } from '@angular/router';
import { ConsultaCatalogosTdcService } from '../../../../services/consultaCatalogosTDC/consulta-catalogos-tdc.service';
import { Http } from '@angular/http';
import { ValidaNipTransaccionTdcService } from '../../../../services/validaNipTrans/valida-nip-transaccion-tdc.service';



declare var $: any;

@Component({
  selector: 'app-pago-servicio-detail-tdc',
  templateUrl: './pago-servicio-detail-tdc.component.html',
})
export class PagoServicioDetailTdcComponent implements OnInit {
  @ViewChild('rImporte', { read: ElementRef}) rImporte: ElementRef ;

  myForm: FormGroup;
  nombreServicio: any;
  cuentaClienteTdd: string;
  importe: string;
  importeAux: string;
  referenciaPago: string;
  fechaVencimiento: string;
  labelTipoAutentica: string;

  INTENTOS = 0;
  TAMCADENA = 0;
  COUNTCHAR = 0;

  postResp;

  numCuenta_show: string;
  NumeroTarjeta: string;

  constructor(private _serviceSesion: SesionTDDService,
              private _service: ConsultaSaldosTddService,
              private service: SesionBxiService,
              private currencyPipe: CurrencyPipe,
              private router: Router,
              private _validaNipService: ValidaNipTransaccionTdcService,
              private fb: FormBuilder,
              private _http: Http) {

    /*this._service.cargarSaldosTDD();

    $('#_modal_please_wait').modal('show');
    const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.cuentaClienteTdd = operaciones.mascaraNumeroCuenta(mensaje.NumeroCuenta);

      }
    );*/

    this.consultaSaldosTarjetas();
    


    this.myForm = this.fb.group({
      fcTelefono: ['', [Validators.required, Validators.pattern(/^(([0-9]{10}))$/)]],
      fcReferencia: ['', [Validators.required, Validators.pattern(/^([a0-zA9-Z]{1,30})$/)]],
      fcDigitoVerificador: ['', [Validators.required, Validators.pattern(/^(([0-9]{1}))$/)]],
      fcFechaVencimiento: ['', [Validators.required , Validators.pattern(/^\d{2,4}\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[0-9])|([1]{1}[0-9])|([2]{1}[0-9])|([3]{1}[0-1]))$/)]],
      fcImporte: ['', [Validators.required, Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)]],
    });


  }

  ngOnInit() {
    $('#txtFechaVencimiento').datetimepicker({
      format: 'YYYY-MM-DD',
      locale: 'es',
    });

    localStorage.removeItem("des");
    localStorage.removeItem("np");
    localStorage.removeItem("res");
    localStorage.removeItem("tr2");
    localStorage.removeItem("tr2_serv");
    localStorage.removeItem("np_serv");
    localStorage.removeItem("res_serv");

    // ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("continuar");
    let btnContinuar2 = document.getElementById("continuar2");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnContinuar2.classList.remove("color-botones");
      btnContinuar2.classList.add("color-botones_Preferente");
    }



    const this_aux = this;
    const ModalLectordeRecibo = $('#ModalLectordeRecibo');
    let cadena = '';
    ModalLectordeRecibo.on('keydown', function(event) {

        let e;
        e = e ||   event;
        const code = e.key;
        cadena = cadena + code;
        setTimeout(function() {
         
         if (this_aux.COUNTCHAR < 1 || this_aux.COUNTCHAR === this_aux.TAMCADENA) {
           const expreg = /(\d+)/g; 
             this_aux.leeCodeBar(cadena.match(expreg));
             setTimeout(function() {
             cadena = ''; 
             }, 500);
            } else {
           this_aux.COUNTCHAR = this_aux.COUNTCHAR + 1;  
         } }, 1000);
      
    });

    const detalleEmpresa = JSON.parse(this_aux.service.detalleEmpresa_PS);
// consulta las reglas del facturador
    const reglaFacturador =  detalleEmpresa.regla;
    const detalleRegla = JSON.parse(reglaFacturador); 

    this_aux.nombreServicio =  detalleEmpresa.empresa;
    this_aux.service.nombreServicio = this_aux.nombreServicio;

    if (this_aux.service.idFacturador === '1310') {
      $('#ModalLectordeRecibo').modal('show');
      $('#ModalLectordeRecibo').on('shown.bs.modal', function() {
        $(this).find('input:first').focus();
      });
        this_aux.myForm.removeControl('fcReferencia');
    } else {

        if (this_aux.service.idFacturador === '88924') {
          $('#ModalLectordeRecibo').modal('show');
          $('#ModalLectordeRecibo').on('shown.bs.modal', function() {
            $(this).find('input:first').focus();
          });
        } else {

          if (detalleRegla.Id === '1') {
            this_aux.setReglaReferencia(detalleRegla);
          } else {
            // tslint:disable-next-line:max-line-length
            const controlReferencia: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([a0-zA9-Z]{1,60})$/)]);
            this_aux.myForm.setControl('fcReferencia', controlReferencia );
          }
          // tslint:disable-next-line:max-line-length
          const controlFecha: FormControl = new FormControl('', [ Validators.pattern(/(^\s*$)|^\d{2,4}\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[0-9])|([1]{1}[0-9])|([2]{1}[0-9])|([3]{1}[0-1]))$/)]);
          this_aux.myForm.setControl('fcFechaVencimiento', controlFecha );
        }
        this_aux.myForm.removeControl('fcTelefono');
        this_aux.myForm.removeControl('fcDigitoVerificador');
    }
   

    $( ".cdk-visually-hidden" ).css( "margin-top", "9%" );
  }

 

  espacioTeclado() {
    // ESTILO TECLADO (QUITAR ESTILO AL SALIR DE PAGINA PARA EVITAR QUE BAJE MAS EN OTRAS PANTALLAS)
console.log("aquiiiiiiiiiiiii");
    $( ".cdk-overlay-container" ).css( "margin-top", "9%" );
  }

  showDetallePago( myForm) {
    const this_aux = this;
    if (this_aux.importeAux === undefined) { this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); }
      this_aux.importe = this_aux.importeAux;
     // console.log(this_aux.importe);
      this_aux.fechaVencimiento = myForm.fcFechaVencimiento.toString();
      if (this_aux.service.idFacturador === '1310') {
        this_aux.referenciaPago = myForm.fcTelefono.toString() + myForm.fcDigitoVerificador.toString();
      } else {
        this_aux.referenciaPago = myForm.fcReferencia.toString();
      }
       this_aux.setTipoAutenticacionOnModal();
  }

  setTipoAutenticacionOnModal() {
    const this_aux = this;
    const divChallenge = document.getElementById('challenger');

      divChallenge.setAttribute('style', 'display: none');
      this_aux.labelTipoAutentica = 'Contrase&atilde;a';

  $('#_modal_please_wait').modal('hide');
  $('#confirmModal').modal('show');
}


transformAmount(importe) {
  // const expre1 = /^\$+([0-9]{1,3}\,*)+(\.)+([0-9]{2})/;
   const expre2 =  /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/;
   const expres3 = /^\$+(([0-9]{1,}\,*)+((\.){0,1}([0-9]{0,}))$)/;
  // const expre3 =  /^([0-9])/;
  // const expre4 =  /^\.+([0-9]{2})/;
  const this_aux = this;
  if (importe !== '' && importe !== '.' && importe !== '-' && (expre2.test(importe) || expres3.test(importe))) {
    this_aux.importeAux = this_aux.replaceSimbolo(importe);
    this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAux, 'USD');
    this_aux.importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;

  } 
}

replaceSimbolo(importe) {
  const this_aux = this;
  let importeAux = importe.replace('$', '');
  const re = /\,/g;
  importeAux = importeAux.replace(re, '');
 // console.log(importeAux);

      return importeAux;
}

iniciaPinpad() {

  const this_aux = this;
  $('#ModalTDCLogin').modal('show');

}

confirmarPago() {
  this._validaNipService.callPinPadTransTdc();
    const this_aux = this;

    if (this_aux.importeAux === undefined) { this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); }
    document.getElementById('capturaInicio').style.display = 'none';
    document.getElementById('caputuraSesion').style.display = 'block';
    //$("#ModalTDDLogin").modal("show");
    $('#ModalTDCLogin').modal('hide');
  let res;

    this._validaNipService.validarDatosrespuesta().then(
      mensaje => {

        res = this._validaNipService.respuestaNip.res;
        //console.log(res);

        if (res === true) {
          
          this.pagoServicio();
          this._validaNipService.respuestaNip.res = "";
        } else {

          console.error("Mostrar modal las tarjetas no son iguales");
          document.getElementById('mnsError').innerHTML =   "Los datos proporcionados son incorrectos, favor de verificar.";
          $('#_modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
          $('#ModalTDDLogin').modal('hide');
          this._validaNipService.respuestaNip.res = "";

        }
      }
    );
    $('#ModalTDDLogin').modal('hide');
}

pagoServicio() {


$('#_modal_please_wait').modal('show');

console.log("si entre");
const this_aux = this;

if (this_aux.service.idFacturador === '88924') {
  let referenciaAux = "0000000000" + this_aux.referenciaPago;
  this_aux.referenciaPago = referenciaAux;
}

const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
//console.log(this_aux.service.idFacturador, this_aux.importeAux, this_aux.referenciaPago, this_aux.cuentaClienteTdd, this_aux.fechaVencimiento);
  
operaciones.pagaServicio(this_aux.service.idFacturador, this_aux.importeAux, this_aux.referenciaPago
  , this_aux.fechaVencimiento).then(
    function(respPago) {

      const jsonDetallePago = respPago.responseJSON;
      if (jsonDetallePago.Id === '1') {
        this_aux.service.detalleConfirmacionPS = respPago.responseText;
        $('div').removeClass('modal-backdrop');
        this_aux.router.navigate(['/pagoServicioVerifyTdc']);
        console.log("ya page");
      } else {
        this_aux.showErrorSucces(jsonDetallePago);
        $('#_modal_please_wait').modal('hide');
        $('#ModalTDDLogin').modal('hide');
        console.log("no page");
      }
    }, function(error) { this_aux.showErrorPromiseMoney(error);
      $('#ModalTDDLogin').modal('hide'); }
  );

}

validarSaldo(myForm) {
  $('#_modal_please_wait').modal('show');
    const this_aux = this;
    if (this_aux.importeAux === undefined) { this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); }
    this_aux.importe = this_aux.importeAux;
    this._validaNipService.consultaTablaYValidaSaldo(this_aux.importe).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        //console.log(response.responseText);
        if (DatosJSON.Id === "1") {
         // aqiiiiiiiii
         this_aux.showDetallePago(myForm);
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
          $('#errorModal').modal('show');
        }, 500);

  });
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

leeCodeBar(valor) {
  const this_aux = this;    
  if (valor !== null ) {

    const value = valor[0];
    if (this_aux.service.idFacturador === '1310') {

      if (value.length === 20) {
        const telefono = value.substring(0, 10);
        const centavos = '.' + value.substring(17, 19);
        const unidades = '$' + parseInt(value.substring(10, 17), 10) ;
        const importe = unidades + centavos;
        const digito = value.substring(19, 20);
        // tslint:disable-next-line:max-line-length
        const controlTelefono: FormControl = new FormControl(telefono, [Validators.required, Validators.pattern(/^(([0-9]{10}))$/)]);
        const controlDigito: FormControl = new FormControl(digito, [Validators.required, Validators.pattern(/^(([0-9]{1}))$/)]);
        const controlImporte: FormControl = new FormControl(importe, [ Validators.required]);
        this_aux.myForm.setControl('fcImporte', controlImporte );
        this_aux.myForm.setControl('fcTelefono', controlTelefono );
        this_aux.myForm.setControl('fcDigitoVerificador', controlDigito );

        $('#ModalLectordeRecibo').modal('hide');

      } else {
          this_aux.validaIntentos(value);
      }
    } else {
      if (value.length === 30) {
        const referencia = value.substring(0, 30);
        const importe = '$' + parseInt(value.substring(20, 29), 10) + '.00';
        const anio = '20' + value.substring(14, 16);
        const mes = value.substring(16, 18);
        const dia = value.substring(18, 20);
        const fecha = anio + '-' + mes + '-' + dia;
        // tslint:disable-next-line:max-line-length
        const controlReferencia: FormControl = new FormControl(referencia, [ Validators.required, Validators.pattern(/^([a0-zA9-Z]{1,30})$/)]);
        // tslint:disable-next-line:max-line-length
        const controlFecha: FormControl = new FormControl(fecha, [Validators.required,  Validators.pattern(/^\d{2,4}\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[0-9])|([1]{1}[0-9])|([2]{1}[0-9])|([3]{1}[0-1]))$/)]);
        const controlImporte: FormControl = new FormControl(importe, Validators.required);
        this_aux.myForm.setControl('fcImporte', controlImporte );
        this_aux.myForm.setControl('fcReferencia', controlReferencia );
        this_aux.myForm.setControl('fcFechaVencimiento', controlFecha );
        $('#ModalLectordeRecibo').modal('hide');
      } else {
          this_aux.validaIntentos(value);
      }
   }
  }
}

irAtras() {
  const this_aux = this;
  this_aux.router.navigate(['/pagoServiciosTdc']);
}


validaIntentos(value) {
  const this_aux = this;
  if (this_aux.COUNTCHAR < 1) {
    this_aux.TAMCADENA = value.length;
    this_aux.COUNTCHAR = this_aux.COUNTCHAR + 1;
 }
 if (this_aux.COUNTCHAR === this_aux.TAMCADENA) {
    this_aux.COUNTCHAR = 0;
    this_aux.INTENTOS = this_aux.INTENTOS + 1;
    if (this_aux.INTENTOS === 5) {
      $('#ModalLectordeRecibo').modal('hide');
      document.getElementById('mnsError').innerHTML = 'Lo sentimos, no pudimos escanear tu recibo, ingresa tus datos manualmente.';
                    $('#errorModal').modal('show');
      
    } 
 }
 }

// consulta TDC
consultaSaldosTarjetas() {
  const this_aux = this;
  const formParameters = { 
  }; 
  
 // console.log(formParameters);
  const resourceRequest = new WLResourceRequest(
    
    'adapters/AdapterBanorteSucursAppsTdc/resource/consultaSaldosTarjetas', WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);
    
    resourceRequest.sendFormParameters(formParameters).then(
      function(response1) {
       // console.log(response1.responseText);

        const detalleSaldos = response1.responseJSON;
        
        if ( detalleSaldos.Id === '1') {
          this_aux.NumeroTarjeta = detalleSaldos.NumeroTarjeta;
          this_aux.mascaraNumeroCuenta(this_aux.NumeroTarjeta);
          $('#_modal_please_wait').modal('hide');

        } else {
           this_aux.showErrorSucces(detalleSaldos);
           $('#_modal_please_wait').modal('hide');
        }
      }, function(error) {
        this_aux.showErrorPromise(error);
        $('#_modal_please_wait').modal('hide');
  });
}

mascaraNumeroCuenta(numCtaSel) {
  const tamNumCta = numCtaSel.length;
  const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
  this.numCuenta_show = '************' + numCta_aux;
  return this.numCuenta_show;
}

calendario() {
  const this_aux = this;
  $('#txtFechaVencimiento').data("datetimepicker").destroy();
 $('#txtFechaVencimiento').datetimepicker({
     format: 'YYYY-MM-DD',
     locale: 'es',
   });
}

validarFecha() {
    // $('#txtFechaVencimiento').click();
    const this_aux = this;
    let fecha = $("#txtFechaVencimiento").val();
    fecha = fecha.substring(0, 10);
    console.log(document.getElementById('txtFechaVencimiento').innerHTML = fecha);
    if (this_aux.service.idFacturador === '1310' || this_aux.service.idFacturador === '88924') {
      // tslint:disable-next-line:max-line-length
     const controlFecha: FormControl = new FormControl(fecha, [Validators.required,  Validators.pattern(/^\d{2,4}\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[0-9])|([1]{1}[0-9])|([2]{1}[0-9])|([3]{1}[0-1]))$/)]);
     this_aux.myForm.setControl('fcFechaVencimiento', controlFecha );
    } else {
       // tslint:disable-next-line:max-line-length
       const controlFecha: FormControl = new FormControl(fecha, [ Validators.pattern(/(^\s*$)|^\d{2,4}\-(([0]{1}[1-9]{1})|([1]{1}[0-2]{1}))\-(([0]{1}[0-9])|([1]{1}[0-9])|([2]{1}[0-9])|([3]{1}[0-1]))$/)]);
       this_aux.myForm.setControl('fcFechaVencimiento', controlFecha );
    }
     }

     setReglaReferencia(detalleRegla) {
      const this_aux = this;
      const tamRef = parseInt(detalleRegla.numCaracteres, 10);
      let re;
      if ( detalleRegla.tipoCadena === 'AN') {
         // alfa numerico 
        // tslint:disable-next-line:max-line-length 
          re = new RegExp("^([a0-zA9-Z]{1," + tamRef + "})$"); 
          // const controlReferencia: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([a0-zA9-Z]{1,tamRef})$/)]);
          const controlReferencia: FormControl = new FormControl('', [Validators.required, Validators.pattern(re)]);
          this_aux.myForm.setControl('fcReferencia', controlReferencia );
    
      } else if (detalleRegla.tipoCadena === 'NS') {
         // numerico
         // const controlReferencia: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{1,40})$/)]);
         re =   new RegExp("^([0-9]{1," + tamRef + "})$"); 
         const controlReferencia: FormControl = new FormControl('', [Validators.required, Validators.pattern(re)]);
         this_aux.myForm.setControl('fcReferencia', controlReferencia );
      }
    }
}
