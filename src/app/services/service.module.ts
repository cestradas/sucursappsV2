import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionTDDService } from './service.index';
import { ConsultaSaldosTddService } from './saldosTDD/consultaSaldos.service';
import { SaldosDiaMesService } from './SaldosDiaMes/saldoDiaMes.service';

@NgModule({
    
    imports: [
        CommonModule
    ],
    providers: [
        SesionTDDService,
        ConsultaSaldosTddService,
        SaldosDiaMesService
    ],
    declarations: []

})

export class ServiceModule {}
