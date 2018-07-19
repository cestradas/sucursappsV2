import { Autenticacion } from './../../autenticacion';
import { SesionBxiService } from './../../sesion-bxi.service';
import { OperacionesBXI } from './../../operacionesBXI';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgControl, FormControl } from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import {CurrencyPipe} from '@angular/common';



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
  @ViewChild('rImporte', { read: ElementRef}) rImporte: ElementRef ;

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
  importeAux: string;
  nombreBanco: string;
  NumeroSeguridad: string;
  SaldoOrigen: number;
  ImporteShow: number;

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2,  private fb: FormBuilder, private currencyPipe: CurrencyPipe) {
    this.myForm = this.fb.group({
      fcImporte: ['', [Validators.required, Validators.pattern( /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/)]],
      fcToken: []
    });
  }

  ngOnInit() {
    $( ".cdk-visually-hidden" ).css( "margin-top", "17%" );
    this.resetLista();
    this.fillSelectCuentas();
    this.fillCuentasBeneficiario();
    setTimeout(function() {
      $('#_modal_please_wait').modal('hide');
    }, 500);

    // ESTILOS Preferente
    let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
    let btnContinuar = document.getElementById("contiuar");
    let btnConfirmar = document.getElementById("confirmar");

    if (storageTipoClienteBEL === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
      btnConfirmar.classList.remove("color-botones");
      btnConfirmar.classList.add("color-botones_Preferente");
    }

  }

    fillSelectCuentas() {
      const this_aux = this;
      const cuentasString = this_aux.service.infoCuentas;
      console.log(this_aux.service.infoCuentas);
      const consultaCuentas = JSON.parse(cuentasString);
      const cuentasArray = consultaCuentas.ArrayCuentas;
        cuentasArray.forEach(cuenta => {
          this_aux.filtraCtaVista(cuenta);
      });
  }

  filtraCtaVista(cuenta) {
    const this_aux = this;
    if ((cuenta.TipoCuenta === 1  && cuenta.NoCuenta.length === 10) || (cuenta.TipoCuenta === 4 &&  cuenta.NoCuenta.length === 10)) {
      this_aux.crearListaCuentas(cuenta);
    } 
  }
  crearListaCuentas(cuenta) {   
    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    const li =  this.renderer.createElement('li');
    this_aux.renderer.addClass(li, 'text-li');
    const a = this.renderer.createElement('a');
    const textoCuenta = this.renderer.createText( cuenta.Alias + ' ' + operacionesbxi.mascaraNumeroCuenta(cuenta.NoCuenta) );
    this.renderer.setProperty(a, 'value', cuenta.NoCuenta);
    this. renderer.listen(a, 'click', (event) => { this_aux.setDatosCuentaSeleccionada(event.target); });
    this.renderer.appendChild(a, textoCuenta),
    this.renderer.appendChild(li, a);
    this.renderer.appendChild(this_aux.listaCuentas.nativeElement, li);
  }

  setDatosCuentaSeleccionada(elementHTML) {

    $('#_modal_please_wait').modal('show');
    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    console.log(elementHTML);
    const tableOrigen = document.getElementById('tableOrigen');
    const tableDefaultOrigen = document.getElementById('tableDefaultOrigen');
    const lblCuentaOrigen = document.getElementById('lblCuentaOrigen');
    const lblAliasOrigen = document.getElementById('lblAliasOrigen');
    const numCuenta_seleccionada = elementHTML.value;

    tableOrigen.setAttribute('style', 'display: block');
    tableDefaultOrigen.setAttribute('style', 'display: none');
    lblAliasOrigen.innerHTML = this_aux.getCtaFromTextContet(elementHTML.textContent);
    lblCuentaOrigen.innerHTML = operacionesbxi.mascaraNumeroCuenta(numCuenta_seleccionada.toString());
    this_aux.service.numCuentaSeleccionado = numCuenta_seleccionada;
    this_aux.getSaldoDeCuenta(numCuenta_seleccionada);
  }

  getSaldoDeCuenta(numCuenta_seleccionada) {

    console.log(numCuenta_seleccionada.length);
    if (numCuenta_seleccionada.length === 16) {
         this.getSaldoTDC(numCuenta_seleccionada);
    } else {
        this.getSaldoTDDOtras(numCuenta_seleccionada);
    }
  }

  getSaldoTDDOtras(numCuenta_seleccionada) {
    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    operacionesbxi.getSaldo(numCuenta_seleccionada).then(
        function(response1) {
          console.log(response1.responseText);
          const detalleSaldos = response1.responseJSON;
          if ( detalleSaldos.Id === '1') {

           setTimeout(function() {
            
             this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
              $('#_modal_please_wait').modal('hide');
            }, 500);
          } else {
           this_aux.SaldoOrigen = 0;
           setTimeout(function() { 
           $('#_modal_please_wait').modal('hide');
             this_aux.showErrorSucces(detalleSaldos);
           }, 500);
          }
        }, function(error) {
        
        this_aux.SaldoOrigen = 0;
         setTimeout(function() {
           $('#_modal_please_wait').modal('hide');
             this_aux.showErrorPromise(error);
         }, 500);
    });
   }

   getSaldoTDC(numCuenta_seleccionada) {
    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    operacionesbxi.getSaldoTDC(numCuenta_seleccionada).then(
        function(response1) {
          console.log(response1.responseText);
          const detalleSaldos = response1.responseJSON;
          if ( detalleSaldos.Id === '1') {

           setTimeout(function() {
            
             this_aux.SaldoOrigen = detalleSaldos.SaldoDisponible;
              $('#_modal_please_wait').modal('hide');
            }, 500);
          } else {
           this_aux.SaldoOrigen = 0;
           setTimeout(function() { 
           $('#_modal_please_wait').modal('hide');
             this_aux.showErrorSucces(detalleSaldos);
           }, 500);
          }
        }, function(error) {
        
        this_aux.SaldoOrigen = 0;
         setTimeout(function() {
           $('#_modal_please_wait').modal('hide');
             this_aux.showErrorPromise(error);
         }, 500);
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
          this_aux.crearListaBeneficiarios(cuentaUsuario, true);
         }

      });
    arrayCuentasXBeneficiario.forEach(element1 => {
      if (element1.Cuenta !== undefined ) {
        cuenta = element1.Cuenta;
        cuenta.forEach(data => {
          if ( data.TipoCuenta === '9' ) {
            this_aux.listaCuentasBen.push(data);
            this_aux.crearListaBeneficiarios(data, true);
          }
          if (  data.TipoCuenta === '2'  ) {
            this_aux.listaCuentasBen.push(data);
            this_aux.crearListaBeneficiarios(data, false);
          }
        });
      }
    });
    console.log(this_aux.listaCuentasBen);
    this_aux.defineFiltros();
  }

  crearListaBeneficiarios(data, isBanorte) {

            const this_aux = this;
            const operacionesbxi: OperacionesBXI = new OperacionesBXI();
            const li =  this.renderer.createElement('li');
            this_aux.renderer.addClass(li, 'text-li');
            const a = this.renderer.createElement('a');
            const textoCuenta = this.renderer.createText( data.Alias + ' ' + data.NoCuenta);
            if ( isBanorte) {
                this.renderer.setProperty(a, 'value', data.NoCuenta + ',Banorte' );
            } else {
              this.renderer.setProperty(a, 'value', data.NoCuenta + ',' + data.DescripcionBanco);
            }
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
    const valueElement = elementHTML.value;

    tableBeneficiarios.setAttribute('style', 'display: block');
    tableDefaultBeneficiarios.setAttribute('style', 'display: none');
    lbDescripcionCtaBen.innerHTML = this_aux.getCtaFromTextContet(elementHTML.textContent);
    lblCuentaDestino.innerHTML = this_aux.getNumeroCuentaDestino(valueElement);
    this_aux.CuentaDestino =  this_aux.getNumeroCuentaDestino(valueElement);
    this_aux.service.numCtaBenSeleccionada = this_aux.CuentaDestino;
    this_aux.service.nameBancoDestino = this_aux.getNameInstitucion(valueElement);

  }

  setCuentasBenficiarioXTipo() {
    const this_aux = this;
    const tableBeneficiarios = document.getElementById('tableBeneficiarios');
    const tableDefaultBeneficiarios = document.getElementById('tableDefaultBeneficiarios');
    const lblCuentaDestino = document.getElementById('lblCuentaDestino');
    const lbDescripcionCtaBen = document.getElementById('lbDescripcionCtaBen');
    this_aux.resetLista();
    lblCuentaDestino.innerHTML = "";
    lbDescripcionCtaBen.innerHTML = "";
    tableBeneficiarios.setAttribute('style', 'display: none;');
    tableDefaultBeneficiarios.setAttribute('style', 'display: block;height: 68px !important;');
    tableDefaultBeneficiarios.removeAttribute('style');
    tableDefaultBeneficiarios.setAttribute('style', 'height: 68px !important;');
    this_aux.listaCuentasBen.forEach(auxcuenta => {

      if (this_aux.rcbFiltro.nativeElement.value.toString() === "20") {
        this_aux.tipoTarjeta = '2230';
        this_aux.service.nameOperacion = "Pago tarjeta de credito American Express";
        if ( auxcuenta.TipoCuenta.toString() === "2" && auxcuenta.ClaveBanco.toString() === "40103") {
          this_aux.crearListaBeneficiarios(auxcuenta, false);
        }
      }
      if (this_aux.rcbFiltro.nativeElement.value.toString() === "2") {
        this_aux.tipoTarjeta = '165';
        this_aux.service.nameOperacion = "Pago tarjeta de credito Otros Bancos";
        if ( auxcuenta.TipoCuenta.toString() === "2" && auxcuenta.ClaveBanco.toString() !== "40103") {
          this_aux.crearListaBeneficiarios(auxcuenta, false);
        }
      }
      if (this_aux.rcbFiltro.nativeElement.value.toString() === "5" || this_aux.rcbFiltro.nativeElement.value.toString() === "9"  ) {
        this_aux.tipoTarjeta = '165';
        if (this_aux.rcbFiltro.nativeElement.value.toString() === "5") {
          this_aux.service.nameOperacion = "Pago tarjeta de credito Propias Banorte";
        } else {
          this_aux.service.nameOperacion = "Pago tarjeta de credito Terceros Banorte";
        }
        if (auxcuenta.TipoCuenta.toString() === this_aux.rcbFiltro.nativeElement.value.toString()) {
            this_aux.crearListaBeneficiarios(auxcuenta, true);
          }
        }

   });
  }

  confirmaOperacion(montoAPagar) {
    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    this_aux.CuentaOrigen = operacionesbxi.mascaraNumeroCuenta( this_aux.service.numCuentaSeleccionado);
    this_aux.nombreBanco = this_aux.service.nameBancoDestino;
    this_aux.ImporteShow = parseInt(this_aux.replaceSimbolo( montoAPagar), 10);
    this_aux.Importe = this_aux.replaceSimbolo( montoAPagar);
    this_aux.validarSaldo(this_aux.service.numCuentaSeleccionado, this_aux.Importe);

  }

  setTipoAutenticacionOnModal() {
    const this_aux = this;
    const divChallenge = document.getElementById('challenger');
    const divTokenPass = document.getElementById('divPass');
    const divMjeTipoAutentica = document.getElementById('mensajeTipoAutentica');

  if (this_aux.rcbFiltro.nativeElement.value.toString() !== "5" ) {

    const control: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{6})*$/)]);
    this_aux.myForm.setControl('fcToken', control );
    let mensajeError;
    if (this_aux.service.metodoAutenticaMayor.toString() === '5') {
      $('#_modal_please_wait').modal('show');
      this_aux.labelTipoAutentica = 'Token Celular';
        divTokenPass.setAttribute('style', 'display: flex');
        divMjeTipoAutentica.setAttribute('style', 'display: flex');
        const operacionesbxi: OperacionesBXI = new OperacionesBXI();
        operacionesbxi.preparaAutenticacion().then(
          function(response) {
            const detallePrepara = response.responseJSON;
            console.log(detallePrepara);
            if (detallePrepara.Id === 'SEG0001') {
              divChallenge.setAttribute('style', 'display: flex');
              this_aux.NumeroSeguridad = detallePrepara.MensajeUsuarioUno;
              setTimeout(() => {
                $('#_modal_please_wait').modal('hide');
             }, 500);
            } else {
              setTimeout(function() { 
                $('#_modal_please_wait').modal('hide');
                console.log(detallePrepara.Id + detallePrepara.MensajeAUsuario);
                mensajeError = this_aux.controlarError(detallePrepara);
                document.getElementById('mnsError').innerHTML =  mensajeError;
                $('#errorModal').modal('show');
              }, 500);
            }
          }, function(error) {
           
            setTimeout(() => {
              $('#_modal_please_wait').modal('hide');
              this_aux.showErrorPromise(error);
           }, 500);

          });

    } else if (this_aux.service.metodoAutenticaMayor.toString()  === '0') {
     
      divMjeTipoAutentica.setAttribute('style', 'display: flex');
      divChallenge.setAttribute('style', 'display: none');
      divTokenPass.setAttribute('style', 'display: flex');
      this_aux.labelTipoAutentica = 'Contrase&atilde;a';
    } else if (this_aux.service.metodoAutenticaMayor.toString()  === '1') {

      divMjeTipoAutentica.setAttribute('style', 'display: flex');
      divChallenge.setAttribute('style', 'display: none');
      divTokenPass.setAttribute('style', 'display: flex');
      this_aux.labelTipoAutentica = 'Token Fisico';
    }
  } else {
    divMjeTipoAutentica.setAttribute('style', 'display: none');
    divChallenge.setAttribute('style', 'display: none');
    divTokenPass.setAttribute('style', 'display: none');
  } 
   setTimeout(function() {
       $( ".cdk-visually-hidden" ).css( "margin-top", "16%" );
      $('#confirmModal').modal('show');
   }, 500);
  }

  confirmarPago(token) {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    if (this_aux.rcbFiltro.nativeElement.value.toString() === "5") {
        this_aux.doPagoTDC();
    } else {

      let mensajeError;
      const autenticacion: Autenticacion = new Autenticacion();
      autenticacion.autenticaUsuario(token, this_aux.service.metodoAutenticaMayor).then(
        function(detalleAutentica) {
              // console.log(detalleAutentica.responseJSON);
              const infoUsuarioJSON = detalleAutentica.responseJSON;
              if (infoUsuarioJSON.Id === 'SEG0001') {
                  console.log('Pago validado');
                  // tslint:disable-next-line:max-line-length
                  this_aux.doPagoTDC();
              } else {
                  setTimeout(function() { 
                    $('#_modal_please_wait').modal('hide');
                    console.log(infoUsuarioJSON.Id + infoUsuarioJSON.MensajeAUsuario);
                    mensajeError = this_aux.controlarError(infoUsuarioJSON);
                    document.getElementById('mnsError').innerHTML =  mensajeError;
                    $('#errorModal').modal('show');
                  }, 500);
              }
        }, function(error) {
          setTimeout(function() { 
            $('#_modal_please_wait').modal('hide');
            this_aux.showErrorPromiseMoney(error);  
          }, 500);
        });
     }
     
  }

  doPagoTDC() {
    const this_aux = this;
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    // tslint:disable-next-line:max-line-length
    operacionesbxi.pagoTarjetaCredito(this_aux.tipoTarjeta, this_aux.Importe, this_aux.CuentaDestino, this_aux.service.numCuentaSeleccionado).then(
      function(detallePago) {
          const jsonDetallePago = detallePago.responseJSON;
          if (jsonDetallePago.Id === '1') {
              console.log('Pago Realizado');
              this_aux.service.detallePagoTarjeta = detallePago.responseText;
              $('div').removeClass('modal-backdrop');
              this_aux.router.navigate(['/pagoTarjetaCredito_verify']);
          } else {

            // tslint:disable-next-line:max-line-length
            if (jsonDetallePago.Id === "2" && jsonDetallePago.MensajeAUsuario === "Error IIB: El Broker no proporcionó una respuesta dentro del intervalo de tiempo especificado" ) {
                setTimeout(() => {
                  $('#_modal_please_wait').modal('hide');
                  this_aux.showErrorPromiseMoney(jsonDetallePago);
              }, 500);
            } else {
              setTimeout(() => {
                $('#_modal_please_wait').modal('hide');
                this_aux.showErrorSucces(jsonDetallePago);
              }, 500);
            }
          }
      }, function(error) {
       
            setTimeout(() => {
              $('#_modal_please_wait').modal('hide');
              this_aux.showErrorPromiseMoney(error);
          }, 500);
       }
    );
  }

  getNumeroCuentaDestino(text) {
    const  separador = ',';
    const  arregloDeSubCadenas = text.split(separador);
    const numCuentaDestino = arregloDeSubCadenas[0];
    console.log(arregloDeSubCadenas);
    console.log(numCuentaDestino);

    return numCuentaDestino;
  }

  getNameInstitucion(text) {
    const  separador = ',';
    const  arregloDeSubCadenas = text.split(separador);
    const nameInstitucion = arregloDeSubCadenas[1];
    console.log(arregloDeSubCadenas);
    console.log(nameInstitucion);

    return nameInstitucion;
  }


  resetLista() {
    const node = document.getElementById("ul_CuentasBen");
    console.log(node);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
     }
  }

  transformAmount(importe) {
    // const expre1 = /^\$+([0-9]{1,3}\,*)+(\.)+([0-9]{2})/;
    const expre2 =  /^([0-9]{1,})+((?:\.){0,1}[0-9]{0,})$/;
    // const expre3 =  /^([0-9])/;
    // const expre4 =  /^\.+([0-9]{2})/;
    const this_aux = this;
    if (importe !== '' && importe !== '.' && importe !== '-' && expre2.test(importe)) {
      this_aux.importeAux = this_aux.replaceSimbolo(importe);
      this_aux.rImporte.nativeElement.value = this_aux.currencyPipe.transform(this_aux.importeAux, 'USD');
      this_aux.importeAux = this_aux.replaceSimbolo( this_aux.rImporte.nativeElement.value) ;
     }
  }
  replaceSimbolo(importe) {
    const this_aux = this;
    let importeAux = importe.replace('$', '');
    const re = /\,/g;
    importeAux = importeAux.replace(re, '');
    console.log(importeAux);

        return importeAux;
          
  }

  controlarError(json) {

    const id = json.Id ;
    const mensajeUsuario = json.MensajeAUsuario;
    let mensajeError;

    switch (id) {

      case 'SEG0003': mensajeError = "Usuario bloqueado, favor de esperar 15 minutos e intentar nuevamente.";
                    break;
      case 'SEG0004': mensajeError =  "Usuario bloqueado, favor de marcar a Banortel.";
                    break;
      case 'SEG0005': mensajeError =  "Los datos proporcionados son incorrectos, favor de verificar.";
                    break;
      case 'SEG0007': mensajeError = "Los datos proporcionados son incorrectos, favor de verificar.";
                    break;
      case 'SEG0008':  mensajeError = "La sesión ha caducado.";
                    break;
      case 'SEG0009':  mensajeError = "Límite de sesiones superado, favor de cerrar las sesiones de banca en línea activas.";
                    break;
      // tslint:disable-next-line:max-line-length
      case 'SEGOTP1': mensajeError = "Token desincronizado. Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                    break;
      case 'SEGOTP2': mensajeError = "Token bloqueado, favor de marcar a Banortel.";
                    break;
      case 'SEGOTP3': mensajeError = "Token deshabilitado, favor de marcar a Banortel.";
                    break;
      case 'SEGOTP4': mensajeError = "Token no activado, favor de marcar a Banortel.";
                    break;
      // tslint:disable-next-line:max-line-length
      case 'SEGAM81': mensajeError = "Token desincronizado. Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                    break;
      case 'SEGAM82': mensajeError = "Token bloqueado, favor de marcar a Banortel.";
                    break;
      case 'SEGAM83': mensajeError = "Token deshabilitado, favor de marcar a Banortel.";
                    break;
      case 'SEGAM84': mensajeError = "Token no activado, favor de marcar a Banortel.";
                    break;

      // tslint:disable-next-line:max-line-length
      case 'SEGTK03': mensajeError = "Token desincronizado."; // Ingresa a Banca en Línea. Selecciona la opción Token Celular, elige sincronizar Token y sigue las instrucciones";
                    break;
      case '2'      : mensajeError = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
                    console.log("Id: 2 Mensaje:" + mensajeUsuario);
                  break;
    }

    return mensajeError;
  }

  showErrorPromise(error) {

      $('#modal_please_wait').modal('hide');

      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
      $('#errorModal').modal('show');
  }

  showErrorSucces(json) {

    console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === '2') {
      document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
    } else {
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    }
    $('#errorModal').modal('show');
}

  showErrorPromiseMoney(error) {

   
    if (error.errorCode === 'API_INVOCATION_FAILURE') {
      $('#errorModal').modal('show'); 
      document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
    } else {
      document.getElementById('msgError').innerHTML =   "No fue posible confirmar la operación. Por favor verifica tu saldo.";
      $('#ModalErrorTransaccion').modal('show');
    }
}

  irMenuBXI() {
    this.router.navigate(['/menuBXI']);
  }

  validarSaldo(numCuentaSelec, importe) {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');
    const operacionesbxi: OperacionesBXI = new OperacionesBXI();
    operacionesbxi.consultaTablaYValidaSaldo(numCuentaSelec, importe).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        console.log(response.responseText);
        if (DatosJSON.Id === "1") {
          console.log("Pago validado");
          this_aux.setTipoAutenticacionOnModal();
        } else if ( DatosJSON.Id === "4" ) {
          $('#modalLimiteDiario').modal('show');
        } else if ( DatosJSON.Id === "5" ) {
          $('#modalLimiteMensual').modal('show');
        } else {
          $('#errorModal').modal('show');
        }
        setTimeout(function() {$('#_modal_please_wait').modal('hide'); }, 500);
      }, function(error) {
        setTimeout(function() {
          $('#_modal_please_wait').modal('hide'); 
          this_aux.showErrorPromise(error);
        }, 500);
  });
  }

  ocultaModal() {
    const this_aux = this;
    const control: FormControl = new FormControl('');
    this_aux.myForm.setControl('fcToken', control );
  }

   getCtaFromTextContet(textContent) {
    
    const re = /\*/g;
    const reNum = /\d/g;
    let textContentAux = textContent.replace(re, '');
    textContentAux = textContentAux.replace(reNum, '');
    console.log(textContentAux);

    return textContentAux;

  }
}
