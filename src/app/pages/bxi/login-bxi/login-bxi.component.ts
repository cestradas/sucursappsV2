import { Autenticacion } from './../autenticacion';
import { SesionBxiService } from './../sesion-bxi.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';


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

  constructor(private router: Router, private service: SesionBxiService, private renderer: Renderer2) { }

  ngOnInit() {
  }

  validaUsuario(usuarioBxi) {
    const this_aux = this;
    this_aux.service.usuarioLogin = usuarioBxi;
    const autenticacion: Autenticacion = new Autenticacion();
    autenticacion.identificaUsuriao(usuarioBxi).then(
      function(identificacion) {
        console.log(identificacion.responseJSON);
        const detalleIdentifacionUsurario = identificacion.responseJSON;

          if ( detalleIdentifacionUsurario.Id === 'SEG0001') {

              this_aux.service.detalleIdentificacion = detalleIdentifacionUsurario.toString();
              this_aux.service.NombreUsuario = detalleIdentifacionUsurario.NombreUsuario;
              this_aux.urlImagenAux = detalleIdentifacionUsurario.UrlImagenPersonal;
              this_aux.nombreEnmascaradoAux = detalleIdentifacionUsurario.NombreEnmascarado;

              autenticacion.getMetodosAutenticacionUsuario().then(
                    function(metodos) {

                        const  respConsultaMetodos = metodos.responseJSON;
                        if (respConsultaMetodos.Id === 'SEG0001') {

                            const arrayMetodos = respConsultaMetodos.ArrayMetodos;
                            this_aux.service.metodosAutenticacionUsario = arrayMetodos.toString();
                            this_aux.getNumeroMetodo(arrayMetodos);

                        } else {
                            console.log(respConsultaMetodos.MensajeAUsuario);
                        }
                     }, function(error) {  }
              );
          } else {
              console.log(detalleIdentifacionUsurario.MensajeAUsuario);
          }
      }, function(error) {});
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

    }


    autenticaUsuario(claveAcceso) {

      const this_aux = this;
      const autenticacion: Autenticacion = new Autenticacion();
      console.log('entro autenticaUsuario ' );
      autenticacion.autenticaUsuario( claveAcceso, "0").then(
          function(response) {
                // console.log(response.responseJSON);
                const infoUsuario = response.responseText;
                const infoUsuarioJSON = response.responseJSON;
                if (infoUsuarioJSON.Id === 'SEG0001') {

                    this_aux.service.infoUsuario = infoUsuario;
                    this_aux.service.infoUsuarioSIC = infoUsuarioJSON.Sic;

                    this_aux.router.navigate(['/menuBXI']);
                    $('div').removeClass('modal-backdrop');

                } else {

                  console.log(infoUsuarioJSON.MensajeAUsuario);
                }

          }, function(error) {
          });
    }

    modalIdentificaUsuario() {

      document.getElementById('view_usr').style.display = 'block';
      document.getElementById('viewGeneralAutentica').style.display = 'none';
      document.getElementById('NosoyYo').style.display = 'none';

    }

  }
