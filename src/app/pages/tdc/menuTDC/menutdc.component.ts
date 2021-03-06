import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { Http, Response, Headers,  URLSearchParams, RequestOptions } from "@angular/http";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConsultaCatalogosTdcService } from '../../../services/consultaCatalogosTDC/consulta-catalogos-tdc.service';
// import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service'; sm
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import $ from "jquery";
import { DOCUMENT } from "@angular/platform-browser";
import { Session } from "protractor";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

import { ResponseWS } from '../../../services/response/response.service';
import { Script } from "vm";

declare var $: $;


@Component({
  selector: "app-menutdc",
  templateUrl: "./menutdc.component.html",
  styles: []
})
export class MenutdcComponent implements OnInit {
  @ViewChild('rIframe') riframe: ElementRef;
ArrayAlertasCliente: Array<any> = [];  
AlertasActivas = false;
urlPropertyHtm: any;
urlFrontCampania: any;
  constructor(private router: Router,private _serviceSesion: SesionTDDService,private serviceTdd: ResponseWS,private http: Http) {}

  ngOnInit() {
    $('#ModalTDDLogin').modal('hide');
     // $('div').removeClass('modal-backdrop');
    if (sessionStorage.getItem("campania") === null)      {
      sessionStorage.setItem("campania", "activa");
    } 
    if (sessionStorage.getItem("campania") === "activa") {
      this.encriptarSic();
    } 
   
  }

  mandarPage(id) {
    console.log(id);

    switch (id) {
      case "saldosMovtdc":
        this.router.navigate(["/movimientoSaldotdc"]);
        break;

       case 'edc-tdc':
       this.router.navigate(['/ImpresionEdcTdc']);
       break;

      case "pagoServicios":
        this.router.navigate(["/pagoServiciosTdc"]);
        break;
      case "actDatosContactotdc":
      this.consultaDatoscontacto(id);
      //this.router.navigate(["/actualizarDatosContactotdc"]);
      break;
      case "activarAlertas":
      this.consultaDatoscontacto(id);
      console.log("funcion activar a lertas");
      //this.router.navigate(["/activarAlertastdc"]);
      break;

      default:
        this.router.navigate(["/menuTdc"]);
    }
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
  const this_aux = this;
  $('#_modal_please_wait').modal('show');
  this_aux.consultaAlertas();
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

  consultaAlertas() {

    const this_aux = this;
    const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
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
                console.log('this_aux.AlertasActivas' + this_aux.AlertasActivas);
                if (this_aux.AlertasActivas) {
                  
                  this_aux.conAlertas();
                  
                } else {
                  this_aux.sinAlertas();
                }


                
              } else if (detalle.Id === '0' && detalle.MensajeAUsuario.includes('NUMERO DE CLIENTE INEXISTENTE.')){
                this_aux.conAlertas();
                console.log(detalle);
                console.log("id = 0");
                // this_aux.showErrorSucces(detalle);      
              } else {
                this_aux.conAlertas();
              }
              setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
        }, function(error) {
          this_aux.conAlertas();
          console.log(error);
          setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
          // this_aux.showErrorPromise(error);    
        }
      );
  }

  sinAlertas() {
    const div = document.getElementById('imgdatoscontacto').style.marginLeft="520px";
    const div2 = document.getElementById('txtdatoscontacto').style.marginLeft="520px";

   const div4 = document.getElementById('Alertas');
   div4.style.display = "block";
   const div5 = document.getElementById('alertasTxt');
   div5.style.display = "block";

   const operacionesNoFrecuetes = document.getElementById('Controlador');
    operacionesNoFrecuetes.style.display="block";
  }
  conAlertas() {
    const div = document.getElementById('imgdatoscontacto').style.marginLeft="633px";
   const div2 = document.getElementById('txtdatoscontacto').style.marginLeft="633px";

    const div4 = document.getElementById('Alertas');
    div4.style.display = "none";
    const div5 = document.getElementById('alertasTxt');
    div5.style.display = "none";
    const operacionesNoFrecuetes = document.getElementById('Controlador');
    operacionesNoFrecuetes.style.display="block";
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
    // console.log(json.Id + json.MensajeAUsuario);
    if (json.Id === '2') {
      document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
    } else {
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
    }
    $('#errorModal').modal('show');
  }

  consultaDatoscontacto(id) {
    
    const this_aux = this;
    const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
    operaciones.consultarDatosContacto().then(
      function(respPago) {
  
        const jsonRespuesta = respPago.responseJSON;
        if (jsonRespuesta.Id === '1') {
         //console.log(respPago.responseText);
         this_aux._serviceSesion.datosBreadCroms.CelCliente = jsonRespuesta.Telefono;
         this_aux._serviceSesion.datosBreadCroms.EmailCliente = jsonRespuesta.Email;
         // tslint:disable-next-line:max-line-length
         if (jsonRespuesta.Email === undefined || jsonRespuesta.Email === '' || jsonRespuesta.Telefono === undefined || jsonRespuesta.Telefono === '') {
          if (id === 'activarAlertas') {  
            setTimeout(function() { 
                // tslint:disable-next-line:max-line-length
                document.getElementById('mnsError').innerHTML =   "Estimado cliente, es necesario que registres tu correo electrónico y número móvil poder continuar. ";
                $('#errorModal').modal('show');
              }, 1000);
            }
        } else {
          if (id === 'activarAlertas') {
            $('#_modal_please_wait').modal('show');  
                this_aux.router.navigate(['/activarAlertastdc']); }
        }
  
        if (id === 'actDatosContactotdc') {  
          $('#_modal_please_wait').modal('show');
          this_aux.router.navigate(['/actualizarDatosContactotdc']); }
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

encriptarSic() {

  const this_aux = this;
  const THIS: any = this;
  // console.log("adentro encriptar sic: " + this_aux._serviceSesion.datosBreadCroms.sicUsuarioTDD);

  const formParameters = {
      sic: this_aux._serviceSesion.datosBreadCroms.sicUsuarioTDD
  };

  const resourceRequest = new WLResourceRequest(
     'adapters/AdapterBanorteSucursAppsTdc/resource/encriptarSic',
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
