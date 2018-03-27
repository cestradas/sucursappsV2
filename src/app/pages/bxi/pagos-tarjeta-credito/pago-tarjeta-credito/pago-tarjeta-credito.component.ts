import { Autenticacion } from './../../autenticacion';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { element } from 'protractor';

declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-pago-tarjeta-credito',
  templateUrl: './pago-tarjeta-credito.component.html',
})
export class PagoTarjetaCreditoComponent implements OnInit {
  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  @ViewChild('listaCuentasBeneficiario', { read: ElementRef}) listaCuentasBeneficiario: ElementRef ;
  @ViewChild('rcbFiltro', { read: ElementRef}) rcbFiltro: ElementRef ;

  myForm: FormGroup;
  listaCuentasBen: Array<any> = [];
  existenPropias = false;
  existenTerceros = false;
  existenExternas = false;
  existenAMEX = false;
  CuentaOrigen: string;
  CuentaDestino: string;
  Importe: string;
  labelTipoAutentica: string;
  tipoTarjeta: string;

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2,  private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      fcImporte: ['', [Validators.required /*Validators.pattern(/^[0-9]+[0-9]*$/ )*/]]
    });
  }

  ngOnInit() {
    this.fillSelectCuentas();
    this.fillCuentasBeneficiario();
    
  }

    fillSelectCuentas() {
      const this_aux = this;
      const cuentasString = this_aux.service.infoCuentas;
      console.log(this_aux.service.infoCuentas);
      const consultaCuentas = JSON.parse(cuentasString);
      const cuentasArray = consultaCuentas.ArrayCuentas;
        cuentasArray.forEach(cuenta => {
          this_aux.crearListaCuentas(cuenta); 

      });

  }

  crearListaCuentas(cuenta) {
    const this_aux = this;
    const li =  this.renderer.createElement('li');
    const a = this.renderer.createElement('a');
    const textoCuenta = this.renderer.createText( cuenta.Alias);
    this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
    this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target); });
    this.renderer.appendChild(a, textoCuenta),
    this.renderer.appendChild(li, a);
    this.renderer.appendChild(this_aux.listaCuentas.nativeElement, li);
  }
  
  setDatosCuentaSeleccionada(elementHTML) {
 
    const this_aux = this;
    console.log(elementHTML);
    const tableOrigen = document.getElementById('tableOrigen');
    const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
    const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
    const lblAliasOrigen = document.getElementById('lblAliasOrigen');
    const numCuenta_seleccionada = elementHTML.value;

    tableOrigen.setAttribute('style', 'display: block');
    tableDefaultOrigen.setAttribute('style', 'display: none');
    lblAliasOrigen.innerHTML = elementHTML.textContent;
    lblCuentaOrigen.innerHTML = numCuenta_seleccionada.toString();
    this_aux.service.numCuentaSeleccionado = numCuenta_seleccionada;
    this_aux.getSaldoDeCuenta(numCuenta_seleccionada);
  }

  getSaldoDeCuenta(numCuenta_seleccionada) {
 
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    operacionesbxi.getSaldo(numCuenta_seleccionada).then(
        function(response1) {
            console.log(response1.responseText);
            const detalleSaldos = response1.responseJSON;
              if ( detalleSaldos.Id === '1') {
                const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
                lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
              } else {
                console.log(detalleSaldos.MensajeAUsuario);
              }
        }, function(error) {
    });
  }


  fillCuentasBeneficiario () {
  
    const this_aux = this;
    let cuenta;
    const cuentasUsuario = this_aux.service.infoCuentas;
    const jsoncuentasUsuario = JSON.parse(cuentasUsuario); // JSON CON CUENTAS PROPIAS
    const arrayCuentasXBeneficiario = JSON.parse(this_aux.service.infoCuentasBeneficiarios); // JSON CON CUENTAS DE BENEFICIARIOS
    const cuentasArray = jsoncuentasUsuario.ArrayCuentas;

    cuentasArray.forEach(cuentaUsuario => {

         if (cuentaUsuario.TipoCuenta.toString() === '5') {
          this_aux.listaCuentasBen.push(cuentaUsuario);
          this_aux.crearListaBeneficiarios(cuentaUsuario);
         }

      });
    arrayCuentasXBeneficiario.forEach(element1 => {
      cuenta = element1.Cuenta;
          cuenta.forEach(data => {

            if ( data.TipoCuenta === '9' || data.TipoCuenta === '2'  ) {
              this_aux.listaCuentasBen.push(data);
              this_aux.crearListaBeneficiarios(data);
            }
          });
    });
    
    console.log(this_aux.listaCuentasBen);
    this_aux.defineFiltros();
  }

  crearListaBeneficiarios(data) {

            const this_aux = this;
            const li =  this.renderer.createElement('li');
            const a = this.renderer.createElement('a');
            const textoCuenta = this.renderer.createText( data.Alias);
            this.renderer.setProperty(a, 'value', data.NoCuenta);
            this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target); });
            this.renderer.appendChild(a, textoCuenta),
            this.renderer.appendChild(li, a);
            this.renderer.appendChild(this_aux.listaCuentasBeneficiario.nativeElement, li);
      
  }

  defineFiltros() {

    const this_aux = this;
    this_aux.listaCuentasBen.forEach(cuenta => {

      if (cuenta.TipoCuenta.toString() === '9') {
        this_aux.existenTerceros = true;
      }
      if (cuenta.TipoCuenta.toString() === '5') {
        this_aux.existenPropias = true;
      }
      if (cuenta.TipoCuenta.toString() === '2' && cuenta.ClaveBanco.toString() === '40103' ) {
        this.existenAMEX = true;
      }
      if (cuenta.TipoCuenta.toString() === '2' && cuenta.ClaveBanco.toString() !== '40103') {
        this.existenExternas = true;
      } 

    });

  }

  setDatosCuentaBeneficiario(elementHTML) {
 
    const this_aux = this;
    console.log(elementHTML);
    const tableBeneficiarios = document.getElementById('tableBeneficiarios');
    const tableDefaultBeneficiarios = document.getElementById('tableDefaultBeneficiarios');
    const lblCuentaDestino = document.getElementById('lblCuentaDestino');
    const lbDescripcionCtaBen = document.getElementById('lbDescripcionCtaBen');
    const numCuentaDestinario_seleccionada = elementHTML.value;

    tableBeneficiarios.setAttribute('style', 'display: block');
    tableDefaultBeneficiarios.setAttribute('style', 'display: none');
    lbDescripcionCtaBen.innerHTML = elementHTML.textContent;
    lblCuentaDestino.innerHTML = numCuentaDestinario_seleccionada.toString();
    this_aux.CuentaDestino = numCuentaDestinario_seleccionada;
  }

  setCuentasBenficiarioXTipo() {
    const this_aux = this;
    console.log('setCuentasBenficiarioXTipo');
    console.log('this_aux.rcbFiltro =' + this_aux.rcbFiltro.nativeElement.value.toString());
    const node = document.getElementById("ul_CuentasBen");
    console.log(node);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
     }

    this_aux.listaCuentasBen.forEach(auxcuenta => {

      if (this_aux.rcbFiltro.nativeElement.value.toString() === "20") {
        this_aux.tipoTarjeta = '2230';
        if ( auxcuenta.TipoCuenta.toString() === "2" && auxcuenta.ClaveBanco.toString() === "40103") {
          this_aux.crearListaBeneficiarios(auxcuenta);
        }
      } 
      if (this_aux.rcbFiltro.nativeElement.value.toString() === "2") {
        this_aux.tipoTarjeta = '2230';
        if ( auxcuenta.TipoCuenta.toString() === "2" && auxcuenta.ClaveBanco.toString() !== "40103") {
          this_aux.crearListaBeneficiarios(auxcuenta);
        }
      }
      if (this_aux.rcbFiltro.nativeElement.value.toString() === "5" || this_aux.rcbFiltro.nativeElement.value.toString() === "9"  ) {
        this_aux.tipoTarjeta = '165';  
        if (auxcuenta.TipoCuenta.toString() === this_aux.rcbFiltro.nativeElement.value.toString()) {

            this_aux.crearListaBeneficiarios(auxcuenta);
          }
        }  
   });
  }

  confirmaOperacion(montoAPagar) {
    const this_aux = this;
    this_aux.CuentaOrigen = this_aux.service.numCuentaSeleccionado;
    this_aux.Importe = montoAPagar;
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
    $('#_modal_please_wait').modal('show');
      const this_aux = this;
      const autenticacion: Autenticacion = new Autenticacion();
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Pago validado');
                  // tslint:disable-next-line:max-line-length
                  operacionesbxi.pagoTarjetaCredito(this_aux.tipoTarjeta, this_aux.Importe, this_aux.CuentaDestino, this_aux.CuentaOrigen).then(
                      function(detallePago) {
                          console.log('Pago Validado');
                          console.log(detallePago.responseJSON);
                      }
                  ); 
              } else {
                console.log(infoUsuarioJSON.MensajeAUsuario);
              }
        }, function(error) {
        });

  }

}
