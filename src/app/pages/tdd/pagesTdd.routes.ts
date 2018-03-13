import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { MenutddComponent } from './menuTDD/menutdd.component';
import { PagesTddComponent } from './pagesTdd.component';
import { MovimientosaldoComponent } from './movimientosaldo/movimientosaldo.component';
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { TransferenciaTercerosComponent } from './transferencia-terceros/transferencia-terceros.component';
import { CompraTiempoAireComponent } from './compra-tiempo-aire/compra-tiempo-aire.component';
import { PagoDeServiciosComponent } from './pago-de-servicios/pago-de-servicios.component';



const pageRoutesTDD: Routes = [
    {
        path: '', component: PagesTddComponent,
        children: [
            { path: 'movimientoSaldo', component: MovimientosaldoComponent},
            { path: 'compraTiempoAire', component: CompraTiempoAireComponent},
            { path: 'spei', component: TransferenciaSpeiComponent},
            { path: 'transBanorte', component: TransferenciaTercerosComponent},
            { path: 'pagoServicios', component: PagoDeServiciosComponent},
            
        ]
    }
];

export class FeatureRoutingModule {}

export const PAGES_ROUTES_TDD = RouterModule.forChild( pageRoutesTDD);
