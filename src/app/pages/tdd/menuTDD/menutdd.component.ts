import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Http, Response, Headers,  URLSearchParams, RequestOptions } from "@angular/http";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { ResponseWS } from '../../../services/response/response.service';
import $ from "jquery";
import { DOCUMENT } from "@angular/platform-browser";
import { Session } from "protractor";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { consultaCatalogos } from "../../../services/consultaCatalogos/consultaCatalogos.service";


declare var $: $;
@Component({
  selector: "app-menutdd",
  templateUrl: "./menutdd.component.html",
  styles: []
})
export class MenutddComponent implements OnInit {

  @ViewChild('rIframe') riframe: ElementRef;
  loadingM: boolean;
  numeroCuentaTitular: string;
  contenido: any;
  urlPropertyHtm: any;
  urlFrontCampania: any;
  AlertasActivas = false;
  ArrayAlertasCliente: Array<any> = [];
  Prieba: boolean;
  event: any;
  postResp;
  constructor(private router: Router, private http: Http, private _service: ConsultaSaldosTddService, 
    private _serviceSesion: SesionTDDService, private serviceTdd: ResponseWS, private renderer: Renderer2) {
    }

  ngOnInit() {
    $('#ModalTDDLogin').modal('hide');
    if (sessionStorage.getItem("campania") === null) {
      sessionStorage.setItem("campania", "activa");
    } 
    if (sessionStorage.getItem("campania") === "activa") {
      this.encriptarSic();
      
    } 
    }


  conAlertas() {
        
    const div4 = document.getElementById('Alertas');
    div4.style.display = "none";
    const div5 = document.getElementById('alertasTxt');
    div5.style.display = "none";
  }

  mandarPage(id) {
    // console.log(id);

    switch (id) {
      case "saldosMov":
        this.router.navigate(["/movimientoSaldo"]);
        break;
       case 'edc':
       this.router.navigate(['/impresion-edc']);
       break;
      case "compraTA":
        this.router.navigate(["/compraTiempoAire"]);
        break;
      case "spei":
        this.router.navigate(["/spei"]);
        break;
      case "transBanorte":
        this.router.navigate(["/transBanorte"]);
        break;
      case "pagoServ":
        this.router.navigate(["/pagoServiciosTDD"]);
        break;
      case "mantoBeneficiarios":
        this.router.navigate(["/mantoBeneficiarios"]);
        break;
      case "pagoCredito":
        this.router.navigate(["/pagoCredito"]);
        break;
      case "actDatosContacto":
          this.consultaDatoscontacto(id);
        // this.router.navigate(["/actualizarDatosContactoTDD"]);
        break;
        case "actAlertas":
        this.consultaDatoscontacto(id);
        // this.router.navigate(["/activarAlertasTDD"]);
        break;

      default:
        this.router.navigate(["/menuTdd"]);
    }
  }

  compraTA() {
    this.router.navigate(["/compraTA"]);
    $("div").removeClass("modal-backdrop");
  }

  moreOptions() {
    setTimeout(() => {

    document.getElementById("operacionesFrecuentes").style.display = "none";
    document.getElementById("opciones").style.display = "none";
    document.getElementById("masOpciones").style.display = "block";
    document.getElementById("regresar").style.display = "block";
    $('#operacionesFrecuentes').removeClass('animated fadeOutUp slow');
    $('#opciones').removeClass('flipOutY fast');


    }, 2000);

    $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
    $('#masOpciones').addClass('animated fadeInUp slow');

    $('#opciones').addClass('flipOutY fast');
    $('#regresar').addClass('flipInY slow');
  // habilitar o desabilitar boton Alertas

  const this_aux = this;
  this_aux.consultaAlertas();

  }

 consultaDatoscontacto(id) {
  const this_aux = this;
  const operaciones: consultaCatalogos = new consultaCatalogos();
  operaciones.consultarDatosContacto().then(
    function(respPago) {

      const jsonRespuesta = respPago.responseJSON;
      if (jsonRespuesta.Id === '1') {
       // console.log(respPago.responseText);
       this_aux._serviceSesion.datosBreadCroms.CelCliente = jsonRespuesta.Telefono;
       this_aux._serviceSesion.datosBreadCroms.EmailCliente = jsonRespuesta.Email;
       // tslint:disable-next-line:max-line-length
       if (jsonRespuesta.Email === undefined || jsonRespuesta.Email === '' || jsonRespuesta.Telefono === undefined || jsonRespuesta.Telefono === '') {
        if (id === 'actAlertas') {  
          setTimeout(function() { 
              // tslint:disable-next-line:max-line-length
              document.getElementById('mnsError').innerHTML =   "Estimado cliente, es necesario que registres tu correo electrónico y número móvil poder continuar. ";
              $('#errorModal').modal('show');
            }, 1000);
          }
      } else {
        if (id === 'actAlertas') {
          $('#_modal_please_wait').modal('show');  
              this_aux.router.navigate(['/activarAlertasTDD']); }
      }

      if (id === 'actDatosContacto') {  
        $('#_modal_please_wait').modal('show');
        this_aux.router.navigate(['/actualizarDatosContactoTDD']); }
        console.log("Consulta de Datos Exitosa");


      } else {
        this_aux.showErrorSucces(jsonRespuesta);
        this_aux._serviceSesion.datosBreadCroms.CelCliente = "";
        this_aux._serviceSesion.datosBreadCroms.EmailCliente = "";
        console.log("No hay Datos");
      }
      setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
    }, function(error) { this_aux.showErrorPromise(error); }
  );
 }

 consultaAlertas() {

      const this_aux = this;
    const operaciones: consultaCatalogos = new consultaCatalogos();
      operaciones.mantieneAlertas().then(
        function(detalleAlertas) {
              const detalle = detalleAlertas.responseJSON;
              let AlertasActivas_true = false;
              // console.log(detalle);
              if (detalle .Id === '1') {

                const alertas = detalle.AlertasXCliente;
                this_aux.ArrayAlertasCliente = alertas;
                alertas.forEach(alerta => {
                    if (alerta.IndicadorServicio === 'S' ) {   AlertasActivas_true = true;
                    }
                });
                this_aux.AlertasActivas = AlertasActivas_true;
                // console.log('this_aux.AlertasActivas' + this_aux.AlertasActivas);
                if (this_aux.AlertasActivas) {
                  
                  this_aux.conAlertas();
                } else {
                  this_aux.sinAlertas();
                }


                
              } else if (detalle.Id === '0' && detalle.MensajeAUsuario === 'NUMERO DE CLIENTE INEXISTENTE.') {
                this_aux.conAlertas();
                // console.log(detalle);
                // this_aux.showErrorSucces(detalle);      
              } else {
                this_aux.conAlertas();
              }
              setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
        }, function(error) {
          this_aux.conAlertas();
          // console.log(error);
          setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
          // this_aux.showErrorPromise(error);    
        }
      );
    }

    sinAlertas() {
      const div = document.getElementById('mantenimientoIMG');
      div.classList.remove("espacioBotones");
      
      const div2 = document.getElementById('mantenimiento');
      div2.classList.remove("espacioBotones");
     
     const div4 = document.getElementById('Alertas');
     div4.style.display = "block";
     const div5 = document.getElementById('alertasTxt');
     div5.style.display = "block";
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

  regresar() {
    setTimeout(() => {

    document.getElementById("operacionesFrecuentes").style.display = "block";
    document.getElementById("opciones").style.display = "block";
    document.getElementById("masOpciones").style.display = "none";
    document.getElementById("regresar").style.display = "none";

    $('#masOpciones').removeClass('animated fadeOutUp slow');
    $('#regresar').removeClass('flipOutY fast');

    }, 2000);

    $('#masOpciones').addClass('animated fadeOutUp slow');
    $('#operacionesFrecuentes').addClass('animated fadeInUp slow');

    $('#regresar').addClass('flipOutY fast');
    $('#opciones').addClass('flipInY slow');

  }

  cargarcampanias(respuesta) {
    const this_aux = this;
    if (respuesta !== "false") {
      let cadena = respuesta;
      let val1 = cadena.indexOf(",");
      let val2 = cadena.indexOf(",", val1 + 1);
      let ancho = cadena.substring(val1 + 1, val2);
      let alto = cadena.substring(val2 + 1);

     document.getElementById("frameCampania").setAttribute("src", this_aux.urlFrontCampania);
     document.getElementById("frameCampania").style.height = "100%";
     document.getElementById("divLargo").style.maxWidth = ancho.toString() + "px";
     document.getElementById("divAltura").style.maxHeight = alto.toString() + "px";
     document.getElementById("divAltura").style.height = alto.toString() + "px";
     $("#campaniaModal").modal("show");   
     this_aux.clickCamp();
  }
  }

  encriptarSic() {

    const this_aux = this;
    const THIS: any = this;

    const formParameters = {
        sic: this_aux._serviceSesion.datosBreadCroms.sicUsuarioTDD
    };

    const resourceRequest = new WLResourceRequest(
       'adapters/AdapterBanorteSucursApps2/resource/encriptarSic',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        if (DatosJSON.Id === "1") {
            this_aux.urlPropertyHtm = DatosJSON.urlCampaniaHtm;
            this_aux.urlFrontCampania = DatosJSON.urlCampaniaFront;
            this_aux.cargarcampanias(DatosJSON.respuesta);
        } else {
            console.log("Ocurrio un error al encriptar sic");
        }
      },
      function(error) {
        THIS.loading = false;
        console.log("Error al encriptar sic");
      }
    );
    console.log("Salió de encriptar sic");
  }


 send(msg) {
    const this_aux = this;
    let popupIframe = this_aux.riframe.nativeElement;
    let newUrl  = "";
    let tamUrl = this_aux.urlPropertyHtm.length;
    newUrl = this_aux.urlPropertyHtm.substring( 0, tamUrl - 18 );
    let contenido = (popupIframe.contentWindow ? popupIframe.contentWindow :
    popupIframe.contentDocument);
    contenido.postMessage(msg,  newUrl); 
    sessionStorage.setItem("campania", "inactivo");
    $('#campaniaModal').modal('toggle');
    return false;
    }

    clickCamp () {
      const this_aux = this;    
      let iframe = this_aux.riframe.nativeElement;
      let newUrl  = "";
      let tamUrl = this_aux.urlPropertyHtm.length;
      newUrl = this_aux.urlPropertyHtm.substring( 0, tamUrl - 18 );
    window.parent.addEventListener('message', function(e) {
        let origin = e.origin;
        if (origin !== newUrl) {
          return;
        } else {
          console.log("Respondio Correctamente");
          if (e.data === "cerrar") {
            $('#campaniaModal').modal('toggle');
          }          
        }
    }, false);
    }
}


