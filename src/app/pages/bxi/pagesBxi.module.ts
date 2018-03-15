import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransferenciaFinishSpeiComponent } from './transferencia-spei/transferencia-finish-spei/transferencia-finish-spei.component';
import { NgModule } from "@angular/core"; 
import { PagesBxiComponent } from './PagesBxi.component';
import { PAGES_ROUTES_BXI } from './pagesBxi.routes';
import { SharedModule } from '../../shared/shared.module';
import { CompraTaComponent } from "./compra-ta/compra-ta.component";
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { MenuBxiComponent } from './menu-bxi/menu-bxi.component';


    



@NgModule ({
    declarations: [
        
        PagesBxiComponent,
        CompraTaComponent,
        TransferenciaSpeiComponent,
        TransferenciaFinishSpeiComponent,
        MenuBxiComponent,
        
        
        
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES_BXI,
        CommonModule,
        FormsModule
        
    ]
})

export class PagesBxiModule {} 
