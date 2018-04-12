import { MantenimientoBenefComponent } from './mantenimiento-benef/mantenimiento-benef.component';
import { MenutddComponent } from './menuTDD/menutdd.component';
import { NgModule } from "@angular/core"; 
import { PagesTddComponent } from './pagesTdd.component';
import { PAGES_ROUTES_TDD } from './pagesTdd.routes';
import { SharedModule } from '../../shared/shared.module';
import { MovimientosaldoComponent } from "./movimientosaldo/movimientosaldo.component";
import { TransferenciaSpeiComponent } from './transferencia-spei/transferencia-spei.component';
import { TransferenciaTercerosComponent } from './transferencia-terceros/transferencia-terceros.component';
import { CompraTiempoAireComponent } from './compra-tiempo-aire/compra-tiempo-aire.component';
import { PagoDeServiciosComponent } from './pago-de-servicios/pago-de-servicios.component';
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
import { ActualizarDatosDeContactoComponent } from './actualizar-datos-de-contacto/actualizar-datos-de-contacto.component';
import { ActivarAlertasComponent } from './activar-alertas/activar-alertas.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { TransferenciaTercerosFinalComponent } from './transferencia-terceros/transferencia-terceros-final.component';





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
        PagesTddComponent,
        MovimientosaldoComponent,
        CompraTiempoAireComponent,
        TransferenciaSpeiComponent,
        TransferenciaTercerosComponent,
        PagoDeServiciosComponent,
        MantenimientoBenefComponent,
        MenutddComponent,
        PagoTarjetaCreditoComponent,
        CompraTiempoAireFinalComponent,
        PagoTarjetaCreditoFinalComponent,
        ActualizarDatosDeContactoComponent,
        ActivarAlertasComponent,
        TransferenciaTercerosFinalComponent
        
    ],
    exports: [],
    imports: [
        SharedModule,
        PAGES_ROUTES_TDD,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatKeyboardModule,
        CurrencyMaskModule
    ],
    providers: [{ provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts}],
  bootstrap: [AppComponent]
})

export class PagesTddModule {} 
