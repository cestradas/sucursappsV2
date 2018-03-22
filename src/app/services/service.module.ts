import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionTDDService } from './service.index';
import { ConsultaSaldosTddService } from './saldosTDD/consultaSaldos.service';

@NgModule({
    
    imports: [
        CommonModule
    ],
    providers: [
        SesionTDDService,
        ConsultaSaldosTddService
    ],
    declarations: []

})

export class ServiceModule {}
