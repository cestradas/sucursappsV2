import { ActivarAlertasVerifyComponent } from './activa-alertas/activar-alertas-verify/activar-alertas-verify.component';
import { MantenimientoDatosVerifyComponent } from './mantenimiento-datos-contacto/mantenimiento-datos-verify/mantenimiento-datos-verify.component';
import { ActivarAlertasIniComponent } from './activa-alertas/activar-alertas-ini/activar-alertas-ini.component';
// tslint:disable-next-line:max-line-length
import { PagoTarjetaCreditoVerifyComponent } from './pagos-tarjeta-credito/pago-tarjeta-credito-verify/pago-tarjeta-credito-verify.component';
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
import { MantenimientoDatosIniComponent } from './mantenimiento-datos-contacto/mantenimiento-datos-ini/mantenimiento-datos-ini.component';

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
            { path: 'pagoTarjetaCredito_ini', component: PagoTarjetaCreditoComponent},
            { path: 'pagoTarjetaCredito_verify', component: PagoTarjetaCreditoVerifyComponent},
            { path: 'activaAlertas_ini', component: ActivarAlertasIniComponent},
            { path: 'activaAlertas_verify', component: ActivarAlertasVerifyComponent},
            { path: 'mantiene-datos-ini', component: MantenimientoDatosIniComponent},
            { path: 'mantiene-datos-fin', component: MantenimientoDatosVerifyComponent}
            
        ]
    }
];

export class FeatureRoutingModule {}

export const PAGES_ROUTES_BXI = RouterModule.forChild( pageRoutesBXI);
