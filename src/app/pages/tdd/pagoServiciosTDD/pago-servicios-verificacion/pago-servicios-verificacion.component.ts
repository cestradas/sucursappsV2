import { Component, OnInit } from '@angular/core';
import { SesionBxiService } from '../../../bxi/sesion-bxi.service';
import { Router } from '@angular/router';
import { ConsultaSaldosTddService } from '../../../../services/service.index';

declare var jquery: any; // jquery
declare var $: any;


@Component({
  selector: 'app-pago-servicios-verificacion',
  templateUrl: './pago-servicios-verificacion.component.html'
})
export class PagoServiciosVerificacionComponent implements OnInit {
  
  detallePago: any = {
    nombreServicio: '',
    fechaOperacion: '',
    claveRastreo: '',
    comisioneiva: '',
    cuentaCargo: '',
    horaOperacion: '',
    importe: ''

};

cuentaClienteTdd: string;

  constructor(private service: SesionBxiService, 
              private router: Router , 
              private _service: ConsultaSaldosTddService) { 
                this._service.cargarSaldosTDD();
    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        this.cuentaClienteTdd = mensaje.NumeroCuenta;
      }
    ); 
  }

  ngOnInit() {
    const this_aux = this;
    const respPago = this_aux.service.detalleConfirmacionPS;
    const respPagoJson = JSON.parse(respPago);
    console.log(respPagoJson);
    this_aux.detallePago.nombreServicio = this_aux.service.nombreServicio;
    this_aux.detallePago.cuentaCargo = this_aux.service.numCuentaSeleccionado;
    if (this.service.idFacturador === '1310') {

      const certificadoPago = respPagoJson.CertificadoPago;
      certificadoPago.forEach(element => {
          if (element.FechaUno !== undefined) {
            this_aux.detallePago.fechaOperacion = element.FechaUno;
          }
          if (element.ImporteTotal !== undefined) {
            this_aux.detallePago.importe = element.ImporteTotal;
          }
          if (element.ClaveConfirmacion !== undefined) {
            this_aux.detallePago.claveRastreo = element.ClaveConfirmacion;
          }
          if (element.ImporteComisionRespCons !== undefined) {
            this_aux.detallePago.comisioneiva = element.ImporteComisionRespCons;
          }
          if (element.HoraOperacion !== undefined) {
            this_aux.detallePago.horaOperacion = element.HoraOperacion ;

          }
      });

    } else {

      this_aux.detallePago.fechaOperacion = respPagoJson.FechaUno;
      this_aux.detallePago.horaOperacion = respPagoJson.HoraOperacion;
      const certificadoPago = respPagoJson.CertificadoPago;
        certificadoPago.forEach(element => {
          this_aux.detallePago.comisioneiva = element.ImporteComisionRespCons;
          this_aux.detallePago.importe = element.ImporteTotal;
          });
      
      const datosEmpresa = respPagoJson.DatosPagoEmpresa;
        datosEmpresa.forEach(element => {
          this_aux.detallePago.claveRastreo = element.ClaveConfirmacion;
        });
      
     
      }
      
      $('#_modal_please_wait').modal('hide');
      setTimeout( () => $('#ModalTDDLogin').modal('hide'), 500 );
  }
  
  irMenu() {
    const this_aux = this;
    this_aux.router.navigate(['/menuTdd']);
  }

}
