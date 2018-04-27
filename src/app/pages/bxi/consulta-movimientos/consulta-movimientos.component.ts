import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';

declare var jquery: any; // jquery
declare var $: any;


@Component({
  selector: 'app-consulta-movimientos',
  templateUrl: './consulta-movimientos.component.html'
})
export class ConsultaMovimientosComponent implements OnInit {
  

  cuentasArray: Array<any>;
  
  
  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  
  constructor(private router: Router,
              private service: SesionBxiService,
              private renderer: Renderer2) {


               }

  ngOnInit() {
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
  this.fillSelectCuentasTDD();
  }


  fillSelectCuentasTDD() {

    console.log("Entre a fiillSelectCuentasTDD");
    const this_aux = this;
    this_aux.resetLista();
    this_aux.service.tipoCuenta = "1";
    const cuentasString = this_aux.service.infoCuentas;
    console.log(this_aux.service.infoCuentas);
    const consultaCuentas = JSON.parse(cuentasString);
    this_aux.cuentasArray = consultaCuentas.ArrayCuentas;
    console.log(this_aux.cuentasArray.length);
    
    
    console.log(this_aux.cuentasArray);
      for (let i = 0; i < this_aux.cuentasArray.length; i++) {
      if (this_aux.cuentasArray[i].TipoCuenta === 1) {
        const li =  this.renderer.createElement('li');
        const a = this.renderer.createElement('a');

        this_aux.service.aliasCuentaSeleccionada = this_aux.cuentasArray[i].Alias;
        this_aux.service.noTarjetaSeleccionada = this_aux.cuentasArray[i].Plastico;
        this_aux.service.divisa = this_aux.cuentasArray[i].Divisa;

        const textoCuenta = this.renderer.createText( this_aux.cuentasArray[i].Alias);
        this.renderer.setProperty(a, 'value', this_aux.cuentasArray[i].NoCuenta);
        this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target, this_aux.service.tipoCuenta); });
        this.renderer.appendChild(a, textoCuenta),
        this.renderer.appendChild(li, a);
        this.renderer.appendChild(this.listaCuentas.nativeElement, li);
      }
    } 
}

fillSelectCuentasTDC() {
  console.log("Entre a fiillSelectCuentasTDC");
  const this_aux = this;
    this_aux.resetLista();
    const cuentasString = this_aux.service.infoCuentas;
    console.log(this_aux.service.infoCuentas);
    const consultaCuentas = JSON.parse(cuentasString);
    this_aux.cuentasArray = consultaCuentas.ArrayCuentas;
    console.log(this_aux.cuentasArray.length);

  this_aux.service.tipoCuenta = "5";
  console.log(this_aux.cuentasArray);

 
    for (let i = 0; i < this_aux.cuentasArray.length; i++) {
    if (this_aux.cuentasArray[i].TipoCuenta === 5) {
      const li =  this.renderer.createElement('li');
      const a = this.renderer.createElement('a');

      this_aux.service.aliasCuentaSeleccionada = this_aux.cuentasArray[i].Alias;
      this_aux.service.noTarjetaSeleccionada = this_aux.cuentasArray[i].Plastico;
      this_aux.service.divisa = this_aux.cuentasArray[i].Divisa;

      const textoCuenta = this.renderer.createText( this_aux.cuentasArray[i].Alias);
      this.renderer.setProperty(a, 'value', this_aux.cuentasArray[i].NoCuenta);
      this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target, this_aux.service.tipoCuenta); });
      this.renderer.appendChild(a, textoCuenta),
      this.renderer.appendChild(li, a);
      this.renderer.appendChild(this.listaCuentas.nativeElement, li);
    }
  } 
}

resetLista() {
    const node = document.getElementById("ul_Cuentas");
    console.log(node);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
     }
  }



  setDatosCuentaSeleccionada(elementHTML, tipoCuenta) {
      console.log("setDatosCuentaSeleccionada inicial  " + tipoCuenta);
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
  console.log("setDatosCuentaSeleccionada final  " + tipoCuenta);

  if (tipoCuenta === "1") {

    console.log("setDatosCuentaSeleccionada if cuando 1  " + tipoCuenta);
    this_aux.getSaldoDeCuentaTDD(numCuenta_seleccionada);
    console.log("llego el saldo tdd");
  } else {

    console.log("setDatosCuentaSeleccionada if cuando 2  " + tipoCuenta);
    this_aux.getSaldoDeCuentaTDC(numCuenta_seleccionada);
    console.log("llego el saldo tdc");
  }
  
}

getSaldoDeCuentaTDD(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuenta_seleccionada).then(
      function(response1) {
        console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {
          const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
          this_aux.service.saldoSeleccionado = detalleSaldos.SaldoDisponible;
          $('#_modal_please_wait').modal('hide');

        } else {
           this_aux.showErrorSucces(detalleSaldos);
        }
      }, function(error) {
         this_aux.showErrorPromise(error);
  });
}

getSaldoDeCuentaTDC(numeroCue) {
  const this_aux = this;
  const formParameters = {
    cuenta: numeroCue
  }; 
  console.log(formParameters);
         
  const resourceRequest = new WLResourceRequest(
    
    'adapters/AdapterBanorteSucursAppsBEL/resource/consultaMovimientosTarjetas', WLResourceRequest.POST);
    resourceRequest.setTimeout(30000);
    
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        console.log(response.responseText);
       let saldo = response.responseJSON;
       let saldoCuenta = saldo.SaldoDisponible;
       console.log(saldoCuenta);

       if ( saldo.Id === '1') {
        const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
        lblSaldoOrigen.innerHTML = saldoCuenta;
        this_aux.service.saldoSeleccionado = saldoCuenta;
        $('#_modal_please_wait').modal('hide');

      } else {
         this_aux.showErrorSucces(saldo);
      }

      }, function(error) {
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
    const divcuentas = document.getElementById("cuentas1");
    const divcuentas2 = document.getElementById("cuentas2");
        switch (peticion) {
    
          case 'cuentas1':
            div.style.display  = 'block'; 
            div2.style.display = "none";
            divcuentas.style.backgroundColor = '#a51029';
            divcuentas2.style.backgroundColor = '#c41330';

            this.fillSelectCuentasTDD();
            // disparar accion para consultar los datos
          break;
          case 'cuentas2': 
            div.style.display = "none";
            div2.style.display = "block";
            divcuentas.style.backgroundColor = '#c41330';
            divcuentas2.style.backgroundColor = '#a51029';

            this.fillSelectCuentasTDC();
            // disparar accion para consultar los datos
          break;
            }
    
    }
  
  
    consultarSaldos() {
      const this_aux = this;
      this_aux.router.navigate(['/saldosDetailBXI']);
    }


}
