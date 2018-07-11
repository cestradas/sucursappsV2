import { Component, OnInit } from '@angular/core';
import { ConsultaSaldosTddService, SesionTDDService } from '../../../../services/service.index';
import { Router } from '@angular/router';
import { consultaCatalogos } from '../../../../services/consultaCatalogos/consultaCatalogos.service';
import $ from 'jquery';
declare var jquery: any; // jquery
declare var $: any;
@Component({
  selector: 'app-mantenimiento-datos-contacto-final',
  templateUrl: './mantenimiento-datos-contacto-final.component.html'
})
export class MantenimientoDatosContactoFinalComponent implements OnInit {
  NombreUser: string;
  Sic: string;
  Celular: string;
  CorreoElectronico: string;
  dia: any;
  mes: any;
  anio: any;
  fechaMesActualFin: any;
  hora: any;

  constructor(private _serviceSesion: SesionTDDService, private router: Router) {
  }

  ngOnInit() {

    // ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnTerminar = document.getElementById("terminar");

    if (storageTipoClienteTar === "true") {

      btnTerminar.classList.remove("color-botones");
      btnTerminar.classList.add("color-botones_Preferente");
    }


    const this_aux = this;

    this_aux.consultarDatos();
    this_aux.hora = new Date().getTimezoneOffset();
    this_aux.dia = new Date().getUTCDate();
    this_aux.mes = (new Date().getUTCMonth() + 1);
    this_aux.anio = new Date().getFullYear();

    if (this_aux.mes < 10) {
      this_aux.mes = "0" + this_aux.mes;
  }
  if (this_aux.dia < 10) {
     this_aux.dia = "0" + this_aux.dia;
  }
  this_aux.fechaMesActualFin = (this_aux.dia + "-" + this_aux.mes + "-" + this_aux.anio).toString();
  }

  mostrarDatos() {

  }


  irMenuTDD() {
    this.router.navigate(['/menuTdd']);
  }

  consultarDatos() {
    const this_aux = this;
    const operaciones: consultaCatalogos = new consultaCatalogos();
    operaciones.consultarDatosContacto().then(
      function(respPago) {

        const jsonRespuesta = respPago.responseJSON;
        if (jsonRespuesta.Id === '1') {
         console.log(respPago.responseText);
         this_aux.Celular = jsonRespuesta.Telefono;
         this_aux.CorreoElectronico = jsonRespuesta.Email;
         this_aux.Sic = this_aux._serviceSesion.datosBreadCroms.numeroCliente;
          

         if (this_aux.CorreoElectronico !== this_aux._serviceSesion.datosBreadCroms.EmailCliente) {
          const div = document.getElementById('correo2');
          div.style.display = "block";
          const div2 = document.getElementById('correo');
          div2.style.display = "block";
        }
        
        if (this_aux.Celular !== this_aux._serviceSesion.datosBreadCroms.CelCliente) {
          const div2 = document.getElementById('celular');
          div2.style.display = "block";
        }
         console.log("Consulta de Datos Exitosa");

          setTimeout(() => $('#_modal_please_wait').modal('hide'), 1000);
        } else {
          this_aux.showErrorSucces(jsonRespuesta);
          this_aux._serviceSesion.datosBreadCroms.CelCliente = "";
          this_aux._serviceSesion.datosBreadCroms.EmailCliente = "";
          console.log("No hay Datos");
        }


      }, function(error) { this_aux.showErrorPromise(error); }
    );

  }

  showErrorSucces(json) {
    setTimeout(function() {
      console.log(json.Id + json.MensajeAUsuario);
      document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
      $('#_modal_please_wait').modal('hide');
      $('#errorModal').modal('show');
    }, 500);
  }

  showErrorPromise(error) {

    setTimeout(function() {
      $('#modal_please_wait').modal('hide');
      $('#errorModal').modal('show');
      if (error.errorCode === 'API_INVOCATION_FAILURE') {
          document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
      } else {
        document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
      }
    }, 500);
  }

}
