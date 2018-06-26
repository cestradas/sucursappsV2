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
import { ImpresionEdcComponent } from './impresion-edc/impresion-edc.component';
import { ImpresionEdcFinishComponent } from './impresion-edc/impresion-edc-finish/impresion-edc-finish.component';
import { TransferenciasBanorteComponent } from "./transferencias-banorte/transferencias-banorte.component";
import { TransferenciaFinishBanorteComponent } from "./transferencias-banorte/transferencia-finish-banorte/transferencia-finish-banorte.component";
import { ConsultaMovimientosComponent } from './consulta-movimientos/consulta-movimientos.component';
import { ConsultaMovimientosDetailComponent } from './consulta-movimientos/consulta-movimientos-detail/consulta-movimientos-detail.component';
import { CancelarEnvioEdcComponent } from './impresion-edc/cancelar-envio-edc/cancelar-envio-edc.component';
import { CancelarEnvioEdcFinishComponent } from './impresion-edc/cancelar-envio-edc-finish/cancelar-envio-edc-finish.component';
import { DocElectronComponent } from './impresion-edc/doc-electron/doc-electron.component';

const pageRoutesBXI: Routes = [
    {
        path: '', component: PagesBxiComponent,
        children: [
            { path: 'saldosDetailBXI', component: ConsultaMovimientosDetailComponent},
            { path: 'saldosBXI', component: ConsultaMovimientosComponent},
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
            { path: 'mantiene-datos-fin', component: MantenimientoDatosVerifyComponent},
            { path: 'TransferBanorte', component: TransferenciasBanorteComponent},
            { path: 'TransferFinishBanorte', component: TransferenciaFinishBanorteComponent},
            { path: 'impresion_EDC', component: ImpresionEdcComponent},
            { path: 'impresion_EDC_Finish', component: ImpresionEdcFinishComponent},
            { path: 'impresion_EDC_Electron', component: DocElectronComponent},
            { path: 'cancelarEnvioEDC_Domicilio', component: CancelarEnvioEdcComponent},
            { path: 'cancelarEnvioEDC_DomicilioFinish', component: CancelarEnvioEdcFinishComponent}

        ]
    }
];

export class FeatureRoutingModule {}

export const PAGES_ROUTES_BXI = RouterModule.forChild( pageRoutesBXI);
