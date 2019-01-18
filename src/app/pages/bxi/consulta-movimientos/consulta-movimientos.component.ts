import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import $ from 'jquery';
import { Router } from '@angular/router';
import { SesionBxiService } from '../sesion-bxi.service';
import { OperacionesBXI } from '../operacionesBXI';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var jquery: any; // jquery
declare var $: any;


@Component({
  selector: 'app-consulta-movimientos',
  templateUrl: './consulta-movimientos.component.html'
})
export class ConsultaMovimientosComponent implements OnInit {
  
  cuentasArray: Array<any>;
  saldoSeleccionado: string;
  aliasSeleccionado: String;
  Cuenta = false;
  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  
  constructor(private router: Router,
              private service: SesionBxiService,
              private renderer: Renderer2,
              ) { }

  ngOnInit() {
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
    this.fillSelectCuentas();

    // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    
    let btnDetalle = document.getElementById("verDetalle");

    if (storageTipoClienteBEL === "true") {
      btnDetalle.classList.remove("color-botones");
      btnDetalle.classList.add("color-botones_Preferente");
    }


    setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);

  }

fillSelectCuentas() {
  console.log("Entre a fiillSelectCuentasTDC");
  const this_aux = this;
    this_aux.resetLista();
    const cuentasString = this_aux.service.infoCuentas;
    // console.log(this_aux.service.infoCuentas);
    const consultaCuentas = JSON.parse(cuentasString);
    this_aux.cuentasArray = consultaCuentas.ArrayCuentas;
    // console.log(this_aux.cuentasArray.length);

  
  // console.log(this_aux.cuentasArray);
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
 
    for (let i = 0; i < this_aux.cuentasArray.length; i++) {
      const li =  this.renderer.createElement('li');
      this_aux.renderer.addClass(li, 'text-li');
      const a = this.renderer.createElement('a');
      let mascaraCuenta;
      let tamCuenta = this_aux.cuentasArray[i].NoCuenta.length;
      let textoCuenta;
      
      this_aux.service.noTarjetaSeleccionada = this_aux.cuentasArray[i].Plastico;
      this_aux.service.divisa = this_aux.cuentasArray[i].Divisa;
      if (this_aux.cuentasArray[i].TipoCuenta === 5) {
        mascaraCuenta = operacionesbxi.mascaraNumeroTarjeta(this_aux.cuentasArray[i].NoCuenta);
        textoCuenta = this.renderer.createText( this_aux.cuentasArray[i].Alias + " - " + mascaraCuenta);
      // tslint:disable-next-line:max-line-length
      } else if (((this_aux.cuentasArray[i].TipoCuenta === 1) && (tamCuenta === 10) ) || ((this_aux.cuentasArray[i].TipoCuenta === 4) && (tamCuenta === 10)) ) {
        mascaraCuenta = operacionesbxi.mascaraNumeroCuenta(this_aux.cuentasArray[i].NoCuenta);
        textoCuenta = this.renderer.createText( this_aux.cuentasArray[i].Alias + " - " + mascaraCuenta);
      }
      
      if (textoCuenta !== undefined) {
        this.renderer.setProperty(a, 'value', this_aux.cuentasArray[i].NoCuenta);
        // tslint:disable-next-line:max-line-length
        this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target, this_aux.cuentasArray[i].TipoCuenta, this_aux.cuentasArray[i].Alias); });
        this.renderer.appendChild(a, textoCuenta),
        this.renderer.appendChild(li, a);
        this.renderer.appendChild(this.listaCuentas.nativeElement, li);
      }
       
  } 
}


resetLista() {
    const node = document.getElementById("ul_Cuentas");
    // console.log(node);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
     }
  }



  setDatosCuentaSeleccionada(elementHTML, tipoCuenta, alias) {
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      console.log("setDatosCuentaSeleccionada inicial  " + tipoCuenta);
  $('#_modal_please_wait').modal('show');
  const this_aux = this;
  // console.log(elementHTML);
  const tableOrigen = document.getElementById('tableOrigen');
  const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
  const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
  // const lblAliasOrigen = document.getElementById('lblAliasOrigen');
  const numCuenta_seleccionada = elementHTML.value;
  this_aux.aliasSeleccionado = alias;
  this_aux.service.aliasCuentaSeleccionada = alias;
  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');

  // lblAliasOrigen.innerHTML = elementHTML.textContent;
  lblCuentaOrigen.innerHTML = operacionesbxi.mascaraNumeroCuenta(numCuenta_seleccionada.toString());
  this_aux.service.numCuentaSeleccionado = numCuenta_seleccionada;
  // console.log("setDatosCuentaSeleccionada final  " + tipoCuenta);

  if (tipoCuenta === 1) {
    this_aux.service.tipoCuenta = "1";
    // console.log("setDatosCuentaSeleccionada if cuando 1  " + tipoCuenta);
    this_aux.getSaldoDeCuentaTDD(this_aux.service.numCuentaSeleccionado);

    console.log("llego el saldo tdd");
  } else if (tipoCuenta === 4) {
    this_aux.service.tipoCuenta = "1";
    // console.log("setDatosCuentaSeleccionada if cuando 1  " + tipoCuenta);
    this_aux.getSaldoDeCuentaTDD(this_aux.service.numCuentaSeleccionado);
  } else {
    this_aux.service.tipoCuenta = "5";

    // console.log("setDatosCuentaSeleccionada if cuando 2  " + tipoCuenta);
    this_aux.getSaldoDeCuentaTDC(this_aux.service.numCuentaSeleccionado);
    console.log("llego el saldo tdc");
  }
  
}

getSaldoDeCuentaTDD(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldo(numCuenta_seleccionada).then(
      function(response1) {
        // console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {
          // const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          // lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
          this_aux.saldoSeleccionado = detalleSaldos.SaldoDisponible;
          this_aux.service.saldoSeleccionado = this_aux.saldoSeleccionado;
          document.getElementById('tipoSaldo').innerHTML = "Saldo Disponible";
          this_aux.Cuenta = true;

        } else {
          this_aux.Cuenta = false;
           this_aux.showErrorSucces(detalleSaldos);
        }
        setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
      }, function(error) {
        this_aux.Cuenta = false;
        this_aux.saldoSeleccionado = "";
          this_aux.service.saldoSeleccionado = this_aux.saldoSeleccionado;
         this_aux.showErrorPromise(error);
         setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
  });
}

getSaldoDeCuentaTDC(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  operacionesbxi.getSaldoTDC(numCuenta_seleccionada).then(
      function(response1) {
        // console.log(response1.responseText);
        const detalleSaldos = response1.responseJSON;
        if ( detalleSaldos.Id === '1') {
          // const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
          // lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
          this_aux.saldoSeleccionado = detalleSaldos.SaldoActual;
          this_aux.service.saldoSeleccionado = this_aux.saldoSeleccionado;
          this_aux.service.SaldoActual = detalleSaldos.SaldoActual;
          document.getElementById('tipoSaldo').innerHTML = "Saldo Actual";
          this_aux.Cuenta = true;

        } else {
          this_aux.Cuenta = false;
           this_aux.showErrorSucces(detalleSaldos);
        }

        setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
      }, function(error) {
        this_aux.Cuenta = false;
        this_aux.saldoSeleccionado = "";
          this_aux.service.saldoSeleccionado = this_aux.saldoSeleccionado;
         this_aux.showErrorPromise(error);
         setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
  });




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
  
  
    consultarSaldos() {
      const this_aux = this;
      this_aux.fillSelectCuentas();
      this_aux.router.navigate(['/saldosDetailBXI']);
      


    }


}
