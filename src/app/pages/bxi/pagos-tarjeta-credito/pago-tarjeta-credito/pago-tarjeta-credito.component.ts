import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { element } from 'protractor';
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

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2,  private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      
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

      if (auxcuenta.TipoCuenta.toString() === this_aux.rcbFiltro.nativeElement.value.toString()) {

       const li =  this.renderer.createElement('li');
       const a = this.renderer.createElement('a');
       const textoCuenta = this.renderer.createText( auxcuenta.DescripcionTipoCuenta);
       this.renderer.setProperty(a, 'value', auxcuenta.CUENTA);
       this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaBeneficiario(event.target); });
       this.renderer.appendChild(a, textoCuenta),
       this.renderer.appendChild(li, a);
       this.renderer.appendChild(this_aux.listaCuentasBeneficiario.nativeElement, li);
      }

     
   });

  }
}
