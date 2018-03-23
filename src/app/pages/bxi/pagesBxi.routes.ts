import { PagoTarjetaCreditoComponent } from './pagos-tarjeta-credito/pago-tarjeta-credito/pago-tarjeta-credito.component';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { MenuBxiComponent } from './menu-bxi/menu-bxi.component';
import { PagesBxiComponent } from './PagesBxi.component';
import { CompraTaComponent } from "./compra-ta/compra-ta.component";
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { TransferenciaFinishSpeiComponent } from "./transferencia-spei/transferencia-finish-spei/transferencia-finish-spei.component";
import { PagoServiciosVerifyComponent } from './pago-servicios/pago-servicios-verify/pago-servicios-verify.component';
import { PagoServiciosIniComponent } from './pago-servicios/pago-servicios-ini/pago-servicios-ini.component';
import { PagoServiciosDetailComponent } from './pago-servicios/pago-servicios-detail/pago-servicios-detail.component';
const pageRoutesBXI: Routes = [
    {
        path: '', component: PagesBxiComponent,
        children: [
            { path: 'CompraTaComponent', component: CompraTaComponent},
            { path: 'speiBXI', component: TransferenciaSpeiComponent},
            { path: 'pagoservicios_ini', component: PagoServiciosIniComponent},
            { path: 'pagoservicios_detail', component: PagoServiciosDetailComponent},
            { path: 'pagoservicios_verify', component: PagoServiciosVerifyComponent},
            { path: 'TransferFinishSpei', component: TransferenciaFinishSpeiComponent},
            { path: 'pagoTarjetaCredito_ini', component: PagoTarjetaCreditoComponent}
            
        ]
    }
];

export class FeatureRoutingModule {}

export const PAGES_ROUTES_BXI = RouterModule.forChild( pageRoutesBXI);
