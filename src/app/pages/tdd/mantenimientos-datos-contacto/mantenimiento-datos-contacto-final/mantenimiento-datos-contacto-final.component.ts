import { Component, OnInit } from '@angular/core';
import { ConsultaSaldosTddService, SesionTDDService } from '../../../../services/service.index';
import { Router } from '@angular/router';

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

  constructor(private _service: ConsultaSaldosTddService, 
    private _serviceSesion: SesionTDDService, private router: Router) { 
      this._service.cargarSaldosTDD();
    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.Sic = mensaje.NumeroCuenta;
        
      }
    );
  }

  ngOnInit() {
    const this_aux = this;
    setTimeout(function() { 
      this_aux.NombreUser = this_aux._serviceSesion.datosBreadCroms.nombreUsuarioTDD;
      this_aux.Celular = this_aux._serviceSesion.datosBreadCroms.CelCliente;
      this_aux.CorreoElectronico = this_aux._serviceSesion.datosBreadCroms.EmailCliente;
      $('#_modal_please_wait').modal('hide');
    }, 500);

  }

  irMenuTDD() {
    this.router.navigate(['/menuTdd']);
  }

}
