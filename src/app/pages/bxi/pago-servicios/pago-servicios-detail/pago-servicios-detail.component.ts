import { Autenticacion } from './../../autenticacion';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Renderer2  } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-pago-servicios-detail',
  templateUrl: './pago-servicios-detail.component.html',
  styleUrls: []
})
export class PagoServiciosDetailComponent implements OnInit {

  @ViewChild('rNombreEmpresa', { read: ElementRef}) rNombreEmpresa: ElementRef ;
  @ViewChild('rCuentaCargo', { read: ElementRef}) rCuentaCargo: ElementRef ;
  @ViewChild('rTelefono', { read: ElementRef}) rTelefono: ElementRef ;
  @ViewChild('rDigitoVerificador', { read: ElementRef}) rDigitoVerificador: ElementRef ;
  @ViewChild('rReferencia', { read: ElementRef}) rReferencia: ElementRef ;
  myForm: FormGroup;
  cuentaCargo: string;
  importe: string;
  referenciaPago: string;
  fechaVencimiento: string;
  nombreServicio: any;
  labelTipoAutentica: string;


  constructor( private service: SesionBxiService, private fb: FormBuilder, private router: Router ) {
    this.myForm = this.fb.group({
      fcCuentaCargo: ['', [Validators.required]],
      fcTelefono: ['', Validators.required],
      fcReferencia: ['', [Validators.required]],
      fcDigitoVerificador: ['', [Validators.required]],
      fcFechaVencimiento: ['', [Validators.required , Validators.pattern(/^[0-9]+[0-9]*$/ )  ]],
      fcImporte: ['', [Validators.required, Validators.pattern(/^[0-9]+[0-9]*$/ )]]
    });
   }

  ngOnInit() {

    const this_aux = this;
    const divTelmex = document.getElementById('serviciosTelmex');
    const divOtro = document.getElementById('otrosServicios');
    console.log(this_aux.service.detalleEmpresa_PS);
    this_aux.nombreServicio = JSON.parse(this_aux.service.detalleEmpresa_PS);
    this_aux.service.nombreServicio = this_aux.nombreServicio;
    this_aux.rNombreEmpresa.nativeElement.textContent = this_aux.nombreServicio.empresa;
    this.rCuentaCargo.nativeElement.value = this_aux.service.numCuentaSeleccionado;
    if (this_aux.service.idFacturador === '1310') {
        divTelmex.setAttribute('style', 'display: block');
        divOtro.setAttribute('style', 'display: block');
       this_aux.rReferencia.nativeElement.value = 12345;
    } else {
        divTelmex.setAttribute('style', 'display: block');
        divOtro.setAttribute('style', 'display: block');
       this_aux.rTelefono.nativeElement.value = 1234567890;
       this_aux.rDigitoVerificador.nativeElement.value = 1;
    }

  }

  showDetallePago(cuenta, referencia, telefono, digito, fecha, importe) {
      alert('cuenta' + cuenta + 'referencia' + referencia + 'telefono' + telefono
      + 'digito' + digito + 'fecha' + fecha + 'importe' + importe);
      this.cuentaCargo = cuenta;
      this.importe = importe;
      this.nombreServicio = this.rNombreEmpresa.nativeElement.textContent;
      if (this.service.idFacturador === '1310') {
          this.referenciaPago = telefono + digito;
      } else {
          this.referenciaPago = referencia;
      }
      this.setTipoAutenticacionOnModal();
  }

  setTipoAutenticacionOnModal() {
      const this_aux = this;
      const divChallenge = document.getElementById('challenger');
      const divTokenPass = document.getElementById('divPass');
      if (this_aux.service.metodoAutenticaLogin.toString() === '5') {

        this_aux.labelTipoAutentica = 'Token Fisico';
        divChallenge.setAttribute('style', 'display: block');
        divTokenPass.setAttribute('style', 'display: block');

      } else if (this_aux.service.metodoAutenticaLogin.toString()  === '0') {

        divChallenge.setAttribute('style', 'display: none');
        divTokenPass.setAttribute('style', 'display: block');
        this_aux.labelTipoAutentica = 'Contrase&atilde;a';
      } else if (this_aux.service.metodoAutenticaLogin.toString()  === '1') {

        divChallenge.setAttribute('style', 'display: none');
        divTokenPass.setAttribute('style', 'display: block');
        this_aux.labelTipoAutentica = 'Token Fisico';
      }

    $('#confirmModal').modal('show');
  }

  confirmarPago(token) {
      const this_aux = this;
      const autenticacion: Autenticacion = new Autenticacion();
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaLogin).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Pago validado');

                  operacionesbxi.pagaServicio(this_aux.service.idFacturador, this_aux.importe, this_aux.referenciaPago
                  , this_aux.service.numCuentaSeleccionado, this_aux.fechaVencimiento).then(
                    function(respPago) {
                      this_aux.service.detalleConfirmacionPS = respPago.responseText;
                      $('div').removeClass('modal-backdrop');
                      this_aux.router.navigate(['/pagoservicios_verify']);
                    }, function(error) { }
                  );
              } else {
                console.log(infoUsuarioJSON.MensajeAUsuario);
              }
        }, function(error) {
        });

  }


}

