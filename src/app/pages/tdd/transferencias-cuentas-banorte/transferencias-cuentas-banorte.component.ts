import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import $ from 'jquery';
import { consultaCatalogos } from '../../../services/consultaCatalogos/consultaCatalogos.service';
import { ConsultaSaldosTddService, SesionTDDService, ValidaNipTransaccion } from '../../../services/service.index';
declare var $: $;

@Component({
  selector: 'app-transferencias-cuentas-banorte',
  templateUrl: './transferencias-cuentas-banorte.component.html'
})
export class TransferenciasCuentasBanorteComponent implements OnInit {
  @ViewChild('rImporte', { read: ElementRef}) rImporte: ElementRef ;
  @ViewChild('rNumCuenta', { read: ElementRef}) rNumCuenta: ElementRef ;
  subscription: Subscription;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;
  myForm: FormGroup;
  forma: FormGroup;

  noTarjeta: string;
  importe: any;
  correo: string;
  desc: string;
  tamCuenta: any;
  cuentaDestino: string;
  formattedAmount;

  importeAux: string;
  constructor(private _service: ConsultaSaldosTddService,
    private _serviceSesion: SesionTDDService,
    private currencyPipe: CurrencyPipe,
    private _validaNipService: ValidaNipTransaccion,
    private fb: FormBuilder,
    private router: Router) {

      this.myForm = this.fb.group({
        fcNumCuenta: ['', [Validators.required, Validators.pattern(/^(([0-9]{10}))$|^(([0-9]{16}))$/)]],
        fcDescripcion: ['', [Validators.required]],
        fcCorreo: ['', [Validators.required, Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]],
       fcImporte: ['', [Validators.required /*Validators.pattern(/^[0-9]+[0-9]*$/ )*/]],
  
      });
      
     }

  ngOnInit() {

    //  // ESTILOS Preferente
      let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
      let btnContinuar = document.getElementById("continuar");
      let btnConfirmar = document.getElementById("continuar2");
 
      if (storageTipoClienteTar === "true") {
 
        btnContinuar.classList.remove("color-botones");
        btnContinuar.classList.add("color-botones_Preferente");
        btnConfirmar.classList.remove("color-botones");
        btnConfirmar.classList.add("color-botones_Preferente");


      
       
       
      }
 
     const operaciones: consultaCatalogos = new consultaCatalogos();
 
     this._service.cargarSaldosTDD();
 
     $('#_modal_please_wait').modal('show');
 
     this._service.validarDatosSaldoTdd().then(
       mensaje => {
 
         this.saldoClienteTdd = mensaje.SaldoDisponible;
         this.cuentaClienteTdd = operaciones.mascaraNumeroCuenta(mensaje.NumeroCuenta);
         this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;
 
         console.log('Saldos cargados correctamente TDD: ' , mensaje);
         setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );
       }
       
     );
 
     
     $( ".cdk-visually-hidden" ).css( "margin-top", "13%" );
       
  }

  

  obtenerCuentaDestino(numCuenta) {
    const this_aux = this;
    this_aux.cuentaDestino = numCuenta;
    
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


    
      this_aux.importe = importe;
  }

  replaceSimbolo(importe) {
    const importeAux = importe.replace('$', '');
    return importeAux;
  }


  validarSaldo(myForm) {
    const this_aux = this;
    if (this_aux.importeAux === undefined) { 
      this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); }
      this_aux.importe = this_aux.importeAux;
    
    $('#_modal_please_wait').modal('show');
    console.log(this_aux.importe + "este es importe a consultar");
    this._validaNipService.consultaTablaYValidaSaldo(this_aux.importe).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        console.log(response.responseText);
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

        setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );

      }, function(error) {
        setTimeout(function() {
          $('#_modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
        }, 500);
        setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );

  });
  }



  confirmarPago(myForm) {
    this._validaNipService.validaNipTrans();
      const this_aux = this;

      $("#ModalTDDLogin").modal("show");
    let res;
  
      this._validaNipService.validarDatosrespuesta().then(
        mensaje => {
  
          res = this._validaNipService.respuestaNip.res;
          console.log(res);
  
          if (res === true) {
  
            
          this.trasferenciaCuentasBanorte(myForm);
          this._validaNipService.respuestaNip.res = "";
          } else {
  
            console.error("Mostrar modal las tarjetas no son iguales");
            document.getElementById('mnsError').innerHTML =   "Las tarjetas no corresponden.";
            $('#_modal_please_wait').modal('hide');
            $('#errorModal').modal('show');
            $('#ModalTDDLogin').modal('hide');
            this._validaNipService.respuestaNip.res = "";
  
          }
        }
      );
      $('#ModalTDDLogin').modal('hide');
  }

  trasferenciaCuentasBanorte(myForm) {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    const operaciones: consultaCatalogos = new consultaCatalogos();
    let descripcion = this_aux.myForm.get('fcDescripcion').value;
    let correo = this_aux.myForm.get('fcCorreo').value;
      operaciones.transferenciaCuentasBanorte(this_aux.cuentaDestino, 
                                              this_aux.importe, 
                                              descripcion, 
                                              correo).then(

        function(respuestaTransferencia) {
          const jsonDetalleTrans = respuestaTransferencia.responseJSON;

          if ( jsonDetalleTrans.Id === '1') {
            this_aux._serviceSesion.datosBreadCroms.repTrasferenciaCuentasBanorte = respuestaTransferencia.responseText;
            $('div').removeClass('modal-backdrop');
            this_aux.router.navigate(['/transFinal']);
            console.log(jsonDetalleTrans.MensajeAUsuario);
            console.log("Trasferencia Exitosa");
          } else {
            this_aux.showErrorSucces(jsonDetalleTrans);
            console.log("Transferencia no realizada");
          }

          
        }, function(error) {

          this_aux.showErrorPromiseMoney(error);
          setTimeout( () => $('#_modal_please_wait').modal('hide'), 500 );
        }
      );

  }

  showErrorPromiseMoney(error) {


    if (error.errorCode === 'API_INVOCATION_FAILURE') {
      $('#errorModal').modal('show');
      document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
    } else {
      document.getElementById('msgError').innerHTML =   "Se presenta falla en el servicio MCA / Time Out de operación monetaria.";
      $('#ModalErrorTransaccion').modal('show');
    }
  }


  showErrorSucces(json) {
    console.log(json.Id + json.MensajeAUsuario);
    document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    $('#errorModal').modal('show');
  }

  showDetallePago( myForm) {
    const this_aux = this;
    if (this_aux.importeAux === undefined) { this_aux.importeAux = this_aux.replaceSimbolo( this_aux.myForm.get('fcImporte').value); }
      this_aux.importe = this_aux.importeAux;
      console.log(this_aux.importe);
      // this_aux.fechaVencimiento = myForm.fcFechaVencimiento.toString();
      // if (this_aux.service.idFacturador === '1310') {
      //   this_aux.referenciaPago = myForm.fcTelefono.toString() + myForm.fcDigitoVerificador.toString();
      // } else {
      //   this_aux.referenciaPago = myForm.fcReferencia.toString();
      // }
       this_aux.setTipoAutenticacionOnModal();
  }
  

  setTipoAutenticacionOnModal() {
    const this_aux = this;
    const divChallenge = document.getElementById('challenger');

      divChallenge.setAttribute('style', 'display: none');
      // this_aux.labelTipoAutentica = 'Contrase&atilde;a';


  $('#confirmModal').modal('show');
}
}
