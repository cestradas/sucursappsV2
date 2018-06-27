import { Component, OnInit } from "@angular/core";
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

declare var $: $;

@Component({
  selector: "app-menutdd",
  templateUrl: "./menutdd.component.html",
  styles: []
})
export class MenutddComponent implements OnInit {
  loadingM: boolean;
  responseCampania: any;
  stringUrl: string;
  sicCifrado: string;
  idSucursal: string;
  numeroCuentaTitular: string;
  contenido: any;
  urlProperty: any;
  sesionBrowser: any;

  constructor(private router: Router, private http: Http, private _service: ConsultaSaldosTddService, 
    private _serviceSesion: SesionTDDService, private serviceTdd: ResponseWS) {}

  ngOnInit() {
    // $('div').removeClass('modal-backdrop');
      this.getidSesion(); 
      if (sessionStorage.getItem("campania") === null)      {
        sessionStorage.setItem("campania", "activa");
      }
  }

  mandarPage(id) {
    console.log(id);

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
        this.router.navigate(["/actualizarDatosContactoTDD"]);
        break;
        case "actAlertas":
        this.router.navigate(["/activarAlertasTDD"]);
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
    // setTimeout(() => {

    document.getElementById("operacionesFrecuentes").style.display = "none";
    document.getElementById("opciones").style.display = "none";
    document.getElementById("masOpciones").style.display = "block";
    document.getElementById("regresar").style.display = "block";

    // }, 2000);

    // $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
  }

  regresar() {
    // setTimeout(() => {

    document.getElementById("operacionesFrecuentes").style.display = "block";
    document.getElementById("opciones").style.display = "block";
    document.getElementById("masOpciones").style.display = "none";
    document.getElementById("regresar").style.display = "none";

    // }, 2000);
  }

  cargarcampanias() {
    const this_aux = this;
    let params: URLSearchParams = new URLSearchParams();
    params.set("param1", decodeURIComponent(this_aux.sicCifrado));
    params.set("param2", "SUCA");
    params.set("sesion", this_aux.sesionBrowser);
    params.set("param3", "1003");

    // Http request-
    // this_aux.stringUrl = this_aux.urlProperty + "/ade-front/existeEvento.json?param1=cGP7ZYTkSjuaCtabUn%2BA2Q%3D%3D";
     this_aux.stringUrl = this_aux.urlProperty + "/ade-front/existeEvento.json";
    // this_aux.urlProperty + "/ade-front/existeEvento.json";
       
    this.http
      .get(this_aux.stringUrl, {
        search: params
      })
      .subscribe(response => (this_aux.responseCampania = response));
     if (this_aux.responseCampania._body !== "false") {
        let cadena = this_aux.responseCampania._body;
        let val1 = cadena.indexOf(",");
        let val2 = cadena.indexOf(",", val1 + 1);
        let ancho = cadena.substring(val1 + 1, val2);
        let alto = cadena.substring(val2 + 1);

       document.getElementById("frameCampania").setAttribute("src", 
      this_aux.urlProperty + "/ade-front/ade.htm?param1=" + this_aux.sicCifrado + 
      "&param2=SUCA&sesion=" + this_aux.sesionBrowser + "&param3=" + this_aux.idSucursal);
       document.getElementById("frameCampania").style.height = "100%";
       document.getElementById("divLargo").style.maxWidth = ancho.toString() + "px";
       document.getElementById("divAltura").style.maxHeight = alto.toString() + "px";
       document.getElementById("divAltura").style.height = alto.toString() + "px";
       $("#campaniaModal").modal("show");   
    }
  }

  encriptarSic() {

    const this_aux = this;
    const THIS: any = this;
    console.log("adentro encriptar sic: " + this_aux._serviceSesion.datosBreadCroms.sicUsuarioTDD);
    
    const formParameters = {
        sic: this_aux._serviceSesion.datosBreadCroms.sicUsuarioTDD
      //  sic: '12345'
    };

    const resourceRequest = new WLResourceRequest(
       'adapters/AdapterBanorteSucursApps/resource/encriptarSic',
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.sendFormParameters(formParameters).then(
      function(response) {
        let DatosJSON = response.responseJSON;
        if (DatosJSON.Id === "1") {
            this_aux.sicCifrado = DatosJSON.SicEncriptado;
            this_aux.idSucursal = DatosJSON.idSucuarsal;
            this_aux.urlProperty = DatosJSON.urlCampania;
            this_aux.cargarcampanias();
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
  
  getidSesion() {
    const this_aux = this;
    this_aux.sesionBrowser = this_aux.serviceTdd.sesionTdd;
    console.log(this_aux.sesionBrowser);

    if (sessionStorage.getItem("campania") === "activa") {
      this_aux.encriptarSic();
    } 
}

  
 send(msg) {
    const this_aux = this;
    let popupIframe = document.getElementsByTagName('iframe')[0];
   this_aux.contenido = (popupIframe.contentWindow ? popupIframe.contentWindow : popupIframe.contentDocument);
    this_aux.contenido.postMessage(msg, this_aux.urlProperty + '/ade-front/');
    sessionStorage.setItem("campania", "inactivo");
    $('#campaniaModal').modal('toggle');
    return false;
    }

   

}

