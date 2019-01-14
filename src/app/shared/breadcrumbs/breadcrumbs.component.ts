import { OperacionesBXI } from './../../pages/bxi/operacionesBXI';
import { SesionBxiService } from './../../pages/bxi/sesion-bxi.service';
import { Component, OnInit ,  ViewChild, ElementRef} from '@angular/core';
import { Router} from '@angular/router';
import { SesionTDDService } from '../../services/breadcrums/breadcroms.service';
import { ResponseWS } from '../../services/service.index';
import { ConsultaSaldosTddService } from '../../services/saldosTDD/consultaSaldos.service';

declare var jquery: any; // jquery
declare var $: any;
@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  NombreUsuario: string;
  

  constructor(private service: SesionBxiService,
              private _service: SesionTDDService,
              private router: Router, private serviceMantenimiento: ResponseWS,
               private consultaSaldosTddService: ConsultaSaldosTddService)  {}

  ngOnInit() {
    const this_aux = this;
    if (localStorage.getItem("contadorTime") === null)      {
      localStorage.setItem("contadorTime", "1");
      localStorage.setItem("okCerrarSesion", "false");
      this_aux.comienzaContador();
     } 

     if (  this_aux._service.datosBreadCroms.nombreUsuarioTDD !== '' ) {

      this_aux.NombreUsuario =  this_aux._service.datosBreadCroms.nombreUsuarioTDD;
      let storageTipoClienteTDD = localStorage.getItem("tipoClienteTar");
      let navElement = document.getElementById("navBar");

    if (storageTipoClienteTDD === "true") {
      navElement.classList.remove("nav-img-banorte");
      navElement.classList.add("nav-img-banorte-preferente");
    } else {

      navElement.classList.remove("nav-img-banorte-preferente");
      navElement.classList.add("nav-img-banorte");
    }

    } else
    if ( this_aux.service.NombreUsuario !== undefined  ) {

      this.NombreUsuario = this_aux.service.NombreUsuario;  
      this.service.Login = "1";
      let storageTipoClienteBEL = localStorage.getItem("tipoClienteBEL");
      let navElement = document.getElementById("navBar");

      if (storageTipoClienteBEL === "true") {
        navElement.classList.remove("nav-img-banorte");
        navElement.classList.add("nav-img-banorte-preferente");
      } else {
         navElement.classList.remove("nav-img-banorte-preferente");
        navElement.classList.add("nav-img-banorte");
      }
    }
    
    
  }

  stopTime() {
    const this_aux = this;
    localStorage.setItem("okCerrarSesion", "true");
  }

  cerrarSessionBEL() {
    const this_aux = this;
    
    const body = $('body');
    body.off();

    if (this_aux.service.Login === "1" ) {
      sessionStorage.removeItem("campania");
      sessionStorage.removeItem("idSesion");
      localStorage.removeItem("tipoClienteBEL");
      localStorage.removeItem("doc");
      localStorage.removeItem("nombreDoc");
     //  localStorage.removeItem("contadorTime");
      
    const THIS: any = this;
      this_aux.service.Login = "0";
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      console.log("Cerrar sesion BEL");
      operacionesbxi.cerrarSesionBEL().then(
          function(response) {
            // console.log(response);
            const responseJson = response.responseJSON;
            if (responseJson.Id === "SEG0001") {
              
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
              this_aux.router.navigate(['/final']);
            } else {
              
              // console.log("BEL error cerrar sesion", responseJson.Id  + responseJson.MensajeAUsuario);
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
              document.getElementById('mnsError').innerHTML =   "Error en cerrar sesión";
              $('#errorModal').modal('show');
              this_aux.router.navigate(['/final']);
            }
          },
          function(error) {
            
            WLAuthorizationManager.logout('banorteSecurityCheckSa');
            console.log(error);
            this_aux.router.navigate(['/final']);
          });


    } else {
        this.cerrarSesion();
    }
    this_aux.eliminarVariables();

  }


   cerrarSesion() {

    const THIS: any = this;

    console.log("Cerrar sesion");
    localStorage.removeItem("validaNipServ");
    sessionStorage.removeItem("campania");
    sessionStorage.removeItem("idSesion");
    localStorage.removeItem("des");
    localStorage.removeItem("np");
    localStorage.removeItem("res");
    localStorage.removeItem("tr2");
    localStorage.removeItem("tr2_serv");
    localStorage.removeItem("np_serv");
    localStorage.removeItem("res_serv");
    localStorage.removeItem("tipoClienteTar");
    localStorage.removeItem("doc");
    localStorage.removeItem("nombreDoc");
   //  localStorage.removeItem("contadorTime");
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps2/resource/cerrarSesion',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest.send().then(
          function(response) {
            
          WLAuthorizationManager.logout('banorteSecurityCheckSa');
            THIS.router.navigate(['/final']);
          },
          function(error) {
            
            console.log(error);
            WLAuthorizationManager.logout('banorteSecurityCheckSa');
            // console.log(error);
            THIS.router.navigate(['/final']);

          });

  }

  comienzaContador() {
    const this_aux = this;
    const body = $('body');
    body.on('click', function() {
      localStorage.setItem('TimeOut', localStorage.getItem('TimeOutIni'));
      
      if ( localStorage.getItem("okCerrarSesion") === "true" ) {
        localStorage.removeItem("okCerrarSesion");
         clearInterval(intervalo);
         localStorage.setItem('TimeOut', localStorage.getItem('TimeOutIni'));
         this_aux.cerrarSessionBEL();
      }
    });
  
    let intervalo = setInterval( function () {
      const valueNewTimeOut = +localStorage.getItem('TimeOut') - 1;
      localStorage.setItem('TimeOut', valueNewTimeOut.toString());
      if  (valueNewTimeOut === 15)  {
               $('#avisoSesionExpira').modal('show');
           }
           if  (valueNewTimeOut <= 15)  {
             document.getElementById('addExpira').innerHTML =  valueNewTimeOut.toString();
           } 
           if (valueNewTimeOut === 0  ) {
             $('#avisoSesionExpira').modal('hide');
             localStorage.removeItem("okCerrarSesion");
              clearInterval(intervalo);
              localStorage.setItem('TimeOut', localStorage.getItem('TimeOutIni'));
              this_aux.cerrarSessionBEL();
           }

    }, 1000);
  
  }

  eliminarVariables() {
    const this_aux = this;
    localStorage.removeItem("fechaDocumentoSeleccionada");
    this_aux.serviceMantenimiento.detalleMantenimiento = undefined;
    this_aux.serviceMantenimiento.datosBeneficiarios = undefined;
    this_aux.serviceMantenimiento.datosTransferenciaSPEI = undefined;
    this_aux.serviceMantenimiento.nombreOperacion = undefined;
    this_aux.serviceMantenimiento.sesionTdd = undefined;
    // Envio EDC Correo
    this_aux.serviceMantenimiento.fechaCorte = undefined;
    this_aux.serviceMantenimiento.numDoc = undefined;
    this_aux.serviceMantenimiento.idOpe = undefined;
    this_aux.serviceMantenimiento.stringDocumento = undefined;
    this_aux.serviceMantenimiento.numeroDocumento = undefined;
    this_aux.serviceMantenimiento.fechaDocumento = undefined;
    this_aux.serviceMantenimiento.validaMail = undefined;
    // Compra TA
    this_aux.serviceMantenimiento.detalleConfirmacionCTA = undefined;
    this_aux.serviceMantenimiento.operadorTelefono = undefined;
    // Cancelacion Envio EDC Domicilio
    this_aux.serviceMantenimiento.numeroCuentaTdd = undefined;
    this_aux.serviceMantenimiento.email = undefined;
    // Pago tarjeta Credito
    this_aux.serviceMantenimiento.detallePagoTarjeta = undefined;
    this_aux.serviceMantenimiento.nameBancoDestino = undefined;
    this_aux.serviceMantenimiento.nameOperacion = undefined;
    this_aux.serviceMantenimiento.numCuentaDestino = undefined;

    this_aux._service.datosBreadCroms.nombreUsuarioTDD = '';
    this_aux._service.datosBreadCroms.sicUsuarioTDD = '';
    this_aux._service.datosBreadCroms.EmailCliente = '';
    this_aux._service.datosBreadCroms.CelCliente = '';
    this_aux._service.datosBreadCroms.numeroCliente = '';
    this_aux._service.datosBreadCroms.repTrasferenciaCuentasBanorte = '';
    /// BEL
    this_aux.service.usuarioLogin = undefined;
    this_aux.service.metodoAutenticaMayor = undefined;
    this_aux.service.metodoAutenticaEtiqueta = undefined;
    this_aux.service.NombreUsuario = undefined;
    this_aux.service.isPreferente = undefined;
    this_aux.service.userRfc = undefined;
    this_aux.service.detalleIdentificacion = undefined;
    this_aux.service.metodosAutenticacionUsario = undefined;
    this_aux.service.infoUsuario = undefined;
    this_aux.service.infoCuentas = undefined;
    this_aux.service.infoCuentasBeneficiarios = undefined;
    this_aux.service.infoDatosDeBeneficiarios = undefined;
    this_aux.service.infoUsuarioSIC = undefined;
    this_aux.service.EmailCliente = undefined;
    this_aux.service.CelCliente = undefined;
    this_aux.service.detalleEmpresa_PS = undefined;
    this_aux.service.idFacturador = undefined;
    this_aux.service.numCuentaSeleccionado = undefined;
    this_aux.service.nombreServicio = undefined;
    this_aux.service.formaPago = undefined;
    this_aux.service.detalleConfirmacionPS = undefined;
    this_aux.service.validaFinishTipoTransfer = undefined;
    this_aux.service.numCuentaSPEISel = undefined;
    this_aux.service.AliasCuentaSPEISel = undefined;
    this_aux.service.numCuentaDestinario = undefined;
    this_aux.service.correoBeneficiario = undefined;
    this_aux.service.nombreBeneficiario = undefined;
    this_aux.service.clabeDestinatario = undefined;
    this_aux.service.claveBancoDestino = undefined;
    this_aux.service.claveAliasCuenta = undefined;
    this_aux.service.claveNumBenefi = undefined;
    this_aux.service.detalleConfirmacionSPEI = undefined;
    this_aux.service.detalleConfirmacionTEF = undefined;
    this_aux.service.detalleConfirmacionQUICK = undefined;
    this_aux.service.numCuentaTranPropBanorte = undefined;
    this_aux.service.AliasCuentaTranPropBanorte = undefined;
    this_aux.service.detalleConfirmacionTranPropBanorte = undefined;
    this_aux.service.numCtaBenSeleccionada = undefined;
    this_aux.service.nameBancoDestino = undefined;
    this_aux.service.nameOperacion = undefined;
    this_aux.service.detallePagoTarjeta = undefined;
    this_aux.service.Importerecargas = undefined;
    this_aux.service.numCuentaCTASel = undefined;
    this_aux.service.operador = undefined;
    this_aux.service.detalleConfirmacionCTA = undefined;
    this_aux.service.SaldoActual = undefined;
    this_aux.service.tipoCuenta = undefined;
    this_aux.service.aliasCuentaSeleccionada = undefined;
    this_aux.service.noTarjetaSeleccionada = undefined;
    this_aux.service.divisa = undefined;
    this_aux.service.saldoSeleccionado = undefined;
    this_aux.service.stringDocumento = undefined;
    this_aux.service.numeroDocumento = undefined;
    this_aux.service.fechaDocumento = undefined;
    this_aux.service.numeroCuentaEDCSel = undefined;
    this_aux.service.aliasCuentaEDCSel = undefined;
    this_aux.service.tipoCuentaEDCSel = undefined;
    this_aux.service.opcionEDCSel = undefined;
    this_aux.service.fechaCorte = undefined;
    this_aux.service.numDoc = undefined;
    this_aux.service.idOpe = undefined;
    this_aux.service.validaMail = undefined;
    this_aux.service.Login = undefined;
    this_aux.service.cambioCel = undefined;
    this_aux.service.cambioCorreo = undefined;
    this_aux.service.Fecha = undefined;
    this_aux.service.Tiempo = undefined;
    // Datos TDD
    
    this_aux.consultaSaldosTddService.datosSaldosTDD.ClabeCuenta = '';
    this_aux.consultaSaldosTddService.datosSaldosTDD.Id = '';
    this_aux.consultaSaldosTddService.datosSaldosTDD.NumeroCuenta = '';
    this_aux.consultaSaldosTddService.datosSaldosTDD.Producto = '';
    this_aux.consultaSaldosTddService.datosSaldosTDD.SaldoDia = '';
    this_aux.consultaSaldosTddService.datosSaldosTDD.SaldoDisponible = '';
    this_aux.consultaSaldosTddService.datosSaldosTDD.SaldoMesAnterior = '';
    this_aux.consultaSaldosTddService.datosSaldosTDD.SaldoRetenido = ''; 
  }

}
