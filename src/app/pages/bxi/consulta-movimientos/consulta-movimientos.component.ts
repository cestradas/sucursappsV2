import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';

@Component({
  selector: 'app-consulta-movimientos',
  templateUrl: './consulta-movimientos.component.html'
})
export class ConsultaMovimientosComponent implements OnInit {
  nombreUsuarioTdd: String;
  saldoClienteTdd: String;
  cuentaClienteTdd: string;
  
  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  
  constructor(private router: Router,
              private service: SesionBxiService,
              private renderer: Renderer2) {


               }

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
      
  $('#_modal_please_wait').modal('show');
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
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuenta_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {
          const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
          $('#_modal_please_wait').modal('hide');

        } else {
           this_aux.showErrorSucces(detalleSaldos);
        }
      }, function(error) {
         this_aux.showErrorPromise(error);
  });
}

showErrorSucces(json) {
  console.log(json.Id + json.MensajeAUsuario);
  document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario; 
  $('#_modal_please_wait').modal('hide');
  $('#errorModal').modal('show');
}

showErrorPromise(error) {
  console.log(error);
  // tslint:disable-next-line:max-line-length
  document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde."; 
  $('#_modal_please_wait').modal('hide');
  $('#errorModal').modal('show');
}
  cambiarMenu(peticion) {

    console.log("Hola");
    console.log(peticion);
    const div = document.getElementById('flecha1');
    const div2 = document.getElementById('flecha2');
 
        switch (peticion) {
    
          case 'cuentas1':
            div.style.display  = 'block'; 
            div2.style.display = "none";
      
            // disparar accion para consultar los datos
          break;
          case 'cuentas2': 
            div.style.display = "none";
            div2.style.display = "block";
      
            // disparar accion para consultar los datos
          break;
            }
    
    }
  
  
    consultarSaldos() {
      const this_aux = this;
      this_aux.router.navigate(['/saldosDetailBXI']);
    }


}
