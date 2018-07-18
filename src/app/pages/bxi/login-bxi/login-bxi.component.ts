import { OperacionesBXI } from './../operacionesBXI';
import { Autenticacion } from './../autenticacion';
import { SesionBxiService } from './../sesion-bxi.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';


declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-login-bxi',
  templateUrl: './login-bxi.component.html',
  styleUrls: [  ]
})
export class LoginBxiComponent implements OnInit {
  @ViewChild('imagenTokenPass', { read: ElementRef}) imagenTokenPass: ElementRef ;
  @ViewChild('imagenTokenCel', { read: ElementRef}) imagenTokenCel: ElementRef ;
  @ViewChild('imagenTokenFisico', { read: ElementRef}) imagenTokenFisico: ElementRef ;
  urlImagen: string;
  urlImagenAux: string;
  nombreEnmascarado: string;
  nombreEnmascaradoAux: string;
  MENSAJEPERSONAL: string;
  MENSAJEPERSONAL_aux: string;
  myForm: FormGroup;
   datosLegacy = "";

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      // tslint:disable-next-line:max-line-length
      fcUsuario: ['', [Validators.required, Validators.pattern(/^[a0-zA9-Z]+([a0-zA9-Z])+$/)]],
      // tslint:disable-next-line:max-line-length
      fcPass: ['', [ Validators.required, Validators.pattern(/^[a0-zA9-Z]+([a0-zA9-Z])+$/)]]

    });
   }

  ngOnInit() {
  
  }
  validaUsuario(usuarioBxi) {
      
    const this_aux = this;
    const securityCheckName = 'banorteSecurityCheckSa';
    const userLoginChallengeHandler = WL.Client
        .createSecurityCheckChallengeHandler(securityCheckName);
    const usr_ca = 'sucursApps';
    const tarjet = 'adm-sucusWeb';
    console.log(usr_ca);
    console.log(tarjet);

        WLAuthorizationManager.login(securityCheckName, {
            'usr_ca': usr_ca,
            'tarjet': tarjet
        }).then(
            function() {
               const usuarioAgent = navigator.userAgent;
               console.log('login onSuccess');
               setTimeout(function() {
                this_aux.getUsrPassLegacy(usuarioAgent, usuarioBxi);
               }, 500);
        
        }, function(error) {
            console.log(error);
        });
  }

   getUsrPassLegacy(usrAgent, usuarioBxi) {
    const this_aux = this;
    $('#_modal_please_wait').modal('show');

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
                console.log( this_aux.datosLegacy);
                if (resLegacyJson.Id === '0') {
                    WLAuthorizationManager.logout('banorteSecurityCheckSa');
                   
                    setTimeout(function() {
                      $('#_modal_please_wait').modal('hide');
                      $('#errorModal').modal('show');
                    }, 500);
                    
                } else {
                  console.log("El servcio de informacion Legacy respondio correctamente");
                  this_aux.validaUsuarioAfterSecurity(usuarioBxi);

                }
              },
            function(error) {
              
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
                console.log("Ocurrio un error con el servcio de informacion Legacy");
                $('#errorModal').modal('show');
                $('#_modal_please_wait').modal('hide');
            });
    
}

  validaUsuarioAfterSecurity(usuarioBxi) {
    $('#_modal_please_wait').modal('show');
    const this_aux = this;
    this_aux.service.usuarioLogin = usuarioBxi;
    const autenticacion: Autenticacion = new Autenticacion();
    let mensajeError;
    autenticacion.identificaUsuriao(usuarioBxi).then(
      function(identificacion) {
        console.log(identificacion.responseJSON);
        const detalleIdentifacionUsurario = identificacion.responseJSON;

          if ( detalleIdentifacionUsurario.Id === 'SEG0001') {

              this_aux.service.detalleIdentificacion = detalleIdentifacionUsurario.toString();
              this_aux.urlImagenAux = detalleIdentifacionUsurario.UrlImagenPersonal;
              this_aux.nombreEnmascaradoAux = detalleIdentifacionUsurario.NombreEnmascarado;
              this_aux.MENSAJEPERSONAL_aux = detalleIdentifacionUsurario.MensajePersonal;

              autenticacion.getMetodosAutenticacionUsuario().then(
                    function(metodos) {

                        const  respConsultaMetodos = metodos.responseJSON;
                        if (respConsultaMetodos.Id === 'SEG0001') {

                            const arrayMetodos = respConsultaMetodos.ArrayMetodos;
                            this_aux.service.metodosAutenticacionUsario = arrayMetodos.toString();
                            this_aux.getNumeroMetodo(arrayMetodos);

                        } else {
                         
                          WLAuthorizationManager.logout('banorteSecurityCheckSa');
                            console.log(respConsultaMetodos.Id + respConsultaMetodos.MensajeAUsuario);
                            mensajeError = this_aux.controlarError(respConsultaMetodos);
                            document.getElementById('mnsError').innerHTML =  mensajeError;
                            $('#_modal_please_wait').modal('hide');
                            $('#errorModal').modal('show');
                        }
                     }, function(error) { 
                     
                      WLAuthorizationManager.logout('banorteSecurityCheckSa'); 
                      this_aux.showErrorPromise(error); 
                    }
              );
          } else {
           
            WLAuthorizationManager.logout('banorteSecurityCheckSa');
            console.log(detalleIdentifacionUsurario.Id + detalleIdentifacionUsurario.MensajeAUsuario);
            mensajeError = this_aux.controlarError(detalleIdentifacionUsurario);
            document.getElementById('mnsError').innerHTML =  mensajeError;
            $('#_modal_please_wait').modal('hide');
            $('#errorModal').modal('show');

          }
      }, function(error) { 
       
        WLAuthorizationManager.logout('banorteSecurityCheckSa');
        this_aux.showErrorPromise(error); });
  }


  getNumeroMetodo(arrayMetodos) {

      const this_aux = this;
      let nivelMayor = 0;
      let tipoAutenticacion: string;
      let etiqueta: string;
      let requierePreparacion: string;
      arrayMetodos.forEach(detalle => {

        const nivelAutenticacion = detalle.NivelAutenticacion;
        if (nivelAutenticacion > nivelMayor) {
            nivelMayor = nivelAutenticacion;
            tipoAutenticacion = detalle.TipoAutenticacion;
            etiqueta = detalle.Etiqueta;
             requierePreparacion = detalle.RequierePreparacion;
        }

      });
      console.log(nivelMayor + tipoAutenticacion + etiqueta + requierePreparacion );
      this_aux.service.metodoAutenticaMayor = tipoAutenticacion;
      this_aux.service.metodoAutenticaEtiqueta = etiqueta;
      this.showModalByTipoAutentica();
    }

    showModalByTipoAutentica() {
        const this_aux = this;
        document.getElementById('viewGeneralAutentica').style.display = 'block';
        document.getElementById('NosoyYo').style.display = 'block';
          // Contraseña
          document.getElementById('view_usr').style.display = 'none';
          document.getElementById('view_pass').style.display = 'block';
          this_aux.nombreEnmascarado = this_aux.nombreEnmascaradoAux;
          this_aux.urlImagen = this_aux.urlImagenAux;
          this_aux.MENSAJEPERSONAL = this_aux.MENSAJEPERSONAL_aux;  
          $('#_modal_please_wait').modal('hide');

    }


    autenticaUsuario(claveAcceso) {
      $('#_modal_please_wait').modal('show');
      const this_aux = this;
      let mensajeError;
      const autenticacion: Autenticacion = new Autenticacion();
      console.log('entro autenticaUsuario ' );
      autenticacion.autenticaUsuario( claveAcceso, "0").then(
          function(response) {
                 console.log(response.responseJSON);
                const infoUsuario = response.responseText;
                const infoUsuarioJSON = response.responseJSON;
                if (infoUsuarioJSON.Id === 'SEG0001') {

                    if (infoUsuarioJSON.Sic === '99999999') {
                           
                            setTimeout(function() {
                              $('#_modal_please_wait').modal('hide');
                              mensajeError = "Los datos proporcionados son incorrectos, favor de verificar.";
                              document.getElementById('mnsError').innerHTML =  mensajeError;
                              $('#errorModal').modal('show');
                            }, 500);
                           
                    } else {
                            this_aux.service.NombreUsuario = infoUsuarioJSON.NombreUsuario;
                            this_aux.service.infoUsuario = infoUsuario;
                            this_aux.service.infoUsuarioSIC = infoUsuarioJSON.Sic;
                            this_aux.verificaPreferencia();
  
                    }

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
            
           // this_aux.modalIdentificaUsuario();
            WLAuthorizationManager.logout('banorteSecurityCheckSa');
            this_aux.showErrorPromise(error);
          });
    }

    modalIdentificaUsuario() {

      const this_aux = this;
      // tslint:disable-next-line:max-line-length
      const control1: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[a0-zA9-Z]+([a0-zA9-Z])+$/)]);
      const control2: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^[a0-zA9-Z]+([a0-zA9-Z])+$/)]);
      this_aux.myForm.setControl('fcUsuario', control1 );
      this_aux.myForm.setControl('fcPass', control2 );

      document.getElementById('view_usr').style.display = 'block';
      document.getElementById('viewGeneralAutentica').style.display = 'none';
      document.getElementById('NosoyYo').style.display = 'none';


    }

  verificaPreferencia() {
      const this_aux = this;
      const autenticacion: Autenticacion = new Autenticacion();
      autenticacion.consultaPreferencia(this_aux.service.usuarioLogin).then(
        function(datosUsuario) {
           const jsonDatosUsuario = datosUsuario.responseJSON;
            if (jsonDatosUsuario.Id === '1') {
              console.log(jsonDatosUsuario);
              this_aux.service.isPreferente = jsonDatosUsuario.Preferente;
              // $( ".nav-img-banorte" ).css( "background-image", "");
              this_aux.comienzaContador();
              if (this_aux.service.isPreferente  === true) {
               // PREFERENTE
               localStorage.setItem("tipoClienteBEL", jsonDatosUsuario.Preferente );
              }
                // NORMAL
                localStorage.setItem("tipoClienteBEL", jsonDatosUsuario.Preferente );

               this_aux.router.navigate(['/menuBXI']);
              // $('div').removeClass('modal-backdrop');

            } else {
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
              this_aux.showErrorSucces(jsonDatosUsuario);
            }
        }, function(error) {
          WLAuthorizationManager.logout('banorteSecurityCheckSa');
            this_aux.showErrorPromise(error);
        }
      );
    }

    comienzaContador() {
      const this_aux = this;
      const body = $('body');
      body.on('click', function() {
        localStorage.setItem('TimeOut', localStorage.getItem('TimeOutIni'));
      });
  
      setInterval(function() {
       const valueNewTimeOut = +localStorage.getItem('TimeOut') - 1;
       localStorage.setItem('TimeOut', valueNewTimeOut.toString());
       if (valueNewTimeOut === 0) {
        this_aux.cerrarSesionTimeOutBXI();
       }
      }, 1000);
    }

    cerrarSesionTimeOutBXI() {

      $('#modal_please_wait').modal('show');
      const this_aux = this;
      sessionStorage.removeItem("campania");
      const THIS: any = this;
      this_aux.service.Login = "0";
      const operacionesbxi: OperacionesBXI = new OperacionesBXI();
      console.log("Cerrar sesion BEL");
      operacionesbxi.cerrarSesionBEL().then(
          function(response) {
            console.log(response);
            const responseJson = response.responseJSON;
            if (responseJson.Id === "SEG0001") {
              WLAuthorizationManager.logout('banorteSecurityCheckSa');
              localStorage.removeItem('TimeOut');
              localStorage.removeItem('TimeOutIni');
              console.log("BEL cerro sesion",  this_aux.service.Login);
              this_aux.router.navigate(['/login']);
              location.reload(true);
            } else {
              console.log("BEL error cerrar sesion", responseJson.Id  + responseJson.MensajeAUsuario);
              document.getElementById('msgError').innerHTML =   "Error en cerrar sesión";
              $('#ModalErrorTransaccion').modal('show');
            }
          },
          function(error) {

            console.log(error);
            document.getElementById('msgError').innerHTML =   "Error en cerrar sesión";
            console.log("BEL error cerrar sesion", error.errorCode  + error.errorMsg);
           // this_aux.router.navigate(['/login']);

          });

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
        case '2'      : mensajeError = "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
                        console.log("Id: 2 Mensaje:" + mensajeUsuario);
                      break;
      }

      return mensajeError;
    }

    showErrorPromise(error) {
      console.log(error);
      // tslint:disable-next-line:max-line-length
      document.getElementById('mnsError').innerHTML =   "Por el momento este servicio no está disponible, favor de intentar de nuevo más tarde.";
      $('#_modal_please_wait').modal('hide');
      $('#errorModal').modal('show');
    }

    showErrorSucces(json) {
        $('#_modal_please_wait').modal('hide');
        console.log(json.Id + json.MensajeAUsuario);
        if (json.Id === '2') {
          document.getElementById('mnsError').innerHTML =   'El servicio no esta disponible, favor de intentar mas tarde';
        } else {
          document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
        }
        $('#errorModal').modal('show');
    }

  }
