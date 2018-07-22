import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionTDDService } from './service.index';
import { ConsultaSaldosTddService } from './saldosTDD/consultaSaldos.service';
import { SaldosDiaMesService } from './SaldosDiaMes/saldoDiaMes.service';
import { ResponseWS } from './response/response.service';
import { ValidaNipTransaccion } from './validaNipTrans/validaNipTrans.service';
import { ValidaNipTransaccionTdcService } from './validaNipTrans/valida-nip-transaccion-tdc.service';

@NgModule({
    
    imports: [
        CommonModule
    ],
    providers: [
        SesionTDDService,
        ConsultaSaldosTddService,
        SaldosDiaMesService,
        ValidaNipTransaccion,
        ResponseWS,
        ValidaNipTransaccionTdcService
        
    ],
    declarations: []

})

export class ServiceModule {}
