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
import { MantenimientoBenefDetailComponent } from './mantenimiento-benef/mantenimiento-benef-detail/mantenimiento-benef-detail.component';
import { TransferenciasSpeiDetailComponent } from './transferencia-spei/transferencias-spei-detail/transferencias-spei-detail.component';
import { ActivarAlertasComponent } from './activar-alertas/activar-alertas.component';
import { TransferenciaTercerosFinalComponent } from './transferencia-terceros/transferencia-terceros-final.component';
import { ImpresionEdcTddComponent } from './impresion-edc-tdd/impresion-edc-tdd.component';
import { ImpresionEdcFinalTddComponent } from './impresion-edc-tdd/impresion-edc-final-tdd.component';
import { PagoDeServicioDetallesComponent } from './pagoServiciosTDD/pago-de-servicio-detalles/pago-de-servicio-detalles.component';
import { PagoServiciosComponent } from './pagoServiciosTDD/pago-servicios/pago-servicios.component';
import { PagoServiciosVerificacionComponent } from './pagoServiciosTDD/pago-servicios-verificacion/pago-servicios-verificacion.component';
// tslint:disable-next-line:max-line-length
import { MantenimientoDatosContactoFinalComponent } from './mantenimientos-datos-contacto/mantenimiento-datos-contacto-final/mantenimiento-datos-contacto-final.component';
import { MantenimientosDatosContactoComponent } from './mantenimientos-datos-contacto/mantenimientos-datos-contacto.component';

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
            { path: 'actualizarDatosContactoFinalTDD', component: MantenimientoDatosContactoFinalComponent},
            { path: 'actualizarDatosContactoTDD', component: MantenimientosDatosContactoComponent},
            { path: 'activarAlertas', component: ActivarAlertasComponent},
            { path: 'transTercerosFinal', component: TransferenciaTercerosFinalComponent},
            { path: 'impresion-edc', component: ImpresionEdcTddComponent},
            { path: 'impresion-edc-final', component: ImpresionEdcFinalTddComponent},
            { path: '', pathMatch: 'full', redirectTo: '/menuTdd' },
            
        ]
    }
];

export class FeatureRoutingModule {}

export const PAGES_ROUTES_TDD = RouterModule.forChild( pageRoutesTDD);
