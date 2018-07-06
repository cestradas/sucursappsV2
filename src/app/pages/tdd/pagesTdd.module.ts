import { MantenimientoBenefComponent } from './mantenimiento-benef/mantenimiento-benef.component';
import { MenutddComponent } from './menuTDD/menutdd.component';
import { NgModule } from "@angular/core"; 
import { PagesTddComponent } from './pagesTdd.component';
import { PAGES_ROUTES_TDD } from './pagesTdd.routes';
import { MovimientosaldoComponent } from "./movimientosaldo/movimientosaldo.component";
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { TransferenciaTercerosComponent } from './transferencia-terceros/transferencia-terceros.component';
import { CompraTiempoAireComponent } from './compra-tiempo-aire/compra-tiempo-aire.component';
import { CommonModule } from '@angular/common';
import { AppComponent } from "../../app.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatKeyboardModule, KeyboardClassKey, MAT_KEYBOARD_LAYOUTS, IKeyboardLayouts, keyboardLayouts } from '@ngx-material-keyboard/core';
import { PagoTarjetaCreditoComponent } from './pago-tarjeta-credito/pago-tarjeta-credito.component';
import { CompraTiempoAireFinalComponent } from './compra-tiempo-aire/compra-tiempo-aire-final.component';
import { PagoTarjetaCreditoFinalComponent } from './pago-tarjeta-credito/pago-tarjeta-credito-final.component';
import { ActivarAlertasComponent } from './activar-alertas/activar-alertas.component';
import { TransferenciaTercerosFinalComponent } from './transferencia-terceros/transferencia-terceros-final.component';
import { MantenimientoBenefDetailComponent } from './mantenimiento-benef/mantenimiento-benef-detail/mantenimiento-benef-detail.component';
import { ImpresionEdcTddComponent } from './impresion-edc-tdd/impresion-edc-tdd.component';
import { TransferenciasSpeiDetailComponent } from './transferencia-spei/transferencias-spei-detail/transferencias-spei-detail.component';
import { PagoDeServicioDetallesComponent } from './pagoServiciosTDD/pago-de-servicio-detalles/pago-de-servicio-detalles.component';
import { PagoServiciosComponent } from './pagoServiciosTDD/pago-servicios/pago-servicios.component';
import { PagoServiciosVerificacionComponent } from './pagoServiciosTDD/pago-servicios-verificacion/pago-servicios-verificacion.component';
import { MantenimientosDatosContactoComponent } from './mantenimientos-datos-contacto/mantenimientos-datos-contacto.component';
// tslint:disable-next-line:max-line-length
import { MantenimientoDatosContactoFinalComponent } from './mantenimientos-datos-contacto/mantenimiento-datos-contacto-final/mantenimiento-datos-contacto-final.component';
import { ImpresionEdcFinishComponent } from './impresion-edc-tdd/impresion-edc-finish/impresion-edc-finish.component';
import { DocElectronTddComponent } from './impresion-edc-tdd/doc-electron-tdd/doc-electron-tdd.component';
import { ActivarAlertasVerifyTddComponent } from './activar-alertas/activar-alertas-verify-tdd/activar-alertas-verify-tdd.component';
import { CancelarEnvioEdcTddComponent } from './impresion-edc-tdd/cancelar-envio-edc-tdd/cancelar-envio-edc-tdd.component';
import { CancelarEnvioEdcFinishTddComponent } from './impresion-edc-tdd/cancelar-envio-edc-finish-tdd/cancelar-envio-edc-finish-tdd.component';
import { TransferenciasCuentasBanorteComponent } from './transferencias-cuentas-banorte/transferencias-cuentas-banorte.component';
import { TransferenciasCuentasBanorteVerifyComponent } from './transferencias-cuentas-banorte/transferencias-cuentas-banorte-verify/transferencias-cuentas-banorte-verify.component';




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
        PagoDeServicioDetallesComponent,
        PagoServiciosComponent,
        PagoServiciosVerificacionComponent,
        PagesTddComponent,
        MovimientosaldoComponent,
        CompraTiempoAireComponent,
        TransferenciaSpeiComponent,
        TransferenciaTercerosComponent,
        MantenimientoBenefComponent,
        MantenimientoBenefDetailComponent,
        MenutddComponent,
        PagoTarjetaCreditoComponent,
        CompraTiempoAireFinalComponent,
        PagoTarjetaCreditoFinalComponent,
        ActivarAlertasComponent,
        TransferenciaTercerosFinalComponent,
        ImpresionEdcTddComponent,
        TransferenciasSpeiDetailComponent,
        MantenimientosDatosContactoComponent,
        MantenimientoDatosContactoFinalComponent,
	ImpresionEdcFinishComponent,
        DocElectronTddComponent,
        ActivarAlertasVerifyTddComponent,
        CancelarEnvioEdcTddComponent,
        CancelarEnvioEdcFinishTddComponent,
	TransferenciasCuentasBanorteComponent,
        TransferenciasCuentasBanorteVerifyComponent
        
    ],
    exports: [],
    imports: [
        
        PAGES_ROUTES_TDD,
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

export class PagesTddModule {} 
