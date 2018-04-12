import { Component, OnInit } from '@angular/core';
import { ResponseWS } from '../../../services/response/response.service';
import { ConsultaSaldosTddService } from '../../../services/saldosTDD/consultaSaldos.service';

@Component({
  selector: 'app-transferencia-terceros-final',
  templateUrl: './transferencia-terceros-final.component.html'
})
export class TransferenciaTercerosFinalComponent implements OnInit {

  res;
  cuentaClienteTdd: string;
  ctaAbono: string;

  constructor(private _response: ResponseWS,
              private _service: ConsultaSaldosTddService) { }

  ngOnInit() {

    this._service.validarDatosSaldoTdd().then(
      mensaje => {

        console.log('Saldos cargados correctamente TDD');
        
        this.cuentaClienteTdd = mensaje.NumeroCuenta;
        

      }
    );

    this.res  = this._response.respuesta.respuestaWS;
    
    this.ctaAbono = this._response.respuesta.paramsExt;

  }

}
