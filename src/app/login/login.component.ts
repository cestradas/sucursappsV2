import { Component, OnInit, Self } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SesionTDDService } from '../services/breadcrums/breadcroms.service';
import { ResponseWS } from '../services/response/response.service';
import $ from 'jquery';
import { HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
declare var $: $;


@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  forma: string;
  tarjeta: string;
  postResp;
  contenido: any;
  datosLegacy = "";
  respuestaTrjeta = "";

  constructor( private _http: Http,
               private router: Router,
               private _service: SesionTDDService, private serviceTdd: ResponseWS  ) {}
               
               ngOnInit() {
                localStorage.removeItem("contadorTime");
               }
  
               onPlasticLogin() {
                const this_aux = this;
                 
                   let respuestaPin = localStorage.getItem("res");
                   let respuestaTar = localStorage.getItem("tr2");
                   let descripcion = localStorage.getItem("des");

                    // tslint:disable-next-line:max-line-length
                    if ((descripcion === "Tarjeta no detectada" || descripcion === "Tarjeta no retirada" || descripcion === "Operacion Cancelada por Cliente" || descripcion === "PIN incorrecto debe de ser 4 Digitos" || descripcion === "ATR error or NO smart card" || descripcion === "Error al leer la tarjeta" || descripcion === "Error lectura pin" || descripcion === null) && (respuestaTar === null || respuestaTar === ""))  {
                      this_aux.onPlasticLoginafterSecurity();
                    } else {
                      const securityCheckName = 'banorteSecurityCheckSa';
                   const userLoginChallengeHandler = WL.Client
                       .createSecurityCheckChallengeHandler(securityCheckName);
                   const usr_ca = 'sucursApps';
                   const tarjet = 'adm-sucusWeb';
                  //  console.log(usr_ca);
                  //  console.log(tarjet);

                       WLAuthorizationManager.login(securityCheckName, {
                           'usr_ca': usr_ca,
                           'tarjet': tarjet
                       }).then(
                           function() {
                              const usuarioAgent = navigator.userAgent;
                              console.log('login onSuccess');
                              setTimeout(function() {
                               this_aux.getUsrPassLegacy(usuarioAgent);
                              }, 1000);

                       }, function(error) {
                          //  console.log(error);
                           $('#ModalTDDLogin').modal('hide');
                           setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
                       });
                    }
               }

             // TDC
  onPlasticLogintdc() {
    const this_aux = this;
    
      let respuestaPin = localStorage.getItem("res");
      let respuestaTar = localStorage.getItem("tr2");
      let descripcion = localStorage.getItem("des");
       // tslint:disable-next-line:max-line-length
       if ((descripcion === "Tarjeta no detectada" || descripcion === "Tarjeta no retirada" || descripcion === "Operacion Cancelada por Cliente" || descripcion === "PIN incorrecto debe de ser 4 Digitos" || descripcion === "ATR error or NO smart card" || descripcion === "Error al leer la tarjeta" || descripcion === "Error lectura pin"  || descripcion === null) && (respuestaTar === null || respuestaTar === ""))  {
         this_aux.onPlasticLoginafterSecuritytdc();
       } else {
        //  console.log("Se detectaron datos Tarjeta: " + localStorage.getItem("tr2"));
         const securityCheckName = 'banorteSecurityCheckSa';
      const userLoginChallengeHandler = WL.Client
          .createSecurityCheckChallengeHandler(securityCheckName);
      const usr_ca = 'sucursApps';
      const tarjet = 'adm-sucusWeb';
      // console.log(usr_ca);
      // console.log(tarjet);

          WLAuthorizationManager.login(securityCheckName, {
              'usr_ca': usr_ca,
              'tarjet': tarjet
          }).then(
              function() {
                 const usuarioAgent = navigator.userAgent;
                 console.log('login onSuccess');
                 setTimeout(function() {
                  this_aux.getUsrPassLegacTdc(usuarioAgent);
                 }, 1000);

          }, function(error) {
              // console.log(error);
              $('#ModalTDDLogin').modal('hide');
              setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
          });
       }
   }




  onPlasticLoginafterSecurity() {
    const this_aux = this;
    // this.getPosts().subscribe( result => {this.postResp = result; });

    // console.log(this.postResp);

    // setTimeout(function() {

      let tr2 = localStorage.getItem("tr2");
     let np = localStorage.getItem("np");
     let respTar = localStorage.getItem("res");
     this.respuestaTrjeta = respTar;
     let descripcion = localStorage.getItem("des");

      if ((respTar !== "NO_OK") && (respTar !== null) && (descripcion !== "Error lectura pin") && (tr2 !== "")) {


        const THIS: any = this;

        const formParameters = {
            tarjeta: tr2,
             // tarjeta: '4334540109018154=151022110000865',
            nip: np
             // nip: 'D4D60267FBB0BB28'
        };

        const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursApps/resource/validaNip',
        WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
        .sendFormParameters(formParameters)
        .then(
           function(response) {

             let res = response.responseJSON;

             if (res.Id === "1") {

              THIS._service.datosBreadCroms.numeroCliente = res.Tran_NumeroCliente;
              THIS._service.datosBreadCroms.nombreUsuarioTDD = res.Tran_NombrePersona;
              THIS._service.datosBreadCroms.sicUsuarioTDD = res.Tran_NumeroCliente;
              // setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );

              let tipoPreferencia = res.DetalleClave;
              // console.log(tipoPreferencia);
              let validaPreferencia = false;
              // this_aux.comienzaContador();

               if (this_aux.includesL(tipoPreferencia, "PREFERENTE")) {
                 // PREFERENTE
                 validaPreferencia = true;
                 localStorage.setItem("tipoClienteTar", validaPreferencia.toString() );
               } else {
                 // NORMAL
                 localStorage.setItem("tipoClienteTar", validaPreferencia.toString()  );
               }

              // $('#ModalTDDLogin').modal('hide');
              THIS.router.navigate(['/menuTdd']);
              //    this_aux.consultaTablaCorpBancosService();
              localStorage.setItem("validaNipServ", "1");

             } else {
              $('#ModalTDDLogin').modal('hide');

          if (this_aux.includesL(res.MensajeDetallado, "QGE2455") || this_aux.includesL(res.MensajeDetallado, "QGE2482")) {
                    // tslint:disable-next-line:max-line-length
                    document.getElementById('mnsError').innerHTML = "Los datos proporcionados son incorrectos, favor de verificar.";
                    $('#errorModal').modal('show');
              } else if (this_aux.includesL(res.MensajeDetallado, "QGE2438")) {
                // tslint:disable-next-line:max-line-length
                  document.getElementById('mnsError').innerHTML = "Has excedido el número de intentos permitidos, por seguridad no es posible continuar.";
                  $('#errorModal').modal('show');
              } else if (this_aux.includesL(res.MensajeDetallado, "QGE2476")) {
                document.getElementById('mnsError').innerHTML = "Tarjeta bloqueada por NIP, favor de hablar a Banortel.";
                $('#errorModal').modal('show');
              } else if (this_aux.includesL(res.MensajeDetallado, "QGE2456")) {
        document.getElementById('mnsError').innerHTML = res.MensajeAUsuario ;
          $('#errorModal').modal('show');
        } else if (res.MensajeAUsuario === "Tarjeta TDC") {
          // tslint:disable-next-line:max-line-length
          document.getElementById('mnsError').innerHTML = "Tipo de plástico incorrecto, favor de seleccionar la opción inicio con tarjeta de crédito";
          $('#errorModal').modal('show');
        } else {

              /*
              localStorage.removeItem("des");
              localStorage.removeItem("np");
              localStorage.removeItem("res");
              localStorage.removeItem("tr2");
              localStorage.removeItem("tr2_serv");
              localStorage.removeItem("np_serv");
              localStorage.removeItem("res_serv"); */

              setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );


              // tslint:disable-next-line:max-line-length
              document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
              $('#errorModal').modal('show');
      }
             }


      },
      function(error) {

        setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
        
        
          // tslint:disable-next-line:max-line-length
          document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
          $('#errorModal').modal('show');

           });

         } else {

          $('#ModalTDDLogin').modal('hide');

        // tslint:disable-next-line:max-line-length
        if (descripcion === "Tarjeta no detectada" || descripcion === "Tarjeta no retirada" || descripcion === "Operacion Cancelada por Cliente" || descripcion === "PIN incorrecto debe de ser 4 Digitos" || descripcion === "ATR error or NO smart card" || tr2 === "") {
              //  console.log("Pinpad respondio con " + this.respuestaTrjeta);
               // tslint:disable-next-line:max-line-length
               document.getElementById('mnsError').innerHTML = "Inicio de sesión falló.";
        $('#errorModal').modal('show');

        } else if (descripcion === "Error al leer la tarjeta" || descripcion === "Error lectura pin") {
          document.getElementById('mnsError').innerHTML = "Plástico no válido, por favor verifica que sea un plástico Banorte.";
          $('#errorModal').modal('show');
        } else {
               // tslint:disable-next-line:max-line-length
              //  console.log("Pinpad respondio con " + this.respuestaTrjeta);
               // tslint:disable-next-line:max-line-length
               document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
        $('#errorModal').modal('show');
        }
        /*
        localStorage.removeItem("tr2");
        localStorage.removeItem("des");
        localStorage.removeItem("res"); */

         }

   // }, 50000);

   localStorage.removeItem("des");
   localStorage.removeItem("np");
   localStorage.removeItem("res");
   localStorage.removeItem("tr2");
   localStorage.removeItem("tr2_serv");
   localStorage.removeItem("np_serv");
   localStorage.removeItem("res_serv");

  }

  onPlasticLoginafterSecuritytdc() {
    const this_aux = this;
    // this.getPosts().subscribe( result => {this.postResp = result; });

    // console.log(this.postResp);

    // setTimeout(function() {

      let tr2 = localStorage.getItem("tr2");
     let np = localStorage.getItem("np");
     let respTar = localStorage.getItem("res");
     this.respuestaTrjeta = respTar;
     let descripcion = localStorage.getItem("des");



      if ((respTar !== "NO_OK") && (respTar !== null) && (descripcion !== "Error lectura pin") && (tr2 !== "")) {


        const THIS: any = this;

        const formParameters = {
            tarjeta: tr2,
             // tarjeta: '4334540109018154=151022110000865',
            nip: np
             // nip: 'D4D60267FBB0BB28'
        };

        const resourceRequest = new WLResourceRequest(
        'adapters/AdapterBanorteSucursAppsTdc/resource/validaNip',
        WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest
        .sendFormParameters(formParameters)
        .then(
           function(response) {

             let res = response.responseJSON;

             if (res.Id === "1") {

              THIS._service.datosBreadCroms.numeroCliente = res.Tran_NumeroCliente;
              THIS._service.datosBreadCroms.nombreUsuarioTDD = res.Tran_NombrePersona;
              THIS._service.datosBreadCroms.sicUsuarioTDD = res.Tran_NumeroCliente;
              // setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );

              let tipoPreferencia = res.DetalleClave;
              // console.log(tipoPreferencia);
              let validaPreferencia = false;
              // this_aux.comienzaContador();

               if (this_aux.includesL(tipoPreferencia, "PREFERENTE")) {
                 // PREFERENTE
                 validaPreferencia = true;
                 localStorage.setItem("tipoClienteTar", validaPreferencia.toString() );
               } else {
                 // NORMAL
                 localStorage.setItem("tipoClienteTar", validaPreferencia.toString()  );
               }

              // $('#ModalTDDLogin').modal('hide');
              THIS.router.navigate(['/menuTDC']);
              //    this_aux.consultaTablaCorpBancosService();
              localStorage.setItem("validaNipServ", "1");

             } else {
              $('#ModalTDDLogin').modal('hide');
              
          if (this_aux.includesL(res.MensajeDetallado, "QGE2455") || this_aux.includesL(res.MensajeDetallado, "QGE2482")) {
                    // tslint:disable-next-line:max-line-length
                    document.getElementById('mnsError').innerHTML = "Los datos proporcionados son incorrectos, favor de verificar.";
                    $('#errorModal').modal('show');
              } else if (this_aux.includesL(res.MensajeDetallado, "QGE2438")) {
                // tslint:disable-next-line:max-line-length
                  document.getElementById('mnsError').innerHTML = "Has excedido el número de intentos permitidos, por seguridad no es posible continuar.";
                  $('#errorModal').modal('show');
              } else if (this_aux.includesL(res.MensajeDetallado, "QGE2476")) {
                document.getElementById('mnsError').innerHTML = "Tarjeta bloqueada por NIP, favor de hablar a Banortel.";
                $('#errorModal').modal('show');
              } else if (this_aux.includesL(res.MensajeDetallado, "QGE2456")) {
            document.getElementById('mnsError').innerHTML = res.MensajeAUsuario ;
            $('#errorModal').modal('show');
          } else if (res.MensajeAUsuario === "Tarjeta TDD") {
            // tslint:disable-next-line:max-line-length
            document.getElementById('mnsError').innerHTML = "Tipo de plástico incorrecto, favor de seleccionar la opción inicio con tarjeta de débito";
            $('#errorModal').modal('show');
          } else {

              /*
              localStorage.removeItem("des");
              localStorage.removeItem("np");
              localStorage.removeItem("res");
              localStorage.removeItem("tr2");
              localStorage.removeItem("tr2_serv");
              localStorage.removeItem("np_serv");
              localStorage.removeItem("res_serv"); */

              setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );


              // tslint:disable-next-line:max-line-length
              document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
              $('#errorModal').modal('show');
      }
             }


      },
      function(error) {


             setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );


               // tslint:disable-next-line:max-line-length
               document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
               $('#errorModal').modal('show');

           });

         } else {

          $('#ModalTDDLogin').modal('hide');
        // tslint:disable-next-line:max-line-length
        if (descripcion === "Tarjeta no detectada" || descripcion === "Tarjeta no retirada" || descripcion === "Operacion Cancelada por Cliente" || descripcion === "PIN incorrecto debe de ser 4 Digitos" || descripcion === "ATR error or NO smart card"  || tr2 === "") {
              //  console.log("Pinpad respondio con " + this.respuestaTrjeta);
               // tslint:disable-next-line:max-line-length
               document.getElementById('mnsError').innerHTML = "Inicio de sesión falló.";
        $('#errorModal').modal('show');

        } else if (descripcion === "Error al leer la tarjeta" || descripcion === "Error lectura pin") {
          document.getElementById('mnsError').innerHTML = "Plástico no válido, por favor verifica que sea un plástico Banorte.";
          $('#errorModal').modal('show');
        } else {
               // tslint:disable-next-line:max-line-length
              //  console.log("Pinpad respondio con " + this.respuestaTrjeta);
               // tslint:disable-next-line:max-line-length
               document.getElementById('mnsError').innerHTML = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
        $('#errorModal').modal('show');
        }
        /*
        localStorage.removeItem("tr2");
        localStorage.removeItem("des");
        localStorage.removeItem("res"); */

         }

   // }, 50000);
   localStorage.removeItem("des");
   localStorage.removeItem("np");
   localStorage.removeItem("res");
   localStorage.removeItem("tr2");
   localStorage.removeItem("tr2_serv");
   localStorage.removeItem("np_serv");
   localStorage.removeItem("res_serv");


  }

  getUsrPassLegacy(usrAgent) {
    const this_aux = this;

        const patron = /@/g;
        usrAgent = usrAgent.replace(patron, '');

        const formParameters = {
            terminal: usrAgent
                // terminal: 'T002'
        };
        const resourceRequest = new WLResourceRequest(
            'adapters/AdapterBanorteSucursApps/resource/consultaUsrLegacy',
            WLResourceRequest.POST);
        resourceRequest.setTimeout(30000);
        resourceRequest.sendFormParameters(formParameters).then(
            function(response) {

              this_aux.datosLegacy = response.responseJSON;
              const resLegacyJson = response.responseJSON;
              // console.log( this_aux.datosLegacy);
              if (resLegacyJson.Id === '0') {
                  WLAuthorizationManager.logout('banorteSecurityCheckSa');

                  setTimeout(function() {
                    $('#errorModal').modal('show');
                    $('#ModalTDDLogin').modal('hide');
                  }, 500);
                  localStorage.removeItem("des");
                  localStorage.removeItem("np");
                  localStorage.removeItem("res");
                  localStorage.removeItem("tr2");
                  localStorage.removeItem("tr2_serv");
                  localStorage.removeItem("np_serv");
                  localStorage.removeItem("res_serv");
              } else {
                console.log("El servcio de informacion Legacy respondio correctamente");
                this_aux.idSession();
                this_aux.tokenOperacion();
              }
              },
            function(error) {
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
                console.log("Ocurrio un error con el servcio de informacion Legacy");
                $('#errorModal').modal('show');
                $('#ModalTDDLogin').modal('hide');
            });
}

getUsrPassLegacTdc(usrAgent) {
  const this_aux = this;

      const patron = /@/g;
      usrAgent = usrAgent.replace(patron, '');

      const formParameters = {
          terminal: usrAgent
              // terminal: 'T002'
      };
      const resourceRequest = new WLResourceRequest(
          'adapters/AdapterBanorteSucursApps/resource/consultaUsrLegacy',
          WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);
      resourceRequest.sendFormParameters(formParameters).then(
          function(response) {

              this_aux.datosLegacy = response.responseJSON;
              const resLegacyJson = response.responseJSON;
              // console.log( this_aux.datosLegacy);
              if (resLegacyJson.Id === '0') {
                  WLAuthorizationManager.logout('banorteSecurityCheckSa');

                  setTimeout(function() {
                    $('#errorModal').modal('show');
                    $('#ModalTDDLogin').modal('hide');
                  }, 500);
                  localStorage.removeItem("des");
                  localStorage.removeItem("np");
                  localStorage.removeItem("res");
                  localStorage.removeItem("tr2");
                  localStorage.removeItem("tr2_serv");
                  localStorage.removeItem("np_serv");
                  localStorage.removeItem("res_serv");
              } else {
                console.log("El servcio de informacion Legacy respondio correctamente");
                this_aux.idSession();
                this_aux.tokenOperacionTdc();
              }
              },
            function(error) {
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
                console.log("Ocurrio un error con el servcio de informacion Legacy");
                $('#errorModal').modal('show');
                $('#ModalTDDLogin').modal('hide');
            });
}
/*
  comienzaContador() {
  const this_aux = this;
  const body = $('body');
  body.on('click', function() {
    localStorage.setItem('TimeOut', localStorage.getItem('TimeOutIni'));
  });

  setInterval(function() {
   const valueNewTimeOut = +localStorage.getItem('TimeOut') - 1;
   localStorage.setItem('TimeOut', valueNewTimeOut.toString());
   if  (valueNewTimeOut === 15)  {
            $('#avisoSesionExpira').modal('show');
        }
        if  (valueNewTimeOut <= 15)  {
          document.getElementById('addExpira').innerHTML =  valueNewTimeOut.toString();
        }
        if (valueNewTimeOut === 0) {
          $('#avisoSesionExpira').modal('hide');
          this_aux.cerrarSesion();
        }
  }, 1000);
  } */

cerrarSesion() {

  const THIS: any = this;

  console.log("Cerrar sesion");
  sessionStorage.removeItem("campania");
  localStorage.removeItem("validaNipServ");
  localStorage.removeItem("des");
  localStorage.removeItem("np");
  localStorage.removeItem("res");
  localStorage.removeItem("tr2");
  const resourceRequest = new WLResourceRequest(
    'adapters/AdapterBanorteSucursApps2/resource/cerrarSesion',
    WLResourceRequest.POST);
resourceRequest.setTimeout(30000);
resourceRequest.send().then(
        function(response) {

          // console.log(response);

          WLAuthorizationManager.logout('banorteSecurityCheckSa');
          location.reload(true);
          THIS.router.navigate(['/login']);

        },
        function(error) {

          WLAuthorizationManager.logout('banorteSecurityCheckSa');
          // console.log(error);
          THIS.router.navigate(['/login']);

        });

}

  idSession() {
    const this_aux = this;
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/getSessionId',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {
              let resp = response.responseJSON;
              this_aux.serviceTdd.sesionTdd = response.responseText;
              // console.log(response.responseText);
          } ,

          function(error) {
              // console.log(error.responseText);
               WLAuthorizationManager.logout('banorteSecurityCheckSa');

          });
  }

  BxiLogin() {
    console.log("en funcion de bxi");
    $( ".cdk-visually-hidden" ).css( "margin-top", "0%" );
    $( ".cdk-overlay-container" ).css( "margin-top", "0%" );
    $('#ModalBXILogin').modal('show');
  }

  encuesta() {
    console.log("Encuesta de satisfaccion");

  }

  // TODO
includesL(container, value) {
 let returnValue = false;
 let pos = String(container).indexOf(value);

 if (pos >= 0) {
   returnValue = true;
 }
 return returnValue;
}


  getPosts() {
    return this._http.get('http://localhost:8081/sucursappsdevices/pinpad/read')
                            .map(res => res.json());
  }

  tokenOperacion() {
    const this_aux = this;
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/tokenOperacion',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {
              let resp = response.responseJSON;
              // console.log(response.responseText);
              this_aux.onPlasticLoginafterSecurity();
          } ,
          function(error) {
              // console.log(error.responseText);

          });
  }

  tokenOperacionTdc() {
    const this_aux = this;
    const resourceRequest = new WLResourceRequest(
      'adapters/AdapterBanorteSucursApps/resource/tokenOperacion',
      WLResourceRequest.POST);
  resourceRequest.setTimeout(30000);
  resourceRequest
      .send()
      .then(
          function(response) {
              let resp = response.responseJSON;
              // console.log(response.responseText);
              this_aux.onPlasticLoginafterSecuritytdc();
          } ,
          function(error) {
              // console.log(error.responseText);

          });
  }

  consultaTablaCorpBancosService() {
    const this_aux = this;
    $("#_modal_please_wait").modal("show");
    const resourceRequest = new WLResourceRequest(
      "adapters/AdapterBanorteSucursApps2/resource/consultaMontosMaximos",
      WLResourceRequest.POST
    );
    resourceRequest.setTimeout(30000);
    resourceRequest.send().then(
      function(response) {
        // console.log(response);
        $("#_modal_please_wait").modal("hide");
      },
      function(error) {
        console.error("El WS respondio incorrectamente");
        $("#_modal_please_wait").modal("hide");
        $("#errorModal").modal("show");
      }
    );
  }

   callPinPad() {
     const this_aux = this;
    let url = 'http://localhost:8081/sucursappsdevices/pinpad/read';
    $('#ModalTDDLogin').modal('show');
    document.getElementById('capturaInicio').style.display = 'block';
    document.getElementById('caputuraSesion').style.display = 'none';
    localStorage.removeItem("tr2");
    localStorage.removeItem("np");
    localStorage.removeItem("res");
    localStorage.removeItem("des");

    fetch(url).then(function(response) {
        // Convert to JSON
        return response.json();
    }).then(function(res) {

        let respuesta = JSON.parse(res);


        if (respuesta.res !== "NO_OK") {
            if ((localStorage.getItem("validaNipServ") === null) || (localStorage.getItem("validaNipServ") === "")) {

                localStorage.setItem("tr2", respuesta.tr2);
                localStorage.setItem("np", respuesta.np);
                localStorage.setItem("res", respuesta.res);

            } else {

                localStorage.setItem("tr2_serv", respuesta.tr2);
                localStorage.setItem("np_serv", respuesta.np);
                localStorage.setItem("res_serv", respuesta.res);
            }

        } else {
          
            localStorage.setItem("res", respuesta.res);
            localStorage.setItem("des", respuesta.des);
            localStorage.setItem("tr2", "");
            localStorage.setItem("tr2_serv", "");
           
        }

        this_aux.onPlasticLogin();

    }, function(err) {
        if (err) {
            return console.log(err);
        }

    });
}

callPinPadtdc() {

  const this_aux = this;

  let url = 'http://localhost:8083/sucursappsdevices/pinpad/read';
  $('#ModalTDDLogin').modal('show');
  document.getElementById('capturaInicio').style.display = 'block';
  document.getElementById('caputuraSesion').style.display = 'none';
  localStorage.removeItem("tr2");
  localStorage.removeItem("np");
  localStorage.removeItem("res");
  localStorage.removeItem("des");

  fetch(url).then(function(response) {
      // Convert to JSON
      return response.json();
  }).then(function(res) {

      let respuesta = JSON.parse(res);


      if (respuesta.res !== "NO_OK") {
          if ((localStorage.getItem("validaNipServ") === null) || (localStorage.getItem("validaNipServ") === "")) {

              localStorage.setItem("tr2", respuesta.tr2);
              localStorage.setItem("np", respuesta.np);
              localStorage.setItem("res", respuesta.res);

          } else {

              localStorage.setItem("tr2_serv", respuesta.tr2);
              localStorage.setItem("np_serv", respuesta.np);
              localStorage.setItem("res_serv", respuesta.res);
          }

      } else {
          localStorage.setItem("res", respuesta.res);
          localStorage.setItem("des", respuesta.des);
          localStorage.setItem("tr2", "");
          localStorage.setItem("tr2_serv", "");
      }
      this_aux.onPlasticLogintdc();
  }, function(err) {
      if (err) {
          return console.log(err);
      }

  });
}

}
