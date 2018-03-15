import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { MenuBxiComponent } from './menu-bxi/menu-bxi.component';
import { PagesBxiComponent } from './PagesBxi.component';

import { CompraTaComponent } from "./compra-ta/compra-ta.component";
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { TransferenciaFinishSpeiComponent } from "./transferencia-spei/transferencia-finish-spei/transferencia-finish-spei.component";



const pageRoutesBXI: Routes = [
    {
        path: '', component: PagesBxiComponent,
        children: [
            { path: 'CompraTaComponent', component: CompraTaComponent},
            { path: 'spei', component: TransferenciaSpeiComponent},
            { path: 'TransferFinishSpei', component: TransferenciaFinishSpeiComponent}
            
        ]
    }
];

export class FeatureRoutingModule {}

export const PAGES_ROUTES_BXI = RouterModule.forChild( pageRoutesBXI);
