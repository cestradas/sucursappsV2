import { MantenimientoBenefComponent } from './mantenimiento-benef/mantenimiento-benef.component';
import { MenutddComponent } from './menuTDD/menutdd.component';
import { NgModule } from "@angular/core"; 
import { PagesTddComponent } from './pagesTdd.component';
import { PAGES_ROUTES_TDD } from './pagesTdd.routes';
import { SharedModule } from '../../shared/shared.module';
import { MovimientosaldoComponent } from "./movimientosaldo/movimientosaldo.component";
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { TransferenciaTercerosComponent } from './transferencia-terceros/transferencia-terceros.component';
import { CompraTiempoAireComponent } from './compra-tiempo-aire/compra-tiempo-aire.component';
import { PagoDeServiciosComponent } from './pago-de-servicios/pago-de-servicios.component';
import { CommonModule } from '@angular/common';
import { AppComponent } from "../../app.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';




@NgModule ({
    declarations: [
        PagesTddComponent,
        MovimientosaldoComponent,
        CompraTiempoAireComponent,
        TransferenciaSpeiComponent,
        TransferenciaTercerosComponent,
        PagoDeServiciosComponent,
        MantenimientoBenefComponent,
        MenutddComponent
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES_TDD,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
	BrowserModule
    ]
})

export class PagesTddModule {} 
