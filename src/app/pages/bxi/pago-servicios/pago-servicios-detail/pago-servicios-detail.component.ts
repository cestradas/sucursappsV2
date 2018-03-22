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

 // @ViewChild('rNombreEmpresa', { read: ElementRef}) rNombreEmpresa: ElementRef ;
 // @ViewChild('rCuentaCargo', { read: ElementRef}) rCuentaCargo: ElementRef ;

  myForm: FormGroup;
  labelTipoAutentica: string;
  nombreServicio: any;
  cuentaCargo: string;
  importe: string;
  referenciaPago: string;
  fechaVencimiento: string;
  
  


  constructor( private service: SesionBxiService, private fb: FormBuilder, private router: Router ) {
    this.myForm = this.fb.group({
      fcTelefono: ['', Validators.required],
       fcReferencia: ['', [Validators.required]],
       fcDigitoVerificador: ['', [Validators.required]],
      fcFechaVencimiento: ['', [Validators.required /*Validators.pattern(/^[0-9]+[0-9]*$/ )*/  ]],
      fcImporte: ['', [Validators.required /*Validators.pattern(/^[0-9]+[0-9]*$/ )*/]]
    });
   }

  ngOnInit() {

    const this_aux = this;
    const divTelmex = document.getElementById('serviciosTelmex');
    const divOtro = document.getElementById('otrosServicios');
    const detalleEmpresa = JSON.parse(this_aux.service.detalleEmpresa_PS);

    this_aux.nombreServicio =  detalleEmpresa.empresa;
    this_aux.service.nombreServicio = this_aux.nombreServicio;
    this_aux.cuentaCargo = this_aux.service.numCuentaSeleccionado;
    
    if (this_aux.service.idFacturador === '1310') {
        divTelmex.setAttribute('style', 'display: block');
        divOtro.setAttribute('style', 'display: block');
        this_aux.myForm.removeControl('fcReferencia');
    } else {
        divTelmex.setAttribute('style', 'display: block');
        divOtro.setAttribute('style', 'display: block');
        this_aux.myForm.removeControl('fcTelefono');
        this_aux.myForm.removeControl('fcDigitoVerificador');
       
    }

  }

  showDetallePago(cuenta, referencia, telefono, digito, fecha, importe) {
    const this_aux = this;  
      this_aux.importe = importe;
      this_aux.fechaVencimiento = fecha;
      if (this_aux.service.idFacturador === '1310') {
        this_aux.referenciaPago = telefono + digito;
      } else {
        this_aux.referenciaPago = referencia;
      }
      this_aux.setTipoAutenticacionOnModal();
  }

  setTipoAutenticacionOnModal() {
      const this_aux = this;
      const divChallenge = document.getElementById('challenger');
      const divTokenPass = document.getElementById('divPass');
      if (this_aux.service.metodoAutenticaMayor.toString() === '5') {

        this_aux.labelTipoAutentica = 'Token Celular';
        divChallenge.setAttribute('style', 'display: block');
        divTokenPass.setAttribute('style', 'display: block');

      } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {

        divChallenge.setAttribute('style', 'display: none');
        divTokenPass.setAttribute('style', 'display: block');
        this_aux.labelTipoAutentica = 'Contrase&atilde;a';
      } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {

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
      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
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

