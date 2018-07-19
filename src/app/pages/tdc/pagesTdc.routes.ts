import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { MenutdcComponent } from './menuTDC/menutdc.component';
import { PagesTdcComponent } from './pagesTdc.component';
import { MovimientosaldotdcComponent } from './movimientosaldotdc/movimientosaldotdc.component';
import { ImpresionEdcTdcComponent } from './impresion-edc-tdc/impresion-edc-tdc.component';
import { PagoServiciosTdcComponent } from './pago-servicios-tdc/pago-servicios-tdc.component';
import { ActualizarDatosContactotdcComponent } from './actualizar-datos-contactotdc/actualizar-datos-contactotdc.component';
import { ActivarAlertastdcComponent } from './activar-alertastdc/activar-alertastdc.component';
import { ActivarAlertasVerifyTdcComponent } from './activar-alertastdc/activar-alertas-verify-tdc/activar-alertas-verify-tdc.component';
import { PagoServicioDetailTdcComponent } from './pago-servicios-tdc/pago-servicio-detail-tdc/pago-servicio-detail-tdc.component';
import { PagoServicioVerifyTdcComponent } from './pago-servicios-tdc/pago-servicio-verify-tdc/pago-servicio-verify-tdc.component';
import { ImpresionEdcTdcFinalComponent } from './impresion-edc-tdc/impresion-edc-tdc-final/impresion-edc-tdc-final.component';

import { CancelarEnvioEdcFinalTdcComponent } from './impresion-edc-tdc/cancelar-envio-edc-final-tdc/cancelar-envio-edc-final-tdc.component';
import { CancelarEnvioEdcTdcComponent } from './impresion-edc-tdc/cancelar-envio-edc-tdc/cancelar-envio-edc-tdc.component';
import { DocElectronTdcComponent } from './impresion-edc-tdc/doc-electron-tdc/doc-electron-tdc.component';

// tslint:disable-next-line:max-line-length
import { MantenimientoDatosContactoFinalTdcComponent } from './actualizar-datos-contactotdc/mantenimiento-datos-contacto-final-tdc/mantenimiento-datos-contacto-final-tdc.component';
// MovimientosaldotdcComponent

const pageRoutesTDC: Routes = [
    {
        path: '', component: PagesTdcComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: '/menuTDC' },
          { path: 'movimientoSaldotdc', component: MovimientosaldotdcComponent}, 
          { path: 'ImpresionEdcTdc', component: ImpresionEdcTdcComponent}, 
          { path: 'pagoServiciosTdc', component: PagoServiciosTdcComponent},
          { path: 'actualizarDatosContactotdc', component: ActualizarDatosContactotdcComponent}, 
          { path: 'activarAlertastdc', component: ActivarAlertastdcComponent},
          {path: 'activarAlertasVerifyTDC', component: ActivarAlertasVerifyTdcComponent},
          {path: 'pagoServicioDetailTdc', component: PagoServicioDetailTdcComponent},
          {path:  'pagoServicioVerifyTdc', component: PagoServicioVerifyTdcComponent},        
          {path:  'impresionEdcTdcFinal', component: ImpresionEdcTdcFinalComponent},
          {path:  'cancelarEnvioEdcFinalTdc', component: CancelarEnvioEdcFinalTdcComponent},
          {path:  'cancelarEnvioEdcTdc', component: CancelarEnvioEdcTdcComponent},
          {path:  'docElectronTdc', component: DocElectronTdcComponent},
          {path:  'mantenimientoDatosContactoFinalTdc', component: MantenimientoDatosContactoFinalTdcComponent}

        ]
    }
];

export class FeatureRoutingModule {}

export const PAGES_ROUTES_TDC = RouterModule.forChild( pageRoutesTDC);
