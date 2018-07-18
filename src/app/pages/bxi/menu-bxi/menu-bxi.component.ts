import { OperacionesBXI } from './../operacionesBXI';
import { Autenticacion } from './../autenticacion';
import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { SesionBxiService } from './../sesion-bxi.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-menu-bxi',
  templateUrl: './menu-bxi.component.html',
  styles: []
})
export class MenuBxiComponent implements OnInit {
  responseCampania: any;
  stringUrl: string;
  sicCifrado: string;
  idSucursal: string;
  numeroCuentaTitular: string;
  contenido: any;
  urlProperty: any;
  sesionBrowser: any;

  constructor(private service: SesionBxiService, private renderer: Renderer2,  private router: Router, private http: Http ) { }

  ngOnInit() {
    const body = $('body');
    // body.off('click');
    this.setNombreUsuario();
    this.getidSesion(); 
      if (sessionStorage.getItem("campania") === null)      {
        sessionStorage.setItem("campania", "activa");
      }
  }

  setNombreUsuario() {
    const this_aux = this;
    // tslint:disable-next-line:max-line-length
    if (this_aux.service.infoCuentas === undefined || this_aux.service.infoCuentasBeneficiarios === undefined || this_aux.service.infoDatosDeBeneficiarios === undefined) {
 
        const autenticacion: Autenticacion = new Autenticacion();
        const operaciones: OperacionesBXI = new OperacionesBXI();
        autenticacion.consultaCuentasUsuario(this_aux.service.usuarioLogin).then(
          function(response) {
              const getCuentasJSON = response.responseJSON;
                if (getCuentasJSON.Id === '1') {
                    const getCuentas = response.responseText;
                    this_aux.service.infoCuentas = getCuentas;
                    operaciones.consultaCuentasBeneficiarios(this_aux.service.usuarioLogin).then(
                      function(cuentasBeneficiario) {
                      console.log(cuentasBeneficiario.responseJSON);
                      const resCuentasXBeneficiario = cuentasBeneficiario.responseJSON;
                      if (resCuentasXBeneficiario.Id === '1') {

                          this_aux.service.infoCuentasBeneficiarios = JSON.stringify(resCuentasXBeneficiario.arrayCuentasXBeneficiario);
                          this_aux.service.infoDatosDeBeneficiarios = JSON.stringify(resCuentasXBeneficiario.Beneficiarios);
                          console.log(this_aux.service.infoCuentasBeneficiarios);
                          console.log(this_aux.service.infoDatosDeBeneficiarios);
                          $('#_modal_please_wait').modal('hide');
                          $('div').removeClass('modal-backdrop');

                      } else {
                        $('div').removeClass('modal-backdrop');
                        this_aux.showErrorSucces(resCuentasXBeneficiario);
                      }
                    }, function(error) {
                      $('div').removeClass('modal-backdrop');
                      this_aux.showErrorPromise(error);
                    });
                } else {
                  $('div').removeClass('modal-backdrop');
                  this_aux.showErrorSucces(getCuentasJSON);
                }
          }, function(error) {
            $('div').removeClass('modal-backdrop');
            this_aux.showErrorPromise(error);
          }
        );
    } else {
      console.log(this_aux.service.infoCuentasBeneficiarios);
      console.log(this_aux.service.infoDatosDeBeneficiarios);
      console.log( this_aux.service.infoCuentas);
    }
  }

  comenzarOperacion(idOperacion) {
    // $('div').removeClass('modal-backdrop');
    const this_aux = this;
    $('#_modal_please_wait').modal('show');

    const tamArrayBeneficiarios = this_aux.countCuentasBene();
    const tamArrayCuentas = this_aux.countCuentasUsuario();
    const tamCuentasCredito = this_aux.ConsultaTDCBene();
    const tamTDCPropias = this_aux.ConsultaTDCPropias();

    if (tamArrayCuentas === 0 ) {

      if (idOperacion === 'actualizaDatos') {
        setTimeout(function() { 
          $('#_modal_please_wait').modal('hide');
          this_aux.getDatosContacto(idOperacion);
          }, 500);
      } else {

        setTimeout(function() { 
          $('#_modal_please_wait').modal('hide');
          document.getElementById('mnsError').innerHTML =   "Lo sentimos, no tienes cuentas relacionadas a tu usuario.";
          $('#errorModal').modal('show');
        }, 500);
      }
      
    // tslint:disable-next-line:max-line-length
    } else if ((idOperacion === 'trnasfSPEI' || idOperacion === 'transferBanorte' ) && ( tamArrayBeneficiarios === 0)) { 
     
      setTimeout(function() { 
        $('#_modal_please_wait').modal('hide');
        document.getElementById('mnsError').innerHTML =   "Lo sentimos, no tienes beneficiarios  relacionados a tu usuario.";
        $('#errorModal').modal('show');
      }, 500);
     
    } else if ((idOperacion === 'pagotar' ) && ((tamCuentasCredito === 0 && tamTDCPropias === 0 ) || tamArrayBeneficiarios === 0)) { 
     
      setTimeout(function() { 
        $('#_modal_please_wait').modal('hide');
        document.getElementById('mnsError').innerHTML =   "Lo sentimos, no tienes beneficiarios con TDC relacionados a tu usuario.";
        $('#errorModal').modal('show');
      }, 500);
     
    } else {

    switch (idOperacion) {
      
      case 'saldoBXI': this_aux.router.navigate(['/saldosBXI']);
            break;
      case 'pagoserv': this_aux.router.navigate(['/pagoservicios_ini']);
            break;
      case 'trnasfSPEI': this_aux.router.navigate(['/speiBXI']);
            break;
      case 'compraTA': this_aux.router.navigate(['/CompraTaComponent']);
            break;
      case 'pagotar':    
                              this_aux.router.navigate(['/pagoTarjetaCredito_ini']);      
            break;
      case 'activaAlertas': 
                              this_aux.getDatosContacto(idOperacion);
            break;
      case 'actualizaDatos':
                              this_aux.getDatosContacto(idOperacion);
                            
            break;
      case 'transferBanorte': this_aux.router.navigate(['/TransferBanorte']);
            break;
      case 'impresionEDC': this_aux.router.navigate(['/impresion_EDC']);
            break;
      }
    }
  }

  moreOptions() {


    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'none';
      document.getElementById('opciones').style.display = 'none';
      document.getElementById('masOpciones').style.display = 'block';
      document.getElementById('regresar').style.display = 'block';
      $('#operacionesFrecuentes').removeClass('animated fadeOutUp slow');
      $('#opciones').removeClass('flipOutY fast');

    }, 2000);

    $('#operacionesFrecuentes').addClass('animated fadeOutUp slow');
    $('#masOpciones').addClass('animated fadeInUp slow');

    $('#opciones').addClass('flipOutY fast');
    $('#regresar').addClass('flipInY slow');
  }

  regresar() {



    setTimeout(() => {

      document.getElementById('operacionesFrecuentes').style.display = 'block';
      document.getElementById('opciones').style.display = 'block';
      document.getElementById('masOpciones').style.display = 'none';
      document.getElementById('regresar').style.display = 'none';
      $('#masOpciones').removeClass('animated fadeOutUp slow');
      $('#regresar').removeClass('flipOutY fast');
    }, 2000);

    $('#masOpciones').addClass('animated fadeOutUp slow');
    $('#operacionesFrecuentes').addClass('animated fadeInUp slow');

    $('#regresar').addClass('flipOutY fast');
    $('#opciones').addClass('flipInY slow');



  }

  showErrorPromise(error) {
    console.log(error);
    // tslint:disable-next-line:max-line-length
    document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
    $('#_modal_please_wait').modal('hide');
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

  getDatosContacto(opc) {

    console.log('getDatosContacto');
    const this_aux = this;
    const operaciones: OperacionesBXI = new OperacionesBXI();
      // tslint:disable-next-line:max-line-length
      if ( this_aux.service.CelCliente === null  || this_aux.service.EmailCliente === null ||  (this_aux.service.EmailCliente === '' && this_aux.service.CelCliente === '') || this_aux.service.EmailCliente === undefined || this_aux.service.CelCliente === undefined) {
        operaciones.consultaDatosContacto(this_aux.service.infoUsuarioSIC).then(
          function(data) {
            const jsonData = data.responseJSON;
            if (jsonData.Id === '1') {
                console.log('Datos contacto' + jsonData);
                  this_aux.service.EmailCliente = jsonData.Email;
                  this_aux.service.CelCliente = jsonData.Telefono;
                  // tslint:disable-next-line:max-line-length
                  if (jsonData.Email === undefined || jsonData.Email === '' || jsonData.Telefono === undefined || jsonData.Telefono === '') {
                    if (opc === 'activaAlertas') {  
                      setTimeout(function() { 
                          // tslint:disable-next-line:max-line-length
                          $('#_modal_please_wait').modal('hide');
                          // tslint:disable-next-line:max-line-length
                          document.getElementById('mnsError').innerHTML =   "Estimado cliente, es necesario que registres tu correo electrónico y número móvil para poder continuar. ";
                          $('#errorModal').modal('show');
                        }, 500);
                      }
                    } else { if (opc === 'activaAlertas') {
                      
                          this_aux.router.navigate(['/activaAlertas_ini']); }
                      }
                  if (opc === 'actualizaDatos') {  
                    
                    this_aux.router.navigate(['/mantiene-datos-ini']); }
            } else {  
                setTimeout(function() {
                  $('#_modal_please_wait').modal('hide');
                  this_aux.showErrorSucces(jsonData);     
                  }, 500);
              }
          }, function (error) { 
           
            setTimeout(function() {
              $('#_modal_please_wait').modal('hide');
              this_aux.showErrorPromise(error); 
              }, 500);
            }
        );
    } else {
      if (opc === 'activaAlertas') {  
        
        this_aux.router.navigate(['/activaAlertas_ini']); }
      if (opc === 'actualizaDatos') {  
        
        this_aux.router.navigate(['/mantiene-datos-ini']); }
    }
}

getidSesion() {
  const this_aux = this;
  const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/getSessionId',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest.send().then(
      function(response) {
           this_aux.sesionBrowser = response.responseText;
          console.log(this_aux.sesionBrowser);
          console.log("El servcio de id sesion respondio correctamente");
          console.log("SIC BEL: " + this_aux.service.infoUsuarioSIC);
                if (sessionStorage.getItem("campania") === "activa") {
                  this_aux.encriptarSic();
                }      
      },
      function(error) {
          console.error("Ocurrio un error con el servcio de id sesion");
      });
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
  console.log("adentro encriptar sic");
  
  const formParameters = {
     //  sic: this_aux.service.infoUsuarioSIC
      sic: '51984872'
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

send(msg) {
  const this_aux = this;
  let popupIframe = document.getElementsByTagName('iframe')[0];
 this_aux.contenido = (popupIframe.contentWindow ? popupIframe.contentWindow : popupIframe.contentDocument);
  this_aux.contenido.postMessage(msg, this_aux.urlProperty + '/ade-front/');
  sessionStorage.setItem("campania", "inactivo");
  $('#campaniaModal').modal('toggle');
  return false;
  }

  countCuentasBene() {
    const this_aux = this;
    const arrayCuentasXBeneficiario = JSON.parse(this_aux.service.infoCuentasBeneficiarios); // JSON CON CUENTAS DE BENEFICIARIOS
    let cuenta;
    let tamCuentasBene = 0;
    arrayCuentasXBeneficiario.forEach(element1 => {
      if (element1.Cuenta !== undefined ) {
        cuenta = element1.Cuenta;
        cuenta.forEach(data => {
            tamCuentasBene = tamCuentasBene + 1;
        });
      }
    });
    return tamCuentasBene;
  }

  countCuentasUsuario() {
    const this_aux = this;
    const cuentasString = this_aux.service.infoCuentas;
    const consultaCuentas = JSON.parse(cuentasString);
    const cuentasArray = consultaCuentas.ArrayCuentas;
    let tamCuentasUsr = 0;
    cuentasArray.forEach(cuenta => {
          tamCuentasUsr = tamCuentasUsr + 1;
    });
    return tamCuentasUsr;
  }

  ConsultaTDCBene() {
    const this_aux = this;
    const arrayCuentasXBeneficiario = JSON.parse(this_aux.service.infoCuentasBeneficiarios); // JSON CON CUENTAS DE BENEFICIARIOS
    let cuenta;
    let tamTDCBene = 0;
    arrayCuentasXBeneficiario.forEach(element1 => {
      if (element1.Cuenta !== undefined ) {
        cuenta = element1.Cuenta;
        cuenta.forEach(data => {

          if ( data.TipoCuenta === '9' ) {
            tamTDCBene = tamTDCBene + 1;
          }
          if (  data.TipoCuenta === '2'  ) {
            tamTDCBene = tamTDCBene + 1;
          }
        });
      }
    });
    return tamTDCBene;
  }

  ConsultaTDCPropias() {

    const this_aux = this;
    const cuentasString = this_aux.service.infoCuentas;
    const consultaCuentas = JSON.parse(cuentasString);
    const cuentasArray = consultaCuentas.ArrayCuentas;
    let tamTDCPropias = 0;
    cuentasArray.forEach(cuenta => {
      if (cuenta.TipoCuenta.toString() === '5') {
        tamTDCPropias = tamTDCPropias + 1;
       }
    });
    return tamTDCPropias;
  }

}


