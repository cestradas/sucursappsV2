import { NgModule } from "@angular/core"; 
import { PagesBxiComponent } from './PagesBxi.component';
import { PAGES_ROUTES_BXI } from './pagesBxi.routes';
import { SharedModule } from '../../shared/shared.module';
import { CompraTaComponent } from "./compra-ta/compra-ta.component";
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';



@NgModule ({
    declarations: [
        
        PagesBxiComponent,
        CompraTaComponent,
        TransferenciaSpeiComponent,
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES_BXI
    ]
})

export class PagesBxiModule {} 
