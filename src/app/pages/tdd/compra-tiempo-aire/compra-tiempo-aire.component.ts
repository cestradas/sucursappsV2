import { Component, OnInit } from '@angular/core';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';
import { SesionTDDService } from '../../../services/breadcrums/breadcroms.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-compra-tiempo-aire',
  templateUrl: './compra-tiempo-aire.component.html',
})
export class CompraTiempoAireComponent implements OnInit {

  subscription: Subscription;

  nombreUsuarioTdd: string;
  saldoClienteTdd: string;
  cuentaClienteTdd: string;

  constructor( private _service: ConsultaSaldosTddService,
               private _serviceSesion: SesionTDDService ) {

                this._service.validarDatosSaldoTdd().then(
                  mensaje => {
            
                    console.log('Saldos cargados correctamente TDD');
                    this.saldoClienteTdd = mensaje.SaldoDisponible;
                    this.cuentaClienteTdd = mensaje.NumeroCuenta;
                    this.nombreUsuarioTdd = this._serviceSesion.datosBreadCroms.nombreUsuarioTDD;
            
                  }
                );

               }

  ngOnInit() {

    console.log('Se cargan los catalogos de compañias telefonicas');

  }


}
