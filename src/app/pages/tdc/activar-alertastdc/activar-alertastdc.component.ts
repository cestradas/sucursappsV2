import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultaCatalogosTdcService } from '../../../services/consultaCatalogosTDC/consulta-catalogos-tdc.service';
import { ConsultaSaldosTddService } from '../../../services/service.index';
import { SesionTDDService} from '../../../services/service.index';
declare var $: any;
@Component({
  selector: 'app-activar-alertastdc',
  templateUrl: './activar-alertastdc.component.html',
  styleUrls: []
})
export class ActivarAlertastdcComponent implements OnInit {
  nombreUsuarioTdc: string;
  AlertasActivas = false;
  isChecked = false ;
  Evento: string;
  ArrayAlertasCliente: Array<any> = [];
  movimientos: any;
  movimientosCue: any;
  
  saldoDispoinible: string;
  SaldoActual: string;
  NumeroTarjeta: string;

  numCuenta_show: string;
  @ViewChild('rcheck', { read: ElementRef}) rcheck: ElementRef ;
  constructor(private router: Router, private _service: ConsultaSaldosTddService, private _serviceSesion: SesionTDDService) {}

  ngOnInit() {
$('#_modal_please_wait').modal('show');
     this.consultaSaldosTarjetas();
     // this._service.validarDatosSaldoTdd().then( // ya no seria necesario
       // mensaje => {
         this.consultaAlertas();
         setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
      // }
     // );
     
    // ESTILOS Preferente
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
    const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
      operaciones.mantieneAlertas().then(
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
                      setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
                        document.getElementById('mnsError').innerHTML =  "Ya tienes alertas activas para esta cuenta"; 
                        $('#errorModal').modal('show');
                    }

              } else {
                $('#_modal_please_wait').modal('hide');
                this_aux.showErrorSucces(detalle);      }
                $("div").remove(".modal-backdrop");
        }, function(error) { 
          setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
          this_aux.showErrorPromise(error);    }
      );
    }



  estaSeleccionado() {
    const checkBox = this.rcheck.nativeElement;
    this.isChecked = checkBox.checked;
    /*if (this.isChecked == true){
      console.log("activar boton");
      } else {
        console.log("desactivar boton");
      }*/
  }
 

 setAltaServicioAlertas() {
  $('#_modal_please_wait').modal('show');
  const this_aux = this;
  

  if (this_aux.ArrayAlertasCliente.length !== 0) {
     const elemento = this_aux.ArrayAlertasCliente[0];
     const servicioEvento = elemento.ServicioEvento;
     this_aux.Evento = servicioEvento.substring(2, 5);
     const operaciones: ConsultaCatalogosTdcService = new ConsultaCatalogosTdcService();
     operaciones.altaServicioAlertasTDC(this_aux.Evento).then(
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
                    this_aux.router.navigate(['/activarAlertasVerifyTDC']);
                  }
              } else { 
                setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
                this_aux.showErrorSucces(res); }
        }, function(error) {  
          
          setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
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
irMenuTDC() {
  const this_aux = this;
  this_aux.router.navigate(['/menuTDC']);
}
// consulta TDC
 consultaSaldosTarjetas() {
    const this_aux = this;
    const formParameters = { 
    }; 
    
    console.log(formParameters);
    const resourceRequest = new WLResourceRequest(
      
      'adapters/AdapterBanorteSucursAppsTdc/resource/consultaSaldosTarjetas', WLResourceRequest.POST);
      resourceRequest.setTimeout(30000);
      
      resourceRequest.sendFormParameters(formParameters).then(
        function(response1) {
          console.log(response1.responseText);

          const detalleSaldos = response1.responseJSON;
          $('#_modal_please_wait').modal('hide');
          if ( detalleSaldos.Id === '1') {
            this_aux.saldoDispoinible = detalleSaldos.SaldoDisponible;
            this_aux.saldoDispoinible = this_aux.saldoDispoinible;
            this_aux.SaldoActual = detalleSaldos.SaldoActual;
            this_aux.NumeroTarjeta = detalleSaldos.NumeroTarjeta;
            this_aux.mascaraNumeroCuenta(this_aux.NumeroTarjeta);
            $('#_modal_please_wait').modal('hide');
  
          } else {
             this_aux.showErrorSucces(detalleSaldos);
          }
        }, function(error) {
          this_aux.showErrorPromise(error);
    });
  }

  timeOut () {
    const div = document.getElementById('timeOut');
    $('#timeOut').modal('show');
  
  }

  mascaraNumeroCuenta(numCtaSel) {
    const tamNumCta = numCtaSel.length;
    const numCta_aux = numCtaSel.substring(tamNumCta - 4, tamNumCta);
    this.numCuenta_show = '******' + numCta_aux;
    return this.numCuenta_show;
  }

}
