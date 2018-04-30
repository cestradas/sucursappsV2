import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SesionTDDService, ConsultaSaldosTddService, ValidaNipTransaccion } from '../../../../services/service.index';
import $ from 'jquery';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SesionBxiService } from '../../../bxi/sesion-bxi.service';
import { CurrencyPipe } from '@angular/common';
import { Autenticacion } from '../../../bxi/autenticacion';
import { OperacionesBXI } from '../../../bxi/operacionesBXI';
import { Router } from '@angular/router';
import { consultaCatalogos } from '../../../../services/consultaCatalogos/consultaCatalogos.service';



declare var $: any;

@Component({
  selector: 'app-pago-de-servicio-detalles',
  templateUrl: './pago-de-servicio-detalles.component.html',
})

export class PagoDeServicioDetallesComponent implements OnInit {

  @ViewChild('rImporte', { read: ElementRef}) rImporte: ElementRef ;
  
  myForm: FormGroup;
  nombreServicio: any;
  cuentaClienteTdd: string;
  importe: string;
  importeAux: string;
  referenciaPago: string;
  fechaVencimiento: string;
  labelTipoAutentica: string;

  postResp;

  constructor(private _serviceSesion: SesionTDDService, 
              private _service: ConsultaSaldosTddService, 
              private service: SesionBxiService,
              private currencyPipe: CurrencyPipe,
              private router: Router,
              private _validaNipService: ValidaNipTransaccion,
              private fb: FormBuilder) { 

                this._service.cargarSaldosTDD();

    $('#_modal_please_wait').modal('show');

    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');

        this.cuentaClienteTdd = mensaje.NumeroCuenta;

      }
    );
    
    setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );


    this.myForm = this.fb.group({
      fcTelefono: ['', [Validators.required, Validators.minLength(10)]],
       fcReferencia: ['', [Validators.required]],
       fcDigitoVerificador: ['', [Validators.required]],
      fcFechaVencimiento: ['', [Validators.required /*Validators.pattern(/^[0-9]+[0-9]*$/ )*/  ]],
     fcImporte: ['', [Validators.required /*Validators.pattern(/^[0-9]+[0-9]*$/ )*/]],

    });


  }

  ngOnInit() {
    const this_aux = this;
    const detalleEmpresa = JSON.parse(this_aux.service.detalleEmpresa_PS);

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
        }
        this_aux.myForm.removeControl('fcTelefono');
        this_aux.myForm.removeControl('fcDigitoVerificador');
    }
    $('#_modal_please_wait').modal('hide');
  }


  espacioTeclado() {
    // ESTILO TECLADO (QUITAR ESTILO AL SALIR DE PAGINA PARA EVITAR QUE BAJE MAS EN OTRAS PANTALLAS)
console.log("aquiiiiiiiiiiiii");
    $( ".cdk-overlay-container" ).css( "margin-top", "8%" );
    $( ".cdk-visually-hidden" ).css( "margin-bottom", "0%" );
  }

  showDetallePago( myForm) {
    const this_aux = this;
    if (this_aux.importeAux === undefined) { this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); }
      this_aux.importe = this_aux.importeAux;
      console.log(this_aux.importe);
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
     

  $('#confirmModal').modal('show');
}


transformAmount(importe) {
  const this_aux = this;
  if (importe !== '') {
    const control: FormControl = new FormControl('');
    this_aux.myForm.setControl('fcImporte', control);
    this_aux.importeAux = this_aux.replaceSimbolo(importe);
    this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAux, 'USD');
    this_aux.importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;

  } else {
      if (this_aux.myForm.get('fcImporte').errors === null) {
        const control: FormControl = new FormControl('', Validators.required);
        this_aux.myForm.setControl('fcImporte', control );
      }
  }
}

replaceSimbolo(importe) {
  const importeAux = importe.replace('$', '');
  return importeAux;
}

confirmarPago() {
    const this_aux = this; 

    if (this_aux.importeAux === undefined) { this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); }

    $('#ModalTDDLogin').modal('show');
    // this.getPosts().subscribe( result => {this.postResp = result; });

     console.log(this.postResp);

      const THIS: any = this;

  const formParameters = {
    // tarjeta: this.postResp.tr2,
     tarjeta: '4334540109018154=151022110000865',
    // nip: this.postResp.np
     nip: 'D4D60267FBB0BB28'
  };
  $('#_modal_please_wait').modal('hide');


  let res;

    this._validaNipService.validarDatosrespuesta().then(
      mensaje => {

        res = this._validaNipService.respuestaNip.res;
        console.log(res);

        if (res === true) { 

          this.pagoServicio();

        } else {

          console.error("Mostrar modal las tarjetas no son iguales");
          

        }

        

      }
    );         
    $('#ModalTDDLogin').modal('hide');
}

pagoServicio() {
  
console.log("si entre");
const this_aux = this;
const operaciones: consultaCatalogos = new consultaCatalogos();
console.log(this_aux.service.idFacturador, this_aux.importeAux, this_aux.referenciaPago
  , this_aux.cuentaClienteTdd, this_aux.fechaVencimiento);
operaciones.pagaServicio(this_aux.service.idFacturador, this_aux.importeAux, this_aux.referenciaPago
  , this_aux.cuentaClienteTdd, this_aux.fechaVencimiento).then(
    function(respPago) {

      const jsonDetallePago = respPago.responseJSON;
      if (jsonDetallePago.Id === '1') {
        this_aux.service.detalleConfirmacionPS = respPago.responseText;
        $('div').removeClass('modal-backdrop');
        this_aux.router.navigate(['/pagoServicioVerifyTdd']);
        console.log("ya page");
      } else {
        this_aux.showErrorSuccesMoney(jsonDetallePago);
        console.log("no page");
      }
    }, function(error) { this_aux.showErrorPromise(error); }
  );

}

showErrorSuccesMoney(json) {
  console.log(json.Id + json.MensajeAUsuario);
  document.getElementById('msgError').innerHTML =   json.MensajeAUsuario; 
  $('#_modal_please_wait').modal('hide');
  $('#ModalErrorTransaccion').modal('show');
}

showErrorPromise(error) {
  console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde."; 
  $('#_modal_please_wait').modal('hide');
  $('#errorModal').modal('show');
}

leeCodeBar(value) {
  const this_aux = this;
  console.log(value);
  console.log(value.length);

  if (this_aux.service.idFacturador === '1310') {

    if (value.length === 20) {
      const telefono = value.substring(0, 10);
      const centavos = '.' + value.substring(17, 19);
      const unidades = '$' + parseInt(value.substring(10, 17), 10) ;
      const importe = unidades + centavos;
      const digito = value.substring(19, 20);
      const controlTelefono: FormControl = new FormControl(telefono, [Validators.required, Validators.minLength(10)]);
      const controlDigito: FormControl = new FormControl(digito, Validators.required);
      const controlImporte: FormControl = new FormControl(importe, Validators.required);
      this_aux.myForm.setControl('fcImporte', controlImporte );
      this_aux.myForm.setControl('fcTelefono', controlTelefono );
      this_aux.myForm.setControl('fcDigitoVerificador', controlDigito );

      $('#ModalLectordeRecibo').modal('hide');
      
    }
  } else {
    if (value.length === 30) {

      const referencia = value.substring(2, 14);
      const importe = '$' + parseInt(value.substring(20, 29), 10) + '.00';
      const anio = '20' + value.substring(14, 16);
      const mes = value.substring(16, 18);
      const dia = value.substring(18, 20);
      const fecha = anio + '-' + mes + '-' + dia;
      const controlReferencia: FormControl = new FormControl(referencia, Validators.required);
      const controlFecha: FormControl = new FormControl(fecha, [Validators.required,  Validators.pattern(/^\d{2,4}\-\d{1,2}\-\d{1,2}$/)]);
      const controlImporte: FormControl = new FormControl(importe, Validators.required);
      this_aux.myForm.setControl('fcImporte', controlImporte );
      this_aux.myForm.setControl('fcReferencia', controlReferencia );
      this_aux.myForm.setControl('fcFechaVencimiento', controlFecha );
      $('#ModalLectordeRecibo').modal('hide');
    }  
 }
}

}
