import { MenutdcComponent } from './menuTDC/menutdc.component';
import { NgModule } from "@angular/core"; 
import { PagesTdcComponent } from './pagesTdc.component';
import { PAGES_ROUTES_TDC } from './pagesTdc.routes';

import { CommonModule } from '@angular/common';
import { AppComponent } from "../../app.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatKeyboardModule, KeyboardClassKey, MAT_KEYBOARD_LAYOUTS, IKeyboardLayouts, keyboardLayouts } from '@ngx-material-keyboard/core';
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



const customLayouts: IKeyboardLayouts = {
    ...keyboardLayouts,
    'Numerico': {
      'name': 'NumPad',
      'keys': [
        [
          ['9'],
          ['8'],
          ['7'],
          [KeyboardClassKey.Bksp]
        ],
        [
          ['6' ],
          ['5'],
          ['4'],
          ['.'],
        ],
        [
          ['3'],
          ['2'],
          ['1'],
          ['-']
        ],
        [
          ['0'],
          [KeyboardClassKey.Space],
        ]
      ],
      'lang': ['num']
    }
  };

@NgModule ({
    declarations: [
      
      MenutdcComponent,
      PagesTdcComponent,
      MovimientosaldotdcComponent,
      ImpresionEdcTdcComponent,
      PagoServiciosTdcComponent,
      ActualizarDatosContactotdcComponent,
      ActivarAlertastdcComponent,
      ActivarAlertasVerifyTdcComponent,
      PagoServicioDetailTdcComponent,
      PagoServicioVerifyTdcComponent,
      ImpresionEdcTdcFinalComponent,
      CancelarEnvioEdcFinalTdcComponent,
      CancelarEnvioEdcTdcComponent,
      DocElectronTdcComponent,
      MantenimientoDatosContactoFinalTdcComponent,
      

      
    
    ],

    exports: [],
    imports: [
        
        PAGES_ROUTES_TDC, 
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatKeyboardModule,
        
        
    ],
    providers: [{ provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts}],
  bootstrap: [AppComponent]
})

export class PagesTdcModule {} 
