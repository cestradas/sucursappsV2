import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { consultaCatalogos } from '../../../services/consultaCatalogos/consultaCatalogos.service';
declare var $: any;
@Component({
  selector: 'app-activar-alertas',
  templateUrl: './activar-alertas.component.html',
})
export class ActivarAlertasComponent implements OnInit {
  AlertasActivas = false;
  isChecked = false ;
  Evento: string;
  ArrayAlertasCliente: Array<any> = [];

  @ViewChild('rcheck', { read: ElementRef}) rcheck: ElementRef ;

  constructor(private router: Router) { }

  ngOnInit() {
    //ESTILOS Preferente
    let storageTipoClienteTar = localStorage.getItem("tipoClienteTar");
    let btnContinuar = document.getElementById("continuar");

    if (storageTipoClienteTar === "true") {

      btnContinuar.classList.remove("color-botones");
      btnContinuar.classList.add("color-botones_Preferente");
    }

  this.consultaAlertas();
  }

    consultaAlertas() {

      const this_aux = this;
    const operaciones: consultaCatalogos = new consultaCatalogos();
      $('#_modal_please_wait').modal('show');
      operaciones.mantieneAlertas('C').then(
        function(detalleAlertas) {
              const detalle = detalleAlertas.responseJSON;
              let AlertasActivas_true = false;
              console.log(detalle);
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
                      $('#_modal_please_wait').modal('hide');
                        document.getElementById('mnsError').innerHTML =  "Ya tienes alertas activas para esta cuenta";
                        $('#errorModal').modal('show');
                    }

              } else {
                $('#_modal_please_wait').modal('hide');
                this_aux.showErrorSucces(detalle);      }
        }, function(error) {
          $('#_modal_please_wait').modal('hide');
          this_aux.showErrorPromise(error);    }
      );
    }



  estaSeleccionado() {
    const checkBox = this.rcheck.nativeElement;
    this.isChecked = checkBox.checked;
  }

  irMenuTDD() {
    this.router.navigate(['/menuTDD']);
}

setAltaServicioAlertas() {
  $('#_modal_please_wait').modal('show');
  const this_aux = this;
  let TDD  = false;
  let TDC = false;
  let I = false;

  if (this_aux.ArrayAlertasCliente.length !== 0) {
     const elemento = this_aux.ArrayAlertasCliente[0];
     const servicioEvento = elemento.ServicioEvento;
     this_aux.Evento = servicioEvento.substring(2, 5);
     const operaciones: consultaCatalogos = new consultaCatalogos();
     operaciones.altaServicioAlertasTDD('A', this_aux.Evento ).then(
        function(res) {
            const respuestaActivacion = res.responseJSON;
              if (respuestaActivacion.Id === '1') {
                  console.log('Servicio activado');
                  this_aux.ArrayAlertasCliente.shift();
                  if (this_aux.ArrayAlertasCliente.length !== 0) {
                    const elementoAux = this_aux.ArrayAlertasCliente[0];
                    const servicioEventoAux = elementoAux.ServicioEvento;
                    this_aux.Evento = servicioEventoAux.substring(2, 5);
                    this_aux.setAltaServicioAlertas();
                  } else {
                    this_aux.router.navigate(['/activaAlertas_verify']);
                  }
              } else {
                $('#_modal_please_wait').modal('hide');
                this_aux.showErrorSucces(res); }
        }, function(error) {

          $('#_modal_please_wait').modal('hide');
          this_aux.showErrorPromise(error);   }

     );

  }

}

showErrorSucces(json) {

  console.log(json.Id + json.MensajeAUsuario);
  document.getElementById('mnsError').innerHTML =   json.MensajeAUsuario;
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
}
