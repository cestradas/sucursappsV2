import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
@Component({
  selector: 'app-pago-tarjeta-credito',
  templateUrl: './pago-tarjeta-credito.component.html',
})
export class PagoTarjetaCreditoComponent implements OnInit {
  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  myForm: FormGroup;
  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2) { }

  ngOnInit() {
    this.fillSelectCuentas();
  }

    fillSelectCuentas() {
      const this_aux = this;
      const cuentasString = this_aux.service.infoCuentas;
      console.log(this_aux.service.infoCuentas);
      const consultaCuentas = JSON.parse(cuentasString);
      const cuentasArray = consultaCuentas.ArrayCuentas;
        cuentasArray.forEach(cuenta => {
            const li =  this.renderer.createElement('li');
            const a = this.renderer.createElement('a');
            const textoCuenta = this.renderer.createText( cuenta.Alias);
            this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
            this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target); });
            this.renderer.appendChild(a, textoCuenta),
            this.renderer.appendChild(li, a);
            this.renderer.appendChild(this.listaCuentas.nativeElement, li);
      });

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
}
