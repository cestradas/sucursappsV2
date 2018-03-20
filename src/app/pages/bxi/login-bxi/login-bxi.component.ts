import { Autenticacion } from './../autenticacion';
import { SesionBxiService } from './../sesion-bxi.service';
import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';


declare var jquery: any; // jquery
declare var $: any;

@Component({
  selector: 'app-login-bxi',
  templateUrl: './login-bxi.component.html',
  styleUrls: [  ]
})
export class LoginBxiComponent implements OnInit {
  @ViewChild('imagenToken', { read: ElementRef}) imagenToken: ElementRef ;
  constructor(private router: Router, private service: SesionBxiService ) { }

  ngOnInit() {
  }

  validaUsuario(usuarioBxi) {
    const this_aux = this;
    this_aux.service.usuarioLogin = usuarioBxi;
    const autenticacion: Autenticacion = new Autenticacion();
    autenticacion.identificaUsuriao(usuarioBxi).then(
      function(identificacion) {
        // console.log(response.responseJSON);
        const detalleIdentifacionUsurario = identificacion.responseJSON;
        
          if ( detalleIdentifacionUsurario.Id === 'SEG0001') {
              this_aux.service.detalleIdentificacion = detalleIdentifacionUsurario.toString();
              autenticacion.getMetodosAutenticacionUsuario().then(
                    function(metodos) {
                        // console.log(metodos.responseJSON);
                        // console.log(metodos.responseText);
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

      this.showModalByTipoAutentica(nivelMayor, tipoAutenticacion, etiqueta, requierePreparacion);
    }

    showModalByTipoAutentica(nivelMayor, tipoAutenticacion, etiqueta, requierePreparacion) {
      console.log(nivelMayor + tipoAutenticacion + etiqueta + requierePreparacion );
        const this_aux = this;
        this_aux.service.metodoAutenticaLogin = tipoAutenticacion;
        if ((nivelMayor === 300) && (tipoAutenticacion === 5)) {

          this_aux.preparaAutenticacion();

        } else if ((nivelMayor === 300) && (tipoAutenticacion === 1)) {
          // TokenFisico

          document.getElementById('view_usr').style.display = 'none';
          document.getElementById('view_pass_token').style.display = 'block';

        } else if (nivelMayor === 100) {
          // Contraseña
          this_aux.service.metodoAutenticaLogin = '0';
          document.getElementById('view_usr').style.display = 'none';
          document.getElementById('view_pass').style.display = 'block';
        }
    }

    preparaAutenticacion() {
      console.log('Entro PreparaAutenticacion');
      document.getElementById('view_usr').style.display = 'none';
      document.getElementById('view_pass_token_cel').style.display = 'block';
    }


    autenticaUsuario(claveAcceso) {

      const this_aux = this;
      const autenticacion: Autenticacion = new Autenticacion();
      console.log(' this_aux.service.metodoAutenticaLogin' +  this_aux.service.metodoAutenticaLogin );
      console.log('entro autenticaUsuario ' );
      autenticacion.autenticaUsuario(claveAcceso, this_aux.service.metodoAutenticaLogin).then(
          function(response) {
                // console.log(response.responseJSON);
                const infoUsuario = response.responseText;
                const infoUsuarioJSON = response.responseJSON;
                if (infoUsuarioJSON.Id === 'SEG0001') {

                    this_aux.service.infoUsuario = infoUsuario;
                    this_aux.router.navigate(['/menuBXI']);
                    $('div').removeClass('modal-backdrop');

                } else {

                  console.log(infoUsuarioJSON.MensajeAUsuario);
                }

          }, function(error) {
          });
    }

  }




