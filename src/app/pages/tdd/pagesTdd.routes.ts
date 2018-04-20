import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { MenutddComponent } from './menuTDD/menutdd.component';
import { PagesTddComponent } from './pagesTdd.component';
import { MovimientosaldoComponent } from './movimientosaldo/movimientosaldo.component';
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { TransferenciaTercerosComponent } from './transferencia-terceros/transferencia-terceros.component';
import { CompraTiempoAireComponent } from './compra-tiempo-aire/compra-tiempo-aire.component';
import { MantenimientoBenefComponent } from './mantenimiento-benef/mantenimiento-benef.component';
import { PagoTarjetaCreditoComponent } from './pago-tarjeta-credito/pago-tarjeta-credito.component';
import { PagoTarjetaCreditoFinalComponent } from './pago-tarjeta-credito/pago-tarjeta-credito-final.component';
import { ActualizarDatosDeContactoComponent } from './actualizar-datos-de-contacto/actualizar-datos-de-contacto.component';
import { MantenimientoBenefDetailComponent } from './mantenimiento-benef/mantenimiento-benef-detail/mantenimiento-benef-detail.component';
import { TransferenciasSpeiDetailComponent } from './transferencia-spei/transferencias-spei-detail/transferencias-spei-detail.component';
import { ActivarAlertasComponent } from './activar-alertas/activar-alertas.component';
import { TransferenciaTercerosFinalComponent } from './transferencia-terceros/transferencia-terceros-final.component';
import { PagoDeServicioDetallesComponent } from './pagoServiciosTDD/pago-de-servicio-detalles/pago-de-servicio-detalles.component';
import { PagoServiciosComponent } from './pagoServiciosTDD/pago-servicios/pago-servicios.component';
import { PagoServiciosVerificacionComponent } from './pagoServiciosTDD/pago-servicios-verificacion/pago-servicios-verificacion.component';

const pageRoutesTDD: Routes = [
    {
        path: '', component: PagesTddComponent,
        children: [
            { path: 'pagoServicioVerifyTdd', component: PagoServiciosVerificacionComponent},
            { path: 'pagoServicioDetailTdd', component: PagoDeServicioDetallesComponent},
            { path: 'movimientoSaldo', component: MovimientosaldoComponent},
            { path: 'compraTiempoAire', component: CompraTiempoAireComponent},
            { path: 'spei', component: TransferenciaSpeiComponent},
            { path: 'transBanorte', component: TransferenciaTercerosComponent},
            { path: 'pagoServiciosTDD', component: PagoServiciosComponent},
            { path: 'pagoCredito', component: PagoTarjetaCreditoComponent},
            { path: 'pagoCreditoFinal', component: PagoTarjetaCreditoFinalComponent},
            { path: '', pathMatch: 'full', redirectTo: '/menuTdd' },
            { path: 'mantoBeneficiarios', component: MantenimientoBenefComponent},
            { path: 'detalleBeneficiarios', component: MantenimientoBenefDetailComponent},
            { path: 'detalleTransferenciaSpei', component: TransferenciasSpeiDetailComponent},            
            { path: 'actualizarDatosContacto', component: ActualizarDatosDeContactoComponent},
            { path: 'activarAlertas', component: ActivarAlertasComponent},
            { path: 'transTercerosFinal', component: TransferenciaTercerosFinalComponent},
        ]
    }
];

export class FeatureRoutingModule {}

export const PAGES_ROUTES_TDD = RouterModule.forChild( pageRoutesTDD);
