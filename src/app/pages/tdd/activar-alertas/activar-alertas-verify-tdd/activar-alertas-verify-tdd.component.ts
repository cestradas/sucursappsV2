import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from '../../../bxi/sesion-bxi.service';
import { Router } from '@angular/router';
import { ConsultaSaldosTddService } from '../../../../services/service.index';
import { consultaCatalogos } from '../../../../services/consultaCatalogos/consultaCatalogos.service';
import $ from 'jquery';
declare var jquery: any; // jquery
declare var $: any;
@Component({
  selector: 'app-activar-alertas-verify-tdd',
  templateUrl: './activar-alertas-verify-tdd.component.html'
})
export class ActivarAlertasVerifyTddComponent implements OnInit {
  NumCuenta: string;
  Email: string;
  Celular: string;

  constructor(private _service: ConsultaSaldosTddService, private router: Router) { }

  ngOnInit() {
    const operaciones: consultaCatalogos = new consultaCatalogos();
    $('#_modal_please_wait').modal('show');
    this._service.cargarSaldosTDD();
    this._service.validarDatosSaldoTdd().then(
      mensaje => {
        console.log('Saldos cargados correctamente TDD');
        // tslint:disable-next-line:no-shadowed-variable
        this.NumCuenta = operaciones.mascaraNumeroCuenta(mensaje.NumeroCuenta);
        this.consultarDatosContacto();
      }
    );    
    




  }


  consultarDatosContacto() {

    const this_aux = this;
    const operaciones: consultaCatalogos = new consultaCatalogos();
    operaciones.consultarDatosContacto().then(
      function(respPago) {
  
        const jsonRespuesta = respPago.responseJSON;
        if (jsonRespuesta.Id === '1') {
         console.log(respPago.responseText);
         this_aux.Email = jsonRespuesta.Email;
         this_aux.Celular = jsonRespuesta.Telefono;
          console.log("Consulta de Datos Exitosa");
          
        } else {
          this_aux.showErrorSucces(jsonRespuesta);
          console.log("No hay Datos");
        }
        setTimeout( () => $('#_modal_please_wait').modal('hide'), 700 );
      }, function(error) { this_aux.showErrorPromise(error); }
    );
  }

  irMenuTDD() {
    this.router.navigate(['/menuTdd']);
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
    
    $('#errorModal').modal('show');
    if (error.errorCode === 'API_INVOCATION_FAILURE') {
        document.getElementById('mnsError').innerHTML = 'Tu sesi�n ha expirado';
    } else {
      document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
    }
  
  }
}
