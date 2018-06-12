
import { OperacionesBXI } from './../../operacionesBXI';
import { SesionBxiService } from './../../sesion-bxi.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-activar-alertas',
  templateUrl: './activar-alertas-ini.component.html',

})
export class ActivarAlertasIniComponent implements OnInit {

  AlertasActivas = false;
  isChecked = false ;
  ArrayAlertasCliente: Array<any> = [];
  tipoTarjetaAlertas: string;
  Evento: string;
  @ViewChild('listaCuentas', { read: ElementRef}) listaCuentas: ElementRef ;
  @ViewChild('rcheck', { read: ElementRef}) rcheck: ElementRef ;

  constructor( private router: Router, private service: SesionBxiService, private renderer: Renderer2) { }

  ngOnInit() {
    this.fillSelectCuentas();

    //ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("continuarA");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }
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
    setTimeout(function() {
      $('#_modal_please_wait').modal('hide');
      $('div').removeClass('modal-backdrop');
    }, 500);
}
crearListaCuentas(cuenta) {
  const this_aux = this;
  const li =  this.renderer.createElement('li');
  const a = this.renderer.createElement('a');
  const textoCuenta = this.renderer.createText( cuenta.Alias);
  this.renderer.setProperty(a, 'value', cuenta.NoCuenta + ',' + cuenta.TipoCuenta);
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
  const value = elementHTML.value;

  tableOrigen.setAttribute('style', 'display: block');
  tableDefaultOrigen.setAttribute('style', 'display: none');
  lblAliasOrigen.innerHTML = elementHTML.textContent;
  lblCuentaOrigen.innerHTML = this_aux.getNumeroCuentaOrigen(value);
  this_aux.service.numCuentaSeleccionado = this_aux.getNumeroCuentaOrigen(value);

  const tipoCuenta = this_aux.getTipoCuenta(value);
  const tipoTarjeta = this_aux.filtroTipoCuenta(tipoCuenta);
  this_aux.searchAlertasByTipoCuenta(tipoTarjeta);
}
searchAlertasByTipoCuenta(tipoTarjeta) {
  const this_aux = this;
  let I, TDD, TDC;
  if ( tipoTarjeta === 'TDD') {
    I = false;
    TDD = true;
    TDC = false;
  }if ( tipoTarjeta === 'TDC') {
    I = false;
    TDD = false;
    TDC = true;
  }
  this_aux.tipoTarjetaAlertas = tipoTarjeta;
  this_aux.consultaAlertas(I, TDD, TDC, this_aux.service.numCuentaSeleccionado);
}

consultaAlertas(I, TDD , TDC , numeroCuenta) {

  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  $('#_modal_please_wait').modal('show');
  operacionesbxi.mantieneAlertas('C', this_aux.service.infoUsuarioSIC, I, TDD, TDC, numeroCuenta).then(
    function(detalleAlertas) {
          const detalle = detalleAlertas.responseJSON;
          let AlertasActivas_true = false;
          console.log(detalle);
          if (detalle .Id === '1') {


                const alertas = detalle.AlertasXCliente;
                this_aux.ArrayAlertasCliente = alertas;
                alertas.forEach(alerta => {
                    if (alerta.IndicadorServicio === 'S' ) {   AlertasActivas_true = true;
                    }
                });
                this_aux.AlertasActivas = AlertasActivas_true;
                console.log('this_aux.AlertasActivas' + this_aux.AlertasActivas);
                if (this_aux.AlertasActivas) {
                  $('#_modal_please_wait').modal('hide');
                    document.getElementById('mnsError').innerHTML =  "Ya tienes alertas activas para esta cuenta";
                    $('#errorModal').modal('show');
                }
                this_aux.getSaldoDeCuenta(numeroCuenta);

          } else {
            $('#_modal_please_wait').modal('hide');
            this_aux.showErrorSucces(detalle);      }
    }, function(error) {
      $('#_modal_please_wait').modal('hide');
      this_aux.showErrorPromise(error);    }
  );
}

getSaldoDeCuenta(numCuenta_seleccionada) {
  const this_aux = this;
  const operacionesbxi: OperacionesBXI = new OperacionesBXI();
  const lblSaldoOrigen = document.getElementById('lblSaldoOrigen');
  operacionesbxi.getSaldo(numCuenta_seleccionada).then(
      function(response1) {
          console.log(response1.responseText);
          const detalleSaldos = response1.responseJSON;
            if ( detalleSaldos.Id === '1') {
                lblSaldoOrigen.innerHTML = detalleSaldos.SaldoDisponible;
                $('#_modal_please_wait').modal('hide');
            } else {
              $('#_modal_please_wait').modal('hide');
              this_aux.showErrorSucces(detalleSaldos);
              lblSaldoOrigen.innerHTML = '';
            }
      }, function(error) {
        $('#_modal_please_wait').modal('hide');
        this_aux.showErrorPromise(error);  }
    );
}
irMenuBXI() {
    this.router.navigate(['/menuBXI']);
}

getNumeroCuentaOrigen(text) {
  const  separador = ',';
  const  arregloDeSubCadenas = text.split(separador);
  const numCuentaOrigen = arregloDeSubCadenas[0];
  console.log(arregloDeSubCadenas);
  console.log(numCuentaOrigen);

  return numCuentaOrigen;
}

  getTipoCuenta(text) {
    const  separador = ',';
    const  arregloDeSubCadenas = text.split(separador);
    const tipoCuenta = arregloDeSubCadenas[1];
    console.log(arregloDeSubCadenas);
    console.log(tipoCuenta);

    return tipoCuenta;
  }

  filtroTipoCuenta(tipoCuenta) {

    let tipoTarjeta;
    if (tipoCuenta === '5') {        tipoTarjeta = 'TDC';    }
    if (tipoCuenta === '1') {      tipoTarjeta = 'TDD';    }
    return tipoTarjeta;
  }

  showErrorPromise(error) {

      $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }

  }

  showErrorSucces(json) {

      console.log(json.Id + json.MensajeAUsuario);
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
      $('#errorModal').modal('show');

  }

  estaSeleccionado() {
    const checkBox = this.rcheck.nativeElement;
    this.isChecked = checkBox.checked;
  }

  setAltaServicioAlertas() {
    $('#_modal_please_wait').modal('show');
    const this_aux = this;
    let TDD  = false;
    let TDC = false;
    let I = false;
    if (this_aux.tipoTarjetaAlertas === 'TDD') {TDD = true; }
    if (this_aux.tipoTarjetaAlertas === 'TDC') {TDC = true; }
    if (this_aux.ArrayAlertasCliente.length !== 0) {
       const elemento = this_aux.ArrayAlertasCliente[0];
       const servicioEvento = elemento.ServicioEvento;
       this_aux.Evento = servicioEvento.substring(2, 5);
       const operacionesbxi: OperacionesBXI = new OperacionesBXI();
       operacionesbxi.altaServicioAlertas('A', this_aux.service.infoUsuarioSIC, I, TDD, TDC, this_aux.service.numCuentaSeleccionado, this_aux.Evento ).then(
          function(res) {
              const respuestaActivacion = res.responseJSON;
                if (respuestaActivacion.Id === '1') {
                    console.log('Servicio activado');
                    this_aux.ArrayAlertasCliente.shift();
                    if (this_aux.ArrayAlertasCliente.length !== 0) {
                      const elementoAux = this_aux.ArrayAlertasCliente[0];
                      const servicioEventoAux = elementoAux.ServicioEvento;
                      this_aux.Evento = servicioEventoAux.substring(2, 5);
                      this_aux.setAltaServicioAlertas();
                    } else {
                      this_aux.router.navigate(['/activaAlertas_verify']);
                    }
                } else {
                  $('#_modal_please_wait').modal('hide');
                  this_aux.showErrorSucces(res); }
          }, function(error) {

            $('#_modal_please_wait').modal('hide');
            this_aux.showErrorPromiseMoney(error);   }

       );

    }

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

}
